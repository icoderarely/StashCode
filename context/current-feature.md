# Current Feature

Prisma + Neon PostgreSQL Setup — set up Prisma ORM with a Neon PostgreSQL database, including the initial schema and NextAuth models.

## Status

In Progress

## Goals

<!-- Goals and requirements -->

- Use Neon PostgreSQL (serverless)
- Create initial schema based on data models in project-overview.md (this will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes

## Notes

<!-- Any extra notes -->

- Full spec: `context/features/database-spec.md`
- Two DB branches: a development branch (`DATABASE_URL`) and a production branch. Always use `prisma migrate dev` to create migrations — never `db push`.
- Use Prisma 7 (breaking changes vs earlier versions) — read the upgrade guide (https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7) before implementing.

### Prisma 7 decisions

- Pinned `prisma` / `@prisma/client` to **7.10.0**. `prisma@latest` currently resolves to `8.0.0-rc.17` (a pre-release), so every Prisma package is pinned exactly.
- Generator is `prisma-client` (not `prisma-client-js`) with a required `output` — it emits **TypeScript**, not compiled JS, into `src/generated/prisma`. That dir is gitignored and rebuilt by the `postinstall` script; it's also excluded from ESLint.
- Connection URLs moved out of `schema.prisma` into `prisma.config.ts`, which loads `.env` explicitly (`import "dotenv/config"`) since v7 dropped automatic env loading.
- Every connection now needs a driver adapter: `@prisma/adapter-neon` over the pooled `DATABASE_URL` at runtime; the CLI uses the unpooled `DIRECT_URL` for migrations, since Neon's pooler can't hold the session locks the schema engine takes.
- `prisma generate` no longer runs automatically after `migrate dev`, so `db:migrate` chains both.
- No `ws` package needed — Neon's driver falls back to the native global `WebSocket` on Node 24+.

### Open issue

- `ItemType.@@unique([userId, name])` does **not** constrain system types: Postgres treats NULLs as distinct, so duplicate `userId = null` rows are allowed (verified). The seed works around this with `findFirst` instead of `upsert`. A partial unique index (`WHERE "userId" IS NULL`) would fix it properly but needs hand-written migration SQL — deferred.

### Verified

- `20260925143739_init` applied to the Neon **dev** branch (`neondb`) via `prisma migrate dev` — no `db push` at any point. `migrate status` reports the schema up to date.
- Seed ran twice and still yields 7 system item types, confirming the `findFirst` idempotency workaround for the NULL-uniqueness issue above.
- Both connection paths exercised against Neon: unpooled `DIRECT_URL` (CLI/migrations, seed) and pooled `DATABASE_URL` through `src/lib/prisma.ts`.
- Cascade behaviour, the `ContentType` enum and nested many-to-many writes were verified against a throwaway local Postgres 18 before the Neon run.

### Pending

- Production Neon branch: run `npm run db:deploy` against it before the app starts (never `migrate dev`).
- Nothing in the UI reads from the database yet — the dashboard still uses `src/lib/mock-data.ts`. Swapping it over is a separate feature.

## History

<!-- Keep this update. Earliest to latest -->

- **Dashboard UI Phase 1** — ShadCN UI init, dashboard route at /dashboard, dark mode by default, top bar with search and new item button (display only), placeholder sidebar/main areas.
- **Dashboard UI Phase 2** — Collapsible sidebar with top-level nav (Overview, All items, Favorites with counts), full 7-type "Item types" list linking to /items/TYPE, "Collections" section listing all collections, user avatar area, and an off-canvas drawer on mobile. Kept all 7 system types (incl. Image) despite the spec listing 6, confirmed with user.
- **Dashboard UI Phase 3** — Main content area: greeting header (mocked "current date" anchored to the mock data's timestamps), 4 stats cards (items/collections/favorite items/favorite collections), "Your collections" grid (dominant item-type icon/color per card), "All items" section with interactive filter tabs (All items, Favorites, Snippet, Prompt, Command, Note, Link) and item cards. Settings icon added to top bar. No dedicated "Pinned Items" section built, per spec note that it's not in the reference screenshot.
