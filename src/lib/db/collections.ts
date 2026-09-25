import { connection } from "next/server";

import { prisma } from "@/lib/prisma";
import type { CollectionItemType, RecentCollection } from "@/types/collection";

const RECENT_COLLECTIONS_LIMIT = 6;

interface TypeTally {
  type: CollectionItemType;
  count: number;
  /** Earliest item createdAt for this type — the last tie-break. */
  firstSeenAt: Date;
}

/**
 * Collections for the dashboard's "Your collections" grid: the given user's
 * own collections, most recently updated first.
 */
export async function getRecentCollections(userId: string): Promise<RecentCollection[]> {
  // The dashboard must reflect the database on every request, so keep this
  // query out of the build-time prerender.
  await connection();

  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: RECENT_COLLECTIONS_LIMIT,
    select: {
      id: true,
      name: true,
      defaultTypeId: true,
      _count: { select: { items: true } },
      items: {
        select: {
          item: {
            select: {
              createdAt: true,
              itemType: { select: { id: true, name: true, icon: true, color: true } },
            },
          },
        },
      },
    },
  });

  return collections.map((collection) => {
    const tallies = tallyItemTypes(collection.items);
    const dominantType = pickDominantType(tallies, collection.defaultTypeId);
    const types = tallies.map((tally) => tally.type);

    return {
      id: collection.id,
      name: collection.name,
      itemCount: collection._count.items,
      dominantType,
      // The card leads its icon row with the type it is colored by, which a
      // defaultTypeId tie-break can pull out of most-used order.
      itemTypes: dominantType
        ? [dominantType, ...types.filter((type) => type.id !== dominantType.id)]
        : types,
    };
  });
}

interface CollectionItemRow {
  item: {
    createdAt: Date;
    itemType: CollectionItemType;
  };
}

/** Counts items per type, returning the distinct types most-used first. */
function tallyItemTypes(rows: CollectionItemRow[]): TypeTally[] {
  const tallies = new Map<string, TypeTally>();

  for (const { item } of rows) {
    const existing = tallies.get(item.itemType.id);
    if (existing) {
      existing.count += 1;
      if (item.createdAt < existing.firstSeenAt) {
        existing.firstSeenAt = item.createdAt;
      }
    } else {
      tallies.set(item.itemType.id, {
        type: item.itemType,
        count: 1,
        firstSeenAt: item.createdAt,
      });
    }
  }

  return [...tallies.values()].sort(
    (a, b) => b.count - a.count || a.firstSeenAt.getTime() - b.firstSeenAt.getTime()
  );
}

/**
 * The type a collection's card is colored by. On a tie for most-used the
 * collection's default type wins if it is one of the tied types; failing that,
 * the tied type whose earliest item came first.
 */
function pickDominantType(
  tallies: TypeTally[],
  defaultTypeId: string | null
): CollectionItemType | null {
  if (tallies.length === 0) {
    return null;
  }

  const topCount = tallies[0].count;
  const tied = tallies.filter((tally) => tally.count === topCount);

  if (tied.length === 1) {
    return tied[0].type;
  }

  const preferred = tied.find((tally) => tally.type.id === defaultTypeId);
  // `tallies` is already sorted by earliest item within a count, so tied[0] is
  // the earliest-created fallback.
  return (preferred ?? tied[0]).type;
}
