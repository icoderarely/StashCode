import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ItemsBrowser } from "@/components/dashboard/ItemsBrowser";
import { getRecentItems } from "@/lib/db/items";
import { getCurrentUserId } from "@/lib/db/user";

export async function ItemsSection() {
  const userId = await getCurrentUserId();
  const items = userId ? await getRecentItems(userId) : [];

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

      <ItemsBrowser items={items} now={new Date()} />
    </section>
  );
}
