import Link from "next/link";
import { CheckCircle, ShoppingBag, ListOrdered } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed | Syntax",
  description: "Thank you for your purchase.",
};

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-20 px-4">
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <div className="mb-8 relative inline-block">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full"></div>
          <CheckCircle className="relative w-24 h-24 text-green-400 mx-auto" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-linear-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
            Thank you for your purchase!
          </span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-lg mx-auto">
          Your order will be processed and shipped as soon as possible (if this
          was a real site).
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/products"
            className="group relative px-8 py-4 bg-linear-to-r from-amber-500 to-yellow-600 rounded-lg font-semibold text-black text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
          <Link
            href="/orders"
            className="group relative px-8 py-4 bg-zinc-800 border border-zinc-700 rounded-lg font-semibold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-amber-500 flex items-center justify-center gap-2"
          >
            <ListOrdered className="w-5 h-5" />
            <span>View My Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
