import type { Decimal, ListParams } from "./api.type";

export type VehicleType = "BICYCLE" | "MOTORCYCLE" | "VAN" | "TRUCK";

export type RiderVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Rider {
  id: string;
  name: string;
  email: string;
  address?: string | null;
  vehicleType: VehicleType;
  vehicleRegistrationNumber: string;
  nidNumber: string;
  drivingLicenseNumber?: string | null;
  contactNumber?: string | null;
  currentZone?: string | null;
  isAvailable: boolean;
  rating: Decimal;
  totalDeliveries: number;
  totalFailed: number;
  verificationStatus: RiderVerificationStatus;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  nidImageUrl?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface RiderParams extends ListParams {
  verificationStatus?: RiderVerificationStatus;
  zone?: string;
  isAvailable?: boolean;
}

export interface VerifyRiderPayload {
  riderId: string;
  verificationStatus: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export interface UpdateRiderProfilePayload {
  contactNumber?: string;
  address?: string;
  currentZone?: string;
  isAvailable?: boolean;
  vehicleType?: VehicleType;
}

export interface RiderEarnings {
  totalDeliveredShipments: number;
  totalDeliveryFeeCollected: number;
  commissionRate: number;
  totalEarnings: number;
  rating: Decimal;
  recentDeliveries: {
    id: string;
    trackingCode: string;
    deliveryFee: Decimal;
    deliveredAt: string | null;
  }[];
}
