import type { Metadata } from "next";
import { Suspense } from "react";
import UserManager from "@/components/modules/admin/user-manager";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export const metadata: Metadata = { title: "Users" };

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Users"
        description="Customers, riders and admins. Block accounts when needed."
      />
      <Suspense fallback={<TableSkeleton />}>
        <UserManager />
      </Suspense>
    </PageContainer>
  );
}
