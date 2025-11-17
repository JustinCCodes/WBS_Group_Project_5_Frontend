import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth";
import { CartProvider, CartDrawer } from "@/features/cart";
import { getCategoriesServer } from "@/features/products";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { ModalProvider } from "@/shared/context";
import { Navbar, Footer, InfoModal } from "@/shared/components";

// Metadata for the entire application
export const metadata: Metadata = {
  title: "Syntax | Online Shop",
  icons: {
    icon: "/Company_Logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetches categories for navbar and footer
  const categories = await getCategoriesServer();

  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <ModalProvider>
                <Toaster
                  position="bottom-center"
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
                <InfoModal />
                <div className="rgb-border"></div>
                <main className="flex-1">{children}</main>
                <div className="rgb-border"></div>
                <Footer categories={categories} />
              </ModalProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
