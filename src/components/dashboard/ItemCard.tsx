import { Pin, Star } from "lucide-react";

import { TYPE_ICONS } from "@/lib/item-type-icons";
import { formatRelativeTime } from "@/lib/format";
import type { DashboardItem } from "@/types/item";

interface ItemCardProps {
  item: DashboardItem;
  /**
   * The instant relative times are measured from. Passed in from the server so
   * a card rendered inside a client tree hydrates to the same string it was
   * server-rendered with.
   */
  now: Date;
}

export function ItemCard({ item, now }: ItemCardProps) {
  const { itemType } = item;
  const Icon = TYPE_ICONS[itemType.icon];

  return (
    <div
      // Per design.md, the left border in the type's color is the card's
      // primary "what type is this" signal.
      style={{ borderLeftColor: itemType.color }}
      className="flex flex-col gap-3 rounded-xl border border-l-[3px] border-border bg-card p-4"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: itemType.color }}
        >
          {Icon && <Icon className="size-3.5" />}
          {itemType.name}
        </span>
        <span className="flex items-center gap-1.5">
          {item.isPinned && <Pin className="size-4 fill-current text-muted-foreground" />}
          <Star
            className={
              item.isFavorite ? "size-4 fill-current text-pro" : "size-4 text-muted-foreground"
            }
          />
        </span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
        {item.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {item.collectionName}
        {item.collectionName && " · "}
        {formatRelativeTime(item.updatedAt, now)}
      </p>
    </div>
  );
}
