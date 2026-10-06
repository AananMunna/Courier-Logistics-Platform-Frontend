import type { ListParams } from "./api.type";
import type { ShipmentStatus } from "./shipment.type";
import type { UserRole } from "./user.type";

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  note?: string | null;
  updatedByUserId?: string | null;
  updatedByName?: string | null;
  updatedByRole?: UserRole | null;
  createdAt: string;
  shipmentId: string;
}

export interface AuditLog extends TrackingEvent {
  shipment: { trackingCode: string };
}

export interface AuditLogParams extends ListParams {
  shipmentId?: string;
}

export interface AddTrackingNotePayload {
  shipmentId: string;
  note: string;
}
