import type { Metadata } from "next";
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { ADMIN_ROLES } from "@/constants";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={ADMIN_ROLES}>
      <DashboardShell role="ADMIN">{children}</DashboardShell>
    </RoleGuard>
  );
}
