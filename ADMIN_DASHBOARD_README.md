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
- `/admin/users` - User management with search, filtering, ban/unban, role changes, and deletion
- `/admin/orders` - Order management with search, filtering, status updates, and deletion
- `/admin/categories` - Category management with create, edit, and delete operations
- `/admin/products` - Product management (placeholder)
- `/admin/test-orders` - Test order creation and management for testing purposes

## Features

### Dashboard Statistics

The dashboard fetches and displays:

1. **Total Registered Users** - Count from `/admin/users` endpoint
2. **Total Products** - Count from `/products` endpoint
3. **Total Categories** - Count from `/categories` endpoint
4. **Total Orders** - Count from `/admin/orders` endpoint
5. **Total Revenue** - Sum of all order totals
6. **Newest Orders** - 10 most recent orders with details

### User Management

The user management page (`/admin/users`) provides:

- **User List** - View all registered users with details
- **Search** - Search users by email or ID
- **Filter** - Filter by role (admin/user) and status (active/banned)
- **Sort** - Sort by name, email, or registration date
- **Role Management** - Change user roles between user and admin
- **Ban/Unban Users** - Ban users with reason and optional expiration date
- **Delete Users** - Remove users from the system
- **Auto-refresh** - Automatically updates every 30 seconds

### Order Management

The order management page (`/admin/orders`) provides:

- **Order List** - View all orders with customer and product details
- **Search** - Search orders by customer name, email, or order ID
- **Filter** - Filter by order status (pending, processing, shipped, delivered, cancelled)
- **Date Range Filter** - Filter orders by date range
- **Sort** - Sort by date (newest/oldest first)
- **Status Updates** - Change order status through dropdown
- **Order Details** - View full order details including all products
- **Delete Orders** - Remove orders from the system
- **Auto-refresh** - Automatically updates every 10 seconds

### Category Management

The category management page (`/admin/categories`) provides:

- **Category List** - View all product categories
- **Create Category** - Add new categories
- **Edit Category** - Update existing category names
- **Delete Category** - Remove categories from the system
- **Search** - Search categories by name
- **Sort** - Sort by name or creation date
- **Auto-refresh** - Automatically updates every 30 seconds

### Test Order Management

The test order management page (`/admin/test-orders`) provides:

- **Test Order Creation** - Create test orders for testing purposes
- **User Selection** - Select which user to create the order for
- **Product Selection** - Add multiple products with quantities
- **Status Selection** - Set initial order status
- **Order List** - View all test orders
- **Delete Test Orders** - Remove test orders
- **Auto-refresh** - Automatically updates every 30 seconds

## API Endpoints Used

### Dashboard

- `GET /api/admin/users` - Get all users (requires admin auth)
- `GET /api/products` - Get all products (public)
- `GET /api/categories` - Get all categories (public)
- `GET /api/admin/orders` - Get all orders (requires admin auth)

### User Management

- `GET /api/admin/users` - Get paginated list of users
- `GET /api/admin/users/search?email={email}&id={id}` - Search users
- `PUT /api/admin/users/{id}` - Update user information
- `PUT /api/admin/users/{id}/ban` - Ban user with reason and duration
- `PUT /api/admin/users/{id}/unban` - Unban user
- `DELETE /api/admin/users/{id}` - Delete user

### Order Management

- `GET /api/admin/orders` - Get paginated list of orders
- `PUT /api/admin/orders/{id}/status` - Update order status
- `DELETE /api/admin/orders/{id}` - Delete order

### Category Management

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Test Order Management

- `GET /api/admin/test-orders` - Get all test orders
- `POST /api/admin/test-orders` - Create test order
- `DELETE /api/admin/test-orders/{id}` - Delete test order

## How to Access

Navigate to `/admin/dashboard` in your application to see the dashboard.

**Note:** Make sure you're logged in as an admin user, as these endpoints require admin authentication.
