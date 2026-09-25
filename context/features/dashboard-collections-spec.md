# Dashboard Collections Spec

## Overview

Replace the dummy collection data displayed in the main area of the dashboard (right side) with actual data from the database. It should look how it does now with the recent-collections cards, but instead of using data from `@src/lib/mock-data.ts`, it should come from our Neon database via Prisma.

Do not add the items underneath yet. We will do that later.

---

## Requirements

### `src/lib/db/collections.ts`

- `getRecentCollections(userId: string)` — fetch the signed-in user's collections only (`where: { userId }`), ordered by `updatedAt desc`, limited to 6.
- For each collection, include:
  - Item count (`_count.items`)
  - Item counts grouped by `itemTypeId`, used to derive:
    - **Dominant type** — the `ItemType` with the highest item count in that collection
    - **Tie-break** — if two or more types are tied for most-used, fall back to `Collection.defaultTypeId` if set, otherwise the type with the earliest `createdAt` item
    - **Empty collection** (0 items) — no dominant type; card renders with `--color-border` / `--color-surface` (neutral) instead of a type tint
  - Distinct `ItemType`s present, for the icon row

### Collection Card rendering

- Fetch collections directly in the server component (no client-side fetch/loading state needed for this pass).
- Background: dominant type's color at ~10% opacity over `--color-surface`.
- Border: dominant type's color at ~30% opacity, per design.md's Collection Card spec.
- Icon row: small icon per distinct type present in the collection, capped at 5 visible + `+N` badge if more.
- Item count: existing stats display, now bound to `_count.items` instead of mock data.
- Keep the current layout/design as-is — reference `@context/screenshots/dashboard-ui-main.png` for placement, spacing, and card structure.
- Item chips inside each card are explicitly out of scope for this pass (per Overview) — the icon row is the stand-in until that's built.

## References

- `@context/screenshots/dashboard-ui-main.png` — layout and design reference; structure is already built, this spec only swaps the data source.
