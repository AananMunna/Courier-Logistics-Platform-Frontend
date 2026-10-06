import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getAdminStats,
  getAuditLogs,
  getCustomerStats,
  getRiderStats,
} from "@/api";
import { queryKeys } from "@/lib/query-keys";
import type { AuditLogParams } from "@/types";

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.adminStats,
    queryFn: getAdminStats,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: queryKeys.customerStats,
    queryFn: getCustomerStats,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useRiderStats() {
  return useQuery({
    queryKey: queryKeys.riderStats,
    queryFn: getRiderStats,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useAuditLogs(params: AuditLogParams) {
  return useQuery({
    queryKey: queryKeys.auditLogs(params),
    queryFn: () => getAuditLogs(params),
    placeholderData: keepPreviousData,
  });
}
