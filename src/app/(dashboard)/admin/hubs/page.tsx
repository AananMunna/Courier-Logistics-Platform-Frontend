import type { Metadata } from "next";
import { Suspense } from "react";
import HubManager from "@/components/modules/admin/hub-manager";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export const metadata: Metadata = { title: "Hubs" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader title="Hubs" description="Manage pickup and delivery hubs." />
      <Suspense fallback={<TableSkeleton />}>
        <HubManager />
      </Suspense>
    </PageContainer>
  );
}
