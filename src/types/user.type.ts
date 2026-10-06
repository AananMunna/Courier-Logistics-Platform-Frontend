import type { ListParams } from "./api.type";
import type { Rider } from "./rider.type";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "RIDER" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AuthProvider = "GOOGLE" | "CREDENTIAL";

export interface Customer {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  address?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  googleId: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  phone?: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: Customer | null;
  rider?: Rider | null;
}

export interface UserParams extends ListParams {
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateMePayload {
  name?: string;
  customer?: {
    contactNumber?: string;
    address?: string;
  };
}

export interface UpdateUserStatusPayload {
  userId: string;
  status: "ACTIVE" | "BLOCKED";
}
