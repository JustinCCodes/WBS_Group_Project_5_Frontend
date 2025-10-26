import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/shared/components/layout/Navbar";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

export const metadata: Metadata = {
  title: "Syntax | The Art of Performance",
  description:
    "Experience cutting-edge design and engineering. Syntax builds premium peripherals to elevate your entire setup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <AuthProvider>
          <Navbar />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
