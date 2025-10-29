// Admin Feature Types
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  newestOrders: Order[];
}

export interface Order {
  id: string;
  _id?: string;
  userId: {
    id: string;
    _id?: string;
    name: string;
    email: string;
  };
  products: {
    productId: {
      id: string;
      _id?: string;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "banned";
  bannedReason?: string;
  bannedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  categoryId: string | { id: string; _id?: string; name: string };
  createdBy?:
    | string
    | { id: string; _id?: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  createdBy?: string | { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

// Test Order type (same as Order for test data)
export type TestOrder = Order;

// Product Summary for reports
export interface ProductSummary {
  id: string;
  _id?: string;
  name: string;
  price: number;
}

// Hook Types
export interface UseAdminFormOptions<T> {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
}

export interface ProductLine {
  productId: string;
  quantity: number;
}

export interface TestOrderFormState {
  userId: string;
  status: "pending" | "processing" | "shipped" | "cancelled";
  products: ProductLine[];
}

export type TestOrderFormAction =
  | { type: "SET_USER_ID"; payload: string }
  | {
      type: "SET_STATUS";
      payload: "pending" | "processing" | "shipped" | "cancelled";
    }
  | { type: "ADD_PRODUCT_LINE" }
  | { type: "REMOVE_PRODUCT_LINE"; payload: number }
  | {
      type: "UPDATE_PRODUCT_LINE";
      payload: {
        index: number;
        field: keyof ProductLine;
        value: string | number;
      };
    }
  | { type: "RESET" };
