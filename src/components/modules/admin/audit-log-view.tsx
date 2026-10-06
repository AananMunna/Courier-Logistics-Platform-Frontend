"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ShipmentStatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { ROLE_LABEL } from "@/constants";
import { useAuditLogs, useUrlState } from "@/hooks";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils";

export default function AuditLogView() {
  const { getNumber, setParams } = useUrlState();
  const page = getNumber("page", 1);

  const { data, isPending, isFetching, error, refetch } = useAuditLogs({
    page,
    limit: 15,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const logs = data?.data ?? [];

  if (isPending) {
    return <TableSkeleton rows={8} columns={5} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (logs.length === 0) {
    return (
      <div className="rounded-2xl border bg-card">
        <EmptyState
          icon={ClipboardList}
          title="No activity yet"
          description="Every status change and note on a shipment is recorded here."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul
        className={cn(
          "space-y-3 transition-opacity md:hidden",
          isFetching && "opacity-60",
        )}
      >
        {logs.map((log) => (
          <li key={log.id} className="space-y-2 rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/admin/shipments/${log.shipmentId}`}
                className="font-mono text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {log.shipment.trackingCode}
              </Link>
              <ShipmentStatusBadge status={log.status} />
            </div>
            {log.note && (
              <p className="text-sm text-muted-foreground">{log.note}</p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {log.updatedByName ?? "System"}
                {log.updatedByRole && (
                  <Badge variant="outline" className="ml-2">
                    {ROLE_LABEL[log.updatedByRole]}
                  </Badge>
                )}
              </span>
              <span>{formatDateTime(log.createdAt)}</span>
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
              <TableHead>When</TableHead>
              <TableHead>Shipment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                  {formatDateTime(log.createdAt)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/shipments/${log.shipmentId}`}
                    className="font-mono text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {log.shipment.trackingCode}
                  </Link>
                </TableCell>
                <TableCell>
                  <ShipmentStatusBadge status={log.status} />
                </TableCell>
                <TableCell className="max-w-[280px] truncate text-sm text-muted-foreground">
                  {log.note ?? "—"}
                </TableCell>
                <TableCell className="text-sm">
                  {log.updatedByName ?? "System"}
                  {log.updatedByRole && (
                    <Badge variant="outline" className="ml-2">
                      {ROLE_LABEL[log.updatedByRole]}
                    </Badge>
                  )}
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
    </div>
  );
}
