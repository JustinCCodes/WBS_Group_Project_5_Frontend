import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CartProvider } from "@/features/cart/context/CartProvider";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { getCategoriesServer } from "@/features/products/data.server";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Syntax | Online Shop",
  description:
    "Experience cutting-edge design and engineering. Syntax builds premium peripherals to elevate your entire setup.",
  icons: {
    icon: "/Company_Logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch categories for navbar
  const categories = await getCategoriesServer();

  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#18181b",
                    color: "#fff",
                    border: "1px solid #27272a",
                  },
                  success: {
                    iconTheme: {
                      primary: "#f59e0b",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />
              <Navbar categories={categories} />
              <CartDrawer />
              <div className="rgb-border"></div>
              <main className="flex-1">{children}</main>
              <div className="rgb-border"></div>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
