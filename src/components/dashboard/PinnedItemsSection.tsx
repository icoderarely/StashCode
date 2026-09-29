import { Pin } from "lucide-react";

import { ItemCard } from "@/components/dashboard/ItemCard";
import { getPinnedItems } from "@/lib/db/items";
import { getCurrentUserId } from "@/lib/db/user";

export async function PinnedItemsSection() {
  const userId = await getCurrentUserId();
  const items = userId ? await getPinnedItems(userId) : [];

  // Nothing pinned means no heading and no empty state — the section is absent.
  if (items.length === 0) {
    return null;
  }

  const now = new Date();

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Pin className="size-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-foreground">Pinned</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          {items.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} now={now} />
        ))}
      </div>
    </section>
  );
}
