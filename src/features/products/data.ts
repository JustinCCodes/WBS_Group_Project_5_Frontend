import api from "@/shared/lib/api";
import { Product, ProductsResponse, Category } from "./types";

// Fetches all products with optional category filter and pagination
export async function getProducts(params?: {
  categoryId?: string; // Filter by category ID
  page?: number; // Page number for pagination
  limit?: number; // Number of products per page
  featured?: boolean; // Filter by featured products
}): Promise<ProductsResponse> {
  // Builds query parameters
  const queryParams = new URLSearchParams();

  // Appends parameters if they exist
  if (params?.categoryId) queryParams.append("categoryId", params.categoryId); // Filter by category ID
  if (params?.page) queryParams.append("page", params.page.toString()); // Page number for pagination
  if (params?.limit) queryParams.append("limit", params.limit.toString()); // Number of products per page
  if (params?.featured !== undefined)
    queryParams.append("featured", params.featured.toString()); // Filter by featured products

  // Fetches products from API
  const response = await api.get<ProductsResponse>(
    `/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  );

  return response.data;
}

// Fetches a single product by ID

export async function getProductById(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

// Fetches all categories
export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

// Fetches a single category by ID
export async function getCategoryById(id: string): Promise<Category> {
  const response = await api.get<Category>(`/categories/${id}`);
  return response.data;
}

// Validates if products exist by their IDs
export async function validateProductIds(
  productIds: string[]
): Promise<string[]> {
  try {
    const validIds: string[] = [];
    // Check each product in parallel, suppressing 404 errors
    const checks = await Promise.allSettled(
      productIds.map(
        (id) => getProductById(id).catch(() => null) // Suppress 404 errors
      )
    );

    // Collect valid IDs
    checks.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value !== null) {
        validIds.push(productIds[index]);
      }
    });

    return validIds;
  } catch {
    // Silent catch validation errors are not critical
    return [];
  }
}
