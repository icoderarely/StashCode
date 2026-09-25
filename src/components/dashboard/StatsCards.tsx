import { Inbox, Folder, Star, Heart, type LucideIcon } from "lucide-react";

import { collections, items } from "@/lib/mock-data";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export function StatsCards() {
  const stats: Stat[] = [
    { label: "Items", value: items.length, icon: Inbox, color: "#6366f1" },
    { label: "Collections", value: collections.length, icon: Folder, color: "#10b981" },
    {
      label: "Favorite items",
      value: items.filter((item) => item.isFavorite).length,
      icon: Star,
      color: "#facc15",
    },
    {
      label: "Favorite collections",
      value: collections.filter((collection) => collection.isFavorite).length,
      icon: Heart,
      color: "#ec4899",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${stat.color}1f`, color: stat.color }}
          >
            <stat.icon className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-xl font-semibold text-foreground">{stat.value}</p>
            <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
