import Link from "next/link";
import { Folder } from "lucide-react";

import { TYPE_ICONS } from "@/lib/item-type-icons";
import { getDominantItemType } from "@/lib/collection-utils";
import { type Collection } from "@/lib/mock-data";

interface CollectionCardProps {
  collection: Collection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const dominantType = getDominantItemType(collection);
  const Icon = dominantType ? TYPE_ICONS[dominantType.icon] : undefined;
  const color = dominantType?.color ?? "#6b7280";

  return (
    <Link
      href={`/collections/${collection.id}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground/30"
    >
      <span
        className="flex size-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}1f`, color }}
      >
        {Icon ? <Icon className="size-4.5" /> : <Folder className="size-4.5" />}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{collection.name}</p>
        <p className="text-xs text-muted-foreground">
          {collection.itemIds.length} item{collection.itemIds.length === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}
