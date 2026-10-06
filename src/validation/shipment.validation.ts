import z from "zod";
import { contactPhoneSchema } from "./common.validation";

export const parcelTypeSchema = z.enum([
  "DOCUMENT",
  "PARCEL",
  "FRAGILE",
  "ELECTRONICS",
  "FOOD",
  "OTHER",
]);

const addressSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(5, `${label} must be at least 5 characters`)
    .max(255, `${label} is too long`);

const contactNameSchema = z
  .string()
  .trim()
  .min(2, "Enter a name (at least 2 characters)")
  .max(100, "Name is too long");

/** Step 1 – where is the parcel picked up? */
export const pickupStepSchema = z
  .object({
    originHubId: z.string().min(1, "Choose the hub nearest to the pickup"),
    destinationHubId: z
      .string()
      .min(1, "Choose the hub nearest to the receiver"),
    pickupAddress: addressSchema("Pickup address"),
    pickupContactName: contactNameSchema,
    pickupContactPhone: contactPhoneSchema,
    scheduledPickupAt: z
      .string()
      .refine(
        (value) => value === "" || new Date(value).getTime() > Date.now(),
        "Pickup time must be in the future",
      ),
  })
  .refine((data) => data.originHubId !== data.destinationHubId, {
    message: "Pickup and delivery hubs must be different",
    path: ["destinationHubId"],
  });

/** Step 2 – who receives it? */
export const receiverStepSchema = z.object({
  deliveryAddress: addressSchema("Delivery address"),
  deliveryContactName: contactNameSchema,
  deliveryContactPhone: contactPhoneSchema,
});

/** Step 3 – what is being sent? */
export const parcelStepSchema = z
  .object({
    parcelType: parcelTypeSchema,
    parcelDescription: z
      .string()
      .trim()
      .max(500, "Keep it under 500 characters"),
    weightKg: z
      .string()
      .trim()
      .refine(
        (value) => value !== "" && Number(value) > 0,
        "Enter the weight in kg",
      )
      .refine((value) => Number(value) <= 1000, "Maximum weight is 1000 kg"),
    distanceKm: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || (Number(value) > 0 && Number(value) <= 5000),
        "Distance must be between 1 and 5000 km",
      ),
    isCod: z.boolean(),
    codAmount: z.string().trim(),
  })
  .refine(
    (data) =>
      !data.isCod || (data.codAmount !== "" && Number(data.codAmount) > 0),
    {
      message: "Enter the amount to collect from the receiver",
      path: ["codAmount"],
    },
  );

export type PickupStepValues = z.infer<typeof pickupStepSchema>;
export type ReceiverStepValues = z.infer<typeof receiverStepSchema>;
export type ParcelStepValues = z.infer<typeof parcelStepSchema>;
