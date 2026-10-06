import type { UserRole } from "@/types";

export const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export const ROLE_LABEL: Record<UserRole, string> = {
  SUPER_ADMIN: "Super admin",
  ADMIN: "Admin",
  RIDER: "Rider",
  CUSTOMER: "Customer",
};

/** Home dashboard for every role. */
export const ROLE_HOME: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  RIDER: "/rider",
  CUSTOMER: "/dashboard",
};

/** Route prefix -> roles allowed to see it. Shared by the proxy and the guards. */
export const PROTECTED_PREFIXES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ADMIN_ROLES },
  { prefix: "/rider", roles: ["RIDER"] },
  { prefix: "/dashboard", roles: ["CUSTOMER"] },
];
