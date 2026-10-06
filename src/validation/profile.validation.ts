import z from "zod";
import { nameSchema, optionalPhoneSchema } from "./common.validation";

export const profileSchema = z.object({
  name: nameSchema,
  contactNumber: optionalPhoneSchema,
  address: z.string().trim().max(255, "Address is too long"),
});

export const MAX_AVATAR_SIZE_MB = 2;

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function validateAvatarFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please choose a PNG, JPG or WebP image.";
  }
  if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
    return `Image must be smaller than ${MAX_AVATAR_SIZE_MB} MB.`;
  }
  return null;
}
