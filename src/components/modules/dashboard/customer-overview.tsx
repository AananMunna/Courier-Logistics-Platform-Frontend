"use client";

import { CheckCircle2, Clock, PackagePlus, Truck, Wallet } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { PageContainer } from "@/components/shared/page-header";
import { StatCard, StatGridSkeleton } from "@/components/shared/stat-card";
import { LinkButton } from "@/components/ui/link-button";
import { useCurrentUser, useCustomerStats } from "@/hooks";
import { formatCurrency } from "@/utils";
import TrackForm from "../tracking/track-form";
import { ActiveShipmentCard } from "./active-shipment-card";
import { RecentShipments } from "./recent-shipments";

export default function CustomerOverview() {
  const { user } = useCurrentUser();
  const { data, isPending, error, refetch } = useCustomerStats();
  const stats = data?.data;

  return (
    <PageContainer>
      <section className="relative overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground md:p-9">
        <div
          aria-hidden="true"
          className="cg-grid-ink absolute inset-0 [mask-image:radial-gradient(ellipse_at_80%_20%,#000,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-16 -right-10 size-64 rounded-full bg-primary/30 blur-3xl"
        />
        <div className="relative grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Hello, {user?.name.split(" ")[0] ?? "there"}
            </h1>
            <p className="max-w-md text-sm text-ink-foreground/70">
              Book a pickup in a few taps, or check on a parcel that is on its
              way.
            </p>
            <LinkButton
              href="/dashboard/shipments/new"
              size="lg"
              className="mt-3 h-11 px-5"
            >
              <PackagePlus /> Send a parcel
            </LinkButton>
          </div>
          <div className="space-y-2 rounded-2xl bg-white/[0.07] p-4 ring-1 ring-white/10">
            <p className="text-sm font-medium">Track any parcel</p>
            <TrackForm />
          </div>
        </div>
      </section>

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
    </PageContainer>
  );
}
