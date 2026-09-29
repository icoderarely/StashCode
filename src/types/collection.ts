// Shapes returned by src/lib/db/collections.ts to the dashboard UI. Kept
// separate from the Prisma models so components depend on what they render,
// not on the full row.

import type { ItemTypeSummary } from "@/types/item";

export interface RecentCollection {
  id: string;
  name: string;
  itemCount: number;
  /** Type with the most items in the collection; null when the collection is empty. */
  dominantType: ItemTypeSummary | null;
  /** Distinct types present, most-used first — drives the card's icon row. */
  itemTypes: ItemTypeSummary[];
}

/** A collection in the sidebar list: a colored dot and a favorite marker. */
export interface SidebarCollection {
  id: string;
  name: string;
  isFavorite: boolean;
  /** Type with the most items — the dot's color; null when the collection is empty. */
  dominantType: ItemTypeSummary | null;
}
