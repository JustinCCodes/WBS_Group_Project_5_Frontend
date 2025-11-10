"use client";

import { useCart } from "@/features/cart/context/CartProvider";
import { useAuth } from "@/features/auth/context/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ShoppingBag,
  CreditCard,
  Truck,
  User,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createOrder } from "@/features/orders/data";
import { getErrorMessage } from "@/shared/lib/utils";

// CheckoutPage component
export function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("You must be logged in to checkout.");
      router.replace("/login?redirect=/checkout");
    }
  }, [user, authLoading, router]);

  // Redirect to products if cart is empty
  useEffect(() => {
    if (!authLoading && cart.items.length === 0 && !isPlacingOrder) {
      toast.error("Your cart is empty.");
      router.replace("/products");
    }
  }, [cart, authLoading, router, isPlacingOrder]);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    toast.loading("Placing your order...");

    try {
      // Formats cart items for the API
      const orderPayload = {
        products: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Calls the createOrder API function
      const newOrder = await createOrder(orderPayload);

      // Handles success
      toast.dismiss();
      toast.success(`Order #${newOrder.id.slice(-8)} placed successfully!`);
      clearCart(); // Clears the cart
      router.push("/orders/success"); // Redirects to success page
    } catch (error) {
      // Handles errors
      toast.dismiss();
      toast.error(
        getErrorMessage(error) || "Checkout failed. Please try again."
      );
      setIsPlacingOrder(false);
    }
  };

  // Loading or empty cart state
  if (authLoading || !user || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Renders checkout page
  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Checkout
          </h1>
          <div className="mt-4 p-4 bg-zinc-900 border border-amber-500/40 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-sm text-gray-300 font-semibold">
                <span className="text-amber-400">Portfolio Notice:</span> This
                site is for demonstration purposes only. Please do not enter any
                real personal information, addresses, or bank/payment details.
                No actual purchases will be made.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information (Dummy) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 text-amber-400" />
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.name}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Musterstraße 12"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Berlin"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      State
                    </label>
                    <input
                      type="text"
                      placeholder="Berlin"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="10115"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information (Dummy) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-amber-400" />
                Payment Information
              </h2>
              <div className="space-y-4"></div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM / JJ"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-amber-400" />
                Order Summary
              </h2>

              {/* Item List */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg shrink-0 overflow-hidden">
                      <Image
                        src={item.product.imageUrl || "/placeholder.png"}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-4 mb-6 pt-4 border-t border-zinc-800">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-semibold">FREE</span>
                </div>
                <div className="border-t border-zinc-800 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-amber-400">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-4 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {isPlacingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
