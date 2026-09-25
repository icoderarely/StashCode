import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

// The seven system item types from context/project-overview.md. Every Item
// requires an itemTypeId, so these have to exist before the app can store
// anything. isSystem types are owned by no one (userId stays null).
const SYSTEM_ITEM_TYPES = [
  { name: "Snippet", icon: "Code", color: "#3b82f6" },
  { name: "Prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "Command", icon: "Terminal", color: "#f97316" },
  { name: "Note", icon: "StickyNote", color: "#fde047" },
  { name: "File", icon: "File", color: "#6b7280" },
  { name: "Image", icon: "Image", color: "#ec4899" },
  { name: "Link", icon: "Link", color: "#10b981" },
];

async function main() {
  const connectionString = process.env.DIRECT_URL;

  if (!connectionString) {
    throw new Error("DIRECT_URL is not set");
  }

  const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  try {
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

    console.log(`Seeded ${SYSTEM_ITEM_TYPES.length} system item types.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
