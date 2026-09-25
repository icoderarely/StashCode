import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CollectionsSection } from "@/components/dashboard/CollectionsSection";
import { ItemsSection } from "@/components/dashboard/ItemsSection";

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <DashboardHeader />
        <StatsCards />
        <CollectionsSection />
        <ItemsSection />
      </div>
    </DashboardShell>
  );
}
