import { DashboardTableSkeleton } from "@/components/boneyard/dashboard-table-skeleton";
import { ThreePanelBuilderSkeleton } from "@/components/boneyard/three-panel-builder-skeleton";
import { WebsiteDetailsPageSkeleton } from "@/components/boneyard/website-details-page-skeleton";
import { WebsiteSettingsPageSkeleton } from "@/components/boneyard/website-settings-page-skeleton";

export default function BoneyardCatalogPage() {
  return (
    <main className="min-h-screen bg-slate-100/80 dark:bg-slate-950 px-6 py-8 space-y-8">
      <section className="space-y-4">
        <h1 className="text-xl font-bold">Boneyard Fixtures</h1>
        <WebsiteSettingsPageSkeleton />
      </section>

      <section className="space-y-4">
        <WebsiteDetailsPageSkeleton />
      </section>

      <section className="space-y-4">
        <ThreePanelBuilderSkeleton />
      </section>

      <section className="space-y-4">
        <DashboardTableSkeleton />
      </section>
    </main>
  );
}
