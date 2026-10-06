import type { Metadata } from "next";
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { default: "Rider", template: "%s | Rider" },
  robots: { index: false },
};

export default function RiderLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["RIDER"]}>
      <DashboardShell role="RIDER">{children}</DashboardShell>
    </RoleGuard>
  );
}
