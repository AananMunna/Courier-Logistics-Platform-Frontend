import type { Decimal } from "./api.type";

export interface AdminStats {
  totalCustomers: number;
  totalRiders: number;
  totalPendingRiderApplications: number;
  totalApprovedRiders: number;
  totalRejectedRiders: number;
  totalHubs: number;
  totalShipments: number;
  totalPendingShipments: number;
  totalInTransitShipments: number;
  totalDeliveredShipments: number;
  totalCancelledShipments: number;
  totalFailedShipments: number;
  totalRevenue: number;
  totalRefunded: number;
  netRevenue: number;
}

export interface CustomerStats {
  totalShipments: number;
  pendingShipments: number;
  inTransitShipments: number;
  deliveredShipments: number;
  cancelledShipments: number;
  totalSpent: number;
}

export interface RiderStats {
  assignedShipments: number;
  deliveredShipments: number;
  failedShipments: number;
  activeShipments: number;
  rating: Decimal;
  isAvailable: boolean;
}
