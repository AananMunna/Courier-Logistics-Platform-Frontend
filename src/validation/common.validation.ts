import z from "zod";
import { normalizePhone } from "@/utils/format.util";

/** Same rules as the backend password schema. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Add at least 1 lowercase letter")
  .regex(/[A-Z]/, "Add at least 1 uppercase letter")
  .regex(/[0-9]/, "Add at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Add at least 1 special character (e.g. @ # !)");

export const emailSchema = z.email("Enter a valid email address");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name is too long");

const BD_MOBILE = /^(?:\+?880|0)1[3-9]\d{8}$/;

const phoneMessage = "Enter a valid mobile number, e.g. 01712345678";

export const phoneSchema = z
  .string()
  .trim()
  .refine((value) => BD_MOBILE.test(normalizePhone(value)), phoneMessage);

/** Optional phone: empty string is allowed, anything else must be valid. */
export const optionalPhoneSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || BD_MOBILE.test(normalizePhone(value)),
    phoneMessage,
  );

export const otpSchema = z
  .string()
  .length(6, "Enter the 6-digit code")
  .regex(/^\d{6}$/, "The code contains digits only");

export const reasonSchema = (label: string, min = 3) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(500, `${label} must be at most 500 characters`);

/**
 * Lenient phone check for *other people's* numbers (receiver, hub desk, pickup contact):
 * landlines like 02-9876543 and +880 numbers are valid. Matches the backend (6–20 chars).
 */
const GENERIC_PHONE = /^\+?\d{6,15}$/;
const contactPhoneMessage =
  "Enter a valid phone number, e.g. 01712345678 or 02-9876543";

export const contactPhoneSchema = z
  .string()
  .trim()
  .refine(
    (value) => GENERIC_PHONE.test(normalizePhone(value)),
    contactPhoneMessage,
  );

export const optionalContactPhoneSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || GENERIC_PHONE.test(normalizePhone(value)),
    contactPhoneMessage,
  );
