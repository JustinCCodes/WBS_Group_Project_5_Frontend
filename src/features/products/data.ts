import api from "@/shared/lib/api";
import { Product, ProductsResponse, Category } from "./types";

// Fetches all products with optional category filter and pagination

export async function getProducts(params?: {
  categoryId?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.categoryId) queryParams.append("categoryId", params.categoryId);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.featured !== undefined)
    queryParams.append("featured", params.featured.toString());

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

// Marks a product as featured

export async function featureProduct(id: string): Promise<Product> {
  const response = await api.put<Product>(`/admin/products/${id}/feature`);
  return response.data;
}

/**
 * Removes featured status from a product
 */
export async function unfeatureProduct(id: string): Promise<Product> {
  const response = await api.put<Product>(`/admin/products/${id}/unfeature`);
  return response.data;
}

/**
 * Validates if products exist by their IDs
 * Returns an array of valid product IDs
 */
export async function validateProductIds(
  productIds: string[]
): Promise<string[]> {
  try {
    const validIds: string[] = [];
    // Check each product in parallel, suppressing 404 errors
    const checks = await Promise.allSettled(
      productIds.map((id) => 
        getProductById(id).catch(() => null) // Suppress 404 errors
      )
    );

    checks.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value !== null) {
        validIds.push(productIds[index]);
      }
    });

    return validIds;
  } catch (error) {
    // Silent catch - validation errors are not critical
    return [];
  }
}
