"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/features/admin/data";
import type { User, TestOrder, ProductSummary } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import { useTestOrderForm } from "@/features/admin/hooks";
import api from "@/shared/lib/api";

export default function TestOrdersManagement() {
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const testOrderForm = useTestOrderForm(async (data) => {
    await api.post("/admin/test-orders", {
      userId: data.userId,
      status: data.status,
      products: data.products.filter((p) => p.productId && p.quantity > 0),
    });
    setIsCreating(false);
    await fetchTestOrders();
  });

  const fetchTestOrders = async () => {
    try {
      const response = await api.get("/admin/test-orders?limit=1000");
      setTestOrders(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load test orders");
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(1, 1000);
      setUsers(data.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products?limit=1000");
      setProducts(response.data.data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchTestOrders(), fetchUsers(), fetchProducts()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteTestOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test order?")) {
      return;
    }

    try {
      await api.delete(`/admin/test-orders/${id}`);
      await fetchTestOrders();
    } catch (err) {
      alert(getErrorMessage(err) || "Failed to delete test order");
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    testOrderForm.reset();
  };

  if (loading && testOrders.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl">Loading test orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Test Orders</h1>
          <p className="text-sm opacity-70 mt-1">
            Create and manage test orders separately from production orders
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(true)}
          disabled={isCreating}
        >
          + Create Test Order
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Create Form */}
      {isCreating && (
        <div className="card bg-base-200 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title">Create Test Order</h2>
            <form onSubmit={testOrderForm.handleSubmit}>
              {testOrderForm.error && (
                <div className="alert alert-error mb-4">
                  <span>{testOrderForm.error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">User *</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={testOrderForm.formState.userId}
                    onChange={(e) =>
                      testOrderForm.dispatch({
                        type: "SET_USER_ID",
                        payload: e.target.value,
                      })
                    }
                    required
                    disabled={testOrderForm.loading}
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option
                        key={user.id || user._id}
                        value={user.id || user._id}
                      >
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status *</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={testOrderForm.formState.status}
                    onChange={(e) =>
                      testOrderForm.dispatch({
                        type: "SET_STATUS",
                        payload: e.target.value as
                          | "pending"
                          | "processing"
                          | "shipped"
                          | "cancelled",
                      })
                    }
                    disabled={testOrderForm.loading}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="divider">Products</div>

              {testOrderForm.formState.products.map((product, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <div className="form-control flex-1">
                    <select
                      className="select select-bordered"
                      value={product.productId}
                      onChange={(e) =>
                        testOrderForm.dispatch({
                          type: "UPDATE_PRODUCT_LINE",
                          payload: {
                            index,
                            field: "productId",
                            value: e.target.value,
                          },
                        })
                      }
                      required
                      disabled={testOrderForm.loading}
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id || p._id} value={p.id || p._id}>
                          {p.name} - ${p.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control w-24">
                    <input
                      type="number"
                      min="1"
                      className="input input-bordered"
                      value={product.quantity}
                      onChange={(e) =>
                        testOrderForm.dispatch({
                          type: "UPDATE_PRODUCT_LINE",
                          payload: {
                            index,
                            field: "quantity",
                            value: parseInt(e.target.value),
                          },
                        })
                      }
                      required
                      disabled={testOrderForm.loading}
                    />
                  </div>
                  {testOrderForm.formState.products.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-error btn-square"
                      onClick={() =>
                        testOrderForm.dispatch({
                          type: "REMOVE_PRODUCT_LINE",
                          payload: index,
                        })
                      }
                      disabled={testOrderForm.loading}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-outline mt-2"
                onClick={() =>
                  testOrderForm.dispatch({ type: "ADD_PRODUCT_LINE" })
                }
                disabled={testOrderForm.loading}
              >
                + Add Product
              </button>

              <div className="card-actions justify-end mt-4">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={resetForm}
                  disabled={testOrderForm.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={testOrderForm.loading}
                >
                  {testOrderForm.loading ? "Creating..." : "Create Test Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Orders Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  No test orders yet
                </td>
              </tr>
            ) : (
              testOrders.map((order) => (
                <tr key={order.id || order._id}>
                  <td className="font-mono text-sm">
                    {(order.id || order._id || "").slice(-8)}
                  </td>
                  <td>
                    <div>
                      <div className="font-semibold">{order.userId.name}</div>
                      <div className="text-sm opacity-50">
                        {order.userId.email}
                      </div>
                    </div>
                  </td>
                  <td>{order.products.length} item(s)</td>
                  <td className="font-semibold">${order.total.toFixed(2)}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "pending"
                          ? "badge-warning"
                          : order.status === "processing"
                          ? "badge-info"
                          : order.status === "shipped"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() =>
                        handleDeleteTestOrder(order.id || order._id || "")
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {testOrders.length} test orders
      </div>
    </div>
  );
}
