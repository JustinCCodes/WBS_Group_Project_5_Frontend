"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "@/features/admin/data";
import type { Order } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Search & filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders(1, 1000); // Fetches all orders
      setOrders(data.data || []);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to update order status");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteOrder(id);
      await fetchOrders();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete order");
    }
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Filters and sorts orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Search filter
        const searchLower = searchTerm.toLowerCase();
        const customerName =
          typeof order.userId === "object"
            ? order.userId.name.toLowerCase()
            : "";
        const customerEmail =
          typeof order.userId === "object"
            ? order.userId.email.toLowerCase()
            : "";
        const orderId = (order.id || order._id || "").toLowerCase();

        const matchesSearch =
          !searchTerm ||
          orderId.includes(searchLower) ||
          customerName.includes(searchLower) ||
          customerEmail.includes(searchLower);

        // Status filter
        const matchesStatus = !filterStatus || order.status === filterStatus;

        // Date range filter
        const orderDate = new Date(order.createdAt);
        const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
        const matchesDateTo = !dateTo || orderDate <= new Date(dateTo);

        return (
          matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [orders, searchTerm, filterStatus, dateFrom, dateTo, sortOrder]);

  // Calculates revenue for filtered orders
  const filteredRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0);
  }, [filteredOrders]);

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-xl">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Manage Orders
            </span>
          </h1>
          <div className="text-lg text-gray-400">
            Filtered Revenue:{" "}
            <span className="font-bold text-amber-400">
              ${filteredRevenue.toFixed(2)}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by Order ID, customer name, or email..."
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="min-w-[150px]">
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From date"
            />
          </div>
          <div>
            <input
              type="date"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To date"
            />
          </div>
          <div>
            <button
              onClick={() => fetchOrders()}
              disabled={loading}
              className="px-6 py-2 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Refresh orders"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchTerm || filterStatus || dateFrom || dateTo
                      ? "No orders found matching your filters"
                      : "No orders yet"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id || order._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-gray-400">
                      {(order.id || order._id || "").slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      {typeof order.userId === "object" ? (
                        <div>
                          <div className="font-semibold text-white">
                            {order.userId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.userId.email}
                          </div>
                        </div>
                      ) : (
                        "Unknown"
                      )}
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-400">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          order.status === "pending"
                            ? "bg-yellow-900/20 border border-yellow-800 text-yellow-400"
                            : order.status === "processing"
                            ? "bg-blue-900/20 border border-blue-800 text-blue-400"
                            : order.status === "shipped"
                            ? "bg-green-900/20 border border-green-800 text-green-400"
                            : "bg-red-900/20 border border-red-800 text-red-400"
                        }`}
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            order.id || order._id || "",
                            e.target.value
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 bg-blue-900/20 border border-blue-800 text-blue-400 text-sm rounded-lg hover:bg-blue-900/40 transition-all"
                          onClick={() => showOrderDetails(order)}
                        >
                          Details
                        </button>
                        <button
                          className="px-4 py-2 bg-red-900/20 border border-red-800 text-red-400 text-sm rounded-lg hover:bg-red-900/40 transition-all"
                          onClick={() =>
                            handleDeleteOrder(order.id || order._id || "")
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-3xl mx-4 w-full max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-xl mb-6 text-amber-400">
                Order Details
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order ID</p>
                  <p className="font-mono text-white">
                    {selectedOrder.id || selectedOrder._id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedOrder.status === "pending"
                        ? "bg-yellow-900/20 border border-yellow-800 text-yellow-400"
                        : selectedOrder.status === "processing"
                        ? "bg-blue-900/20 border border-blue-800 text-blue-400"
                        : selectedOrder.status === "shipped"
                        ? "bg-green-900/20 border border-green-800 text-green-400"
                        : "bg-red-900/20 border border-red-800 text-red-400"
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Customer</p>
                  {typeof selectedOrder.userId === "object" ? (
                    <div>
                      <p className="font-semibold text-white">
                        {selectedOrder.userId.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedOrder.userId.email}
                      </p>
                    </div>
                  ) : (
                    <p className="text-white">Unknown</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Order Date</p>
                  <p className="text-white">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-800 my-6">
                <h4 className="text-lg font-semibold text-gray-300 mt-6 mb-4">
                  Products
                </h4>
              </div>

              <div className="overflow-x-auto bg-zinc-800 border border-zinc-700 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((item, idx) => (
                      <tr key={idx} className="border-b border-zinc-700">
                        <td className="px-4 py-3 text-white">
                          {typeof item.productId === "object" &&
                          item.productId.name
                            ? item.productId.name
                            : "Unknown Product"}
                        </td>
                        <td className="px-4 py-3 text-gray-400">
                          $
                          {typeof item.productId === "object" &&
                          item.productId.price
                            ? item.productId.price.toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="px-4 py-3 text-white">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 font-semibold text-amber-400">
                          $
                          {typeof item.productId === "object" &&
                          item.productId.price
                            ? (item.productId.price * item.quantity).toFixed(2)
                            : "0.00"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-amber-500/30">
                      <th
                        colSpan={3}
                        className="px-4 py-3 text-right text-white"
                      >
                        Total
                      </th>
                      <th className="px-4 py-3 text-lg text-amber-400">
                        ${selectedOrder.total.toFixed(2)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
