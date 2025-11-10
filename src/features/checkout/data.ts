import { getAddresses as getAddressesApi } from "@/features/addresses";
import { createOrder as createOrderApi } from "@/features/orders";
import type { GetAddressesResponse } from "@/features/addresses";
import type { CreateOrderPayload, Order } from "@/features/orders/types";

// Fetches users addresses
export async function getAddresses(): Promise<GetAddressesResponse> {
  return getAddressesApi();
}

// Creates a new order
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return createOrderApi(payload);
}
