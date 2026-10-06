"use client";

import { Building2, Pencil, Plus, SearchX, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SearchInput } from "@/components/shared/search-input";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import {
  useDeleteHub,
  useGetAllHubs,
  useUpdateHub,
  useUrlState,
} from "@/hooks";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import type { Hub } from "@/types";
import { HubFormDialog } from "./hub-form-dialog";

export default function HubManager() {
  const { getString, getNumber, setParams } = useUrlState();
  const search = getString("search");
  const page = getNumber("page", 1);

  const [editing, setEditing] = useState<Hub | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Hub | null>(null);

  const { data, isPending, isFetching, error, refetch } = useGetAllHubs({
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(search ? { searchTerm: search } : {}),
  });
  const { mutate: update, isPending: updating } = useUpdateHub();
  const { mutate: remove, isPending: removing } = useDeleteHub();
  const hubs = data?.data ?? [];

  const openForm = (hub: Hub | null) => {
    setEditing(hub);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onSearch={(value) => setParams({ search: value })}
          placeholder="Search hubs"
          label="Search hubs"
        />
        <Button onClick={() => openForm(null)}>
          <Plus /> Add hub
        </Button>
      </div>

      {isPending ? (
        <TableSkeleton rows={5} columns={5} />
      ) : error ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : hubs.length === 0 ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={search ? SearchX : Building2}
            title={search ? "No hubs match your search" : "No hubs yet"}
            description={
              search
                ? "Try a different name or zone."
                : "Add your first hub so customers can book shipments."
            }
            action={
              !search ? (
                <Button onClick={() => openForm(null)}>
                  <Plus /> Add hub
                </Button>
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
            {hubs.map((hub) => (
              <li
                key={hub.id}
                className="space-y-3 rounded-2xl border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{hub.name}</p>
                    {hub.contactNumber && (
                      <p className="text-xs text-muted-foreground">
                        {hub.contactNumber}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">{hub.zone}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{hub.address}</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      aria-label={`${hub.name} active`}
                      checked={hub.isActive}
                      disabled={updating}
                      onCheckedChange={(checked) =>
                        update(
                          { hubId: hub.id, isActive: checked },
                          {
                            onSuccess: () =>
                              notify.success(
                                checked ? "Hub activated" : "Hub deactivated",
                              ),
                            onError: (err) =>
                              notify.error("Couldn't update hub", err),
                          },
                        )
                      }
                    />
                    <span className="text-xs text-muted-foreground">
                      {hub.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Edit ${hub.name}`}
                      onClick={() => openForm(hub)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={`Delete ${hub.name}`}
                      onClick={() => setDeleting(hub)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
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
                  <TableHead>Hub</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hubs.map((hub) => (
                  <TableRow key={hub.id}>
                    <TableCell>
                      <p className="font-medium">{hub.name}</p>
                      {hub.contactNumber && (
                        <p className="text-xs text-muted-foreground">
                          {hub.contactNumber}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{hub.zone}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate text-sm text-muted-foreground">
                      {hub.address}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          aria-label={`${hub.name} active`}
                          checked={hub.isActive}
                          disabled={updating}
                          onCheckedChange={(checked) =>
                            update(
                              { hubId: hub.id, isActive: checked },
                              {
                                onSuccess: () =>
                                  notify.success(
                                    checked
                                      ? "Hub activated"
                                      : "Hub deactivated",
                                  ),
                                onError: (err) =>
                                  notify.error("Couldn't update hub", err),
                              },
                            )
                          }
                        />
                        <span className="text-xs text-muted-foreground">
                          {hub.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${hub.name}`}
                          onClick={() => openForm(hub)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${hub.name}`}
                          onClick={() => setDeleting(hub)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
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

      <HubFormDialog open={formOpen} onOpenChange={setFormOpen} hub={editing} />

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "hub"}?`}
        description="Hubs with active shipments can't be deleted. Consider deactivating it instead."
        confirmLabel="Delete hub"
        destructive
        isPending={removing}
        onConfirm={() =>
          deleting &&
          remove(deleting.id, {
            onSuccess: () => {
              notify.success("Hub deleted");
              setDeleting(null);
            },
            onError: (err) =>
              notify.error("Couldn't delete hub", err, {
                409: "This hub still has active shipments.",
              }),
          })
        }
      />
    </div>
  );
}
