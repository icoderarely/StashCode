import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  COLLECTIONS,
  DEMO_USER,
  SYSTEM_ITEM_TYPES,
  TAG_NAMES,
  type SeedItem,
} from "./seed-data";

const BCRYPT_ROUNDS = 12;

type Client = PrismaClient;

async function seedSystemItemTypes(prisma: Client) {
  for (const type of SYSTEM_ITEM_TYPES) {
    // Not an upsert: Postgres treats NULLs as distinct, so the
    // @@unique([userId, name]) index does not constrain system types.
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, isSystem: true, userId: null },
    });

    if (existing) {
      await prisma.itemType.update({
        where: { id: existing.id },
        data: { icon: type.icon, color: type.color },
      });
    } else {
      await prisma.itemType.create({ data: { ...type, isSystem: true } });
    }
  }

  const types = await prisma.itemType.findMany({
    where: { isSystem: true, userId: null },
  });

  return new Map(types.map((type) => [type.name, type.id]));
}

async function seedDemoUser(prisma: Client) {
  const passwordHash = await bcrypt.hash(DEMO_USER.password, BCRYPT_ROUNDS);

  return prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: { name: DEMO_USER.name, passwordHash, isPro: DEMO_USER.isPro },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      passwordHash,
      isPro: DEMO_USER.isPro,
      emailVerified: new Date(),
    },
  });
}

// Re-running the seed rebuilds the demo content from scratch rather than
// stacking duplicates. Scoped to the demo user, so nothing else is touched.
// Items go first: deleting them cascades ItemCollection and ItemTag rows.
async function clearDemoData(prisma: Client, userId: string) {
  await prisma.item.deleteMany({ where: { userId } });
  await prisma.collection.deleteMany({ where: { userId } });
  await prisma.tag.deleteMany({ where: { userId } });
}

async function seedTags(prisma: Client, userId: string) {
  await prisma.tag.createMany({
    data: TAG_NAMES.map((name) => ({ name, userId })),
  });

  const tags = await prisma.tag.findMany({ where: { userId } });

  return new Map(tags.map((tag) => [tag.name, tag.id]));
}

function resolve<T>(map: Map<string, T>, key: string, label: string): T {
  const value = map.get(key);

  if (value === undefined) {
    throw new Error(`Unknown ${label}: ${key}`);
  }

  return value;
}

async function createItem(
  prisma: Client,
  item: SeedItem,
  context: {
    userId: string;
    collectionId: string;
    typeIds: Map<string, string>;
    tagIds: Map<string, string>;
  },
) {
  await prisma.item.create({
    data: {
      title: item.title,
      description: item.description,
      contentType: item.contentType,
      content: item.content ?? null,
      url: item.url ?? null,
      fileUrl: item.fileUrl ?? null,
      fileName: item.fileName ?? null,
      fileSize: item.fileSize ?? null,
      language: item.language ?? null,
      isFavorite: item.isFavorite ?? false,
      isPinned: item.isPinned ?? false,
      userId: context.userId,
      itemTypeId: resolve(context.typeIds, item.typeName, "item type"),
      collections: { create: { collectionId: context.collectionId } },
      tags: {
        create: item.tags.map((name) => ({
          tagId: resolve(context.tagIds, name, "tag"),
        })),
      },
    },
  });
}

async function seedCollections(
  prisma: Client,
  userId: string,
  typeIds: Map<string, string>,
  tagIds: Map<string, string>,
) {
  let itemCount = 0;

  for (const seed of COLLECTIONS) {
    const collection = await prisma.collection.create({
      data: {
        name: seed.name,
        description: seed.description,
        isFavorite: seed.isFavorite ?? false,
        userId,
        defaultTypeId: resolve(typeIds, seed.defaultTypeName, "item type"),
      },
    });

    for (const item of seed.items) {
      await createItem(prisma, item, {
        userId,
        collectionId: collection.id,
        typeIds,
        tagIds,
      });
      itemCount += 1;
    }
  }

  return itemCount;
}

async function main() {
  const connectionString = process.env.DIRECT_URL;

  if (!connectionString) {
    throw new Error("DIRECT_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  try {
    const typeIds = await seedSystemItemTypes(prisma);
    const user = await seedDemoUser(prisma);

    await clearDemoData(prisma, user.id);
    const tagIds = await seedTags(prisma, user.id);
    const itemCount = await seedCollections(prisma, user.id, typeIds, tagIds);

    console.log(
      `Seeded ${SYSTEM_ITEM_TYPES.length} system item types, ${DEMO_USER.email}, ` +
        `${TAG_NAMES.length} tags, ${COLLECTIONS.length} collections, ${itemCount} items.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
