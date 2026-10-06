import z from "zod";
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
} from "./common.validation";

export const riderApplicationSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    contactNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    vehicleType: z.enum(["BICYCLE", "MOTORCYCLE", "VAN", "TRUCK"], {
      message: "Choose your vehicle type",
    }),
    vehicleRegistrationNumber: z
      .string()
      .trim()
      .min(2, "Enter your vehicle registration number")
      .max(50, "Registration number is too long"),
    nidNumber: z
      .string()
      .trim()
      .regex(/^\d{10}$|^\d{13}$|^\d{17}$/, "NID must be 10, 13 or 17 digits"),
    drivingLicenseNumber: z
      .string()
      .trim()
      .max(50, "License number is too long"),
    currentZone: z.string().trim().max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const riderSettingsSchema = z.object({
  contactNumber: phoneSchema,
  address: z.string().trim().max(255, "Address is too long"),
  currentZone: z.string().trim().max(100),
  vehicleType: z.enum(["BICYCLE", "MOTORCYCLE", "VAN", "TRUCK"]),
});
