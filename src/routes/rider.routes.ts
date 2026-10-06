import { Bike, LayoutDashboard, PackageCheck, Wallet } from "lucide-react";
import type { MobileTab, SidebarItems } from "@/types";

const prefix = "/rider";

export const riderRoutes: SidebarItems = [
  {
    title: "Deliveries",
    items: [
      { title: "Today", url: prefix, icon: LayoutDashboard },
      {
        title: "My shipments",
        url: `${prefix}/shipments`,
        icon: PackageCheck,
        matchNested: true,
      },
      { title: "Earnings", url: `${prefix}/earnings`, icon: Wallet },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile & vehicle", url: `${prefix}/profile`, icon: Bike },
    ],
  },
];

export const riderMobileTabs: MobileTab[] = [
  { title: "Today", url: prefix, icon: LayoutDashboard },
  {
    title: "Shipments",
    url: `${prefix}/shipments`,
    icon: PackageCheck,
    matchNested: true,
  },
  { title: "Earnings", url: `${prefix}/earnings`, icon: Wallet },
  { title: "Profile", url: `${prefix}/profile`, icon: Bike },
];
