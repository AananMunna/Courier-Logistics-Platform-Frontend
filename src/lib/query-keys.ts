/**
 * Central place for TanStack Query keys so invalidation stays predictable.
 * Every list key starts with a short domain name, e.g. ["shipments", ...].
 */
export const queryKeys = {
  me: ["user"] as const,

  hubs: ["hubs"] as const,
  hubList: (params: object) => ["hubs", "list", params] as const,
  hub: (id: string) => ["hubs", "detail", id] as const,

  shipments: ["shipments"] as const,
  shipmentList: (scope: string, params: object) =>
    ["shipments", "list", scope, params] as const,
  shipment: (id: string) => ["shipments", "detail", id] as const,
  publicTracking: (code: string) => ["tracking", "public", code] as const,

  riders: ["riders"] as const,
  riderList: (params: object) => ["riders", "list", params] as const,
  riderMe: ["riders", "me"] as const,
  riderEarnings: ["riders", "me", "earnings"] as const,

  users: ["users"] as const,
  userList: (params: object) => ["users", "list", params] as const,

  payments: ["payments"] as const,
  paymentList: (scope: string, params: object) =>
    ["payments", "list", scope, params] as const,
  paymentByShipment: (shipmentId: string) =>
    ["payments", "shipment", shipmentId] as const,

  analytics: ["analytics"] as const,
  adminStats: ["analytics", "admin"] as const,
  customerStats: ["analytics", "customer"] as const,
  riderStats: ["analytics", "rider"] as const,
  auditLogs: (params: object) => ["analytics", "audit-logs", params] as const,
};
