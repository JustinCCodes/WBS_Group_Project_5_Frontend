// Order Types for Customer Orders Page
export interface OrderProduct {
  productId: {
    _id?: string;
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

export interface Order {
  _id?: string;
  id: string;
  userId: {
    _id?: string;
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

export interface OrdersResponse {
  orders: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
