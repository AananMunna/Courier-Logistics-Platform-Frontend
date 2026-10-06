import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AssignRiderPayload,
  CancelShipmentPayload,
  CreateShipmentPayload,
  PublicTrackingResult,
  Shipment,
  ShipmentParams,
  UpdateShipmentStatusPayload,
} from "@/types";
import { cleanParams } from "@/utils/url.util";

export function createShipment(payload: CreateShipmentPayload) {
  return apiClient<ApiResponse<Shipment>>("/shipments", {
    method: "POST",
    body: payload,
  });
}

export function getMyShipments(params: ShipmentParams) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments/my-shipments", {
    params: cleanParams(params),
  });
}

export function getAllShipments(params: ShipmentParams) {
  return apiClient<ApiResponse<Shipment[]>>("/shipments", {
    params: cleanParams(params),
  });
}

export function getShipmentById(shipmentId: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${shipmentId}`);
}

export function trackShipment(trackingCode: string) {
  return apiClient<ApiResponse<PublicTrackingResult>>(
    `/shipments/track/${encodeURIComponent(trackingCode)}`,
  );
}

export function assignRider({ shipmentId, ...body }: AssignRiderPayload) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${shipmentId}/assign`, {
    method: "PATCH",
    body,
  });
}

export function updateShipmentStatus({
  shipmentId,
  ...body
}: UpdateShipmentStatusPayload) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${shipmentId}/status`, {
    method: "PATCH",
    body,
  });
}

export function cancelShipment({ shipmentId, ...body }: CancelShipmentPayload) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${shipmentId}/cancel`, {
    method: "PATCH",
    body,
  });
}

export function deleteShipment(shipmentId: string) {
  return apiClient<ApiResponse<Shipment>>(`/shipments/${shipmentId}`, {
    method: "DELETE",
  });
}
