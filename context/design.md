# StashCode — Design System

> Developer-focused, dark-by-default. Adapted from the "Steep" style reference to fit StashCode's product spec.

**Theme:** dark (default) / light (optional)
**Inspiration:** Notion, Linear, Raycast

---

## ⚠️ What changed from the original "Steep" reference, and why

The source reference (`Steep`) is a light-mode, editorial/magazine aesthetic: a 400-weight serif display font, a single warm peach accent, and fully-pill buttons — closer to a marketing site for a finance product than a developer tool. Your spec explicitly calls for:

- **Dark mode by default**, not light
- **Notion / Linear / Raycast** as references — all sans-serif, utility-first UI systems, none of them lean editorial-serif
- **Seven functional accent colors** (one per item type: blue, purple, orange, yellow, gray, pink, emerald) rather than one editorial accent
- Syntax-highlighted code blocks, which need a monospace font Steep never defines

So this version keeps Steep's _structure_ (a token table, a type scale, a component list, do's/don'ts, CSS custom properties) but replaces the content to fit a dev tool:

| Kept from Steep                                             | Changed                                                                |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| Token-table format, spacing scale, "Quick Start" CSS output | Serif display font → dropped entirely (sans-only, like Linear/Raycast) |
| Card-radius/shadow system as a concept                      | Radii pulled in from 24px pill-editorial to 8–14px utility scale       |
| Do's/Don'ts and component list structure                    | Peach single-accent → seven-color type system as first-class tokens    |
| —                                                           | Added a monospace token for code, since this product is code-first     |
| —                                                           | Dark surfaces are now the default, not an afterthought                 |

---

## 1. Color Tokens

### Base (dark — default)

| Name           | Value     | Token                    | Role                                 |
| -------------- | --------- | ------------------------ | ------------------------------------ |
| Canvas         | `#0a0a0b` | `--color-canvas`         | App background                       |
| Surface        | `#141416` | `--color-surface`        | Sidebar, cards, panels               |
| Surface Raised | `#1c1c1f` | `--color-surface-raised` | Drawer, modal, popover               |
| Border         | `#2a2a2e` | `--color-border`         | Hairline dividers, card borders      |
| Border Subtle  | `#1f1f22` | `--color-border-subtle`  | Low-emphasis dividers                |
| Text Primary   | `#f4f4f5` | `--color-text-primary`   | Headings, primary body text          |
| Text Secondary | `#a1a1aa` | `--color-text-secondary` | Metadata, helper text, timestamps    |
| Text Muted     | `#6b6b70` | `--color-text-muted`     | Placeholders, disabled text          |
| Accent (brand) | `#6366f1` | `--color-accent`         | Primary CTA, focus rings, active nav |

### Base (light — optional)

| Name           | Value     | Token                          |
| -------------- | --------- | ------------------------------ |
| Canvas         | `#ffffff` | `--color-canvas-light`         |
| Surface        | `#f7f7f8` | `--color-surface-light`        |
| Surface Raised | `#ffffff` | `--color-surface-raised-light` |
| Border         | `#e4e4e7` | `--color-border-light`         |
| Text Primary   | `#18181b` | `--color-text-primary-light`   |
| Text Secondary | `#52525b` | `--color-text-secondary-light` |
| Text Muted     | `#a1a1aa` | `--color-text-muted-light`     |

### Item type accents (functional, not decorative)

These are load-bearing — they encode meaning (which item type something is) rather than adding editorial warmth, so they appear everywhere: sidebar icons, card borders, badges, drawer headers.

| Type    | Color   | Token                  | Hex       |
| ------- | ------- | ---------------------- | --------- |
| Snippet | Blue    | `--color-type-snippet` | `#3b82f6` |
| Prompt  | Purple  | `--color-type-prompt`  | `#8b5cf6` |
| Command | Orange  | `--color-type-command` | `#f97316` |
| Note    | Yellow  | `--color-type-note`    | `#fde047` |
| File    | Gray    | `--color-type-file`    | `#6b7280` |
| Image   | Pink    | `--color-type-image`   | `#ec4899` |
| Link    | Emerald | `--color-type-link`    | `#10b981` |

