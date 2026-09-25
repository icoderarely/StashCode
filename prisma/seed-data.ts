import type { ContentType } from "../src/generated/prisma/enums";

// Declarative source of everything prisma/seed.ts writes. Kept separate so the
// seed script stays about *how* rows are created, not *what* they contain.

export interface SeedItem {
  title: string;
  description: string;
  typeName: string;
  contentType: ContentType;
  content?: string;
  url?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  language?: string;
  tags: string[];
  isFavorite?: boolean;
  isPinned?: boolean;
}

export interface SeedCollection {
  name: string;
  description: string;
  defaultTypeName: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

export const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
  isPro: false,
};

// The seven system item types from context/project-overview.md. Every Item
// requires an itemTypeId, so these have to exist before the app can store
// anything. isSystem types are owned by no one (userId stays null).
export const SYSTEM_ITEM_TYPES = [
  { name: "Snippet", icon: "Code", color: "#3b82f6" },
  { name: "Prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "Command", icon: "Terminal", color: "#f97316" },
  { name: "Note", icon: "StickyNote", color: "#fde047" },
  { name: "File", icon: "File", color: "#6b7280" },
  { name: "Image", icon: "Image", color: "#ec4899" },
  { name: "Link", icon: "Link", color: "#10b981" },
];

// Shared pool — items across different collections reuse these on purpose so
// search-by-tag has real overlap to demonstrate.
export const TAG_NAMES = [
  "react",
  "hooks",
  "typescript",
  "docker",
  "ci-cd",
  "git",
  "process",
  "package-manager",
  "css",
  "tailwind",
  "components",
  "design-system",
  "icons",
  "ai",
  "prompt-engineering",
  "documentation",
  "refactoring",
  "config",
];

// R2 is not wired up yet, so FILE items point at obvious stand-ins. The image
// URL resolves to a real placeholder service so file/image cards render.
const PLACEHOLDER_FILE_URL = "https://files.example.com/seed/env-example.txt";
const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/1200x800/0a0a0b/6366f1.png?text=StashCode+Palette";

const reactPatterns: SeedCollection = {
  name: "React Patterns",
  description: "Reusable React patterns and hooks",
  defaultTypeName: "Snippet",
  isFavorite: true,
  items: [
    {
      title: "useDebounce & useLocalStorage",
      description: "Two custom hooks for debounced values and persisted state.",
      typeName: "Snippet",
      contentType: "TEXT",
      language: "typescript",
      tags: ["react", "hooks", "typescript"],
      isFavorite: true,
      content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
    },
    {
      title: "Compound component with Context",
      description:
        "Context provider + compound children, so <Tabs> shares state without prop drilling.",
      typeName: "Snippet",
      contentType: "TEXT",
      language: "typescript",
      tags: ["react", "components", "typescript"],
      content: `import { createContext, useContext, useState } from "react";

interface TabsContextValue {
  active: string;
  setActive: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs.* must be used inside <Tabs>");
  return context;
}

export function Tabs({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
}

Tabs.Trigger = function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button data-active={active === value} onClick={() => setActive(value)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useTabs();
  return active === value ? <div>{children}</div> : null;
};`,
    },
    {
      title: "cn() and formatRelativeTime()",
      description: "The two utilities every component file ends up importing.",
      typeName: "Snippet",
      contentType: "TEXT",
      language: "typescript",
      tags: ["react", "typescript"],
      content: `type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

export function formatRelativeTime(date: Date, now = new Date()): string {
  const seconds = (date.getTime() - now.getTime()) / 1000;
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, secondsPerUnit] of UNITS) {
    if (Math.abs(seconds) >= secondsPerUnit) {
      return formatter.format(Math.round(seconds / secondsPerUnit), unit);
    }
  }

  return formatter.format(Math.round(seconds), "second");
}`,
    },
  ],
};

const aiWorkflows: SeedCollection = {
  name: "AI Workflows",
  description: "AI prompts and workflow automations",
  defaultTypeName: "Prompt",
  items: [
    {
      title: "Structured code review",
      description: "Forces a severity-ranked review instead of vague praise.",
      typeName: "Prompt",
      contentType: "TEXT",
      tags: ["ai", "prompt-engineering"],
      content: `Review the diff below as a senior engineer on this codebase.

Report findings in three ranked groups, most severe first:
1. Correctness — bugs, race conditions, unhandled errors, missing auth checks
2. Design — leaky abstractions, duplicated logic, patterns that fight the codebase
3. Polish — naming, dead code, missing tests

For each finding give: file:line, one sentence on what breaks, and the concrete fix.
Skip anything a linter or formatter would already catch. If a group is empty, say so
and move on — do not pad it.

DIFF:
"""
{{diff}}
"""`,
    },
    {
      title: "Generate TSDoc from source",
      description: "Documents exported functions without inventing behaviour.",
      typeName: "Prompt",
      contentType: "TEXT",
      tags: ["ai", "documentation", "prompt-engineering"],
      content: `Write TSDoc comments for every exported symbol in the file below.

Rules:
- Describe only what the code actually does. Never infer intent that isn't in the code.
- One summary line, then @param / @returns / @throws as applicable.
- Document non-obvious edge cases (empty input, null handling, thrown errors).
- Leave the implementation untouched; return the full file with comments added.
- If a function's behaviour is ambiguous, add a TODO instead of guessing.

FILE:
"""
{{file}}
"""`,
    },
    {
      title: "Refactoring assistant",
      description:
        "Proposes a staged refactor plan before touching any code. Pinned for quick access.",
      typeName: "Prompt",
      contentType: "TEXT",
      tags: ["ai", "refactoring"],
      isPinned: true,
      content: `You are refactoring the module below. Do not rewrite it yet.

First, return:
1. What this module is responsible for, in two sentences.
2. The specific problems (long functions, mixed concerns, duplicated logic, hidden state).
3. A staged plan — each stage independently shippable and behaviour-preserving,
   ordered so the riskiest change comes last.
4. What could break at each stage, and the test that would catch it.

Then wait. I'll pick the stage to implement.

MODULE:
"""
{{module}}
"""`,
    },
  ],
};

const devOps: SeedCollection = {
  name: "DevOps",
  description: "Infrastructure and deployment resources",
  defaultTypeName: "Snippet",
  items: [
    {
      title: "Multi-stage Dockerfile for Next.js",
      description: "Standalone output, non-root user, minimal runtime layer.",
      typeName: "Snippet",
      contentType: "TEXT",
      language: "dockerfile",
      tags: ["docker", "ci-cd"],
      content: `FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
    },
    {
      title: "Tag and deploy a release",
      description:
        "Migrate, tag from the current SHA, push. Pinned — run before every production deploy.",
      typeName: "Command",
      contentType: "TEXT",
      language: "bash",
      tags: ["ci-cd", "git"],
      isPinned: true,
      content: `# Fail the deploy rather than ship against an out-of-date schema
npx prisma migrate deploy

VERSION=$(date +%Y.%m.%d)-$(git rev-parse --short HEAD)
git tag -a "v$VERSION" -m "release $VERSION"
git push origin "v$VERSION"`,
    },
    {
      title: "Compose file reference",
      description: "Every key available in a compose.yaml, with examples.",
      typeName: "Link",
      contentType: "URL",
      url: "https://docs.docker.com/reference/compose-file/",
      tags: ["documentation"],
    },
    {
      title: "GitHub Actions workflow syntax",
      description: "Triggers, jobs, matrices and expressions in one page.",
      typeName: "Link",
      contentType: "URL",
      url: "https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions",
      tags: ["documentation"],
    },
    {
      title: ".env.example",
      description:
        "Template of every environment variable the app expects, with no real values.",
      typeName: "File",
      contentType: "FILE",
      fileUrl: PLACEHOLDER_FILE_URL,
      fileName: ".env.example",
      fileSize: 412,
      tags: ["docker", "config"],
    },
  ],
};

const terminalCommands: SeedCollection = {
  name: "Terminal Commands",
  description: "Useful shell commands for everyday development",
  defaultTypeName: "Command",
  items: [
    {
      title: "Undo the last commit, keep the changes",
      description: "Soft reset — the work stays staged, the commit disappears.",
      typeName: "Command",
      contentType: "TEXT",
      language: "bash",
      tags: ["git"],
      content: `# Undo the commit, keep everything staged
git reset --soft HEAD~1

# Already pushed? Rewrite only your own branch, never a shared one
git push --force-with-lease`,
    },
    {
      title: "Reclaim Docker disk space",
      description: "Removes stopped containers, unused images, networks and build cache.",
      typeName: "Command",
      contentType: "TEXT",
      language: "bash",
      tags: ["docker"],
      content: `# See what is actually using space first
docker system df

# Then reclaim it (-a also drops unused images, not just dangling ones)
docker system prune -a --volumes`,
    },
    {
      title: "Kill whatever is holding port 3000",
      description: "For when the dev server says the port is already in use.",
      typeName: "Command",
      contentType: "TEXT",
      language: "bash",
      tags: ["process"],
      content: `# Who has it?
lsof -i :3000

# Kill it
kill -9 $(lsof -ti :3000)`,
    },
    {
      title: "Audit and update npm dependencies",
      description: "Check what's stale, patch vulnerabilities, prune what's unused.",
      typeName: "Command",
      contentType: "TEXT",
      language: "bash",
      tags: ["package-manager"],
      isFavorite: true,
      content: `npm outdated
npm audit fix
npm prune

# Interactive major-version bumps
npx npm-check-updates --interactive`,
    },
  ],
};

const designResources: SeedCollection = {
  name: "Design Resources",
  description: "UI/UX resources and references",
  defaultTypeName: "Link",
  items: [
    {
      title: "Tailwind CSS documentation",
      description: "Utility reference and the v4 CSS-first configuration guide.",
      typeName: "Link",
      contentType: "URL",
      url: "https://tailwindcss.com/docs",
      tags: ["css", "tailwind"],
    },
    {
      title: "shadcn/ui components",
      description: "Copy-in components built on Radix — the base for this project's UI.",
      typeName: "Link",
      contentType: "URL",
      url: "https://ui.shadcn.com/docs/components",
      tags: ["components", "design-system"],
    },
    {
      title: "Material Design 3",
      description: "A full design system worth reading for token and elevation patterns.",
      typeName: "Link",
      contentType: "URL",
      url: "https://m3.material.io/",
      tags: ["design-system"],
    },
    {
      title: "Lucide icon library",
      description: "The icon set StashCode uses for item types.",
      typeName: "Link",
      contentType: "URL",
      url: "https://lucide.dev/icons/",
      tags: ["icons"],
    },
    {
      title: "StashCode palette reference",
      description: "Canvas, surface and the seven item-type accents, side by side.",
      typeName: "Image",
      contentType: "FILE",
      fileUrl: PLACEHOLDER_IMAGE_URL,
      fileName: "stashcode-palette.png",
      fileSize: 84_320,
      tags: ["design-system", "icons"],
    },
  ],
};

// 5 collections, not the documented free-tier cap of 3: the demo account shows
// the product's full range, per the "leave all features unlocked during
// development" build note. See context/features/seed-spec.md.
export const COLLECTIONS: SeedCollection[] = [
  reactPatterns,
  aiWorkflows,
  devOps,
  terminalCommands,
  designResources,
];
