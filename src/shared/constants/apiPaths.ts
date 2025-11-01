// Centralized API path constants

export const API_PATHS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/users/me",
  },

  // User endpoints
  USERS: {
    BASE: "/users",
    ME: "/users/me",
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Product endpoints
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    FEATURED: "/products?featured=true",
  },

  // Category endpoints
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
  },

  // Order endpoints
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
  },

  // Health check
  HEALTH: "/health",
} as const;

// Type helpers for type-safe route building
export type ApiPath = typeof API_PATHS;
