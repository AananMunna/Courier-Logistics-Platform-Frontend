import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentListView from "@/components/modules/payments/payment-list-view";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export const metadata: Metadata = { title: "Payments" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Payments"
        description="All payments and refunds across the platform."
      />
      <Suspense fallback={<TableSkeleton />}>
        <PaymentListView role="admin" />
      </Suspense>
    </PageContainer>
  );
}
