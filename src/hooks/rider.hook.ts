import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllRiders,
  getMyAssignedShipments,
  getMyEarnings,
  getMyRiderProfile,
  updateMyRiderProfile,
  verifyRider,
} from "@/api";
import { queryKeys } from "@/lib/query-keys";
import type {
  ApiResponse,
  Rider,
  RiderParams,
  ShipmentParams,
} from "@/types";

export function useGetAllRiders(params: RiderParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.riderList(params),
    queryFn: () => getAllRiders(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useVerifyRider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyRider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.riders });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    },
  });
}

export function useMyRiderProfile() {
  return useQuery({
    queryKey: queryKeys.riderMe,
    queryFn: getMyRiderProfile,
  });
}

export function useUpdateMyRiderProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyRiderProfile,
    // Flip the availability switch instantly; roll back if the API rejects it.
    onMutate: async (payload) => {
      if (payload.isAvailable === undefined) {
        return { previous: undefined };
      }
      await queryClient.cancelQueries({ queryKey: queryKeys.riderMe });
      const previous = queryClient.getQueryData<ApiResponse<Rider>>(
        queryKeys.riderMe,
      );
      if (previous) {
        queryClient.setQueryData<ApiResponse<Rider>>(queryKeys.riderMe, {
          ...previous,
          data: { ...previous.data, isAvailable: payload.isAvailable },
        });
      }
      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.riderMe, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.riderMe });
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.riderStats });
    },
  });
}

export function useMyAssignedShipments(params: ShipmentParams) {
  return useQuery({
    queryKey: queryKeys.shipmentList("rider", params),
    queryFn: () => getMyAssignedShipments(params),
    placeholderData: keepPreviousData,
  });
}

export function useMyEarnings() {
  return useQuery({
    queryKey: queryKeys.riderEarnings,
    queryFn: getMyEarnings,
  });
}
