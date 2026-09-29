import { Inbox, Folder, Star, Heart, type LucideIcon } from "lucide-react";

import { getDashboardStats } from "@/lib/db/stats";
import { getCurrentUserId } from "@/lib/db/user";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const EMPTY_STATS = { items: 0, collections: 0, favoriteItems: 0, favoriteCollections: 0 };

export async function StatsCards() {
  const userId = await getCurrentUserId();
  const counts = userId ? await getDashboardStats(userId) : EMPTY_STATS;

  const stats: Stat[] = [
    { label: "Items", value: counts.items, icon: Inbox, color: "#6366f1" },
    { label: "Collections", value: counts.collections, icon: Folder, color: "#10b981" },
    { label: "Favorite items", value: counts.favoriteItems, icon: Star, color: "#facc15" },
    {
      label: "Favorite collections",
      value: counts.favoriteCollections,
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
