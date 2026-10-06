"use client";

import { CreditCard, SearchX } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { LinkButton } from "@/components/ui/link-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { usePaymentList, useUrlState } from "@/hooks";
import { cn } from "@/lib/utils";
import type {
  PaymentParams,
  PaymentStatus,
  PaymentWithShipment,
} from "@/types";
import { formatCurrency, formatDateTime, getShipmentHref } from "@/utils";

type Filter = "ALL" | PaymentStatus;

const FILTERS: readonly (readonly [Filter, string])[] = [
  ["ALL", "All"],
  ["PAID", "Paid"],
  ["UNPAID", "Unpaid"],
  ["FAILED", "Failed"],
  ["REFUNDED", "Refunded"],
];

const VALID: Filter[] = [
  "ALL",
  "PAID",
  "UNPAID",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
];
const PAGE_SIZE = 10;

function methodLabel(payment: PaymentWithShipment) {
  return payment.method === "BKASH" ? "bKash" : "Cash on delivery";
}

export default function PaymentListView({
  role,
}: {
  role: "admin" | "customer";
}) {
  const { getString, getNumber, setParams } = useUrlState();
  const rawStatus = getString("status", "ALL") as Filter;
  const status = VALID.includes(rawStatus) ? rawStatus : "ALL";
  const page = getNumber("page", 1);

  const params: PaymentParams = {
    page,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(status !== "ALL" ? { status } : {}),
  };

  const { data, isPending, isFetching, error, refetch } = usePaymentList(
    role,
    params,
  );
  const payments = data?.data ?? [];
  const shipmentRole = role;

  return (
    <div className="space-y-4">
      <FilterTabs
        label="Filter by payment status"
        value={status}
        onChange={(value) =>
          setParams({ status: value === "ALL" ? null : value })
        }
        options={FILTERS}
      />

      {isPending ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={status === "ALL" ? CreditCard : SearchX}
            title={status === "ALL" ? "No payments yet" : "No payments match"}
            description={
              status === "ALL"
                ? "Payments appear here once you pay for a shipment."
                : "Try a different status."
            }
            action={
              status === "ALL" && role === "customer" ? (
                <LinkButton href="/dashboard/shipments/new">
                  Send a parcel
                </LinkButton>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          <ul
            className={cn(
              "space-y-3 transition-opacity md:hidden",
              isFetching && "opacity-60",
            )}
          >
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="space-y-2 rounded-2xl border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={getShipmentHref(shipmentRole, payment.shipment.id)}
                    className="font-mono text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {payment.shipment.trackingCode}
                  </Link>
                  <PaymentStatusBadge status={payment.status} />
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0 text-xs text-muted-foreground">
                    <p>{methodLabel(payment)}</p>
                    {role === "admin" && (
                      <p className="truncate">
                        {payment.shipment.customer?.name ?? "—"}
                      </p>
                    )}
                    <p>{formatDateTime(payment.paidAt ?? payment.createdAt)}</p>
                  </div>
                  <p className="text-lg font-semibold tabular-nums">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div
            className={cn(
              "hidden overflow-x-auto rounded-2xl border bg-card transition-opacity md:block",
              isFetching && "opacity-60",
            )}
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Shipment</TableHead>
                  {role === "admin" && <TableHead>Customer</TableHead>}
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Link
                        href={getShipmentHref(
                          shipmentRole,
                          payment.shipment.id,
                        )}
                        className="font-mono text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        {payment.shipment.trackingCode}
                      </Link>
                      {payment.bkashTrxId && (
                        <p className="text-xs text-muted-foreground">
                          TrxID {payment.bkashTrxId}
                        </p>
                      )}
                    </TableCell>
                    {role === "admin" && (
                      <TableCell className="text-sm">
                        {payment.shipment.customer?.name ?? "—"}
                      </TableCell>
                    )}
                    <TableCell className="text-sm">
                      {methodLabel(payment)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                      {formatDateTime(payment.paidAt ?? payment.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
