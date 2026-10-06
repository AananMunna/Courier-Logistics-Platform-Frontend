import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllPayments,
  getMyPayments,
  getPaymentByShipment,
  initiatePayment,
  refundPayment,
} from "@/api";
import { queryKeys } from "@/lib/query-keys";
import type { PaymentParams } from "@/types";

export function useInitiatePayment() {
  return useMutation({ mutationFn: initiatePayment });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments });
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}

export function useMyPayments(params: PaymentParams) {
  return useQuery({
    queryKey: queryKeys.paymentList("customer", params),
    queryFn: () => getMyPayments(params),
    placeholderData: keepPreviousData,
  });
}

export function useAllPayments(params: PaymentParams) {
  return useQuery({
    queryKey: queryKeys.paymentList("admin", params),
    queryFn: () => getAllPayments(params),
    placeholderData: keepPreviousData,
  });
}

export function usePaymentByShipment(shipmentId: string | null) {
  return useQuery({
    queryKey: queryKeys.paymentByShipment(shipmentId ?? ""),
    queryFn: () => getPaymentByShipment(shipmentId as string),
    enabled: !!shipmentId,
    retry: false,
  });
}

export type PaymentListScope = "admin" | "customer";

const CUSTOMER_FETCH_LIMIT = 100;

/**
 * One query for both payment lists; only the matching endpoint is called.
 *
 * The backend's /payments/my-payments ignores the `status` filter and only paginates,
 * so for customers we load their payments once (a customer has few) and filter + paginate
 * locally. Admin lists use the server-side filter as normal.
 */
export function usePaymentList(scope: PaymentListScope, params: PaymentParams) {
  const { status, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey:
      scope === "customer"
        ? queryKeys.paymentList("customer", { all: true })
        : queryKeys.paymentList("admin", params),
    queryFn: () =>
      scope === "admin"
        ? getAllPayments(params)
        : getMyPayments({
            page: 1,
            limit: CUSTOMER_FETCH_LIMIT,
            sortBy: "createdAt",
            sortOrder: "desc",
          }),
    placeholderData: keepPreviousData,
    select: (response) => {
      if (scope === "admin") {
        return response;
      }
      const filtered = status
        ? response.data.filter((payment) => payment.status === status)
        : response.data;
      const start = (page - 1) * limit;

      return {
        ...response,
        data: filtered.slice(start, start + limit),
        meta: {
          page,
          limit,
          total: filtered.length,
          totalPages: Math.max(Math.ceil(filtered.length / limit), 1),
        },
      };
    },
  });
}
