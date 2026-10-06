import z from "zod";
import { optionalContactPhoneSchema } from "./common.validation";

export const hubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Hub name must be at least 2 characters")
    .max(100),
  zone: z.string().trim().min(2, "Zone must be at least 2 characters").max(100),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(255),
  contactNumber: optionalContactPhoneSchema,
});
