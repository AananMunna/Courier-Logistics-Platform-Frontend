import type { SidebarItems, UserRole } from "@/types";
import { adminRoutes } from "./admin.routes";
import { customerRoutes } from "./customer.routes";
import { riderRoutes } from "./rider.routes";

export const ROLE_ROUTES: Record<UserRole, SidebarItems> = {
  SUPER_ADMIN: adminRoutes,
  ADMIN: adminRoutes,
  RIDER: riderRoutes,
  CUSTOMER: customerRoutes,
};

export const ROLE_PREFIX: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  ADMIN: "/admin",
  RIDER: "/rider",
  CUSTOMER: "/dashboard",
};
