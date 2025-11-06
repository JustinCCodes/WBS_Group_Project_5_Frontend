// Server side data fetching for products
import apiServer from "@/shared/lib/api-server";
import type { Category, Product, ProductsResponse } from "./types";

// Fetches all categories
export async function getCategoriesServer(): Promise<Category[]> {
  try {
    const response = await apiServer.get<Category[]>("/categories");
    return response.data;
  } catch {
    // Returns empty array on error to prevent breaking the UI
    return [];
  }
}

// Fetches a single product by ID
export async function getProductByIdServer(
  id: string
): Promise<Product | null> {
  try {
    const response = await apiServer.get<Product>(`/products/${id}`);
    return response.data;
  } catch {
    // Returns null on error so page can show 404
    return null;
  }
}

// Fetches products with optional filters
export async function getProductsServer(params?: {
  categoryId?: string; // Filter by category ID
  page?: number; // Page number for pagination
  limit?: number; // Number of products per page
  featured?: boolean; // Filter by featured products
}): Promise<ProductsResponse> {
  try {
    // Builds query parameters
    const queryParams = new URLSearchParams();

    // Appends parameters if they exist
    if (params?.categoryId) queryParams.append("categoryId", params.categoryId); // Filter by category ID
    if (params?.page) queryParams.append("page", params.page.toString()); // Page number for pagination
    if (params?.limit) queryParams.append("limit", params.limit.toString()); // Number of products per page
    if (params?.featured !== undefined)
      queryParams.append("featured", params.featured.toString()); // Filter by featured products

    // Fetches products from API
    const response = await apiServer.get<ProductsResponse>(
      `/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );

    return response.data;
  } catch {
    // Returns empty response on error to prevent page crash
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
