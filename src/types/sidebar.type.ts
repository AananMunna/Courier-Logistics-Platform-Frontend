import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  /** Match nested routes (e.g. /admin/shipments/123) as active. */
  matchNested?: boolean;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];

export interface MobileTab {
  title: string;
  url: string;
  icon: LucideIcon;
  matchNested?: boolean;
  /** Raised centre call-to-action button. */
  primary?: boolean;
  /** Opens the sidebar sheet instead of navigating. */
  opensMenu?: boolean;
}
