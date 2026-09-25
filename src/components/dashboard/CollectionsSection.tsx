import Link from "next/link";
import { FolderPlus } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { getRecentCollections } from "@/lib/db/collections";
import { getCurrentUserId } from "@/lib/db/user";

export async function CollectionsSection() {
  const userId = await getCurrentUserId();
  const collections = userId ? await getRecentCollections(userId) : [];

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Your collections</h2>
        <Link
          href="/collections/new"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <FolderPlus className="size-4" />
          New collection
        </Link>
      </div>
      {collections.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          No collections yet. Create one to start grouping your stash.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      )}
    </section>
  );
}
