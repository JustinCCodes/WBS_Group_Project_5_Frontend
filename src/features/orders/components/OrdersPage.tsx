"use client";

import { useEffect, useState } from "react";
import { getUserOrders, deleteOrder } from "../data";
import type { Order } from "../types";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  ShoppingBag,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/shared/lib/utils";
import toast from "react-hot-toast";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Fetches user orders from the server
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      const errorMsg = "Failed to load orders. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handles order deletion with confirmation
  const handleDeleteOrder = async (
    orderId: string,
    orderStatus: Order["status"]
  ) => {
    // Only allows deletion for pending or cancelled orders
    if (orderStatus !== "pending" && orderStatus !== "cancelled") {
      toast.error("Only pending or cancelled orders can be deleted.");
      return;
    }

    // Show confirmation dialog
    setConfirmDeleteId(orderId);
  };

  // Confirms and deletes the order
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;

    // Deletes the order
    try {
      setDeletingOrderId(confirmDeleteId);
      await deleteOrder(confirmDeleteId);
      toast.success("Order deleted successfully");
      // Refreshes orders list after successful deletion
      await fetchOrders();
    } catch (err) {
      toast.error(
        getErrorMessage(err) || "Failed to delete order. Please try again."
      );
    } finally {
      setDeletingOrderId(null);
      setConfirmDeleteId(null);
    }
  };

  // Returns a styled badge based on order status
  const getStatusBadge = (status: Order["status"]) => {
    const badges = {
      pending: "bg-yellow-900/20 border-yellow-800 text-yellow-400",
      processing: "bg-blue-900/20 border-blue-800 text-blue-400",
      shipped: "bg-green-900/20 border-green-800 text-green-400",
      cancelled: "bg-red-900/20 border-red-800 text-red-400",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${badges[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Toggles the expanded state of an order
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Renders loading error empty state or orders list
  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-xl text-white">Loading your orders...</div>
          </div>
        </div>
      </div>
    );
  }

  // Renders error state
  if (error) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Renders empty state if no orders
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-zinc-700 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              No Orders Yet
            </h1>
            <p className="text-gray-400 mb-8">
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renders orders list
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
            My Orders
          </h1>
          <p className="text-gray-400">View and track your order history</p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order.id;
            const isExpanded = expandedOrder === orderId;

            return (
              <div
                key={orderId}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-amber-500/30 transition-colors"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrderExpand(orderId)}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Left Section - Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <Package className="w-5 h-5 text-amber-400 shrink-0" />
                        <h3 className="text-lg font-semibold text-white">
                          Order #{orderId.slice(-8).toUpperCase()}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <ShoppingBag className="w-4 h-4" />
                          <span>
                            {order.products.length}{" "}
                            {order.products.length === 1 ? "item" : "items"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-400 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions & Expand Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Delete Button only for pending/cancelled orders */}
                      {(order.status === "pending" ||
                        order.status === "cancelled") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteOrder(orderId, order.status);
                          }}
                          disabled={deletingOrderId === orderId}
                          className="p-2 bg-red-900/20 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete Order"
                        >
                          {deletingOrderId === orderId ? (
                            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      {/* Read only notice for processing/shipped orders */}
                      {(order.status === "processing" ||
                        order.status === "shipped") && (
                        <div
                          className="flex items-center gap-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-gray-400"
                          title="Orders being processed or shipped cannot be modified"
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Read-only</span>
                        </div>
                      )}
                      {/* Expand Button */}
                      <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Details*/}
                {isExpanded && (
                  <div className="border-t border-zinc-800 bg-zinc-950/50">
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.products.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg"
                          >
                            {/* Product Image Placeholder */}
                            <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                              {item.productId.imageUrl ? (
                                <img
                                  src={item.productId.imageUrl}
                                  alt={item.productId.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Package className="w-8 h-8 text-zinc-600" />
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/products/${item.productId.id}`}
                                className="text-white font-semibold hover:text-amber-400 transition-colors line-clamp-1"
                              >
                                {item.productId.name}
                              </Link>
                              <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                                <span>Qty: {item.quantity}</span>
                                <span>•</span>
                                <span className="text-amber-400 font-semibold">
                                  ${item.productId.price.toFixed(2)} each
                                </span>
                              </div>
                            </div>

                            {/* Item Total */}
                            <div className="text-right shrink-0">
                              <div className="text-lg font-bold text-amber-400">
                                $
                                {(item.productId.price * item.quantity).toFixed(
                                  2
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-6 border-t border-zinc-800">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-400">
                            Order Total
                          </span>
                          <span className="text-2xl font-bold text-amber-400">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-900/20 border border-red-800 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Order</h3>
                  <p className="text-sm text-gray-400">
                    #{confirmDeleteId.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this order? This action cannot
                be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={deletingOrderId === confirmDeleteId}
                  className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg hover:bg-zinc-700 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingOrderId === confirmDeleteId}
                  className="flex-1 px-4 py-2 bg-red-900/30 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/50 transition-all disabled:opacity-50"
                >
                  {deletingOrderId === confirmDeleteId
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
