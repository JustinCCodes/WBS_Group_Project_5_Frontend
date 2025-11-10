import { getAddresses as getAddressesApi } from "@/features/addresses";
import { createOrder as createOrderApi } from "@/features/orders";
import type { GetAddressesResponse } from "@/features/addresses";

// Fetches users addresses
export async function getAddresses(): Promise<GetAddressesResponse> {
  return getAddressesApi();
}

// Creates a new order
export async function createOrder(payload: any) {
  return createOrderApi(payload);
}
