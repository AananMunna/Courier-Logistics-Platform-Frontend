import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  assignRider,
  cancelShipment,
  createShipment,
  deleteShipment,
  getAllShipments,
  getMyAssignedShipments,
  getMyShipments,
  getShipmentById,
  trackShipment,
  updateShipmentStatus,
} from "@/api";
import { ApiError } from "@/lib/apiClient";
import { queryKeys } from "@/lib/query-keys";
import type { ShipmentParams } from "@/types";

export type ShipmentListScope = "admin" | "customer" | "rider";

const LIST_FETCHERS = {
  admin: getAllShipments,
  customer: getMyShipments,
  rider: getMyAssignedShipments,
} as const;

/** One query for every role's shipment list; only the matching endpoint is called. */
export function useShipmentList(
  scope: ShipmentListScope,
  params: ShipmentParams,
) {
  return useQuery({
    queryKey: queryKeys.shipmentList(scope, params),
    queryFn: () => LIST_FETCHERS[scope](params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useMyShipments(params: ShipmentParams) {
  return useQuery({
    queryKey: queryKeys.shipmentList("customer", params),
    queryFn: () => getMyShipments(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useAllShipments(params: ShipmentParams) {
  return useQuery({
    queryKey: queryKeys.shipmentList("admin", params),
    queryFn: () => getAllShipments(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useShipment(shipmentId: string) {
  return useQuery({
    queryKey: queryKeys.shipment(shipmentId),
    queryFn: () => getShipmentById(shipmentId),
    enabled: !!shipmentId,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status < 500) && failureCount < 2,
  });
}

export function usePublicTracking(trackingCode: string) {
  return useQuery({
    queryKey: queryKeys.publicTracking(trackingCode),
    queryFn: () => trackShipment(trackingCode),
    enabled: !!trackingCode,
    retry: false,
    // Tracking pages should feel live.
    refetchInterval: 30 * 1000,
  });
}

/** Shipments, analytics and payments all derive from shipment state. */
function useInvalidateShipmentData() {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.shipments }),
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics }),
      queryClient.invalidateQueries({ queryKey: queryKeys.payments }),
      queryClient.invalidateQueries({ queryKey: queryKeys.riders }),
    ]);
}

export function useCreateShipment() {
  const invalidate = useInvalidateShipmentData();
  return useMutation({ mutationFn: createShipment, onSuccess: invalidate });
}

export function useAssignRider() {
  const invalidate = useInvalidateShipmentData();
  return useMutation({ mutationFn: assignRider, onSuccess: invalidate });
}

export function useUpdateShipmentStatus() {
  const invalidate = useInvalidateShipmentData();
  return useMutation({
    mutationFn: updateShipmentStatus,
    onSuccess: invalidate,
  });
}

export function useCancelShipment() {
  const invalidate = useInvalidateShipmentData();
  return useMutation({ mutationFn: cancelShipment, onSuccess: invalidate });
}

export function useDeleteShipment() {
  const invalidate = useInvalidateShipmentData();
  return useMutation({ mutationFn: deleteShipment, onSuccess: invalidate });
}
