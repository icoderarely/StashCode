// Shapes returned by src/lib/db/items.ts to the dashboard UI. Kept separate
// from the Prisma models so components depend on what they render, not on the
// full row.

/** The parts of an ItemType the UI needs to color and label something. */
export interface ItemTypeSummary {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  color: string; // hex
}

/** An item type in the sidebar's type list, with the user's count for it. */
export interface ItemTypeNavEntry extends ItemTypeSummary {
  itemCount: number;
}

export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  itemType: ItemTypeSummary;
  /** First collection the item belongs to — the card shows a single name. */
  collectionName: string | null;
}
