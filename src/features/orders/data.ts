import api from "@/shared/lib/api";
import type { Order, OrdersResponse } from "./types";

// Fetches user's orders
export async function getUserOrders(
  page: number = 1,
  limit: number = 100
): Promise<Order[]> {
  const response = await api.get<OrdersResponse>(
    `/orders?page=${page}&limit=${limit}`
  );
  return response.data?.orders || [];
}

// Get single order by ID
export async function getOrderById(orderId: string): Promise<Order> {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
}

// Deletes order (only for pending/cancelled orders)
export async function deleteOrder(orderId: string): Promise<void> {
  await api.delete(`/orders/${orderId}`);
}
