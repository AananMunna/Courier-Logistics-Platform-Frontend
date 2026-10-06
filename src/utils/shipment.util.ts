import { SHIPMENT_FLOW } from "@/constants";
import type { Shipment, ShipmentStatus } from "@/types";

/** Index of the current step in the happy-path flow, or -1 for off-path states. */
export function getFlowIndex(status: ShipmentStatus) {
  return SHIPMENT_FLOW.indexOf(status);
}

export function canCancelShipment(status: ShipmentStatus) {
  return status === "PENDING" || status === "ASSIGNED";
}

export function canPayShipment(shipment: Pick<Shipment, "status" | "payment">) {
  const payable: ShipmentStatus[] = [
    "PENDING",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
  ];

  return (
    payable.includes(shipment.status) &&
    shipment.payment?.status !== "PAID" &&
    shipment.payment?.status !== "REFUNDED"
  );
}

export function canAssignRider(status: ShipmentStatus) {
  return status === "PENDING" || status === "FAILED";
}

/** Where the active customer-facing route of a shipment lives, per role. */
export function getShipmentHref(
  role: "admin" | "customer" | "rider",
  id: string,
) {
  const base = {
    admin: "/admin/shipments",
    customer: "/dashboard/shipments",
    rider: "/rider/shipments",
  }[role];
  return `${base}/${id}`;
}
