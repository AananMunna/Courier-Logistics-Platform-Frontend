import type {
  ParcelStepValues,
  PickupStepValues,
  ReceiverStepValues,
} from "@/validation";

export interface WizardValues {
  pickup: PickupStepValues;
  receiver: ReceiverStepValues;
  parcel: ParcelStepValues;
}

export const EMPTY_PICKUP: PickupStepValues = {
  originHubId: "",
  destinationHubId: "",
  pickupAddress: "",
  pickupContactName: "",
  pickupContactPhone: "",
  scheduledPickupAt: "",
};

export const EMPTY_RECEIVER: ReceiverStepValues = {
  deliveryAddress: "",
  deliveryContactName: "",
  deliveryContactPhone: "",
};

export const EMPTY_PARCEL: ParcelStepValues = {
  parcelType: "PARCEL",
  parcelDescription: "",
  weightKg: "",
  distanceKm: "",
  isCod: false,
  codAmount: "",
};

export const WIZARD_STEPS = ["Pickup", "Receiver", "Parcel", "Review"] as const;
