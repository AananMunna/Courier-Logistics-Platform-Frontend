"use client";

import { CheckCircle2, ListTodo, Star, XCircle } from "lucide-react";
import { DashboardHero } from "@/components/shared/dashboard-hero";
import { ErrorState } from "@/components/shared/error-state";
import { PageContainer } from "@/components/shared/page-header";
import { StatCard, StatGridSkeleton } from "@/components/shared/stat-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCurrentUser, useMyRiderProfile, useRiderStats } from "@/hooks";
import { toNumber } from "@/utils";
import { RecentShipments } from "../dashboard/recent-shipments";
import { ActiveDeliveryCard } from "./active-delivery-card";
import { AvailabilityToggle } from "./availability-toggle";

export default function RiderOverview() {
  const { user } = useCurrentUser();
  const { data, isPending, error, refetch } = useRiderStats();
  const { data: profile } = useMyRiderProfile();
  const stats = data?.data;
  const approved = profile?.data.verificationStatus === "APPROVED";

  return (
    <PageContainer>
      <DashboardHero
        title={`Hi, ${user?.name.split(" ")[0] ?? "rider"}`}
        description="Your active deliveries are listed first. Tap a parcel to update its status."
        aside={
          approved && profile ? (
            <AvailabilityToggle rider={profile.data} />
          ) : (
            <p className="text-sm text-ink-foreground/70">
              {approved
                ? "Loading your availability…"
                : "Availability turns on once your account is approved."}
            </p>
          )
        }
      />

      {profile && !approved && (
        <Alert variant="warning">
          <AlertTitle>
            Your account is {profile.data.verificationStatus.toLowerCase()}
          </AlertTitle>
          <AlertDescription>
            {profile.data.rejectionReason ??
              "An admin needs to approve your account before you can receive deliveries."}
          </AlertDescription>
        </Alert>
      )}

      {approved && <ActiveDeliveryCard />}

      {isPending ? (
        <StatGridSkeleton />
      ) : error || !stats ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active now"
            value={stats.activeShipments}
            icon={ListTodo}
            tone="info"
            hint="Pickups & deliveries to do"
          />
          <StatCard
            label="Delivered"
            value={stats.deliveredShipments}
            icon={CheckCircle2}
            tone="success"
          />
          <StatCard
            label="Failed"
            value={stats.failedShipments}
            icon={XCircle}
            tone="danger"
          />
          <StatCard
            label="Rating"
            value={toNumber(stats.rating).toFixed(1)}
            icon={Star}
            tone="warning"
            hint={`${stats.assignedShipments} assigned in total`}
          />
        </div>
      )}

      <RecentShipments
        role="rider"
        title="Latest assignments"
        emptyText="When an admin assigns you a parcel, it appears here."
        viewAllHref="/rider/shipments"
      />
    </PageContainer>
  );
}
