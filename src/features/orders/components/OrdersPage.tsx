"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getUserOrders,
  deleteOrder,
  Order,
  OrderCard,
  ConfirmCancelModal,
  OrdersPageSkeleton,
} from "../index";
import { ShoppingBag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getErrorMessage } from "@/shared/lib/utils";
import toast from "react-hot-toast";

// OrdersPage component
export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [confirmCancelOrder, setConfirmCancelOrder] = useState<Order | null>(
    null
  );

  // Fetches user orders from the server
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      const errorMsg =
        getErrorMessage(err) || "Failed to load orders. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetches orders on component mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handles starting the order cancellation process
  const handleCancelOrder = useCallback(
    (orderId: string, orderStatus: Order["status"]) => {
      if (orderStatus !== "pending") {
        toast.error("Only pending orders can be cancelled.");
        return;
      }
      // Finds full order object from state
      const orderToCancel = orders.find((o) => o.id === orderId);
      setConfirmCancelOrder(orderToCancel || null);
    },
    [orders] // Add orders dependency
  );

  // Confirms and processes the cancellation
  const confirmCancel = useCallback(async () => {
    if (!confirmCancelOrder) return;
    const orderIdToCancel = confirmCancelOrder.id;

    try {
      setCancellingOrderId(orderIdToCancel);
      const cancelledOrder = await deleteOrder(orderIdToCancel);

      // Updates the order in our state list
      setOrders((prev) =>
        prev.map((o) => (o.id === orderIdToCancel ? cancelledOrder : o))
      );
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(
        getErrorMessage(err) || "Failed to cancel order. Please try again."
      );
    } finally {
      setCancellingOrderId(null);
      setConfirmCancelOrder(null); // Close modal
    }
  }, [confirmCancelOrder]); // Add dependency

  // Renders loading state
  if (loading) {
    return <OrdersPageSkeleton />;
  }

  // Renders error state
  if (error) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-6 px-6 py-3 bg-red-900/30 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/50 transition-all"
            >
              Try Again
            </button>
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
            <div className="mb-6 relative inline-block">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
              <ShoppingBag className="relative w-24 h-24 text-amber-400 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              No Orders Yet
            </h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You haven&apos;t placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-amber-500/20"
            >
              View All Products
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
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
              My Orders
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {orders.length} {orders.length === 1 ? "order" : "orders"} in your
            history
          </p>
        </div>

        {/* Orders Grid */}
        <div className="space-y-6" role="list" aria-label="Orders">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancelOrder}
              isCancelling={cancellingOrderId === order.id}
            />
          ))}
        </div>

        {/* Confirmation Modal */}
        <ConfirmCancelModal
          isOpen={!!confirmCancelOrder}
          order={confirmCancelOrder}
          isCancelling={cancellingOrderId === confirmCancelOrder?.id}
          onConfirm={confirmCancel}
          onCancel={() => setConfirmCancelOrder(null)}
        />
      </div>
    </div>
  );
}
