"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { ItemCard } from "@/components/dashboard/ItemCard";
import type { DashboardItem } from "@/types/item";

const FILTERS = ["All items", "Favorites", "Snippet", "Prompt", "Command", "Note", "Link"] as const;
type Filter = (typeof FILTERS)[number];

function filterItems(items: DashboardItem[], filter: Filter) {
  if (filter === "All items") return items;
  if (filter === "Favorites") return items.filter((item) => item.isFavorite);
  return items.filter((item) => item.itemType.name === filter);
}

interface ItemsBrowserProps {
  items: DashboardItem[];
  now: Date;
}

/** The filter tabs and grid. Split out of ItemsSection so the fetch can stay
 * on the server while the tabs keep their client-side state. */
export function ItemsBrowser({ items, now }: ItemsBrowserProps) {
  const [filter, setFilter] = useState<Filter>("All items");
  const visibleItems = filterItems(items, filter);

  return (
    <>
      <div className="mb-4 flex items-center gap-5 border-b border-border">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={cn(
              "border-b-2 pb-2.5 text-sm whitespace-nowrap transition-colors",
              filter === option
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {visibleItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <ItemCard key={item.id} item={item} now={now} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">No items in this filter yet.</p>
      )}
    </>
  );
}
