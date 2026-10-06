import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  PaymentStatusBadge,
  ShipmentStatusBadge,
} from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Shipment } from "@/types";
import { formatCurrency, formatDate, getShipmentHref } from "@/utils";

export type ShipmentViewRole = "admin" | "customer" | "rider";

interface Props {
  shipments: Shipment[];
  role: ShipmentViewRole;
  isFetching?: boolean;
}

function routeLabel(shipment: Shipment) {
  const from = shipment.originHub?.name ?? "—";
  const to = shipment.destinationHub?.name ?? "—";
  return (
    <span className="inline-flex items-center gap-1.5">
      {from}{" "}
      <ArrowRight
        className="size-3 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />{" "}
      {to}
    </span>
  );
}

function ShipmentCard({
  shipment,
  role,
}: {
  shipment: Shipment;
  role: ShipmentViewRole;
}) {
  return (
    <Link
      href={getShipmentHref(role, shipment.id)}
      className="block rounded-2xl border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-[0_12px_30px_-20px_rgb(15_23_42/0.35)] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold">
            {shipment.trackingCode}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(shipment.createdAt)}
          </p>
        </div>
        <ShipmentStatusBadge status={shipment.status} />
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <p className="truncate">{routeLabel(shipment)}</p>
        <p className="truncate text-muted-foreground">
          To {shipment.deliveryContactName} · {shipment.deliveryAddress}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold tabular-nums">
            {formatCurrency(shipment.deliveryFee)}
          </span>
          {role !== "rider" && (
            <PaymentStatusBadge status={shipment.payment?.status} />
          )}
          {shipment.isCod && Number(shipment.codAmount) > 0 && (
            <span className="text-xs text-muted-foreground">
              COD {formatCurrency(shipment.codAmount)}
            </span>
          )}
        </div>
        <ChevronRight
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export default function ShipmentList({ shipments, role, isFetching }: Props) {
  return (
    <div className={cn("transition-opacity", isFetching && "opacity-60")}>
      <ul className="space-y-3 md:hidden">
        {shipments.map((shipment) => (
          <li key={shipment.id}>
            <ShipmentCard shipment={shipment} role={role} />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Tracking</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>
                {role === "admin" ? "Customer" : "Receiver"}
              </TableHead>
              {role === "admin" && <TableHead>Rider</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              {role !== "rider" && <TableHead>Payment</TableHead>}
              <TableHead>Booked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow
                key={shipment.id}
                className="group transition-colors hover:bg-primary/[0.03]"
              >
                <TableCell>
                  <Link
                    href={getShipmentHref(role, shipment.id)}
                    className="font-mono text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {shipment.trackingCode}
                  </Link>
                </TableCell>
                <TableCell className="text-sm">
                  {routeLabel(shipment)}
                </TableCell>
                <TableCell className="max-w-[180px] truncate text-sm">
                  {role === "admin"
                    ? (shipment.customer?.name ?? "—")
                    : shipment.deliveryContactName}
                </TableCell>
                {role === "admin" && (
                  <TableCell className="text-sm text-muted-foreground">
                    {shipment.rider?.name ?? "Unassigned"}
                  </TableCell>
                )}
                <TableCell>
                  <ShipmentStatusBadge status={shipment.status} />
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(shipment.deliveryFee)}
                </TableCell>
                {role !== "rider" && (
                  <TableCell>
                    <PaymentStatusBadge status={shipment.payment?.status} />
                  </TableCell>
                )}
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(shipment.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
