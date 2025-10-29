// Server-Side Data Fetching for Products

import apiServer from "@/shared/lib/api-server";
import type { Category, Product, ProductsResponse } from "./types";

// Fetches all categories

export async function getCategoriesServer(): Promise<Category[]> {
  try {
    const response = await apiServer.get<Category[]>("/categories");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch categories (server-side):", error);
    return []; // Return empty array on error to prevent breaking the UI
  }
}

// Fetches a single product by ID
export async function getProductByIdServer(
  id: string
): Promise<Product | null> {
  try {
    const response = await apiServer.get<Product>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product ${id} (server-side):`, error);
    return null; // Return null on error so page can show 404
  }
}

// Fetches products with optional filters

export async function getProductsServer(params?: {
  categoryId?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}): Promise<ProductsResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.featured !== undefined)
      queryParams.append("featured", params.featured.toString());

    const response = await apiServer.get<ProductsResponse>(
      `/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch products (server-side):", error);
    // Returns empty response on error
    return {
      data: [],
      pagination: {
        page: 1,
        limit: params?.limit || 12,
        total: 0,
        totalPages: 0,
      },
    };
  }
}
