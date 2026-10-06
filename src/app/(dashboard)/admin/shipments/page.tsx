import type { Metadata } from "next";
import { Suspense } from "react";
import ShipmentListView from "@/components/modules/shipments/shipment-list-view";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { CardListSkeleton } from "@/components/shared/table-skeleton";

export const metadata: Metadata = { title: "Shipments" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Shipments"
        description="Every shipment on the platform. Assign riders to pending parcels."
      />
      <Suspense fallback={<CardListSkeleton />}>
        <ShipmentListView role="admin" />
      </Suspense>
    </PageContainer>
  );
}
