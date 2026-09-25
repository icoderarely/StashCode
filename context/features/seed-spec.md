# Seed Data Specification

## Overview

Create a seed script (`prisma/seed.ts`) to populate the database with sample data for development and demos.

---

## Requirements

### User

- **Email:** demo@devstash.io
- **Name:** Demo User
- **Password:** `12345678` (hash with bcryptjs, 12 rounds)
- **isPro:** false
- **emailVerified:** current date

### System Item Types

| Name    | Icon       | Color   |
| ------- | ---------- | ------- |
| snippet | Code       | #3b82f6 |
| prompt  | Sparkles   | #8b5cf6 |
| command | Terminal   | #f97316 |
| note    | StickyNote | #fde047 |
| file    | File       | #6b7280 |
| image   | Image      | #ec4899 |
| link    | Link       | #10b981 |

Icons are Lucide React component names. All types have `isSystem: true`.

### Tags

Seed a shared tag pool and attach 1–3 tags per item, reused across collections so search-by-tag has real overlap to demonstrate:

`react`, `hooks`, `typescript`, `docker`, `ci-cd`, `git`, `process`, `package-manager`, `css`, `tailwind`, `components`, `design-system`, `icons`, `ai`, `prompt-engineering`, `documentation`, `refactoring`, `config`

### Collections & Items

> **Note on the 3-collection free-tier cap:** the free plan is documented as 3 collections max, but this seed script deliberately creates 5 so the demo account shows the product's full range. This is intentional per the project's "leave all features unlocked for all users during development" build note — don't treat this as the script forgetting the cap. If a stricter demo of free-tier limits is ever needed, seed only React Patterns, AI Workflows, and Terminal Commands.

#### React Patterns

_Description: Reusable React patterns and hooks_
**Default type:** `snippet`

3 snippets (TypeScript):

- Custom hooks (`useDebounce`, `useLocalStorage`, etc.) — tags: `react`, `hooks`, `typescript` — mark **favorite**
- Component patterns (Context providers, compound components) — tags: `react`, `components`, `typescript`
- Utility functions — tags: `react`, `typescript`

#### AI Workflows

_Description: AI prompts and workflow automations_
**Default type:** `prompt`

3 prompts:

- Code review prompts — tags: `ai`, `prompt-engineering`
- Documentation generation — tags: `ai`, `documentation`, `prompt-engineering`
- Refactoring assistance — tags: `ai`, `refactoring` — mark **pinned**

#### DevOps

_Description: Infrastructure and deployment resources_
**Default type:** `snippet`

- 1 snippet (Docker, CI/CD config) — tags: `docker`, `ci-cd`
- 1 command (deployment scripts) — tags: `ci-cd`, `git` — mark **pinned**
- 2 links (documentation URLs — use real URLs) — tags: `documentation`
- 1 **file** (e.g. an `.env.example` template) — tags: `docker`, `config` — demonstrates the `file` item type with a placeholder `fileUrl`

#### Terminal Commands

_Description: Useful shell commands for everyday development_
**Default type:** `command`

4 commands:

- Git operations — tags: `git`
- Docker commands — tags: `docker`
- Process management — tags: `process`
- Package manager utilities — tags: `package-manager` — mark **favorite**

#### Design Resources

_Description: UI/UX resources and references_
**Default type:** `link`

4 links (use real URLs):

- CSS/Tailwind references — tags: `css`, `tailwind`
- Component libraries — tags: `components`, `design-system`
- Design systems — tags: `design-system`
- Icon libraries — tags: `icons`
- 1 **image** (e.g. a UI mockup or brand palette reference) — tags: `design-system`, `icons` — demonstrates the `image` item type with a placeholder `fileUrl`

---

## Summary of additions vs. original draft

| Feature demoed          | How                                                                       |
| ----------------------- | ------------------------------------------------------------------------- |
| Tag search              | Shared tag pool across all 5 collections                                  |
| Favorites               | 2 items marked `isFavorite: true`                                         |
| Pinned                  | 2 items marked `isPinned: true`                                           |
| Collection default type | `defaultTypeId` set per collection                                        |
| File / Image types      | 1 `file` item (DevOps), 1 `image` item (Design Resources)                 |
| Free-tier cap awareness | Explicit note explaining the 5-vs-3 collection discrepancy is intentional |
