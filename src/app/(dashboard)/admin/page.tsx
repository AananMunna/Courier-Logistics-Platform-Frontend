import type { Metadata } from "next";
import AdminOverview from "@/components/modules/admin/admin-overview";

export const metadata: Metadata = { title: "Overview" };

export default function AdminHomePage() {
  return <AdminOverview />;
}
