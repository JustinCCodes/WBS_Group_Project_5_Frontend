import type { Product } from "@/features/products/types";

// Extracts the category name from a product

export function getCategoryName(product: Product): string {
  if (typeof product.categoryId === "object" && product.categoryId !== null) {
    return product.categoryId.name;
  }
  return "Product";
}

// Formats a price value with currency symbol
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Formats a date to a localized string
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Truncates text to a maximum length with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Helper function to extract error message from API errors
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  const apiError = error as {
    response?: {
      data?: {
        error?: string;
        message?: string;
      };
      status?: number;
    };
    message?: string;
  };

  return (
    apiError?.response?.data?.error ||
    apiError?.response?.data?.message ||
    apiError?.message ||
    "An unexpected error occurred"
  );
}
