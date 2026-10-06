import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";
import { MobileTabBar } from "./mobile-tab-bar";

export default function DashboardShell({
  children,
  role,
}: {
  children: ReactNode;
  role: UserRole;
}) {
  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <DashboardSidebar role={role} />
      <SidebarInset className="bg-muted/30">
        <DashboardTopbar role={role} />
        <main id="main-content" className="flex-1 pb-24 md:pb-0">
          {children}
        </main>
        <MobileTabBar role={role} />
      </SidebarInset>
    </SidebarProvider>
  );
}
