import z from "zod";
import { reasonSchema } from "./common.validation";

export const rejectionSchema = z.object({
  rejectionReason: reasonSchema("Rejection reason"),
});

export const cancelShipmentSchema = z.object({
  cancelReason: z.string().trim().max(500, "Keep it under 500 characters"),
});

export const failureSchema = z.object({
  failureReason: reasonSchema("Reason"),
  note: z.string().trim().max(500, "Keep it under 500 characters"),
});

export const noteSchema = z.object({
  note: reasonSchema("Note", 2),
});

export const refundSchema = z.object({
  refundReason: reasonSchema("Refund reason"),
});

export const assignRiderSchema = z.object({
  riderId: z.string().min(1, "Choose a rider"),
  note: z.string().trim().max(500, "Keep it under 500 characters"),
});
