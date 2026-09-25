"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { items, itemTypes } from "@/lib/mock-data";

const FILTERS = ["All items", "Favorites", "Snippet", "Prompt", "Command", "Note", "Link"] as const;
type Filter = (typeof FILTERS)[number];

function filterItems(filter: Filter) {
  if (filter === "All items") return items;
  if (filter === "Favorites") return items.filter((item) => item.isFavorite);
  const type = itemTypes.find((t) => t.name === filter);
  return items.filter((item) => item.itemTypeId === type?.id);
}

export function ItemsSection() {
  const [filter, setFilter] = useState<Filter>("All items");
  const visibleItems = filterItems(filter);

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          All items
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {items.length}
          </span>
        </h2>
        <Link
          href="/items"
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ChevronRight className="size-4" />
        </Link>
      </div>

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
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-muted-foreground">No items in this filter yet.</p>
      )}
    </section>
  );
}
