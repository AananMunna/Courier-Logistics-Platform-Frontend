import type { VehicleType } from "./rider.type";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  customer?: {
    contactNumber?: string;
    address?: string;
  };
}

export interface RiderRegistrationPayload {
  name: string;
  email: string;
  password: string;
  rider: {
    vehicleType: VehicleType;
    vehicleRegistrationNumber: string;
    nidNumber: string;
    drivingLicenseNumber?: string;
    contactNumber?: string;
    currentZone?: string;
  };
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
