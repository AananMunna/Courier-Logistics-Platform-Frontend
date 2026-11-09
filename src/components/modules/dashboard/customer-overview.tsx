"use client";

import { CheckCircle2, Clock, PackagePlus, Truck, Wallet } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { StatCard, StatGridSkeleton } from "@/components/shared/stat-card";
import { LinkButton } from "@/components/ui/link-button";
import { useCustomerStats } from "@/hooks";
import { formatCurrency } from "@/utils";
import { ActiveShipmentCard } from "./active-shipment-card";
import { RecentShipments } from "./recent-shipments";

export default function CustomerOverview() {
  const { data, isPending, error, refetch } = useCustomerStats();
  const stats = data?.data;

  return (
    <>
      <ActiveShipmentCard />

      {isPending ? (
        <StatGridSkeleton />
      ) : error || !stats ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Pending"
            value={stats.pendingShipments}
            icon={Clock}
            tone="warning"
            hint="Waiting for a rider"
          />
          <StatCard
            label="On the way"
            value={stats.inTransitShipments}
            icon={Truck}
            tone="info"
          />
          <StatCard
            label="Delivered"
            value={stats.deliveredShipments}
            icon={CheckCircle2}
            tone="success"
          />
          <StatCard
            label="Total spent"
            value={formatCurrency(stats.totalSpent)}
            icon={Wallet}
            hint={`${stats.totalShipments} shipments`}
          />
        </div>
      )}

      <RecentShipments
        role="customer"
        emptyText="Book your first parcel and it will show up here."
        viewAllHref="/dashboard/shipments"
        emptyAction={
          <LinkButton href="/dashboard/shipments/new">
            <PackagePlus /> Send a parcel
          </LinkButton>
        }
      />
    </>
  );
}
