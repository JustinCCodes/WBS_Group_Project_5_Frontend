### 1. Admin Service (`src/features/admin/services/adminClient.ts`)

This file handles all API calls for the admin dashboard:

- `getDashboardStats()` - Fetches all statistics for the dashboard
- `getAllUsers()` - Gets paginated list of users
- `getAllOrders()` - Gets paginated list of orders with filters
- `getAllCategories()` - Gets all categories
- `updateOrderStatus()` - Updates order status (admin)
- `deleteUser()` - Deletes a user (admin)
- `updateUser()` - Updates user information (admin)

### 2. Dashboard Component (`src/features/admin/components/AdminDashboard.tsx`)

The main dashboard component displays:

- **Statistics Cards:**

  - Total Users
  - Total Products
  - Total Categories
  - Total Orders
  - Total Revenue (calculated from all orders)

- **Quick Links:**

  - Manage Users
  - Manage Orders
  - Manage Categories

- **Newest Orders Table:**
  - Shows the 10 most recent orders
  - Displays Order ID, Customer info, Total, Status, and Date

### 3. Route Pages

- `/admin/dashboard` - Main admin dashboard
- `/admin/users` - Placeholder for user management
- `/admin/orders` - Placeholder for order management
- `/admin/categories` - Placeholder for category management

## Features

### Dashboard Statistics

The dashboard fetches and displays:

1. **Total Registered Users** - Count from `/admin/users` endpoint
2. **Total Products** - Count from `/products` endpoint
3. **Total Categories** - Count from `/categories` endpoint
4. **Total Orders** - Count from `/admin/orders` endpoint
5. **Total Revenue** - Sum of all order totals
6. **Newest Orders** - 10 most recent orders with details

## API Endpoints Used

- `GET /api/admin/users` - Get all users (requires admin auth)
- `GET /api/products` - Get all products (public)
- `GET /api/categories` - Get all categories (public)
- `GET /api/admin/orders` - Get all orders (requires admin auth)

## How to Access

Navigate to `/admin/dashboard` in your application to see the dashboard.

**Note:** Make sure you're logged in as an admin user, as these endpoints require admin authentication.
