"use client";

import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllProducts,
  createTestOrder,
  getAllTestOrders,
  deleteTestOrder,
} from "@/features/admin/data";
import type { User, TestOrder, ProductSummary } from "@/features/admin/types";
import { getErrorMessage } from "@/shared/types";
import { useTestOrderForm } from "@/features/admin/hooks";

export default function TestOrdersManagement() {
  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const testOrderForm = useTestOrderForm(async (data) => {
    await createTestOrder({
      userId: data.userId,
      status: data.status,
      products: data.products.filter((p) => p.productId && p.quantity > 0),
    });
    setIsCreating(false);
    await fetchTestOrders();
  });

  const fetchTestOrders = async () => {
    try {
      const data = await getAllTestOrders();
      setTestOrders(data.data || []);
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
      const data = await getAllProducts();
      setProducts(data.data || []);
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
  }, []);

  const handleDeleteTestOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test order?")) {
      return;
    }

    try {
      await deleteTestOrder(id);
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
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-xl">Loading test orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                Test Orders
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Create and manage test orders separately from production orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              title="Refresh test orders"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={() => setIsCreating(true)}
              disabled={isCreating}
            >
              + Create Test Order
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Create Form */}
        {isCreating && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-xl mb-6">
            <h2 className="text-xl font-bold mb-6 text-amber-400">
              Create Test Order
            </h2>
            <form onSubmit={testOrderForm.handleSubmit}>
              {testOrderForm.error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
                  <span className="text-red-400">{testOrderForm.error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    User *
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status *
                  </label>
                  <select
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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

              <div className="border-t border-zinc-800 my-6 pt-6">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">
                  Products
                </h3>
              </div>

              {testOrderForm.formState.products.map((product, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <select
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
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
                      className="w-10 h-10 bg-red-900/20 border border-red-800 text-red-400 font-bold rounded hover:bg-red-900/40 transition-all"
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
                className="mt-2 px-4 py-2 bg-zinc-800 border border-zinc-700 text-gray-300 text-sm font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                onClick={() =>
                  testOrderForm.dispatch({ type: "ADD_PRODUCT_LINE" })
                }
                disabled={testOrderForm.loading}
              >
                + Add Product
              </button>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
                  onClick={resetForm}
                  disabled={testOrderForm.loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={testOrderForm.loading}
                >
                  {testOrderForm.loading ? "Creating..." : "Create Test Order"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Test Orders Table */}
        <div className="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Products
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-amber-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {testOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No test orders yet
                  </td>
                </tr>
              ) : (
                testOrders.map((order) => (
                  <tr
                    key={order.id || order._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-sm text-gray-300">
                      {(order.id || order._id || "").slice(-8)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-white">
                          {order.userId.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {order.userId.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {order.products.length} item(s)
                    </td>
                    <td className="px-4 py-3 font-semibold text-amber-400">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "pending"
                            ? "bg-yellow-900/20 border border-yellow-800 text-yellow-400"
                            : order.status === "processing"
                            ? "bg-blue-900/20 border border-blue-800 text-blue-400"
                            : order.status === "shipped"
                            ? "bg-green-900/20 border border-green-800 text-green-400"
                            : "bg-red-900/20 border border-red-800 text-red-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="px-3 py-1 bg-red-900/20 border border-red-800 text-red-400 text-sm font-semibold rounded hover:bg-red-900/40 transition-all"
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

        <div className="mt-4 text-sm text-gray-400">
          Showing {testOrders.length} test orders
        </div>
      </div>
    </div>
  );
}
