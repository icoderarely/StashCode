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
