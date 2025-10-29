"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllOrders, updateOrderStatus } from "@/features/admin/data";
import type { Order } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import api from "@/shared/lib/api";

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
      const data = await getAllOrders(1, 1000); // Fetch all orders
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

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchOrders();
      }
    }, 10000);

    return () => clearInterval(interval);
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
      await api.delete(`/admin/orders/${id}`);
      await fetchOrders();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete order");
    }
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Filter and sort orders
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

  // Calculate revenue for filtered orders
  const filteredRevenue = useMemo(() => {
    return filteredOrders.reduce((sum, order) => sum + order.total, 0);
  }, [filteredOrders]);

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <div className="card bg-base-200 shadow">
          <div className="card-body p-4">
            <div className="text-sm opacity-70">Filtered Revenue</div>
            <div className="text-2xl font-bold">
              ${filteredRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="form-control flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search by Order ID, customer name, or email..."
            className="input input-bordered"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-control min-w-[150px]">
          <select
            className="select select-bordered"
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
        <div className="form-control">
          <input
            type="date"
            className="input input-bordered"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From date"
          />
        </div>
        <div className="form-control">
          <input
            type="date"
            className="input input-bordered"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To date"
          />
        </div>
        <div className="form-control">
          <select
            className="select select-bordered"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  {searchTerm || filterStatus || dateFrom || dateTo
                    ? "No orders found matching your filters"
                    : "No orders yet"}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id || order._id}>
                  <td className="font-mono text-sm">
                    {(order.id || order._id || "").slice(-8)}
                  </td>
                  <td>
                    {typeof order.userId === "object" ? (
                      <div>
                        <div className="font-semibold">{order.userId.name}</div>
                        <div className="text-sm opacity-50">
                          {order.userId.email}
                        </div>
                      </div>
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="font-semibold">${order.total.toFixed(2)}</td>
                  <td>
                    <select
                      className={`select select-sm ${
                        order.status === "pending"
                          ? "select-warning"
                          : order.status === "processing"
                          ? "select-info"
                          : order.status === "shipped"
                          ? "select-success"
                          : "select-error"
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
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => showOrderDetails(order)}
                      >
                        Details
                      </button>
                      <button
                        className="btn btn-sm btn-error"
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

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredOrders.length} of {orders.length} orders
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Order Details</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm opacity-70">Order ID</p>
                <p className="font-mono">
                  {selectedOrder.id || selectedOrder._id}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-70">Status</p>
                <span
                  className={`badge ${
                    selectedOrder.status === "pending"
                      ? "badge-warning"
                      : selectedOrder.status === "processing"
                      ? "badge-info"
                      : selectedOrder.status === "shipped"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-sm opacity-70">Customer</p>
                {typeof selectedOrder.userId === "object" ? (
                  <div>
                    <p className="font-semibold">{selectedOrder.userId.name}</p>
                    <p className="text-sm">{selectedOrder.userId.email}</p>
                  </div>
                ) : (
                  <p>Unknown</p>
                )}
              </div>
              <div>
                <p className="text-sm opacity-70">Order Date</p>
                <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="divider">Products</div>

            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        {typeof item.productId === "object" &&
                        item.productId.name
                          ? item.productId.name
                          : "Unknown Product"}
                      </td>
                      <td>
                        $
                        {typeof item.productId === "object" &&
                        item.productId.price
                          ? item.productId.price.toFixed(2)
                          : "0.00"}
                      </td>
                      <td>{item.quantity}</td>
                      <td className="font-semibold">
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
                  <tr>
                    <th colSpan={3} className="text-right">
                      Total
                    </th>
                    <th className="text-lg">
                      ${selectedOrder.total.toFixed(2)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
