import type { Product } from "@/features/products";
import type { StockValidationResult } from "@/features/cart";

// Validates if requested quantity can be added to cart
export function validateStockAvailability(
  product: Product, // Product to validate
  requestedQuantity: number, // Quantity user wants to add
  currentCartQuantity: number = 0 // Current quantity in cart
): StockValidationResult {
  // Checks if product is out of stock
  if (product.stock === 0) {
    return {
      isValid: false, // Product cannot be added
      errorMessage: `${product.name} is out of stock`, // Message to show
    };
  }

  // Total quantity after addition
  const totalQuantity = currentCartQuantity + requestedQuantity;

  // Checks if requested quantity exceeds available stock
  if (totalQuantity > product.stock) {
    if (currentCartQuantity > 0) {
      return {
        isValid: false,
        errorMessage: `Only ${product.stock} items available. You already have ${currentCartQuantity} in your cart.`,
      };
    }
    return {
      isValid: false,
      errorMessage: `Only ${product.stock} items available.`,
    };
  }

  return { isValid: true };
}

// Validates if a specific quantity is available for a product
export function validateQuantityUpdate(
  product: Product, // Product to validate
  newQuantity: number // New desired quantity
): StockValidationResult {
  if (newQuantity <= 0) {
    return { isValid: false, errorMessage: "Quantity must be greater than 0" };
  }

  // Checks if new quantity exceeds stock
  if (newQuantity > product.stock) {
    return {
      isValid: false,
      errorMessage: `Only ${product.stock} items available in stock.`,
    };
  }

  return { isValid: true };
}
