import type { Metadata } from "next";
import AdminOverview from "@/components/modules/admin/admin-overview";
import { DashboardHero } from "@/components/shared/dashboard-hero";
import { PageContainer } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = { title: "Overview" };

// Static hero stays on the server (zero client JS); only the live stats are client.
export default function AdminHomePage() {
  return (
    <PageContainer>
      <DashboardHero
        title="Operations overview"
        description="What needs your attention right now, and how the business is doing."
        actions={
          <>
            <LinkButton href="/admin/shipments" size="lg" className="h-10 px-4">
              All shipments
            </LinkButton>
            <LinkButton
              href="/admin/approve-rider"
              size="lg"
              variant="outline"
              className="h-10 border-white/20 bg-white/5 px-4 text-ink-foreground hover:bg-white/10"
            >
              Rider approvals
            </LinkButton>
          </>
        }
      />
      <AdminOverview />
    </PageContainer>
  );
}
