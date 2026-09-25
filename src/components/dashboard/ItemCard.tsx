import { Star } from "lucide-react";

import { TYPE_ICONS } from "@/lib/item-type-icons";
import { formatRelativeTime } from "@/lib/format";
import { type Item, collections, itemTypes } from "@/lib/mock-data";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const itemType = itemTypes.find((type) => type.id === item.itemTypeId);
  const Icon = itemType ? TYPE_ICONS[itemType.icon] : undefined;
  const collection = collections.find((c) => item.collectionIds.includes(c.id));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: itemType?.color }}
        >
          {Icon && <Icon className="size-3.5" />}
          {itemType?.name}
        </span>
        <Star
          className={item.isFavorite ? "size-4 fill-current text-pro" : "size-4 text-muted-foreground"}
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        {collection?.name}
        {collection && " · "}
        {formatRelativeTime(item.updatedAt)}
      </p>
    </div>
  );
}
