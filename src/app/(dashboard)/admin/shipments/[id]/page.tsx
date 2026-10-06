import type { Metadata } from "next";
import ShipmentDetail from "@/components/modules/shipments/shipment-detail";

export const metadata: Metadata = { title: "Shipment details" };

export default async function AdminShipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShipmentDetail id={id} role="admin" />;
}
