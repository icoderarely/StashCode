// Read-only connectivity check, safe to run against any branch.
//   npm run db:test
//
// dotenv must load before ./src/lib/prisma, which reads DATABASE_URL at import
// time. ES modules evaluate imports in declaration order, so this stays first.
import "dotenv/config";
import { prisma } from "@/lib/prisma";

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

async function main() {
  // Never print the full URL — it carries the password.
  console.log("DATABASE_URL:", describeTarget(process.env.DATABASE_URL));
  console.log("DIRECT_URL:  ", describeTarget(process.env.DIRECT_URL));

  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  console.log(`\nConnected in ${Date.now() - start}ms`);

  const [users, itemTypes, items, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.itemType.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);
  console.log("\nRow counts:", {
    users,
    itemTypes,
    items,
    collections,
    tags,
  });

  const systemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
    select: { name: true, icon: true, color: true },
  });

  console.log(`\nSystem item types (${systemTypes.length}/7):`);
  for (const type of systemTypes) {
    console.log(`  ${type.name.padEnd(8)} ${type.icon.padEnd(11)} ${type.color}`);
  }

  if (systemTypes.length !== 7) {
    throw new Error(
      `Expected 7 system item types, found ${systemTypes.length}. Run: npm run db:seed`,
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
