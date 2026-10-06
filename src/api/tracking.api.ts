import apiClient from "@/lib/apiClient";
import type {
  AddTrackingNotePayload,
  ApiResponse,
  TrackingEvent,
} from "@/types";

export function getTrackingTimeline(shipmentId: string) {
  return apiClient<ApiResponse<TrackingEvent[]>>(`/tracking/${shipmentId}`);
}

export function addTrackingNote({ shipmentId, note }: AddTrackingNotePayload) {
  return apiClient<ApiResponse<TrackingEvent>>(`/tracking/${shipmentId}/note`, {
    method: "POST",
    body: { note },
  });
}
