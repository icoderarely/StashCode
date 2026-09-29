// Shape returned by src/lib/db/nav.ts to the dashboard sidebar. The sidebar is
// a client component, so everything here has to be serializable.

import type { SidebarCollection } from "@/types/collection";
import type { ItemTypeNavEntry } from "@/types/item";

export interface SidebarNav {
  /** Badge on "All items". */
  itemCount: number;
  /** Badge on "Favorites". */
  favoriteItemCount: number;
  /** System item types, in the canonical order from project-overview.md. */
  itemTypes: ItemTypeNavEntry[];
  /** Most recently updated collections. */
  collections: SidebarCollection[];
}
