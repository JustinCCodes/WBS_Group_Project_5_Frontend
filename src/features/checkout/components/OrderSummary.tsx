import Image from "next/image";
import { ShoppingBag, Lock } from "lucide-react";
import type { OrderSummaryProps } from "../types";

export function OrderSummary({
  cart,
  isPlacingOrder,
  onPlaceOrder,
  hasSelectedAddress,
}: OrderSummaryProps) {
  return (
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
                <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
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
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || !hasSelectedAddress}
          className="w-full py-4 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Lock className="w-5 h-5" />
          {isPlacingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
