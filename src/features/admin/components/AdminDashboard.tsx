"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getLowStockProducts } from "@/features/admin/data";
import type { DashboardStats, Product } from "@/features/admin/types";
import Link from "next/link";
import { AlertTriangle, Package } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLowStockProducts = async () => {
      try {
        const data = await getLowStockProducts(10);
        setLowStockProducts(data || []);
      } catch (err) {
        console.error("Failed to load low stock products:", err);
      }
    };

    fetchStats();
    fetchLowStockProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">
          <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
            Admin Dashboard
          </span>
        </h1>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              Total Users
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalUsers}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              Total Products
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalProducts}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              Total Categories
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalCategories}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              Total Orders
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-amber-500/50 transition-all col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-400 mb-2">
              Total Revenue
            </h2>
            <p className="text-4xl font-bold text-amber-400">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="mb-8 bg-red-900/10 border-2 border-red-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-red-400">
                Low Stock Alert
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              The following products have low stock (≤10 items):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id || product._id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-red-500/50 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Package className="w-8 h-8 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-sm font-bold ${
                            product.stock === 0
                              ? "text-red-400"
                              : product.stock <= 5
                              ? "text-orange-400"
                              : "text-yellow-400"
                          }`}
                        >
                          {product.stock === 0
                            ? "OUT OF STOCK"
                            : `${product.stock} left`}
                        </span>
                      </div>
                      <Link
                        href="/admin/products"
                        className="inline-block mt-2 text-xs text-amber-400 hover:text-amber-300"
                      >
                        Update Stock →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/admin/users"
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/orders"
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all"
            >
              Manage Orders
            </Link>
            <Link
              href="/admin/categories"
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all"
            >
              Manage Categories
            </Link>
            <Link
              href="/admin/products"
              className="px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-700 transform hover:scale-105 transition-all"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/featured"
              className="px-6 py-3 bg-amber-500/20 border border-amber-500 text-amber-400 font-semibold rounded-lg hover:bg-amber-500 hover:text-black transform hover:scale-105 transition-all"
            >
              Featured Products
            </Link>
            <Link
              href="/admin/test-orders"
              className="px-6 py-3 bg-zinc-800 border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-zinc-700 hover:text-amber-400 hover:border-amber-500/50 transition-all"
            >
              Test Orders
            </Link>
          </div>
        </div>

        {/* Newest Orders */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Newest Orders</h2>
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
                </tr>
              </thead>
              <tbody>
                {stats.newestOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  stats.newestOrders.map((order) => (
                    <tr
                      key={order.id || order._id}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-sm text-gray-400">
                        {(order.id || order._id || "").slice(-8)}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-semibold text-white">
                            {order.userId.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.userId.email}
                          </div>
                        </div>
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
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