Rule: exactly one type color at full saturation per card/badge; never combine two type colors on one surface. On dark surfaces, type colors are used at full opacity for icons/borders and ~12% opacity as a background tint (e.g. `rgba(59,130,246,0.12)` for a Snippet card wash).

### Semantic

| Name      | Token             | Hex       |
| --------- | ----------------- | --------- |
| Success   | `--color-success` | `#22c55e` |
| Warning   | `--color-warning` | `#f59e0b` |
| Danger    | `--color-danger`  | `#ef4444` |
| Pro badge | `--color-pro`     | `#facc15` |

---

## 2. Typography

Sans-only system — no serif display face. This is the single biggest departure from Steep, driven directly by the Notion/Linear/Raycast reference.

### Font families

- **UI / body:** `Inter` — `--font-ui: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;`
- **Code / monospace:** `JetBrains Mono` — `--font-mono: 'JetBrains Mono', ui-monospace, "SF Mono", Menlo, Consolas, monospace;` (used in the snippet editor, command items, and inline code)

### Type scale

| Role       | Size | Weight     | Line height | Letter spacing | Token               |
| ---------- | ---- | ---------- | ----------- | -------------- | ------------------- |
| Caption    | 12px | 500        | 1.4         | 0              | `--text-caption`    |
| Body-sm    | 13px | 400        | 1.5         | 0              | `--text-body-sm`    |
| Body       | 14px | 400        | 1.5         | 0              | `--text-body`       |
| Body-lg    | 16px | 400        | 1.5         | 0              | `--text-body-lg`    |
| Heading-sm | 18px | 600        | 1.3         | -0.01em        | `--text-heading-sm` |
| Heading    | 24px | 600        | 1.25        | -0.015em       | `--text-heading`    |
| Heading-lg | 32px | 600        | 1.2         | -0.02em        | `--text-heading-lg` |
| Display    | 44px | 600        | 1.15        | -0.02em        | `--text-display`    |
| Code       | 13px | 400 (mono) | 1.6         | 0              | `--text-code`       |

No editorial regular-400 display weight here — headings run 600 across the board, which reads as "product UI" rather than "magazine."

---

## 3. Spacing & Shape

**Base unit:** 4px (kept from Steep)

### Spacing scale

| Token          | Value |
| -------------- | ----- |
| `--spacing-1`  | 4px   |
| `--spacing-2`  | 8px   |
| `--spacing-3`  | 12px  |
| `--spacing-4`  | 16px  |
| `--spacing-5`  | 20px  |
| `--spacing-6`  | 24px  |
| `--spacing-8`  | 32px  |
| `--spacing-10` | 40px  |
| `--spacing-16` | 64px  |
| `--spacing-20` | 80px  |

### Border radius

Pulled well in from Steep's 24px/pill editorial radii — a dev tool needs tighter, more "clickable" geometry.

| Element                 | Value  | Token              |
| ----------------------- | ------ | ------------------ |
| Buttons                 | 8px    | `--radius-button`  |
| Inputs                  | 8px    | `--radius-input`   |
| Badges / pills          | 9999px | `--radius-badge`   |
| Small cards (item card) | 10px   | `--radius-card-sm` |
| Cards (collection card) | 14px   | `--radius-card`    |
| Drawer / modal          | 16px   | `--radius-drawer`  |
| Code blocks             | 8px    | `--radius-code`    |

### Shadows (dark-mode calibrated — Steep's shadows assume a white canvas)

| Name           | Value                                                           | Token             |
| -------------- | --------------------------------------------------------------- | ----------------- |
| Subtle         | `0 0 0 1px rgba(255,255,255,0.06), 0 1px 2px rgba(0,0,0,0.4)`   | `--shadow-subtle` |
| Card           | `0 0 0 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.35)` | `--shadow-card`   |
| Drawer / modal | `0 0 0 1px rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.5)` | `--shadow-drawer` |
| Focus ring     | `0 0 0 2px var(--color-canvas), 0 0 0 4px var(--color-accent)`  | `--shadow-focus`  |

### Layout

