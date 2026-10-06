"use client";

import { Check, UserRoundX, X } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { VerificationBadge } from "@/components/shared/status-badge";
import { CardListSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import TablePagination from "@/components/ui/table-pagination";
import { VEHICLE_TYPE_LABEL } from "@/constants";
import { useGetAllRiders, useUrlState, useVerifyRider } from "@/hooks";
import { notify } from "@/lib/notify";
import type { Rider, RiderVerificationStatus } from "@/types";
import { formatDate, maskValue } from "@/utils";

const FILTERS: readonly (readonly [RiderVerificationStatus, string])[] = [
  ["PENDING", "Pending"],
  ["APPROVED", "Approved"],
  ["REJECTED", "Rejected"],
];

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium break-words">{value || "—"}</dd>
    </div>
  );
}

function RiderCard({ rider }: { rider: Rider }) {
  const { mutate: verify, isPending } = useVerifyRider();
  const [rejecting, setRejecting] = useState(false);
  const [action, setAction] = useState<"APPROVED" | "REJECTED" | null>(null);

  const approve = () => {
    setAction("APPROVED");
    verify(
      { riderId: rider.id, verificationStatus: "APPROVED" },
      {
        onSuccess: () =>
          notify.success(
            "Rider approved",
            `${rider.name} can now take deliveries.`,
          ),
        onError: (error) => notify.error("Couldn't approve rider", error),
        onSettled: () => setAction(null),
      },
    );
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-semibold">{rider.name}</h2>
            <p className="text-sm text-muted-foreground">{rider.email}</p>
          </div>
          <VerificationBadge status={rider.verificationStatus} />
        </div>

        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <Detail label="Phone" value={rider.contactNumber} />
          <Detail
            label="Vehicle"
            value={VEHICLE_TYPE_LABEL[rider.vehicleType]}
          />
          <Detail
            label="Registration"
            value={rider.vehicleRegistrationNumber}
          />
          <Detail label="NID" value={maskValue(rider.nidNumber, 4)} />
          <Detail label="License" value={rider.drivingLicenseNumber} />
          <Detail label="Zone" value={rider.currentZone} />
          <Detail label="Applied" value={formatDate(rider.createdAt)} />
          {rider.reviewedAt && (
            <Detail label="Reviewed" value={formatDate(rider.reviewedAt)} />
          )}
        </dl>

        {rider.rejectionReason && (
          <p className="rounded-lg bg-destructive/5 p-3 text-sm text-destructive">
            Reason: {rider.rejectionReason}
          </p>
        )}

        {rider.verificationStatus === "PENDING" && (
          <div className="grid grid-cols-2 gap-2 border-t pt-4 sm:flex sm:flex-wrap">
            <Button
              className="h-11 sm:h-auto"
              onClick={approve}
              disabled={isPending}
            >
              {isPending && action === "APPROVED" ? <Spinner /> : <Check />}{" "}
              Approve
            </Button>
            <Button
              variant="outline"
              className="h-11 sm:h-auto"
              onClick={() => setRejecting(true)}
              disabled={isPending}
            >
              <X /> Reject
            </Button>
          </div>
        )}

        <ReasonDialog
          open={rejecting}
          onOpenChange={setRejecting}
          title={`Reject ${rider.name}?`}
          description="The applicant will see this reason by email."
          label="Rejection reason"
          placeholder="e.g. NID photo is unclear"
          confirmLabel="Reject application"
          destructive
          isPending={isPending}
          onConfirm={(reason) => {
            setAction("REJECTED");
            verify(
              {
                riderId: rider.id,
                verificationStatus: "REJECTED",
                rejectionReason: reason,
              },
              {
                onSuccess: () => {
                  notify.success("Application rejected");
                  setRejecting(false);
                },
                onError: (error) =>
                  notify.error("Couldn't reject application", error),
                onSettled: () => setAction(null),
              },
            );
          }}
        />
      </CardContent>
    </Card>
  );
}

export default function RiderApproval() {
  const { getString, getNumber, setParams } = useUrlState();
  const raw = getString("status", "PENDING");
  const status = (
    ["PENDING", "APPROVED", "REJECTED"].includes(raw) ? raw : "PENDING"
  ) as RiderVerificationStatus;
  const page = getNumber("page", 1);

  const { data, isPending, error, refetch } = useGetAllRiders({
    verificationStatus: status,
    page,
    limit: 6,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const riders = data?.data ?? [];

  return (
    <div className="space-y-4">
      <FilterTabs
        label="Application status"
        value={status}
        onChange={(value) =>
          setParams({ status: value === "PENDING" ? null : value })
        }
        options={FILTERS}
      />
      {isPending ? (
        <CardListSkeleton rows={3} />
      ) : error ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : riders.length === 0 ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={UserRoundX}
            title={
              status === "PENDING"
                ? "No applications waiting"
                : `No ${status.toLowerCase()} riders`
            }
            description="New rider applications will appear here."
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {riders.map((rider) => (
              <RiderCard key={rider.id} rider={rider} />
            ))}
          </div>
          <TablePagination
            page={page}
            totalPages={data?.meta?.totalPages ?? 1}
            handlePageChange={(next) => setParams({ page: next })}
          />
        </>
      )}
    </div>
  );
}
