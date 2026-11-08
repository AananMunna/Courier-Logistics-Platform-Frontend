import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PageContainer, PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Data explorer" };

// Server component shell: header + metadata ship as HTML, only the interactive
// virtualized lists are sent to the browser as JS (and in their own chunk).
const LargeDataExplorer = dynamic(
  () => import("@/components/modules/admin/large-data-explorer"),
  { loading: () => <ExplorerSkeleton /> },
);

function ExplorerSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-[500px] w-full rounded-2xl" />
      <Skeleton className="h-[500px] w-full rounded-2xl" />
    </div>
  );
}

export default function Page() {
  return (
    <PageContainer>
      <PageHeader
        title="Data explorer"
        description="1,200 shipments and 1,500 activity entries rendered with DOM virtualization — only visible rows exist in the DOM."
      />
      <Suspense fallback={<ExplorerSkeleton />}>
        <LargeDataExplorer />
      </Suspense>
    </PageContainer>
  );
}
