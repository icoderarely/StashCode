# Current Feature

<!-- Feature name and short description -->

## Status

Completed

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this update. Earliest to latest -->

- **Dashboard UI Phase 1** — ShadCN UI init, dashboard route at /dashboard, dark mode by default, top bar with search and new item button (display only), placeholder sidebar/main areas.
- **Dashboard UI Phase 2** — Collapsible sidebar with top-level nav (Overview, All items, Favorites with counts), full 7-type "Item types" list linking to /items/TYPE, "Collections" section listing all collections, user avatar area, and an off-canvas drawer on mobile. Kept all 7 system types (incl. Image) despite the spec listing 6, confirmed with user.
- **Dashboard UI Phase 3** — Main content area: greeting header (mocked "current date" anchored to the mock data's timestamps), 4 stats cards (items/collections/favorite items/favorite collections), "Your collections" grid (dominant item-type icon/color per card), "All items" section with interactive filter tabs (All items, Favorites, Snippet, Prompt, Command, Note, Link) and item cards. Settings icon added to top bar. No dedicated "Pinned Items" section built, per spec note that it's not in the reference screenshot.
- **Prisma + Neon PostgreSQL** — Prisma 7.10.0 (pinned; `prisma@latest` resolves to an 8.0.0 RC) with the `prisma-client` generator emitting TypeScript to a gitignored `src/generated/prisma`. Connection URLs live in `prisma.config.ts` (v7 dropped auto env loading, so it imports dotenv); driver adapters are mandatory, so `@prisma/adapter-neon` runs on the pooled `DATABASE_URL` while the CLI migrates over the unpooled `DIRECT_URL`. Initial migration covers the core domain plus Auth.js models, with cascade deletes and FK indexes; seed inserts the 7 system item types. Added `db:*` scripts and `scripts/test-db.ts`. Known gap: `ItemType.@@unique([userId, name])` doesn't constrain system types since Postgres treats NULLs as distinct — seed works around it with `findFirst`; a partial unique index would need hand-written migration SQL. Nothing in the UI reads the DB yet; the dashboard still uses `src/lib/mock-data.ts`.
- **Seed Data** — Full demo dataset per `context/features/seed-spec.md`. Data is declarative in `prisma/seed-data.ts`; `prisma/seed.ts` writes it. Demo user `demo@devstash.io` / `12345678` (bcryptjs, 12 rounds — v3 ships its own types, so no `@types/bcryptjs`), 18 shared tags, 5 collections each with a `defaultTypeId`, 20 items (Snippet 4, Prompt 3, Command 5, Link 6, File 1, Image 1), 2 favorites, 2 pinned, 35 item↔tag links, no `Note` items since the spec lists none. Idempotent: the user is upserted by email, then that user's items/collections/tags are deleted and rebuilt (cascades clear the join tables), so re-runs don't stack duplicates. `file`/`image` items use placeholder `fileUrl`s until R2 is wired up; the image one points at placehold.co so the card renders. Deviations from the spec: type names stay capitalized (`Snippet`) to match the existing seed/UI, and React Patterns is marked a favorite collection so the dashboard's "favorite collections" stat isn't 0. 5 collections vs. the documented 3-collection free-tier cap is intentional per the spec. `scripts/test-db.ts` was extended to print the demo data (collections, every item with type/collections/tags/preview, favorite+pinned totals, per-tag usage) and assert the DB against `seed-data.ts` — counts, no untagged/uncollected items, no unused tags, contentType matching the populated field — exiting 1 with "Run: npm run db:seed" on mismatch. No schema change, so no migration. The dashboard still reads `src/lib/mock-data.ts`.
