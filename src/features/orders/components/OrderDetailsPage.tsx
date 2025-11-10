"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getOrderById } from "@/features/orders";
import { getErrorMessage } from "@/shared/lib/utils";
import { Order, OrderDetailsPageProps } from "../index";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { getStatusConfig } from "./OrderStatusBadge";
import { OrderItem } from "./OrderItem";
import { OrdersPageSkeleton } from "./OrdersPageSkeleton";

// Component to display individual order details
export function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolves dynamic route parameters
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  // Fetches order details on mount
  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    // Fetches order details
    async function fetchOrder() {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(getErrorMessage(err) || "Order not found.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <OrdersPageSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-20 px-4">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-lg">{error || "Order not found."}</p>
          <Link
            href="/profile/orders"
            className="mt-6 inline-block px-6 py-3 bg-red-900/30 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/50 transition-all"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Get status configuration
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to My Orders
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
              Order Details
            </h1>
            <p className="text-gray-400">
              Order #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
          >
            <StatusIcon className={`w-5 h-5 ${statusConfig.textColor}`} />
            <span className={`font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {/* Order Info Header */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-zinc-800">
            <div>
              <h3 className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Order Placed
              </h3>
              <p className="text-white font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Total
              </h3>
              <p className="text-white font-medium">
                ${order.total.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-2">
                Customer
              </h3>
              <p className="text-white font-medium truncate">
                {order.userId?.name}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {order.userId?.email}
              </p>
            </div>
          </div>

          {/* Product List */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
              Items in this Order
            </h2>
            <div className="space-y-4">
              {order.products.map((item, idx) => (
                <OrderItem key={idx} item={item} />
              ))}
            </div>
          </div>

          {/* Order Total Summary */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-950/50">
            <div className="max-w-sm ml-auto space-y-3">
              <div className="flex justify-between items-center text-gray-300">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-300">
                <span>Shipping</span>
                <span className="text-green-400 font-medium">FREE</span>
              </div>
              <div className="border-t border-zinc-700 my-2"></div>
              <div className="flex justify-between items-center text-xl font-bold text-white">
                <span>Order Total</span>
                <span className="text-2xl text-amber-400">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
