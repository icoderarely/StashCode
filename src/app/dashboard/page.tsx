import { TopBar } from "@/components/dashboard/TopBar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-65 shrink-0 border-r border-border bg-card p-4">
          <h2 className="text-lg font-semibold text-foreground">Sidebar</h2>
        </aside>
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-lg font-semibold text-foreground">Main</h2>
        </main>
      </div>
    </div>
  );
}
