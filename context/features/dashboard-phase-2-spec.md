# Dashboard UI Phase 2 Spec

## Overview

This is phase 2 of 3 for the dashboard UI layout. Use the screenshot referenced below for how it should look. Use the data from the mock data file referenced below. Just import it directly for now until we implement a database.

## Requirements for phase 2

- Collapsible sidebar, toggled by a drawer icon next to the logo (top-left of sidebar header)
- Top-level nav: Overview, All items (with total count badge), Favorites (with favorited-item count badge)
- "ITEM TYPES" section — one row per type (Snippet, Prompt, Command, Note, Link, File), each with a colored icon, linking to /items/TYPE (eg. /items/snippets)
- "COLLECTIONS" section — lists all of the user's collections (folder icon + name), not filtered to favorites
- User avatar area at the bottom — avatar initials, full name, and workspace/plan label (e.g. "Free workspace")
- Always a drawer (overlay) on mobile view

## References

- @context/screenshots/dashboard-ui-main.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-phase-1-spec.md
- @context/features/dashboard-phase-3-spec.md
