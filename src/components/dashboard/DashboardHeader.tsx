import { formatHeaderDate, MOCK_NOW } from "@/lib/format";
import { currentUser } from "@/lib/mock-data";

export function DashboardHeader() {
  const firstName = currentUser.name.split(" ")[0];

  return (
    <div>
      <p className="text-sm text-muted-foreground">{formatHeaderDate(MOCK_NOW)}</p>
      <h1 className="mt-1 text-3xl font-semibold text-foreground">Good morning, {firstName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s in your stash today.</p>
    </div>
  );
}
