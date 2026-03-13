import StatsCards from "@/components/layout/Content/StatsCards";
import ChartsSection from "@/components/layout/Content/ChartsSection";
import TablesSection from "@/components/layout/Content/TablesSection";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <ChartsSection />
      <TablesSection />
    </div>
  );
}
