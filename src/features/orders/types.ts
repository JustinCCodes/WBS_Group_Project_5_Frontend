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
  orders: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

