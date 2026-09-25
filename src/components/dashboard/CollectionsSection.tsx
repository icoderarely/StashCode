import Link from "next/link";
import { FolderPlus } from "lucide-react";

import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { collections } from "@/lib/mock-data";

export function CollectionsSection() {
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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}
