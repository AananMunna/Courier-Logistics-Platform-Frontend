import type { Metadata } from "next";
import ShipmentDetail from "@/components/modules/shipments/shipment-detail";

export const metadata: Metadata = { title: "Delivery details" };

export default async function RiderShipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentDetail id={id} role="rider" />;
}
