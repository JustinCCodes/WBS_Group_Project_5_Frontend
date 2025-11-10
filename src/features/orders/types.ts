import type { ComponentType } from "react";

// Order Types for Customer Orders Page
export interface OrderProduct {
  productId: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

// Main Order interface
export interface Order {
  id: string;
  userId: {
    id: string;
    name: string;
    email: string;
  };
  products: OrderProduct[];
  total: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Response structure for fetching orders with pagination
export interface OrdersResponse {
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Props for Order Status Badge component
export interface OrderStatusBadgeProps {
  status: Order["status"];
}

// Type for the create order payload
export interface CreateOrderPayload {
  products: {
    productId: string;
    quantity: number;
  }[];
}

// Props for Confirm Cancel Modal component
export interface ConfirmCancelModalProps {
  isOpen: boolean;
  orderId: string | null;
  isCancelling: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Props for Order Actions component
export interface OrderActionsProps {
  order: Order;
  isCancelling: boolean;
  onCancel: () => void;
  onDownloadBill: () => void;
}

// Props for individual Order Card component
export interface OrderCardProps {
  order: Order;
  onCancel: (orderId: string, orderStatus: Order["status"]) => void;
  isCancelling: boolean;
}

// Props for individual Order Item component
export interface OrderItemProps {
  item: OrderProduct;
}

// Props for the Order Summary Header component
export interface OrderProductListProps {
  products: OrderProduct[];
}

// Props for the Order Summary Header component
export interface OrderSummaryHeaderProps {
  order: Order;
}

// Props for the Order Details Page component
export interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Props for client components receiving params
// Status configuration interface for order statuses
export interface StatusConfig {
  icon: ComponentType<{ className?: string }>;
  label: string;
  textColor: string;
  iconBg: string;
  bgColor: string;
  borderColor: string;
}
