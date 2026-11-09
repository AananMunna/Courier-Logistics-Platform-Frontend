import type { Metadata } from "next";
import { CustomerHero } from "@/components/modules/dashboard/customer-hero";
import CustomerOverview from "@/components/modules/dashboard/customer-overview";
import { PageContainer } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Overview" };

export default function CustomerDashboardPage() {
  return (
    <PageContainer>
      <CustomerHero />
      <CustomerOverview />
    </PageContainer>
  );
}
