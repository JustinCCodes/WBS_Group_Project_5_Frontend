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

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "luxe-cart";

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
    const loadAndValidateCart = async () => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsedCart: Cart = JSON.parse(savedCart);
          
          // Extract product IDs from cart
          const productIds = parsedCart.items.map((item) => item.product.id);
          
          // Validate which products still exist
          const validIds = await validateProductIds(productIds);
          
          // Filter out deleted products
          const validItems = parsedCart.items.filter((item) =>
            validIds.includes(item.product.id)
          );
          
          // Update cart with valid items
          const totals = calculateTotals(validItems);
          setCart({
            items: validItems,
            ...totals,
          });
          
          // Only log if products were actually removed
          if (validItems.length < parsedCart.items.length) {
            const removedCount = parsedCart.items.length - validItems.length;
            console.info(`Removed ${removedCount} deleted product(s) from cart`);
          }
        } catch (error) {
          console.error("Failed to parse or validate cart:", error);
        }
      }
    };

    loadAndValidateCart();
  }, []);

  // Saves cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Checks stock availability
    if (product.stock === 0) {
      alert("This product is out of stock");
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Updates quantity if product already in cart
        const existingItem = prevCart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // Checks if new quantity exceeds stock
        if (newQuantity > product.stock) {
          alert(
            `Only ${product.stock} items available. You already have ${existingItem.quantity} in your cart.`
          );
          return prevCart; // Don't update cart
        }

        newItems = prevCart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Checks if initial quantity exceeds stock
        if (quantity > product.stock) {
          alert(`Only ${product.stock} items available.`);
          return prevCart; // Don't update cart
        }

        // Add new product to cart
        newItems = [...prevCart.items, { product, quantity }];
      }

      const totals = calculateTotals(newItems);

      return {
        items: newItems,
        ...totals,
      };
    });
  };

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

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const item = prevCart.items.find((item) => item.product.id === productId);

      // Checks stock availability
      if (item && quantity > item.product.stock) {
        alert(`Only ${item.product.stock} items available in stock.`);
        return prevCart; // Don't update cart
      }

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

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
