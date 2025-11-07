# 🛍️ E-Commerce Frontend

A modern, high-performance e-commerce customer-facing application built with Next.js 15, React 19, and TypeScript 5. Features a sleek shopping experience with cart management, order tracking, and user authentication.

---

## 🚀 Tech Stack

- **Framework:** Next.js 15.5.6 (App Router)
- **UI Library:** React 19.1.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **HTTP Client:** Axios 1.12.2
- **Validation:** Zod 4.1.12
- **Icons:** Lucide React 0.548.0
- **Notifications:** React Hot Toast 2.6.0
- **Desktop Support:** Tauri 2.9 (optional)

---

## ✨ Features

### 🛒 Customer Shopping Experience

- **Product Browsing:** Browse products by category with rich filtering
- **Product Details:** Detailed product pages with image galleries and descriptions
- **Shopping Cart:** Persistent cart with real-time stock validation
- **Checkout:** Secure order placement with Stripe integration
- **Order Tracking:** View order history and status updates

### 🔐 Authentication & Security

- **JWT Authentication:** Secure token-based auth with httpOnly cookies
- **CSRF Protection:** Double-submit cookie pattern for all state-changing requests
- **Automatic Token Refresh:** Seamless token renewal with queued request handling
- **Ban Detection:** User-friendly notifications when accounts are banned
- **Error Boundaries:** Graceful error handling to prevent app crashes

### 🎨 User Experience

- **Server-Side Rendering (SSR):** Fast initial page loads with SEO optimization
- **Client-Side Navigation:** Smooth SPA-like transitions
- **Responsive Design:** Mobile-first, works on all screen sizes
- **Toast Notifications:** Non-blocking feedback for user actions
- **Loading States:** Skeleton screens and loading indicators
- **Accessibility:** WCAG compliant with proper ARIA labels

### 🏗️ Architecture

- **Feature-Based Structure:** Organized by business domain
- **Clean Separation:** Client/Server component patterns
- **Type Safety:** Full TypeScript coverage with Zod validation
- **Reusable Components:** DRY principles with shared utilities
- **Error Handling:** Centralized error management

---

## 📁 Project Structure

```
ecommerce-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About page
│   │   ├── cart/               # Shopping cart page
│   │   ├── login/              # Login page
│   │   ├── orders/             # Order history page
│   │   ├── products/           # Product listing & details
│   │   └── register/           # Registration page
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication feature
│   │   │   ├── components/     # Login, Register, BanModal
│   │   │   ├── context/        # AuthProvider
│   │   │   ├── data.ts         # API calls (client)
│   │   │   └── types.ts        # Auth types
│   │   │
│   │   ├── cart/               # Shopping cart feature
│   │   │   ├── components/     # CartDrawer, CartItem
│   │   │   ├── context/        # CartProvider
│   │   │   ├── utils/          # Stock validation
│   │   │   └── types.ts        # Cart types
│   │   │
│   │   ├── products/           # Product catalog feature
│   │   │   ├── components/     # ProductList, ProductDetail
│   │   │   ├── data.ts         # API calls (client)
│   │   │   ├── data.server.ts  # API calls (server)
│   │   │   └── types.ts        # Product types
│   │   │
│   │   ├── orders/             # Order management feature
│   │   │   ├── components/     # OrdersPage, OrderItem
│   │   │   ├── data.ts         # API calls
│   │   │   └── types.ts        # Order types
│   │   │
│   │   └── home/               # Homepage feature
│   │       └── components/     # HomePage, Hero
│   │
│   └── shared/                 # Shared resources
│       ├── components/         # Reusable UI components
│       │   ├── layout/         # Navbar, Footer
│       │   └── ErrorBoundary.tsx
│       │
│       ├── lib/                # Core utilities
│       │   ├── api.ts          # Client-side API client
│       │   ├── api-server.ts   # Server-side API client
│       │   └── utils.ts        # Helper functions
│       │
│       ├── constants/          # App constants
│       │   └── apiPaths.ts     # API route definitions
│       │
│       └── types/              # Shared types
│           └── types.ts        # Common interfaces
│
├── public/                     # Static assets
│   └── Company_Logo.png
│
├── .env.local.example          # Environment variable template
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js:** v20 or higher
- **npm:** v10 or higher
- **Backend:** The [ecommerce-backend](https://github.com/JustinCCodes/WBS_Group_Project_5_Backend) must be running

### Installation

1. **Clone the repository:**

   ```bash
   cd ecommerce-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.local.example .env.local
   ```

4. **Edit `.env.local` with your configuration:**

   ```bash
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:8001/api/v1/auth

   # SSR Fallbacks
   API_BASE_URL=http://localhost:8000/api/v1
   AUTH_SERVER_URL=http://localhost:8001/api/v1/auth
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open your browser:**
   ```
   http://localhost:3000
   ```

