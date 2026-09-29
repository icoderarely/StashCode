import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import type { DashboardItem, ItemTypeNavEntry } from "@/types/item";

const RECENT_ITEMS_LIMIT = 6;

// ItemType has no ordering column, so a plain findMany comes back in whatever
// order Postgres feels like. This is the canonical order from
// context/project-overview.md, which prisma/seed-data.ts also inserts in.
const SYSTEM_TYPE_ORDER = ["Snippet", "Prompt", "Command", "Note", "File", "Image", "Link"];

// The card shows one owning collection, so only the oldest membership is
// fetched rather than every row in the join table.
const DASHBOARD_ITEM_SELECT = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  updatedAt: true,
  itemType: { select: { id: true, name: true, icon: true, color: true } },
  collections: {
    take: 1,
    orderBy: { addedAt: "asc" },
    select: { collection: { select: { name: true } } },
  },
} as const;

interface DashboardItemRow {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  itemType: { id: string; name: string; icon: string; color: string };
  collections: { collection: { name: string } }[];
}

function toDashboardItem(row: DashboardItemRow): DashboardItem {
  const { collections, ...item } = row;

  return { ...item, collectionName: collections[0]?.collection.name ?? null };
}

/** Items for the dashboard's "All items" grid, most recently updated first. */
export async function getRecentItems(userId: string): Promise<DashboardItem[]> {
  // The dashboard must reflect the database on every request, so keep this
  // query out of the build-time prerender.
  await connection();

  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: RECENT_ITEMS_LIMIT,
    select: DASHBOARD_ITEM_SELECT,
  });

  return items.map(toDashboardItem);
}

/**
 * Items the user pinned, most recently updated first. Returns an empty array
 * when nothing is pinned — the section renders nothing in that case.
 */
export async function getPinnedItems(userId: string): Promise<DashboardItem[]> {
  await connection();

  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: DASHBOARD_ITEM_SELECT,
  });

  return items.map(toDashboardItem);
}

/**
 * The system item types for the sidebar's type list, each with how many items
 * the user has of that type. Custom (user-owned) types are Pro and post-MVP, so
 * only system types are listed for now.
 */
export async function getItemTypeNav(userId: string): Promise<ItemTypeNavEntry[]> {
  // The sidebar counts must reflect the database on every request, so keep this
  // query out of the build-time prerender.
  await connection();

  const [types, counts] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      select: { id: true, name: true, icon: true, color: true },
    }),
    // One grouped count beats a per-type count query, and a filtered relation
    // count on ItemType would count every user's items, not just this one's.
    prisma.item.groupBy({
      by: ["itemTypeId"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  const countsByTypeId = new Map(counts.map((row) => [row.itemTypeId, row._count._all]));

  return types
    .map((type) => ({ ...type, itemCount: countsByTypeId.get(type.id) ?? 0 }))
    .sort(compareTypeOrder);
}

/** Canonical order first, then any unrecognized type alphabetically. */
function compareTypeOrder(a: { name: string }, b: { name: string }): number {
  const aIndex = SYSTEM_TYPE_ORDER.indexOf(a.name);
  const bIndex = SYSTEM_TYPE_ORDER.indexOf(b.name);

  if (aIndex === -1 && bIndex === -1) {
    return a.name.localeCompare(b.name);
  }
  if (aIndex === -1) {
    return 1;
  }
  if (bIndex === -1) {
    return -1;
  }

  return aIndex - bIndex;
}
