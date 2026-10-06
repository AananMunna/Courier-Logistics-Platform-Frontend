import {
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Menu,
  PackageSearch,
  UserCog,
  Users,
} from "lucide-react";
import type { MobileTab, SidebarItems } from "@/types";

const prefix = "/admin";

export const adminRoutes: SidebarItems = [
  {
    title: "Operations",
    items: [
      { title: "Overview", url: prefix, icon: LayoutDashboard },
      {
        title: "Shipments",
        url: `${prefix}/shipments`,
        icon: PackageSearch,
        matchNested: true,
      },
      {
        title: "Rider applications",
        url: `${prefix}/approve-rider`,
        icon: UserCog,
      },
      { title: "Hubs", url: `${prefix}/hubs`, icon: Building2 },
    ],
  },
  {
    title: "Business",
    items: [
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
      { title: "Users", url: `${prefix}/users`, icon: Users },
      { title: "Audit logs", url: `${prefix}/audit-logs`, icon: ClipboardList },
    ],
  },
];

export const adminMobileTabs: MobileTab[] = [
  { title: "Overview", url: prefix, icon: LayoutDashboard },
  {
    title: "Shipments",
    url: `${prefix}/shipments`,
    icon: PackageSearch,
    matchNested: true,
  },
  { title: "Riders", url: `${prefix}/approve-rider`, icon: UserCog },
  { title: "Hubs", url: `${prefix}/hubs`, icon: Building2 },
  { title: "Menu", url: "#menu", icon: Menu, opensMenu: true },
];
