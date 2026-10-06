import type { Decimal, ListParams } from "./api.type";
import type { Hub } from "./hub.type";
import type { Payment } from "./payment.type";
import type { Rider } from "./rider.type";
import type { TrackingEvent } from "./tracking.type";
import type { Customer } from "./user.type";

export type ShipmentStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "RETURNED"
  | "CANCELLED";

export type ParcelType =
  | "DOCUMENT"
  | "PARCEL"
  | "FRAGILE"
  | "ELECTRONICS"
  | "FOOD"
  | "OTHER";

export interface Shipment {
  id: string;
  trackingCode: string;
  status: ShipmentStatus;
  parcelType: ParcelType;
  parcelDescription?: string | null;
  weightKg: Decimal;
  pickupAddress: string;
  pickupContactName: string;
  pickupContactPhone: string;
  deliveryAddress: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  distanceKm?: Decimal | null;
  deliveryFee: Decimal;
  isCod: boolean;
  codAmount: Decimal;
  scheduledPickupAt?: string | null;
  pickedUpAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;
  failureReason?: string | null;
  cancelReason?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  riderId?: string | null;
  originHubId: string;
  destinationHubId: string;
  customer?: Customer;
  rider?: Rider | null;
  originHub?: Hub;
  destinationHub?: Hub;
  payment?: Payment | null;
  trackingEvents?: TrackingEvent[];
}

export interface PublicTrackingResult {
  trackingCode: string;
  status: ShipmentStatus;
  parcelType: ParcelType;
  pickupAddress: string;
  deliveryAddress: string;
  scheduledPickupAt?: string | null;
  pickedUpAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  originHub: Pick<Hub, "name" | "zone">;
  destinationHub: Pick<Hub, "name" | "zone">;
  trackingEvents: Pick<TrackingEvent, "status" | "note" | "createdAt">[];
}

export interface ShipmentParams extends ListParams {
  status?: ShipmentStatus;
  riderId?: string;
  customerId?: string;
  originHubId?: string;
  destinationHubId?: string;
}

export interface CreateShipmentPayload {
  parcelType?: ParcelType;
  parcelDescription?: string;
  weightKg: number;
  pickupAddress: string;
  pickupContactName: string;
  pickupContactPhone: string;
  deliveryAddress: string;
  deliveryContactName: string;
  deliveryContactPhone: string;
  distanceKm?: number;
  isCod?: boolean;
  codAmount?: number;
  scheduledPickupAt?: string;
  originHubId: string;
  destinationHubId: string;
}

export interface AssignRiderPayload {
  shipmentId: string;
  riderId: string;
  note?: string;
}

export interface UpdateShipmentStatusPayload {
  shipmentId: string;
  status:
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "FAILED"
    | "RETURNED";
  note?: string;
  failureReason?: string;
}

export interface CancelShipmentPayload {
  shipmentId: string;
  cancelReason?: string;
}
