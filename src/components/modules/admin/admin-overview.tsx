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
import { DashboardHero } from "@/components/shared/dashboard-hero";
import { ErrorState } from "@/components/shared/error-state";
import { PageContainer } from "@/components/shared/page-header";
import { StatCard, StatGridSkeleton } from "@/components/shared/stat-card";
import { LinkButton } from "@/components/ui/link-button";
import { useAdminStats } from "@/hooks";
import { formatCurrency } from "@/utils";
import { RecentShipments } from "../dashboard/recent-shipments";
import { OpsQueue } from "./ops-queue";
import { OverviewCharts } from "./overview-charts";
import { ShipmentTrend } from "./shipment-trend";

export default function AdminOverview() {
  const { data, isPending, error, refetch } = useAdminStats();
  const stats = data?.data;

  return (
    <PageContainer>
      <DashboardHero
        title="Operations overview"
        description="What needs your attention right now, and how the business is doing."
        actions={
          <>
            <LinkButton href="/admin/shipments" size="lg" className="h-10 px-4">
              All shipments
            </LinkButton>
            <LinkButton
              href="/admin/approve-rider"
              size="lg"
              variant="outline"
              className="h-10 border-white/20 bg-white/5 px-4 text-ink-foreground hover:bg-white/10"
            >
              Rider approvals
            </LinkButton>
          </>
        }
      />

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
          <ShipmentTrend />
          <OverviewCharts stats={stats} />
        </>
      )}

      <RecentShipments
        role="admin"
        title="Latest shipments"
        emptyText="Shipments booked by customers will appear here."
        viewAllHref="/admin/shipments"
      />
    </PageContainer>
  );
}
