import { Product } from "../products";

// Individual item in the cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// Cart structure with items and totals
export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Context type for cart operations and state
export interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

// Result of stock validation checks
export interface StockValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
