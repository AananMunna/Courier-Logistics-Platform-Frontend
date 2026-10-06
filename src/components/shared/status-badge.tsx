import { SHIPMENT_STATUS } from "@/constants";
import { cn } from "@/lib/utils";
import type {
  PaymentStatus,
  RiderVerificationStatus,
  ShipmentStatus,
  UserStatus,
} from "@/types";
import { Badge } from "../ui/badge";

export function ShipmentStatusBadge({
  status,
  className,
}: {
  status: ShipmentStatus;
  className?: string;
}) {
  const meta = SHIPMENT_STATUS[status];

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        meta.badgeClass,
        className,
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", meta.dotClass)}
        aria-hidden="true"
      />
      {meta.label}
    </span>
  );
}

const PAYMENT_VARIANT: Record<
  PaymentStatus,
  {
    label: string;
    variant: "success" | "warning" | "destructive" | "secondary" | "info";
  }
> = {
  PAID: { label: "Paid", variant: "success" },
  UNPAID: { label: "Unpaid", variant: "warning" },
  FAILED: { label: "Failed", variant: "destructive" },
  CANCELLED: { label: "Cancelled", variant: "secondary" },
  REFUNDED: { label: "Refunded", variant: "info" },
};

export function PaymentStatusBadge({
  status,
}: {
  status?: PaymentStatus | null;
}) {
  if (!status) {
    return <Badge variant="warning">Unpaid</Badge>;
  }
  const meta = PAYMENT_VARIANT[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

const VERIFICATION: Record<
  RiderVerificationStatus,
  { label: string; variant: "success" | "warning" | "destructive" }
> = {
  APPROVED: { label: "Approved", variant: "success" },
  PENDING: { label: "Pending review", variant: "warning" },
  REJECTED: { label: "Rejected", variant: "destructive" },
};

export function VerificationBadge({
  status,
}: {
  status: RiderVerificationStatus;
}) {
  const meta = VERIFICATION[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const variant = status === "ACTIVE" ? "success" : "destructive";
  return (
    <Badge variant={variant}>
      {status === "ACTIVE"
        ? "Active"
        : status === "BLOCKED"
          ? "Blocked"
          : "Deleted"}
    </Badge>
  );
}
