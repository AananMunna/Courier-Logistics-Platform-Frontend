"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAdminStats } from "@/hooks";

export function AttentionPopover() {
  const { data } = useAdminStats();
  const stats = data?.data;

  const items = [
    {
      label: "Shipments need a rider",
      count: stats?.totalPendingShipments ?? 0,
      href: "/admin/shipments?status=PENDING",
    },
    {
      label: "Rider applications",
      count: stats?.totalPendingRiderApplications ?? 0,
      href: "/admin/approve-rider",
    },
    {
      label: "Failed deliveries",
      count: stats?.totalFailedShipments ?? 0,
      href: "/admin/shipments?status=FAILED",
    },
  ];
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={
              total > 0 ? `Needs attention, ${total} items` : "Needs attention"
            }
          />
        }
      >
        <Bell />
        {total > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-background"
          />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Needs attention</PopoverTitle>
        </PopoverHeader>
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-muted"
              >
                <span>{item.label}</span>
                <span
                  className={
                    item.count > 0
                      ? "rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {item.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
