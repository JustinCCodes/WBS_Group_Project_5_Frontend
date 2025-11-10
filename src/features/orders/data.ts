import api from "@/shared/lib/api";
import type { Order, OrdersResponse, CreateOrderPayload } from "./types";

// Fetches users orders
export async function getUserOrders(
  page: number = 1,
  limit: number = 100
): Promise<Order[]> {
  const response = await api.get<OrdersResponse>(
    `/orders?page=${page}&limit=${limit}`
  );
  // The backend response wraps data in a 'data' property
  return response.data?.data || [];
}

// Gets single order by ID
export async function getOrderById(orderId: string): Promise<Order> {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
}

// Deletes/Cancels order (only for pending/cancelled orders)
export async function deleteOrder(orderId: string): Promise<void> {
  await api.delete(`/orders/${orderId}`);
}

// Creates a new order by sending the cart products to the backend
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await api.post<Order>("/orders", payload);
  return response.data;
}
