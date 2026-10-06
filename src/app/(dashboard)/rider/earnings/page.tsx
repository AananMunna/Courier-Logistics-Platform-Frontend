import type { Metadata } from "next";
import EarningsView from "@/components/modules/rider/earnings-view";
import { PageContainer, PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Earnings" };

export default function RiderEarningsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Earnings"
        description="What you've earned from completed deliveries."
      />
      <EarningsView />
    </PageContainer>
  );
}
