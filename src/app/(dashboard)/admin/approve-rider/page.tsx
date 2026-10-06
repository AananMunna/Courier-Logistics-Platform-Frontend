import type { Metadata } from "next";
import { Suspense } from "react";
import RiderApproval from "@/components/modules/admin/rider-approval";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { CardListSkeleton } from "@/components/shared/table-skeleton";

export const metadata: Metadata = { title: "Rider applications" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Rider applications"
        description="Review new riders before they can take deliveries."
      />
      <Suspense fallback={<CardListSkeleton />}>
        <RiderApproval />
      </Suspense>
    </PageContainer>
  );
}
