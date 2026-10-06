"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site";
import { ROLE_ROUTES } from "@/routes";
import type { SidebarItem, UserRole } from "@/types";
import { UserMenu } from "./user-menu";

function isItemActive(pathname: string, item: SidebarItem) {
  if (pathname === item.url) {
    return true;
  }
  return (
    !!item.matchNested &&
    pathname.startsWith(`${item.url}/`) &&
    !pathname.endsWith("/new")
  );
}

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const groups = ROLE_ROUTES[role];

  // "New shipment" lives under the shipments prefix; keep only the most specific match active.
  const allItems = groups.flatMap((group) => group.items);
  const exact = allItems.find((item) => item.url === pathname);

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-1 py-1.5 font-semibold"
        >
          <Logo className="size-8" />
          <span className="text-base tracking-tight">{siteConfig.name}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = exact
                    ? exact.url === item.url
                    : isItemActive(pathname, item);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={item.url}
                            onClick={() => setOpenMobile(false)}
                            onPointerEnter={() => router.prefetch(item.url)}
                            onFocus={() => router.prefetch(item.url)}
                          />
                        }
                        isActive={active}
                        aria-current={active ? "page" : undefined}
                        className="relative h-9 rounded-lg px-3 text-muted-foreground transition-colors hover:text-foreground data-active:bg-primary/10 data-active:text-primary before:absolute before:top-2 before:bottom-2 before:-left-2 before:w-1 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity data-active:before:opacity-100"
                      >
                        {Icon && <Icon aria-hidden="true" />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
