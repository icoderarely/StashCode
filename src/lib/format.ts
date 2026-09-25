// Mock data timestamps are anchored to this "now" so relative times (and the
// dashboard's "current date") stay consistent with each other until real
// auth/data replaces the mock layer.
export const MOCK_NOW = new Date("2024-09-24T10:00:00Z");

export function formatHeaderDate(date: Date = MOCK_NOW): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatRelativeTime(dateString: string, now: Date = MOCK_NOW): string {
  const diffMs = now.getTime() - new Date(dateString).getTime();
  const diffMinutes = Math.round(diffMs / 60_000);
  const diffHours = Math.round(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}
