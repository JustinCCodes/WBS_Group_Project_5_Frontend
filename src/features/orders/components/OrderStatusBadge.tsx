import { Clock, Package, Truck, XCircle } from "lucide-react";
import { StatusConfig, Order } from "../index";

// Centralized status configuration
const STATUS_CONFIG: Record<Order["status"], StatusConfig> = {
  pending: {
    icon: Clock,
    label: "Pending",
    textColor: "text-yellow-400",
    iconBg: "bg-yellow-900/30",
    bgColor: "bg-yellow-900/20",
    borderColor: "border-yellow-800",
  },
  processing: {
    icon: Package,
    label: "Processing",
    textColor: "text-blue-400",
    iconBg: "bg-blue-900/30",
    bgColor: "bg-blue-900/20",
    borderColor: "border-blue-800",
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    textColor: "text-green-400",
    iconBg: "bg-green-900/30",
    bgColor: "bg-green-900/20",
    borderColor: "border-green-800",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    textColor: "text-red-400",
    iconBg: "bg-red-900/30",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-800",
  },
};

export function getStatusConfig(status: Order["status"]): StatusConfig {
  return STATUS_CONFIG[status];
}

import type { OrderStatusBadgeProps } from "../types";

// Component to display order status badge
export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg}`}
    >
      <StatusIcon
        className={`w-5 h-5 ${config.textColor}`}
        aria-hidden="true"
      />
      <span className="sr-only">{config.label}</span>
    </div>
  );
}
