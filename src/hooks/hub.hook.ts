import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createHub, deleteHub, getAllHubs, getHub, updateHub } from "@/api";
import { queryKeys } from "@/lib/query-keys";
import type { HubParams } from "@/types";

export function useGetAllHubs(params: HubParams = {}) {
  return useQuery({
    queryKey: queryKeys.hubList(params),
    queryFn: () => getAllHubs(params),
    placeholderData: keepPreviousData,
    // Hubs rarely change, so keep them warm for fast forms and selects.
    staleTime: 5 * 60 * 1000,
  });
}

/** Every active hub (used by selects). One request, cached for the whole app. */
export function useActiveHubs() {
  return useGetAllHubs({
    isActive: true,
    limit: 100,
    sortBy: "name",
    sortOrder: "asc",
  });
}

export function useHub(hubId: string) {
  return useQuery({
    queryKey: queryKeys.hub(hubId),
    queryFn: () => getHub(hubId),
    enabled: !!hubId,
    staleTime: 5 * 60 * 1000,
  });
}

function useInvalidateHubs() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.hubs });
}

export function useCreateHub() {
  const invalidate = useInvalidateHubs();
  return useMutation({ mutationFn: createHub, onSuccess: invalidate });
}

export function useUpdateHub() {
  const invalidate = useInvalidateHubs();
  return useMutation({ mutationFn: updateHub, onSuccess: invalidate });
}

export function useDeleteHub() {
  const invalidate = useInvalidateHubs();
  return useMutation({ mutationFn: deleteHub, onSuccess: invalidate });
}
