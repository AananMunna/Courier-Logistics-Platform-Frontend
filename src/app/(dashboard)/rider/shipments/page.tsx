import type { Metadata } from "next";
import { Suspense } from "react";
import ShipmentListView from "@/components/modules/shipments/shipment-list-view";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { CardListSkeleton } from "@/components/shared/table-skeleton";

export const metadata: Metadata = { title: "My shipments" };

export default function RiderShipmentsPage() {
  return (
    <PageContainer>
      <PageHeader title="My shipments" description="Parcels assigned to you." />
      <Suspense fallback={<CardListSkeleton />}>
        <ShipmentListView role="rider" />
      </Suspense>
    </PageContainer>
  );
}
