import api from "@/shared/lib/api";
import { DashboardStats, Order } from "./types";

// Dashboard API Functions
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetches all required data
    const [usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all(
      [
        api.get("/admin/users?limit=1000"), // Gets all users
        api.get("/products?limit=1000"), // Gets all products (public endpoint)
        api.get("/categories"), // Gets all categories (public endpoint)
        api.get("/admin/orders?limit=10&page=1"), // Gets first 10 orders
      ]
    );

    const users = usersRes.data.data || [];
    const products = productsRes.data.data || [];
    const categories = categoriesRes.data || [];
    const orders = ordersRes.data.data || [];

    // Calculates total revenue from all orders
    const allOrdersRes = await api.get("/admin/orders?limit=1000");
    const allOrders = allOrdersRes.data.data || [];
    const totalRevenue = allOrders.reduce(
      (sum: number, order: Order) => sum + order.total,
      0
    );

    return {
      totalUsers: usersRes.data.pagination?.total || users.length,
      totalProducts: productsRes.data.pagination?.total || products.length,
      totalCategories: categories.length,
      totalOrders: ordersRes.data.pagination?.total || 0,
      totalRevenue,
      newestOrders: orders.slice(0, 10), // Get the 10 newest orders
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

// Users API Functions
export const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string; role?: string }
) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Orders API Functions
export const getAllOrders = async (
  page = 1,
  limit = 10,
  filters?: { userId?: string; status?: string }
) => {
  try {
    let url = `/admin/orders?page=${page}&limit=${limit}`;
    if (filters?.userId) url += `&userId=${filters.userId}`;
    if (filters?.status) url += `&status=${filters.status}`;

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Categories API Functions
export const getAllCategories = async () => {
  try {
    // Uses admin endpoint to get categories with full metadata
    const response = await api.get("/admin/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
