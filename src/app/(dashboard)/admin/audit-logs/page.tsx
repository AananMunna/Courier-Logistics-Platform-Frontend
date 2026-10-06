import type { Metadata } from "next";
import { Suspense } from "react";
import AuditLogView from "@/components/modules/admin/audit-log-view";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export const metadata: Metadata = { title: "Audit logs" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Audit logs"
        description="A timestamped record of every status change and note."
      />
      <Suspense fallback={<TableSkeleton />}>
        <AuditLogView />
      </Suspense>
    </PageContainer>
  );
}
