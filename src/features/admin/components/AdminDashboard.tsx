"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/features/admin/data";
import type { DashboardStats } from "@/features/admin/types";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
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

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Users</h2>
            <p className="text-4xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Products</h2>
            <p className="text-4xl font-bold">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Categories</h2>
            <p className="text-4xl font-bold">{stats.totalCategories}</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Total Orders</h2>
            <p className="text-4xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl col-span-1 md:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Total Revenue</h2>
            <p className="text-4xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link href="/admin/orders" className="btn btn-primary">
            Manage Orders
          </Link>
          <Link href="/admin/categories" className="btn btn-primary">
            Manage Categories
          </Link>
          <Link href="/admin/products" className="btn btn-primary">
            Manage Products
          </Link>
          <Link
            href="/admin/test-orders"
            className="btn btn-outline btn-secondary"
          >
            Test Orders
          </Link>
        </div>
      </div>

      {/* Newest Orders */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Newest Orders</h2>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.newestOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    No orders found
                  </td>
                </tr>
              ) : (
                stats.newestOrders.map((order) => (
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
