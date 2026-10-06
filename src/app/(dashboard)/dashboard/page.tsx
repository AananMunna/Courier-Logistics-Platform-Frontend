import type { Metadata } from "next";
import CustomerOverview from "@/components/modules/dashboard/customer-overview";

export const metadata: Metadata = { title: "Overview" };

export default function CustomerDashboardPage() {
  return <CustomerOverview />;
}
