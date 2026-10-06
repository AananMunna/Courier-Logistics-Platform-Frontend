"use client";

import {
  CornerDownLeft,
  type LucideIcon,
  PackagePlus,
  PackageSearch,
  Search,
  UserCog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ROLE_ROUTES } from "@/routes";
import type { UserRole } from "@/types";

interface Command {
  id: string;
  label: string;
  hint: string;
  group: "Track a parcel" | "Actions" | "Go to";
  icon?: LucideIcon;
  href: string;
}

const TRACKING_CODE = /^CR-\d{4}-\d{6}$/i;

function actionsFor(role: UserRole): Command[] {
  if (role === "CUSTOMER") {
    return [
      {
        id: "act-new",
        label: "New shipment",
        hint: "Book a pickup",
        group: "Actions",
        icon: PackagePlus,
        href: "/dashboard/shipments/new",
      },
    ];
  }
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return [
      {
        id: "act-assign",
        label: "Assign riders",
        hint: "Shipments waiting for a rider",
        group: "Actions",
        icon: PackageSearch,
        href: "/admin/shipments?status=PENDING",
      },
      {
        id: "act-apps",
        label: "Review applications",
        hint: "Pending rider applications",
        group: "Actions",
        icon: UserCog,
        href: "/admin/approve-rider",
      },
    ];
  }
  return [];
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}

export function CommandPalette({
  role,
  open,
  onOpenChange,
}: {
  role: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const commands = useMemo(() => {
    const goTo: Command[] = ROLE_ROUTES[role].flatMap((group) =>
      group.items.map((item) => ({
        id: `go-${item.url}`,
        label: item.title,
        hint: group.title,
        group: "Go to" as const,
        icon: item.icon,
        href: item.url,
      })),
    );
    const all = [...actionsFor(role), ...goTo];
    const q = query.trim().toLowerCase();
    const filtered = q
      ? all.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q))
      : all;

    const code = query.trim().toUpperCase();
    if (TRACKING_CODE.test(code)) {
      return [
        {
          id: "track-code",
          label: `Track ${code}`,
          hint: "Open public tracking",
          group: "Track a parcel" as const,
          icon: Search,
          href: `/track?code=${encodeURIComponent(code)}`,
        },
        ...filtered,
      ];
    }
    return filtered;
  }, [role, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const run = (command: Command | undefined) => {
    if (!command) {
      return;
    }
    onOpenChange(false);
    router.push(command.href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (commands.length ? (i + 1) % commands.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) =>
        commands.length ? (i - 1 + commands.length) % commands.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(commands[active]);
    }
  };

  const optionId = (index: number) => `${listId}-opt-${index}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        initialFocus={inputRef}
        className="top-[20%] -translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              commands.length ? optionId(active) : undefined
            }
            aria-label="Search pages and actions"
            placeholder="Search pages, actions or paste a tracking code…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul
          id={listId}
          role="listbox"
          aria-label="Results"
          className="max-h-80 overflow-y-auto p-2"
        >
          {commands.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              Nothing found. Try a page name or a code like CR-2026-048213.
            </li>
          )}
          {commands.map((command, index) => {
            const Icon = command.icon;
            const showGroup =
              index === 0 || commands[index - 1].group !== command.group;
            return (
              <li key={command.id} role="presentation">
                {showGroup && (
                  <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground">
                    {command.group}
                  </p>
                )}
                <div
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === active}
                  tabIndex={-1}
                  onPointerMove={() => setActive(index)}
                  onClick={() => run(command)}
                  onKeyDown={undefined}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                    index === active && "bg-primary/10 text-primary",
                  )}
                >
                  {Icon && <Icon className="size-4" aria-hidden="true" />}
                  <span className="font-medium">{command.label}</span>
                  <span className="ml-auto truncate text-xs text-muted-foreground">
                    {command.hint}
                  </span>
                  {index === active && (
                    <CornerDownLeft className="size-3.5" aria-hidden="true" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
