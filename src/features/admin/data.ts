import api from "@/shared/lib/api";
import { DashboardStats, Order } from "./types";

// Dashboard API Functions
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetches all required data
    const [usersRes, productsRes, categoriesRes, ordersRes] = await Promise.all(
      [
        api.get("/admin/users?limit=1000"), // Gets all users
        api.get("/products?limit=1000"), // Gets all products (public)
        api.get("/categories"), // Gets all categories (public)
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

export const createCategory = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const updateCategory = async (
  categoryId: string,
  data: { name: string; description?: string }
) => {
  const response = await api.put(`/categories/${categoryId}`, data);
  return response.data;
};

export const deleteCategory = async (categoryId: string) => {
  await api.delete(`/categories/${categoryId}`);
};

// Products API Functions
export const getAllProducts = async () => {
  const response = await api.get("/products?limit=1000");
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post("/products", data);
  return response.data;
};

export const updateProduct = async (productId: string, data: any) => {
  const response = await api.put(`/products/${productId}`, data);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  await api.delete(`/products/${productId}`);
};

export const updateProductStock = async (productId: string, stock: number) => {
  await api.put(`/admin/products/${productId}/stock`, { stock });
};

export const getLowStockProducts = async (threshold: number = 10) => {
  const response = await api.get(
    `/admin/products/low-stock?threshold=${threshold}`
  );
  return response.data;
};

// Orders API Functions (additional)
export const deleteOrder = async (orderId: string) => {
  await api.delete(`/admin/orders/${orderId}`);
};

// Users API Functions (additional)
export const banUser = async (
  userId: string,
  data: { reason: string; bannedUntil?: string; isPermanent?: boolean }
) => {
  await api.put(`/admin/users/${userId}/ban`, data);
};

export const unbanUser = async (userId: string) => {
  await api.put(`/admin/users/${userId}/unban`);
};

export const searchUsers = async (searchTerm: string) => {
  const response = await api.get(
    `/admin/users/search?email=${searchTerm}&id=${searchTerm}&limit=1000`
  );
  return response.data;
};

// Test Orders API Functions
export const createTestOrder = async (data: {
  userId: string;
  products: { productId: string; quantity: number }[];
  status: string;
}) => {
  const response = await api.post("/admin/test-orders", data);
  return response.data;
};

export const getAllTestOrders = async () => {
  const response = await api.get("/admin/test-orders?limit=1000");
  return response.data;
};

export const deleteTestOrder = async (orderId: string) => {
  await api.delete(`/admin/test-orders/${orderId}`);
};

// Cloudinary Image Upload Function (Direct Upload)
export const uploadImageToCloudinary = async (
  file: File
): Promise<{ imageUrl: string; imagePublicId: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
  );
  formData.append("folder", "products");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error(
      "Cloudinary cloud name not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env.local file."
    );
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error?.message || "Failed to upload image to Cloudinary"
    );
  }

  const data = await response.json();

  return {
    imageUrl: data.secure_url,
    imagePublicId: data.public_id,
  };
};
