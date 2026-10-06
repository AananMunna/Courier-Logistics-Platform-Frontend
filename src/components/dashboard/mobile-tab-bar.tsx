"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { adminMobileTabs, customerMobileTabs, riderMobileTabs } from "@/routes";
import type { MobileTab, UserRole } from "@/types";

const TABS: Record<UserRole, MobileTab[]> = {
  SUPER_ADMIN: adminMobileTabs,
  ADMIN: adminMobileTabs,
  RIDER: riderMobileTabs,
  CUSTOMER: customerMobileTabs,
};

export function MobileTabBar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const tabs = TABS[role];

  // Most specific match wins so "New" doesn't also light up "Shipments".
  const exact = tabs.find((tab) => tab.url === pathname);
  const isActive = (tab: MobileTab) =>
    exact
      ? exact.url === tab.url
      : !tab.opensMenu &&
        !!tab.matchNested &&
        pathname.startsWith(`${tab.url}/`);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch justify-around px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab);

          if (tab.primary) {
            return (
              <li key={tab.url} className="flex flex-1 justify-center">
                <Link
                  href={tab.url}
                  aria-label={tab.title}
                  aria-current={active ? "page" : undefined}
                  className="-mt-5 flex size-14 items-center justify-center self-start rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_-8px_var(--primary)] ring-4 ring-background transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon className="size-6" aria-hidden="true" />
                </Link>
              </li>
            );
          }

          const content = (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0 h-0.5 w-8 rounded-full bg-primary transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon className="size-5" aria-hidden="true" />
              <span className="text-[11px] leading-none font-medium">
                {tab.title}
              </span>
            </>
          );
          const cls = cn(
            "relative flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded-lg transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary",
            active ? "text-primary" : "text-muted-foreground",
          );

          return (
            <li key={tab.url} className="flex flex-1">
              {tab.opensMenu ? (
                <button
                  type="button"
                  className={cls}
                  onClick={() => setOpenMobile(true)}
                >
                  {content}
                </button>
              ) : (
                <Link
                  href={tab.url}
                  className={cls}
                  aria-current={active ? "page" : undefined}
                  onPointerEnter={() => router.prefetch(tab.url)}
                  onFocus={() => router.prefetch(tab.url)}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
