# Dashboard UI Phase 3 Spec

## Overview

This is phase 3 of 3 for the dashboard UI layout. Use the screenshot referenced below for how it should look. Use the data from the mock data file referenced below. Just import it directly for now until we implement a database.

## Requirements for phase 3

- The main area to the right
- Header: current date, "Good morning, {user}" greeting, subtext ("Here's what's in your stash today."), top-right search bar + settings icon + "New item" button
- "Your collections" section — collection cards (icon, name, item count) + "New collection" action link
- "All items" section — count badge, filter tabs (All items, Favorites, Snippet, Prompt, Command, Note, Link), item cards (type icon/label, favorite star, title, description, collection · relative time), "View all" link
- Item-level pin action (see item detail drawer) — no dedicated "Pinned Items" dashboard section exists in the reference screenshot; confirm before building one
- 4 stats cards at the top for number of items, collections, favorite items and favorite collections (Not in screenshot)

## References

- @context/screenshots/dashboard-ui-main.png
- @context/project-overview.md
- @src/lib/mock-data.js
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-2-spec.md
