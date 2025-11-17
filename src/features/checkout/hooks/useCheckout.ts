"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/features/cart";
import { useAuth } from "@/features/auth";
import { getAddresses, createOrder } from "../data";
import { getErrorMessage } from "@/shared/lib/utils";
import type { Address, GetAddressesResponse } from "@/features/addresses";
import { UseCheckoutReturn } from "../types";

// Custom hook to manage checkout process
export function useCheckout(): UseCheckoutReturn {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  // Order state
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddressLoading, setIsAddressLoading] = useState(true);

  // Combined loading state
  const isLoading = authLoading || isAddressLoading;

  // Effect 1: Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("You must be logged in to checkout.");
      router.replace("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  // Effect 2: Redirect if cart is empty
  useEffect(() => {
    if (!authLoading && cart.items.length === 0 && !isPlacingOrder) {
      toast.error("Your cart is empty.");
      router.replace("/products");
    }
  }, [cart, authLoading, router, isPlacingOrder]);

  // Effect 3: Fetch addresses on user load
  useEffect(() => {
    if (user) {
      setIsAddressLoading(true);
      getAddresses()
        .then(({ addresses, defaultAddressId }: GetAddressesResponse) => {
          setAddresses(addresses);
          if (defaultAddressId) {
            setSelectedAddress(
              addresses.find((a: Address) => a.id === defaultAddressId) || null
            );
          } else if (addresses.length > 0) {
            setSelectedAddress(addresses[0]);
          }
        })
        .catch((err: unknown) => {
          toast.error(getErrorMessage(err));
        })
        .finally(() => {
          setIsAddressLoading(false);
        });
    }
  }, [user]);

  // Handles Place Order
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select or add a shipping address.");
      return;
    }

    setIsPlacingOrder(true);
    toast.loading("Placing your order...");

    try {
      const orderPayload = {
        products: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Adds address ID to payload
      const newOrder = await createOrder(orderPayload);

      toast.dismiss();
      toast.success(`Order #${newOrder.id.slice(-8)} placed successfully!`);

      // Sets a flag in session storage to verify the success page view
      sessionStorage.setItem("orderSuccess", "true");

      clearCart();
      router.push("/profile/orders/success");
    } catch (error) {
      toast.dismiss();
      toast.error(
        getErrorMessage(error) || "Checkout failed. Please try again."
      );
      setIsPlacingOrder(false);
    }
  };

  return {
    cart,
    user,
    isLoading,
    isPlacingOrder,
    addresses,
    selectedAddress,
    setSelectedAddress,
    isAddressModalOpen,
    setIsAddressModalOpen,
    handlePlaceOrder,
  };
}
