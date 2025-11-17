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

## ✨ Key Features

### 🛒 Shopping Experience

- Browse products by category with rich filtering
- Detailed product pages with image galleries
- Persistent shopping cart with real-time stock validation
- Secure checkout with Stripe integration
- Order history and tracking (with actual order numbers)

### 👤 User Management

- JWT authentication with httpOnly cookies
- Profile management and password updates
- Address book with CRUD operations
- Order cancellation and detailed breakdowns

### 🔐 Security & Performance

- **CSRF Protection:** Double-submit cookie pattern
- **Auto Token Refresh:** Seamless renewal with request queuing
- **SSR:** Fast initial page loads with SEO optimization
- **ISR:** Home, Products, and Product pages revalidate hourly
- **Error Boundaries:** Graceful error handling throughout

### 🎨 User Experience

- Mobile-first responsive design
- Smooth SPA-like client-side navigation
- Skeleton screens and loading states
- Real-time toast notifications
- Keyboard-accessible modals (Escape, outside click, X button)

---

## 📁 Project Structure

```
ecommerce-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── not-found.tsx
│   │   │       └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   ├── features/               # Feature-based modules
│   │   ├── about/
│   │   │   ├── data.ts
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── components/
│   │   │       └── AboutPage.tsx
│   │   ├── auth/
│   │   │   ├── data.server.ts
│   │   │   ├── data.ts
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   ├── components/
│   │   │   │   ├── BanNotificationModal.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   └── context/
│   │   │       └── AuthProvider.tsx
│   │   ├── cart/
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   ├── components/
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   └── CartPage.tsx
│   │   │   └── context/
│   │   │       └── CartProvider.tsx
│   │   │   └── utils/
│   │   │       └── stockValidation.ts
│   │   ├── home/
│   │   │   ├── index.ts
│   │   │   └── components/
│   │   │       └── HomePage.tsx
│   │   ├── orders/
│   │   │   ├── data.ts
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── components/
│   │   │       └── OrdersPage.tsx
│   │   ├── products/
│   │   │   ├── data.server.ts
│   │   │   ├── data.ts
│   │   │   ├── index.ts
│   │   │   ├── types.ts
│   │   │   └── components/
│   │   │       ├── ProductDetail.tsx
│   │   │       └── ProductList.tsx
│   └── shared/                 # Shared utilities
│       ├── components/
│       │   ├── ErrorBoundary.tsx
│       │   └── layout/
│       │       ├── Footer.tsx
│       │       ├── InfoModal.tsx
│       │       └── Navbar.tsx
│       │       └── InfoModal.tsx
│       ├── constants/
│       │   └── apiPaths.ts
│       ├── context/
│       │   └── ModalProvider.tsx
│       ├── lib/
│       │   ├── api-server.ts
│       │   ├── api.ts
│       │   └── utils.ts
│       └── types/
│           └── types.ts
├── public/
│   └── Company_Logo.png
├── scripts/
│   └── wait-and-start-tauri.sh
├── .env.local.example
├── package.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

**Architecture Principles:**

- Feature-based organization by business domain
- Clear client/server component separation
- Barrel imports for cleaner code
- Centralized types and data fetching logic

---

## 🛠️ Getting Started

### Prerequisites

- Node.js v20+
- npm v10+
- Running [backend server](https://github.com/JustinCCodes/WBS_Group_Project_5_Backend)

### Installation

1. **Clone and install:**

   ```bash
   cd ecommerce-frontend
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.local.example .env.local
   ```

3. **Edit `.env.local`:**

   ```bash
   # Client-side (browser-exposed)
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_AUTH_SERVER_URL=http://localhost:8001/api/v1/auth

   # Server-side (SSR only)
   API_BASE_URL=http://localhost:8000/api/v1
   AUTH_SERVER_URL=http://localhost:8001/api/v1/auth
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Open:** `http://localhost:3000`

---

## 📜 Available Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start dev server (port 3000)     |
| `npm run build` | Build for production             |
| `npm start`     | Start production server          |
| `npm run lint`  | Run ESLint                       |
| `npm run tauri` | Run Tauri desktop app (optional) |

---

## 🔌 API Integration

### Proxy Architecture

All API calls route through Next.js API routes to avoid CORS:

```
Client → /api/products → http://localhost:8000/api/v1/products
```

### Dual API Clients

**Client-Side (`api.ts`)**

- Used in Client Components
- Automatic token refresh on 401
- CSRF token attachment
- Ban detection

**Server-Side (`api-server.ts`)**

- Used in Server Components/SSR
- Public data only (no cookies)
- Production environment validation

---

## 🔐 Authentication Flow

1. User logs in → JWT stored in httpOnly cookie
2. Client requests include cookie automatically
3. Token refreshed before expiry (queued requests)
4. Protected routes require valid token
5. Logout clears token and redirects home

**Ban Detection:** Users receive friendly notification if account is banned

---

## 🛒 Cart Management

**Implementation:**

```typescript
const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
```

**Features:**

- localStorage persistence
- Real-time stock validation
- Dynamic price calculations
- One-click item removal

---

## 🎨 Design System

**Tailwind CSS 4 Theme:**

- **Colors:** Amber/Yellow primary, Zinc grayscale
- **Typography:** Roboto font family
- **Spacing:** 4px base grid
- **Approach:** Utility-first, mobile-first

---

## 🚢 Deployment

### Vercel (Recommended)

1. Import repository to Vercel
2. Add environment variables from `.env.local`
3. Update URLs to production backend
4. Deploy with `vercel --prod`

### Manual Build

```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting

| Issue                    | Solution                                                       |
| ------------------------ | -------------------------------------------------------------- |
| Can't connect to backend | Verify backend is running and `.env.local` URLs are correct    |
| Authentication fails     | Clear cookies/localStorage, check backend JWT configuration    |
| Cart not persisting      | Enable localStorage in browser, verify cart key in provider    |
| Build errors             | Delete `.next` folder, run `npm install`, check `npm run lint` |

---

## 🔗 Related Projects

- **Backend API:** [ecommerce-backend](https://github.com/JustinCCodes/WBS_Group_Project_5_Backend)
- **Admin Dashboard:** [ecommerce-admin](https://github.com/JustinCCodes/WBS_Group_Project_5_Admin_Dashboard)

---

## 👨‍💻 Author

**Justin Sturm**

- [GitHub](https://github.com/JustinCCodes)
- [LinkedIn](https://www.linkedin.com/in/sturmjustin/)

---

## 📄 License

Private project for educational purposes.