- Sidebar width: 260px (collapsible to 64px icon rail; becomes an off-canvas drawer under 768px)
- Content max-width: 1280px
- Section/card gap: 16–24px
- Card padding: 16px (small cards), 20px (collection cards)

---

## 4. Components

### Sidebar

`--color-surface` background, `--color-border` right hairline. Item-type links show icon in that type's color + label + count; active state gets a `--color-surface-raised` pill background. Collections list below, showing up to 5 "recent," each with a small color dot matching its dominant type.

### Collection Card (main grid)

Background: dominant item-type color at ~10% opacity over `--color-surface`. Border: 1px solid, same type color at ~30% opacity. Radius `--radius-card` (14px). Header row: collection name (`--text-heading-sm`), item count (`--text-caption`, muted), favorite star (top-right). Body: a compact grid/list of item chips.

### Item Card / Chip

Background `--color-surface`, left border 3px solid in the item's type color (this is the primary "what type is this" signal — cheaper and clearer than a full-tint background at this size). Radius `--radius-card-sm` (10px). Shows: type icon, title (truncated), a `--text-caption` snippet of content, pinned/favorite indicators as small icons top-right.

### Item Drawer

Slides in from the right, `--radius-drawer` on the left edge only, `--shadow-drawer`. Header: type icon + color, title (editable inline), collection chips it belongs to, actions (favorite, pin, add to collection, delete). Body: markdown editor for text types, syntax-highlighted read-only/edit view for snippets (`--font-mono`), file preview for file/image types.

### Button — Primary

Background `--color-accent`, text `#ffffff`, radius `--radius-button` (8px, **not** a pill), padding `8px 16px`, `--text-body` weight 500. Hover: 8% darken. Focus: `--shadow-focus`.

### Button — Secondary

Background `--color-surface-raised`, text `--color-text-primary`, 1px border `--color-border`, radius `--radius-button`. Same padding as primary.

### Button — Ghost

No background, no border, text `--color-text-secondary`, hover → `--color-text-primary` + `--color-surface` background wash. Used for icon-only actions (drawer close, card overflow menu).

### Input / Search

Background `--color-surface`, 1px border `--color-border`, radius `--radius-input` (8px), padding `8px 12px`, placeholder `--color-text-muted`. Focus: border → `--color-accent`, add `--shadow-focus`.

### Type Badge

Pill (`--radius-badge`), background = type color at 15% opacity, text = type color at full saturation, `--text-caption` weight 500, small leading icon. Used on item cards, drawer headers, and filter chips.

### Pro Badge

Pill, background `--color-pro` at 15% opacity, text `--color-pro`, small crown/sparkle icon, `--text-caption` weight 600. Attached next to any Pro-gated feature or nav item.

### Toast

`--color-surface-raised` background, `--shadow-drawer`, radius `--radius-card-sm`, left 3px accent bar in semantic color (success/warning/danger), auto-dismiss with a thin progress bar along the bottom edge.

### Skeleton Loader

`--color-surface` base with a subtle shimmer sweep (`--color-border` → `--color-surface-raised` → `--color-border`), matches the shape/radius of the component it's replacing (card, chip, avatar).

---

## 5. Do's and Don'ts

### Do

- Default every new surface to dark tokens; treat light mode as a themed override, not a separate design
- Use exactly one item-type color per card/badge/chip — it's the primary way users recognize type at a glance
- Keep button/input radius at 8px; reserve full-pill (`9999px`) radius for badges and tags only
- Use `--font-mono` for anything that is or contains code: snippets, commands, inline code in notes
- Use 600-weight for all headings — this system has no light-weight display face
- Keep card backgrounds at low-opacity type-color tints (≤12%) so multiple cards in a grid don't fight each other

### Don't

- Don't introduce a serif or editorial display face — everything sans + mono, no exceptions
- Don't make buttons fully pill-shaped — that reads as marketing-site, not product UI
- Don't apply Steep's light-mode shadow values directly to dark surfaces — dark shadows need to lean on 1px white-alpha borders (`rgba(255,255,255,0.05–0.06)`) plus black shadow, not colored/soft shadows on their own
- Don't mix two item-type colors on a single card or badge
- Don't use the brand accent (`--color-accent`) for item-type meaning — it's reserved for primary actions and focus states only

