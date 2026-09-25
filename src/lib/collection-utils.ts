import { type Collection, type ItemType, itemTypes, items } from "@/lib/mock-data";

// A collection can mix item types, but its card shows a single dominant
// color/icon. Ties go to whichever type appears first in `itemTypes`.
export function getDominantItemType(collection: Collection): ItemType | undefined {
  const collectionItems = items.filter((item) => collection.itemIds.includes(item.id));
  const counts = new Map<string, number>();
  for (const item of collectionItems) {
    counts.set(item.itemTypeId, (counts.get(item.itemTypeId) ?? 0) + 1);
  }

  let dominant: ItemType | undefined;
  let max = 0;
  for (const type of itemTypes) {
    const count = counts.get(type.id) ?? 0;
    if (count > max) {
      max = count;
      dominant = type;
    }
  }
  return dominant;
}
