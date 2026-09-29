import { getSidebarCollections } from "@/lib/db/collections";
import { getItemTypeNav } from "@/lib/db/items";
import { getDashboardStats } from "@/lib/db/stats";
import { getCurrentUserId } from "@/lib/db/user";
import type { SidebarNav } from "@/types/nav";

const EMPTY_SIDEBAR_NAV: SidebarNav = {
  itemCount: 0,
  favoriteItemCount: 0,
  itemTypes: [],
  collections: [],
};

/**
 * Everything the sidebar renders, in one call. This spans items, collections and
 * counts, so it sits here rather than in any one of those modules. Unlike the
 * per-section queries it resolves the user itself: the sidebar is chrome, and the
 * pages rendering it have no other reason to look the user up.
 */
export async function getSidebarNav(): Promise<SidebarNav> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return EMPTY_SIDEBAR_NAV;
  }

  const [stats, itemTypes, collections] = await Promise.all([
    getDashboardStats(userId),
    getItemTypeNav(userId),
    getSidebarCollections(userId),
  ]);

  return {
    itemCount: stats.items,
    favoriteItemCount: stats.favoriteItems,
    itemTypes,
    collections,
  };
}
