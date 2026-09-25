// Shapes returned by src/lib/db/collections.ts to the dashboard UI. Kept
// separate from the Prisma models so components depend on what they render,
// not on the full row.

export interface CollectionItemType {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  color: string; // hex
}

export interface RecentCollection {
  id: string;
  name: string;
  itemCount: number;
  /** Type with the most items in the collection; null when the collection is empty. */
  dominantType: CollectionItemType | null;
  /** Distinct types present, most-used first — drives the card's icon row. */
  itemTypes: CollectionItemType[];
}
