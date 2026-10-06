import {
  CreditCard,
  LayoutDashboard,
  PackagePlus,
  PackageSearch,
  UserRound,
} from "lucide-react";
import type { MobileTab, SidebarItems } from "@/types";

const prefix = "/dashboard";

export const customerRoutes: SidebarItems = [
  {
    title: "Shipping",
    items: [
      { title: "Overview", url: prefix, icon: LayoutDashboard },
      {
        title: "New shipment",
        url: `${prefix}/shipments/new`,
        icon: PackagePlus,
      },
      {
        title: "My shipments",
        url: `${prefix}/shipments`,
        icon: PackageSearch,
        matchNested: true,
      },
      { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile & security",
        url: `${prefix}/profile`,
        icon: UserRound,
      },
    ],
  },
];

export const customerMobileTabs: MobileTab[] = [
  { title: "Overview", url: prefix, icon: LayoutDashboard },
  {
    title: "Shipments",
    url: `${prefix}/shipments`,
    icon: PackageSearch,
    matchNested: true,
  },
  {
    title: "New",
    url: `${prefix}/shipments/new`,
    icon: PackagePlus,
    primary: true,
  },
  { title: "Payments", url: `${prefix}/payments`, icon: CreditCard },
  { title: "Profile", url: `${prefix}/profile`, icon: UserRound },
];