---

## 📜 Available Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start development server on port 3000 |
| `npm run build` | Build production-ready application    |
| `npm start`     | Start production server               |
| `npm run lint`  | Run ESLint for code quality           |
| `npm run tauri` | Run Tauri desktop app (optional)      |

---

## 🔌 API Integration

### Proxy Configuration

The frontend uses Next.js API routes as a proxy to avoid CORS issues:

```typescript
// All API calls go through /api/* which proxies to backend
Client → /api/products → http://localhost:8000/api/v1/products
```

### API Client Configuration

**Client-Side (`api.ts`):**

- Used in client components
- Automatic token refresh on 401
- CSRF token attachment
- Ban detection

**Server-Side (`api-server.ts`):**

- Used in Server Components and SSR
- No cookies/tokens (public data only)
- Production environment validation

---

## 🔐 Authentication Flow

1. **Login/Register:** User credentials sent to `/auth/login` or `/users`
2. **Token Storage:** httpOnly cookie set by backend (secure)
3. **Automatic Refresh:** Token refreshed before expiry
4. **Protected Routes:** Cart, Orders, Profile require authentication
5. **Logout:** Token cleared, user redirected to homepage

---

## 🛒 Shopping Cart

### Features

- **Persistent Storage:** Cart saved to localStorage
- **Stock Validation:** Real-time inventory checks
- **Quantity Controls:** Increase/decrease with stock limits
- **Remove Items:** One-click item removal
- **Total Calculation:** Dynamic price updates

### Implementation

```typescript
// Cart context provides global state
const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
```

---

## 🎨 Styling

### Tailwind CSS 4

- **Utility-First:** Rapid UI development
- **Custom Theme:** Consistent brand colors
- **Responsive:** Mobile-first breakpoints

### Design System

- **Colors:** Amber/Yellow primary, Zinc grayscale
- **Typography:** Roboto font family
- **Spacing:** 4px base grid system
- **Shadows:** Subtle elevation layers

---

## 🔧 Environment Variables

| Variable                      | Purpose                           | Example                             |
| ----------------------------- | --------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`    | Client-side API base URL          | `http://localhost:8000/api/v1`      |
| `NEXT_PUBLIC_AUTH_SERVER_URL` | Client-side auth server URL       | `http://localhost:8001/api/v1/auth` |
| `API_BASE_URL`                | Server-side API base URL (SSR)    | `http://localhost:8000/api/v1`      |
| `AUTH_SERVER_URL`             | Server-side auth server URL (SSR) | `http://localhost:8001/api/v1/auth` |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect Repository:**

   - Import project to Vercel
   - Connect GitHub repository

2. **Configure Environment Variables:**

   - Add all `.env.local` variables to Vercel
   - Set production URLs for backend

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Build for Production

```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting

### Common Issues

**1. "Cannot connect to backend"**

- Ensure backend is running on port 8000/8001
- Check `.env.local` URLs are correct
- Verify CORS settings in backend

**2. "Authentication not working"**

- Clear browser cookies and localStorage
- Check backend JWT secret is set
- Verify httpOnly cookies are enabled

**3. "Cart not persisting"**

- Check browser localStorage is enabled
- Clear localStorage and try again
- Verify cart key matches in CartProvider

**4. "Build errors"**

- Run `npm install` to ensure dependencies are up to date
- Delete `.next` folder and rebuild
- Check for TypeScript errors with `npm run lint`

---

## 📝 Code Style

- **TypeScript:** Strict mode enabled
- **ESLint:** Next.js recommended config
- **Formatting:** Consistent spacing and indentation
- **Naming:** camelCase for variables, PascalCase for components
- **Comments:** Clear, concise explanations for complex logic

---

## 🔗 Related Repositories

- **Backend API:** [ecommerce-backend](https://github.com/JustinCCodes/WBS_Group_Project_5_Backend)
- **Admin Dashboard:** [ecommerce-admin](https://github.com/JustinCCodes/WBS_Group_Project_5_Admin_Dashboard)

---

## 📄 License

Private project for educational purposes.

---

## � Project

**Justin Sturm**

- **GitHub** - [GitHub](https://github.com/JustinCCodes)
- **LinkedIn**: [LinkedIn](https://www.linkedin.com/in/sturmjustin/)

---
