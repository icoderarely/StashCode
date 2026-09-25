// Read-only connectivity + seed check, safe to run against any branch.
//   npm run db:test
//
// dotenv must load before ./src/lib/prisma, which reads DATABASE_URL at import
// time. ES modules evaluate imports in declaration order, so this stays first.
import "dotenv/config";
import { prisma } from "@/lib/prisma";
import {
  COLLECTIONS,
  DEMO_USER,
  SYSTEM_ITEM_TYPES,
  TAG_NAMES,
} from "../prisma/seed-data";

const EXPECTED_ITEMS = COLLECTIONS.reduce(
  (total, collection) => total + collection.items.length,
  0,
);

const problems: string[] = [];

function check(condition: boolean, message: string) {
  if (!condition) problems.push(message);
}

function describeTarget(raw: string | undefined) {
  if (!raw) return "MISSING";
  try {
    const url = new URL(raw);
    const pooled = url.hostname.includes("-pooler") ? "pooled" : "direct";
    return `${url.pathname.slice(1)} @ ${url.hostname} (${pooled})`;
  } catch {
    return "UNPARSEABLE";
  }
}

function preview(text: string | null, length = 60) {
  if (!text) return "";
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > length ? `${flat.slice(0, length - 1)}…` : flat;
}

async function checkConnection() {
  // Never print the full URL — it carries the password.
  console.log("DATABASE_URL:", describeTarget(process.env.DATABASE_URL));
  console.log("DIRECT_URL:  ", describeTarget(process.env.DIRECT_URL));

  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  console.log(`\nConnected in ${Date.now() - start}ms`);
}

async function checkSystemTypes() {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
    select: { name: true, icon: true, color: true },
  });

  console.log(`\nSystem item types (${types.length}/${SYSTEM_ITEM_TYPES.length}):`);
  for (const type of types) {
    console.log(`  ${type.name.padEnd(8)} ${type.icon.padEnd(11)} ${type.color}`);
  }

  check(
    types.length === SYSTEM_ITEM_TYPES.length,
    `Expected ${SYSTEM_ITEM_TYPES.length} system item types, found ${types.length}.`,
  );
}

async function showCollections(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      defaultType: { select: { name: true } },
      _count: { select: { items: true } },
    },
  });

  console.log(`\nCollections (${collections.length}/${COLLECTIONS.length}):`);
  for (const collection of collections) {
    const star = collection.isFavorite ? " ★" : "";
    console.log(
      `  ${collection.name.padEnd(20)} default: ${(collection.defaultType?.name ?? "—").padEnd(8)} ` +
        `items: ${collection._count.items}${star}`,
    );
  }

  check(
    collections.length === COLLECTIONS.length,
    `Expected ${COLLECTIONS.length} collections, found ${collections.length}.`,
  );
  check(
    collections.every((collection) => collection.defaultType !== null),
    "Some collections are missing a default item type.",
  );
}

async function showItems(userId: string) {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: [{ itemType: { name: "asc" } }, { createdAt: "asc" }],
    include: {
      itemType: { select: { name: true } },
      tags: { select: { tag: { select: { name: true } } } },
      collections: { select: { collection: { select: { name: true } } } },
    },
  });

  console.log(`\nItems (${items.length}/${EXPECTED_ITEMS}):`);
  for (const item of items) {
    const flags = `${item.isFavorite ? "★" : " "}${item.isPinned ? "📌" : "  "}`;
    const tags = item.tags.map((link) => link.tag.name).join(", ");
    const body = item.url ?? item.fileName ?? preview(item.content);
    console.log(`  ${flags} [${item.itemType.name.padEnd(7)}] ${item.title}`);
    console.log(`        ${item.collections.map((c) => c.collection.name).join(", ")} · ${tags}`);
    console.log(`        ${body}`);
  }

  check(
    items.length === EXPECTED_ITEMS,
    `Expected ${EXPECTED_ITEMS} items, found ${items.length}.`,
  );
  check(
    items.every((item) => item.tags.length > 0),
    "Some items have no tags.",
  );
  check(
    items.every((item) => item.collections.length > 0),
    "Some items belong to no collection.",
  );
  check(
    items.every((item) =>
      item.contentType === "URL"
        ? Boolean(item.url)
        : item.contentType === "FILE"
          ? Boolean(item.fileUrl)
          : Boolean(item.content),
    ),
    "Some items are missing the content field their contentType requires.",
  );

  console.log(
    `\n  Favorites: ${items.filter((i) => i.isFavorite).length} · ` +
      `Pinned: ${items.filter((i) => i.isPinned).length}`,
  );
}

async function showTags(userId: string) {
  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } },
  });

  console.log(`\nTags (${tags.length}/${TAG_NAMES.length}):`);
  console.log(
    "  " + tags.map((tag) => `${tag.name} (${tag._count.items})`).join(", "),
  );

  const unused = tags.filter((tag) => tag._count.items === 0);
  check(
    tags.length === TAG_NAMES.length,
    `Expected ${TAG_NAMES.length} tags, found ${tags.length}.`,
  );
  check(
    unused.length === 0,
    `Unused tags: ${unused.map((tag) => tag.name).join(", ")}`,
  );
}

async function main() {
  await checkConnection();

  const [users, itemTypes, items, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);
  console.log("\nRow counts:", { users, itemTypes, items, collections, tags });

  await checkSystemTypes();

  const demoUser = await prisma.user.findUnique({
    where: { email: DEMO_USER.email },
    select: { id: true, name: true, email: true, isPro: true, emailVerified: true },
  });

  if (!demoUser) {
    console.log(`\nNo demo user (${DEMO_USER.email}) — run: npm run db:seed`);
  } else {
    console.log(
      `\nDemo user: ${demoUser.name} <${demoUser.email}> · isPro: ${demoUser.isPro} · ` +
        `verified: ${demoUser.emailVerified ? "yes" : "no"}`,
    );
    await showCollections(demoUser.id);
    await showItems(demoUser.id);
    await showTags(demoUser.id);
  }

  if (problems.length > 0) {
    throw new Error(
      `${problems.length} problem(s):\n  - ${problems.join("\n  - ")}\n\nRun: npm run db:seed`,
    );
  }

  console.log("\nDatabase OK.");
}

main()
  .catch((error) => {
    console.error("\nDatabase check failed:\n", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
