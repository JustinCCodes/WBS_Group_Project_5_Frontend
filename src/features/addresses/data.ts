import api from "@/shared/lib/api";
import { Address, GetAddressesResponse } from "./index";

// Type for the address data submitted to the API
export type AddressPayload = Omit<Address, "id">;

// Fetches all addresses for the current user
export async function getAddresses(): Promise<GetAddressesResponse> {
  const response = await api.get<GetAddressesResponse>("/addresses");
  return response.data;
}

// Creates a new address
export async function createAddress(data: AddressPayload): Promise<Address> {
  const response = await api.post<Address>("/addresses", data);
  return response.data;
}

// Updates an existing address by its ID
export async function updateAddress(
  id: string,
  data: Partial<AddressPayload>
): Promise<Address> {
  const response = await api.put<Address>(`/addresses/${id}`, data);
  return response.data;
}

// Deletes an address by its ID
export async function deleteAddress(id: string): Promise<void> {
  await api.delete(`/addresses/${id}`);
}

// Sets an address as the default by its ID
export async function setDefaultAddress(
  id: string
): Promise<{ defaultAddressId: string }> {
  const response = await api.post(`/addresses/${id}/set-default`);
  return response.data;
}
