"use client";

import { SearchX, Users } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterTabs } from "@/components/shared/filter-tabs";
import { SearchInput } from "@/components/shared/search-input";
import { UserStatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { ADMIN_ROLES, ROLE_LABEL } from "@/constants";
import {
  useCurrentUser,
  useGetAllUsers,
  useUpdateUserStatus,
  useUrlState,
} from "@/hooks";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import type { User, UserRole } from "@/types";
import { formatDate } from "@/utils";

type RoleFilter = "ALL" | UserRole;

const FILTERS: readonly (readonly [RoleFilter, string])[] = [
  ["ALL", "Everyone"],
  ["CUSTOMER", "Customers"],
  ["RIDER", "Riders"],
  ["ADMIN", "Admins"],
];

export default function UserManager() {
  const { user: me } = useCurrentUser();
  const { getString, getNumber, setParams } = useUrlState();
  const rawRole = getString("role", "ALL") as RoleFilter;
  const role = FILTERS.some(([value]) => value === rawRole) ? rawRole : "ALL";
  const search = getString("search");
  const page = getNumber("page", 1);

  const [target, setTarget] = useState<User | null>(null);
  const { mutate: updateStatus, isPending: updating } = useUpdateUserStatus();

  const { data, isPending, isFetching, error, refetch } = useGetAllUsers({
    page,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...(role !== "ALL" ? { role } : {}),
    ...(search ? { searchTerm: search } : {}),
  });
  const users = data?.data ?? [];
  const blocking = target?.status === "ACTIVE";

  return (
    <div className="space-y-4">
      <SearchInput
        value={search}
        onSearch={(value) => setParams({ search: value })}
        placeholder="Search name or email"
        label="Search users"
      />
      <FilterTabs
        label="Filter by role"
        value={role}
        onChange={(value) =>
          setParams({ role: value === "ALL" ? null : value })
        }
        options={FILTERS}
      />

      {isPending ? (
        <TableSkeleton rows={6} columns={5} />
      ) : error ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : users.length === 0 ? (
        <div className="rounded-2xl border bg-card">
          <EmptyState
            icon={search ? SearchX : Users}
            title="No users found"
            description="Try a different search or filter."
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
            {users.map((row) => {
              const protectedRow =
                ADMIN_ROLES.includes(row.role) || row.id === me?.id;
              return (
                <li
                  key={row.id}
                  className="space-y-3 rounded-2xl border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={row.name}
                      src={row.imageUrl}
                      className="size-10"
                      size={40}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{row.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {row.email}
                      </p>
                    </div>
                    <UserStatusBadge status={row.status} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline">{ROLE_LABEL[row.role]}</Badge>
                    <span>Joined {formatDate(row.createdAt)}</span>
                  </div>
                  {!protectedRow && (
                    <Button
                      variant={row.status === "ACTIVE" ? "outline" : "default"}
                      className="h-11 w-full"
                      onClick={() => setTarget(row)}
                    >
                      {row.status === "ACTIVE" ? "Block" : "Unblock"}
                    </Button>
                  )}
                </li>
              );
            })}
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
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((row) => {
                  const protectedRow =
                    ADMIN_ROLES.includes(row.role) || row.id === me?.id;
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={row.name}
                            src={row.imageUrl}
                            className="size-9"
                            size={36}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{row.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {row.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ROLE_LABEL[row.role]}</Badge>
                      </TableCell>
                      <TableCell>
                        <UserStatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(row.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        {protectedRow ? (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        ) : (
                          <Button
                            variant={
                              row.status === "ACTIVE" ? "outline" : "default"
                            }
                            size="sm"
                            onClick={() => setTarget(row)}
                          >
                            {row.status === "ACTIVE" ? "Block" : "Unblock"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
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

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={blocking ? `Block ${target?.name}?` : `Unblock ${target?.name}?`}
        description={
          blocking
            ? "They will be signed out and won't be able to log in until unblocked."
            : "They will be able to log in and use the platform again."
        }
        confirmLabel={blocking ? "Block user" : "Unblock user"}
        destructive={blocking}
        isPending={updating}
        onConfirm={() =>
          target &&
          updateStatus(
            { userId: target.id, status: blocking ? "BLOCKED" : "ACTIVE" },
            {
              onSuccess: () => {
                notify.success(blocking ? "User blocked" : "User unblocked");
                setTarget(null);
              },
              onError: (err) => notify.error("Couldn't update user", err),
            },
          )
        }
      />
    </div>
  );
}
