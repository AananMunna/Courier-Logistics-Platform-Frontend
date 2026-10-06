"use client";

import { Bike, PackagePlus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ROLE_PREFIX, ROLE_ROUTES } from "@/routes";
import type { UserRole } from "@/types";
import { AttentionPopover } from "./attention-popover";
import { CommandPalette, useCommandPalette } from "./command-palette";
import { ThemeToggle } from "./theme-toggle";

const ROOT_TITLE: Record<UserRole, string> = {
  CUSTOMER: "Overview",
  RIDER: "Today",
  ADMIN: "Operations",
  SUPER_ADMIN: "Operations",
};

const SEGMENT_LABELS: Record<string, string> = {
  shipments: "Shipments",
  payments: "Payments",
  profile: "Profile",
  earnings: "Earnings",
  users: "Users",
  hubs: "Hubs",
  "audit-logs": "Audit log",
  "approve-rider": "Rider applications",
  new: "New shipment",
};

function useTrail(role: UserRole, pathname: string) {
  const prefix = ROLE_PREFIX[role];
  const known = new Map(
    ROLE_ROUTES[role].flatMap((g) => g.items.map((i) => [i.url, i.title])),
  );
  const rest = pathname
    .slice(prefix.length)
    .split("/")
    .filter(Boolean);

  const trail = [{ label: ROOT_TITLE[role], href: prefix }];
  let href = prefix;
  rest.forEach((segment, index) => {
    href = `${href}/${segment}`;
    const isLast = index === rest.length - 1;
    const label =
      SEGMENT_LABELS[segment] ??
      known.get(href) ??
      (isLast ? decodeURIComponent(segment) : "Details");
    trail.push({ label, href });
  });

  // /shipments/<id> => title "Shipment details", crumb shows the id.
  const isDetail = rest[0] === "shipments" && rest.length === 2 && rest[1] !== "new";
  const title = rest.length === 0
    ? ROOT_TITLE[role]
    : isDetail
      ? "Shipment details"
      : trail[trail.length - 1].label;

  return { trail, title };
}

export function DashboardTopbar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { trail, title } = useTrail(role, pathname);
  const palette = useCommandPalette();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-xl">
      <SidebarTrigger className="-ml-1" aria-label="Toggle menu" />
      <Separator orientation="vertical" className="mr-1 h-5" />

      <p className="truncate text-sm font-medium md:hidden">{title}</p>
      <nav aria-label="Breadcrumb" className="hidden min-w-0 md:block">
        <ol className="flex items-center gap-1.5 text-sm">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <Fragment key={crumb.href}>
                {index > 0 && (
                  <li aria-hidden="true" className="text-muted-foreground">
                    /
                  </li>
                )}
                <li className="min-w-0 truncate">
                  {last ? (
                    <span aria-current="page" className="font-medium">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => palette.setOpen(true)}
          aria-label="Search and commands"
        >
          <Search />
          <span className="hidden text-muted-foreground md:inline">Search</span>
          <kbd className="ml-1 hidden rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground md:inline">
            ⌘K
          </kbd>
        </Button>
        <ThemeToggle />
        {isAdmin && <AttentionPopover />}
        {role === "CUSTOMER" && (
          <LinkButton
            href="/dashboard/shipments/new"
            size="sm"
            className="rounded-full"
          >
            <PackagePlus />
            <span className="hidden sm:inline">Send a parcel</span>
          </LinkButton>
        )}
        {role === "RIDER" && (
          <LinkButton
            href="/rider/shipments"
            size="sm"
            className="rounded-full"
          >
            <Bike />
            <span className="hidden sm:inline">Active deliveries</span>
          </LinkButton>
        )}
      </div>
      <CommandPalette
        role={role}
        open={palette.open}
        onOpenChange={palette.setOpen}
      />
    </header>
  );
}
