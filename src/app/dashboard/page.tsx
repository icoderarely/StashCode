import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsSection } from "@/components/dashboard/CollectionsSection";
import { PinnedItemsSection } from "@/components/dashboard/PinnedItemsSection";
import { ItemsSection } from "@/components/dashboard/ItemsSection";
import { getSidebarNav } from "@/lib/db/nav";

export default async function DashboardPage() {
  const nav = await getSidebarNav();

  return (
    <DashboardShell nav={nav}>
      <div className="flex flex-col gap-8">
        <DashboardHeader />
        <StatsCards />
        <CollectionsSection />
        <PinnedItemsSection />
        <ItemsSection />
      </div>
    </DashboardShell>
  );
}
