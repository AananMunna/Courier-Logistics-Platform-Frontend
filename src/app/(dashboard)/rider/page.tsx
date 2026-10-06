import type { Metadata } from "next";
import RiderOverview from "@/components/modules/rider/rider-overview";

export const metadata: Metadata = { title: "Today" };

export default function RiderHomePage() {
  return <RiderOverview />;
}
