import type { Decimal, ListParams } from "./api.type";
import type { ShipmentStatus } from "./shipment.type";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "BKASH" | "COD";

export interface Payment {
  id: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: Decimal;
  currency: string;
  paymentGateway: string;
  merchantInvoiceNumber: string;
  bkashPaymentId?: string | null;
  bkashTrxId?: string | null;
  payerReference?: string | null;
  paidAt?: string | null;
  refundTrxId?: string | null;
  refundAmount?: Decimal | null;
  refundReason?: string | null;
  refundedAt?: string | null;
  shipmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentWithShipment extends Payment {
  shipment: {
    id: string;
    trackingCode: string;
    status: ShipmentStatus;
    customer?: { name: string; email: string };
  };
}

export interface PaymentParams extends ListParams {
  status?: PaymentStatus;
}

export interface InitiatePaymentResponse {
  bkashURL: string;
  paymentID: string;
}

export interface RefundPaymentPayload {
  shipmentId: string;
  refundReason: string;
}