---

## 6. Quick Start — CSS Custom Properties

```css
:root[data-theme="dark"] {
  /* Base */
  --color-canvas: #0a0a0b;
  --color-surface: #141416;
  --color-surface-raised: #1c1c1f;
  --color-border: #2a2a2e;
  --color-border-subtle: #1f1f22;
  --color-text-primary: #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #6b6b70;
  --color-accent: #6366f1;

  /* Item type accents */
  --color-type-snippet: #3b82f6;
  --color-type-prompt: #8b5cf6;
  --color-type-command: #f97316;
  --color-type-note: #fde047;
  --color-type-file: #6b7280;
  --color-type-image: #ec4899;
  --color-type-link: #10b981;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-pro: #facc15;

  /* Typography */
  --font-ui:
    "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    sans-serif;
  --font-mono:
    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  --text-caption: 12px;
  --text-body-sm: 13px;
  --text-body: 14px;
  --text-body-lg: 16px;
  --text-heading-sm: 18px;
  --text-heading: 24px;
  --text-heading-lg: 32px;
  --text-display: 44px;
  --text-code: 13px;

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-16: 64px;
  --spacing-20: 80px;

  /* Radius */
  --radius-button: 8px;
  --radius-input: 8px;
  --radius-badge: 9999px;
  --radius-card-sm: 10px;
  --radius-card: 14px;
  --radius-drawer: 16px;
  --radius-code: 8px;

  /* Shadows */
  --shadow-subtle:
    0 0 0 1px rgba(255, 255, 255, 0.06), 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-card:
    0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.35);
  --shadow-drawer:
    0 0 0 1px rgba(255, 255, 255, 0.06), 0 16px 40px rgba(0, 0, 0, 0.5);
  --shadow-focus: 0 0 0 2px var(--color-canvas), 0 0 0 4px var(--color-accent);

  /* Layout */
  --sidebar-width: 260px;
  --sidebar-rail-width: 64px;
  --content-max-width: 1280px;
}

:root[data-theme="light"] {
  --color-canvas: #ffffff;
  --color-surface: #f7f7f8;
  --color-surface-raised: #ffffff;
  --color-border: #e4e4e7;
  --color-border-subtle: #eeeeef;
  --color-text-primary: #18181b;
  --color-text-secondary: #52525b;
  --color-text-muted: #a1a1aa;
  --color-accent: #6366f1;

  /* Item type accents stay identical across themes for recognizability */
  --color-type-snippet: #3b82f6;
  --color-type-prompt: #8b5cf6;
  --color-type-command: #f97316;
  --color-type-note: #eab308; /* darkened slightly for AA contrast on white */
  --color-type-file: #6b7280;
  --color-type-image: #ec4899;
  --color-type-link: #10b981;

  --shadow-subtle: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.08);
  --shadow-card: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-drawer:
    0 0 0 1px rgba(0, 0, 0, 0.05), 0 16px 40px rgba(0, 0, 0, 0.12);
}
```

### Tailwind v4

```css
@theme {
  --color-canvas: #0a0a0b;
  --color-surface: #141416;
  --color-surface-raised: #1c1c1f;
  --color-border: #2a2a2e;
  --color-text-primary: #f4f4f5;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #6b6b70;
  --color-accent: #6366f1;

  --color-type-snippet: #3b82f6;
  --color-type-prompt: #8b5cf6;
  --color-type-command: #f97316;
  --color-type-note: #fde047;
  --color-type-file: #6b7280;
  --color-type-image: #ec4899;
  --color-type-link: #10b981;

  --font-ui:
    "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    sans-serif;
  --font-mono:
    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  --radius-button: 8px;
  --radius-card-sm: 10px;
  --radius-card: 14px;
  --radius-drawer: 16px;
  --radius-badge: 9999px;
}
```

---

## 7. Similar Products (for visual reference, not copy)

- **Linear** — dark-default, tight radii, single accent + semantic colors, sans-only type
- **Raycast** — sidebar + command surfaces, type-coded icons, compact card density
- **Notion** — icon+color-coded item types, drawer-style detail views
- **Arc / Warp** — dark developer-tool chrome with a restrained accent palette
