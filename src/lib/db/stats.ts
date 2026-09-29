import { cache } from "react";
import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import type { DashboardStats } from "@/types/stats";

/**
 * The four counts across the top of the dashboard. The sidebar reuses the item
 * counts for its "All items" and "Favorites" badges, so this is cached to keep
 * that from doubling the queries.
 */
export const getDashboardStats = cache(async (userId: string): Promise<DashboardStats> => {
  // The dashboard must reflect the database on every request, so keep these
  // queries out of the build-time prerender.
  await connection();

  const [items, collections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);

  return { items, collections, favoriteItems, favoriteCollections };
});
