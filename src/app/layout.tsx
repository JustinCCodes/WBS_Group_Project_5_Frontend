import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/shared/components/layout/Navbar";
import Footer from "@/shared/components/layout/Footer";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { CartProvider } from "@/features/cart/context/CartProvider";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { getCategoriesServer } from "@/features/products/data.server";

export const metadata: Metadata = {
  title: "Syntax | Online Shop",
  description:
    "Experience cutting-edge design and engineering. Syntax builds premium peripherals to elevate your entire setup.",
  icons: {
    icon: "/ChatGPT Image 29. Okt. 2025, 15_49_39.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetches categories on server using server side API client
  // This ensures navbar always has data and prevents flickering
  const categories = await getCategoriesServer();

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar categories={categories} />
            <CartDrawer />
            <div className="rgb-border"></div>
            <main className="min-h-screen">{children}</main>
            <div className="rgb-border"></div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
