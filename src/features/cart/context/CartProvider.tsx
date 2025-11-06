"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartContextType, Cart, CartItem } from "../types";
import { Product } from "@/features/products/types";
import { validateProductIds } from "@/features/products/data";
import toast from "react-hot-toast";
import {
  validateStockAvailability,
  validateQuantityUpdate,
} from "../utils/stockValidation";

// Creates cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Key for storing cart data in localStorage
const CART_STORAGE_KEY = "luxe-cart";

// Provides cart context to manage cart state and actions
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculates totals
  const calculateTotals = (
    items: CartItem[]
  ): Pick<Cart, "totalItems" | "totalPrice"> => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    return { totalItems, totalPrice };
  };

  // Loads cart from localStorage and validates products still exist
  useEffect(() => {
    let cancelled = false;

    // Loads and validates cart
    const loadAndValidateCart = async () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart: Cart = JSON.parse(savedCart);

          // Extracts product IDs from cart
          const productIds = parsedCart.items.map((item) => item.product.id);

          // Validates which products still exist
          const validIds = await validateProductIds(productIds);

          if (cancelled) return;

          // Filters out deleted products
          const validItems = parsedCart.items.filter((item) =>
            validIds.includes(item.product.id)
          );

          // Updates cart with valid items
          const totals = calculateTotals(validItems);
          setCart({
            items: validItems,
            ...totals,
          });

          // Notifies if products were removed
          if (validItems.length < parsedCart.items.length) {
            const removedCount = parsedCart.items.length - validItems.length;
            toast.error(
              `${removedCount} product(s) removed from cart (no longer available)`
            );
          }
        } catch {
          // Silent fail cart will be empty no user disruption
        }
      }
    };

    loadAndValidateCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // Saves cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Adds a product to the cart
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.id === product.id
    );

    // Current quantity in cart
    const currentCartQuantity =
      existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;

    // Validate stock availability
    const validation = validateStockAvailability(
      product,
      quantity,
      currentCartQuantity
    );

    // If validation fails show error and do not update cart
    if (!validation.isValid) {
      toast.error(validation.errorMessage!);
      return;
    }

    // Prepare new items array
    let newItems: CartItem[];

    if (existingItemIndex > -1) {
      // Update existing item quantity
      newItems = cart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      // Add new product to cart
      newItems = [...cart.items, { product, quantity }];
    }

    // Calculates new totals
    const totals = calculateTotals(newItems);

    setCart({
      items: newItems,
      ...totals,
    });
  };

  // Removes a product from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product.id !== productId
      );
      const totals = calculateTotals(newItems);

      return {
        items: newItems,
        ...totals,
      };
    });
  };

  // Updates quantity of a product in cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Updates cart with new quantity
    setCart((prevCart) => {
      const item = prevCart.items.find((item) => item.product.id === productId);

      if (!item) return prevCart;

      // Validate quantity update
      const validation = validateQuantityUpdate(item.product, quantity);

      if (!validation.isValid) {
        toast.error(validation.errorMessage!);
        return prevCart;
      }

      // Prepares new items array with updated quantity
      const newItems = prevCart.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      const totals = calculateTotals(newItems);

      return {
        items: newItems,
        ...totals,
      };
    });
  };

  // Clears the entire cart
  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  };

  // Opens and closes cart drawer
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Provides cart context values
  return (
    <CartContext.Provider
      value={{
        cart, // Current cart state
        addToCart, // Function to add products to cart
        removeFromCart, // Function to remove products from cart
        updateQuantity, // Function to update product quantity in cart
        clearCart, // Function to clear the cart
        isDrawerOpen, // Cart drawer open state
        openDrawer, // Function to open cart drawer
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
