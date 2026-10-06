import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTrackingNote } from "@/api";
import { queryKeys } from "@/lib/query-keys";

export function useAddTrackingNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTrackingNote,
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.shipment(variables.shipmentId),
      });
      queryClient.invalidateQueries({ queryKey: ["analytics", "audit-logs"] });
    },
  });
}
