"use client";

import {
  Bike,
  Building2,
  CheckCircle2,
  PackageSearch,
  TriangleAlert,
  Truck,
  UserCog,
  Wallet,
} from "lucide-react";
import { lazy, Suspense } from "react";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard, StatGridSkeleton } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks";
import { formatCurrency } from "@/utils";
import { RecentShipments } from "../dashboard/recent-shipments";
import { OpsQueue } from "./ops-queue";

// Recharts (~370 kB raw) is only needed once stats have loaded — keep it out of
// the initial route bundle. Fallbacks reserve the final height to avoid CLS.
const ShipmentTrend = lazy(() =>
  import("./shipment-trend").then((m) => ({ default: m.ShipmentTrend })),
);
const OverviewCharts = lazy(() =>
  import("./overview-charts").then((m) => ({ default: m.OverviewCharts })),
);

function ChartSkeleton({ height }: { height: number }) {
  return (
    <Skeleton
      style={{ height }}
      className="w-full rounded-2xl"
      aria-busy="true"
      aria-label="Loading chart"
    />
  );
}

/** Client-only live section. The hero/header is a Server Component in page.tsx. */
export default function AdminOverview() {
  const { data, isPending, error, refetch } = useAdminStats();
  const stats = data?.data;

  return (
    <>
      <OpsQueue />

      {isPending ? (
        <>
          <StatGridSkeleton count={4} />
          <StatGridSkeleton count={4} />
        </>
      ) : error || !stats ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total shipments"
              value={stats.totalShipments}
              icon={PackageSearch}
            />
            <StatCard
              label="In transit"
              value={stats.totalInTransitShipments}
              icon={Truck}
              tone="info"
            />
            <StatCard
              label="Delivered"
              value={stats.totalDeliveredShipments}
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="Failed"
              value={stats.totalFailedShipments}
              icon={TriangleAlert}
              tone="danger"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Net revenue"
              value={formatCurrency(stats.netRevenue)}
              icon={Wallet}
              tone="success"
              hint={`${formatCurrency(stats.totalRefunded)} refunded`}
            />
            <StatCard
              label="Approved riders"
              value={stats.totalApprovedRiders}
              icon={Bike}
              hint={`${stats.totalPendingRiderApplications} pending`}
            />
            <StatCard
              label="Customers"
              value={stats.totalCustomers}
              icon={UserCog}
            />
            <StatCard
              label="Active hubs"
              value={stats.totalHubs}
              icon={Building2}
            />
          </div>
          <Suspense fallback={<ChartSkeleton height={380} />}>
            <ShipmentTrend />
          </Suspense>
          <Suspense fallback={<ChartSkeleton height={340} />}>
            <OverviewCharts stats={stats} />
          </Suspense>
        </>
      )}

      <RecentShipments
        role="admin"
        title="Latest shipments"
        emptyText="Shipments booked by customers will appear here."
        viewAllHref="/admin/shipments"
      />
    </>
  );
}
