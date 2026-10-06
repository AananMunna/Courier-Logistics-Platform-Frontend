import type { ListParams } from "./api.type";

export interface Hub {
  id: string;
  name: string;
  zone: string;
  address: string;
  contactNumber?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HubParams extends ListParams {
  zone?: string;
  isActive?: boolean;
}

export interface HubPayload {
  name: string;
  zone: string;
  address: string;
  contactNumber?: string;
}

export interface UpdateHubPayload extends Partial<HubPayload> {
  isActive?: boolean;
}
