import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import type { DashboardItem } from "@/types/item";

const RECENT_ITEMS_LIMIT = 6;

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
