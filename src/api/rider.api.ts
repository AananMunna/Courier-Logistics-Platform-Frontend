import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Rider,
  RiderEarnings,
  RiderParams,
  Shipment,
  ShipmentParams,
  UpdateRiderProfilePayload,
  VerifyRiderPayload,
} from "@/types";
import { cleanParams } from "@/utils/url.util";

export function getAllRiders(params: RiderParams) {
  return apiClient<ApiResponse<Rider[]>>("/riders", {
    params: cleanParams(params),
  });
}

export function verifyRider({ riderId, ...body }: VerifyRiderPayload) {
  return apiClient<ApiResponse<Rider>>(`/riders/${riderId}/verify`, {
    method: "PATCH",
    body,
  });
}

export function getMyRiderProfile() {
  return apiClient<ApiResponse<Rider>>("/riders/me");
}

export function updateMyRiderProfile(payload: UpdateRiderProfilePayload) {
  return apiClient<ApiResponse<Rider>>("/riders/me", {
    method: "PATCH",
    body: payload,
  });
}

export function getMyAssignedShipments(params: ShipmentParams) {
  return apiClient<ApiResponse<Shipment[]>>("/riders/me/assigned-shipments", {
    params: cleanParams(params),
  });
}

export function getMyEarnings() {
  return apiClient<ApiResponse<RiderEarnings>>("/riders/me/earnings");
}
