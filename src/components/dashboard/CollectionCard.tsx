import Link from "next/link";
import { Folder } from "lucide-react";

import { TYPE_ICONS } from "@/lib/item-type-icons";
import type { RecentCollection } from "@/types/collection";

// Distinct types beyond this are rolled into a "+N" chip.
const MAX_VISIBLE_TYPES = 5;

interface CollectionCardProps {
  collection: RecentCollection;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const { dominantType, itemTypes, itemCount } = collection;
  const visibleTypes = itemTypes.slice(0, MAX_VISIBLE_TYPES);
  const overflowCount = itemTypes.length - visibleTypes.length;

  // Empty collections have no dominant type, so they stay on the neutral
  // card surface rather than borrowing a type color.
  const tint = dominantType
    ? {
        backgroundColor: `color-mix(in oklab, ${dominantType.color} 10%, var(--card))`,
        borderColor: `color-mix(in oklab, ${dominantType.color} 30%, transparent)`,
      }
    : undefined;

  return (
    <Link
      href={`/collections/${collection.id}`}
      style={tint}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex items-center gap-1.5">
        {visibleTypes.length > 0 ? (
          visibleTypes.map((type) => <TypeIcon key={type.id} type={type} />)
        ) : (
          <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Folder className="size-4.5" />
          </span>
        )}
        {overflowCount > 0 && (
          <span className="text-xs font-medium text-muted-foreground">+{overflowCount}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{collection.name}</p>
        <p className="text-xs text-muted-foreground">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </p>
      </div>
    </Link>
  );
}

interface TypeIconProps {
  type: RecentCollection["itemTypes"][number];
}

function TypeIcon({ type }: TypeIconProps) {
  const Icon = TYPE_ICONS[type.icon] ?? Folder;

  return (
    <span
      title={type.name}
      className="flex size-7 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: `${type.color}1f`, color: type.color }}
    >
      <Icon className="size-3.5" />
    </span>
  );
}
