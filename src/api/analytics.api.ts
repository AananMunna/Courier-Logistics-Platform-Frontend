import apiClient from "@/lib/apiClient";
import type {
  AdminStats,
  ApiResponse,
  AuditLog,
  AuditLogParams,
  CustomerStats,
  RiderStats,
} from "@/types";
import { cleanParams } from "@/utils/url.util";

export function getAdminStats() {
  return apiClient<ApiResponse<AdminStats>>("/analytics/dashboard-stats");
}

export function getCustomerStats() {
  return apiClient<ApiResponse<CustomerStats>>("/analytics/customer-analytics");
}

export function getRiderStats() {
  return apiClient<ApiResponse<RiderStats>>("/analytics/rider-analytics");
}

export function getAuditLogs(params: AuditLogParams) {
  return apiClient<ApiResponse<AuditLog[]>>("/analytics/audit-logs", {
    params: cleanParams(params),
  });
}
