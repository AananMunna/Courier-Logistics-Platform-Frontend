import { PackagePlus } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import ShipmentListView from "@/components/modules/shipments/shipment-list-view";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { CardListSkeleton } from "@/components/shared/table-skeleton";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = { title: "My shipments" };

export default function MyShipmentsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="My shipments"
        description="Every parcel you've booked, newest first."
        actions={
          <LinkButton href="/dashboard/shipments/new">
            <PackagePlus /> New shipment
          </LinkButton>
        }
      />
      <Suspense fallback={<CardListSkeleton />}>
        <ShipmentListView role="customer" />
      </Suspense>
    </PageContainer>
  );
}
