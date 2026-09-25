// Mock data source for the dashboard UI until the database is implemented.
// Shape mirrors the Prisma schema in context/project-overview.md.

export type ContentType = "TEXT" | "URL" | "FILE";

export interface User {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
}

export interface ItemType {
  id: string;
  name: string;
  icon: string; // lucide-react icon name
  color: string; // hex
  isSystem: boolean;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  content?: string;
  url?: string;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: string;
  itemTypeId: string;
  collectionIds: string[];
}

export interface Collection {
  id: string;
  name: string;
  itemIds: string[];
}

export const currentUser: User = {
  id: "user-1",
  name: "Jordan Davis",
  email: "jordan@example.com",
  isPro: false,
};

export const itemTypes: ItemType[] = [
  { id: "type-snippet", name: "Snippet", icon: "Code", color: "#3b82f6", isSystem: true },
  { id: "type-prompt", name: "Prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true },
  { id: "type-command", name: "Command", icon: "Terminal", color: "#f97316", isSystem: true },
  { id: "type-note", name: "Note", icon: "StickyNote", color: "#fde047", isSystem: true },
  { id: "type-file", name: "File", icon: "File", color: "#6b7280", isSystem: true },
  { id: "type-image", name: "Image", icon: "Image", color: "#ec4899", isSystem: true },
  { id: "type-link", name: "Link", icon: "Link", color: "#10b981", isSystem: true },
];

export const items: Item[] = [
  {
    id: "item-1",
    title: "Fetch with timeout",
    description: "Abortable fetch helper with a built-in timeout.",
    contentType: "TEXT",
    content: "async function fetchWithTimeout(url, ms) { /* ... */ }",
    isFavorite: false,
    isPinned: false,
    updatedAt: "2024-09-24T09:58:00Z",
    itemTypeId: "type-snippet",
    collectionIds: ["collection-react-patterns"],
  },
  {
    id: "item-2",
    title: "Code review prompt",
    description: "A systematic prompt for thoughtful code reviews.",
    contentType: "TEXT",
    content: "Review the following code for correctness, security, and style...",
    isFavorite: false,
    isPinned: false,
    updatedAt: "2024-09-24T09:42:00Z",
    itemTypeId: "type-prompt",
    collectionIds: ["collection-ai-prompts"],
  },
  {
    id: "item-3",
    title: "New project setup",
    description: "Create a new Next.js project with the essentials.",
    contentType: "TEXT",
    content: "npx create-next-app@latest my-app --typescript --tailwind",
    isFavorite: false,
    isPinned: false,
    updatedAt: "2024-09-24T09:00:00Z",
    itemTypeId: "type-command",
    collectionIds: ["collection-terminal-commands"],
  },
  {
    id: "item-4",
    title: "Things worth remembering",
    description: "Small principles that make building software easier.",
    contentType: "TEXT",
    content: "1. Make it work, then make it right, then make it fast.",
    isFavorite: false,
    isPinned: false,
    updatedAt: "2024-09-23T10:00:00Z",
    itemTypeId: "type-note",
    collectionIds: ["collection-personal-notes"],
  },
  {
    id: "item-5",
    title: "Vercel documentation",
    description: "The home for Vercel platform documentation.",
    contentType: "URL",
    url: "https://vercel.com/docs",
    isFavorite: false,
    isPinned: false,
    updatedAt: "2024-09-23T09:00:00Z",
    itemTypeId: "type-link",
    collectionIds: ["collection-resources"],
  },
  {
    id: "item-6",
    title: "Environment variables",
    description: "Notes on handling runtime configuration safely.",
    contentType: "TEXT",
    content: "Never commit .env files. Use .env.local for secrets.",
    isFavorite: false,
    isPinned: false,
    updatedAt: "2024-09-22T09:00:00Z",
    itemTypeId: "type-note",
    collectionIds: ["collection-react-patterns"],
  },
];

export const collections: Collection[] = [
  {
    id: "collection-react-patterns",
    name: "React Patterns",
    itemIds: ["item-1", "item-6"],
  },
  {
    id: "collection-ai-prompts",
    name: "AI Prompts",
    itemIds: ["item-2"],
  },
  {
    id: "collection-terminal-commands",
    name: "Terminal Commands",
    itemIds: ["item-3"],
  },
  {
    id: "collection-personal-notes",
    name: "Personal Notes",
    itemIds: ["item-4"],
  },
  {
    id: "collection-resources",
    name: "Resources",
    itemIds: ["item-5"],
  },
];
