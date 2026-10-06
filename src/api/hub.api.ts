import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Hub,
  HubParams,
  HubPayload,
  UpdateHubPayload,
} from "@/types";
import { cleanParams } from "@/utils/url.util";

export function getAllHubs(params: HubParams = {}) {
  return apiClient<ApiResponse<Hub[]>>("/hubs", {
    params: cleanParams(params),
  });
}

export function getHub(hubId: string) {
  return apiClient<ApiResponse<Hub>>(`/hubs/${hubId}`);
}

export function createHub(payload: HubPayload) {
  return apiClient<ApiResponse<Hub>>("/hubs", {
    method: "POST",
    body: payload,
  });
}

export function updateHub({
  hubId,
  ...payload
}: UpdateHubPayload & { hubId: string }) {
  return apiClient<ApiResponse<Hub>>(`/hubs/${hubId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteHub(hubId: string) {
  return apiClient<ApiResponse<Hub>>(`/hubs/${hubId}`, { method: "DELETE" });
}
