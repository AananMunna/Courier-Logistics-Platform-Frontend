import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  InitiatePaymentResponse,
  Payment,
  PaymentParams,
  PaymentWithShipment,
  RefundPaymentPayload,
} from "@/types";
import { cleanParams } from "@/utils/url.util";

export function initiatePayment(shipmentId: string) {
  return apiClient<ApiResponse<InitiatePaymentResponse>>("/payments/initiate", {
    method: "POST",
    body: { shipmentId },
  });
}

export function refundPayment(payload: RefundPaymentPayload) {
  return apiClient<ApiResponse<Payment>>("/payments/refund", {
    method: "POST",
    body: payload,
  });
}

export function getMyPayments(params: PaymentParams) {
  return apiClient<ApiResponse<PaymentWithShipment[]>>(
    "/payments/my-payments",
    {
      params: cleanParams(params),
    },
  );
}

export function getAllPayments(params: PaymentParams) {
  return apiClient<ApiResponse<PaymentWithShipment[]>>(
    "/payments/all-payments",
    { params: cleanParams(params) },
  );
}

export function getPaymentByShipment(shipmentId: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${shipmentId}`);
}
