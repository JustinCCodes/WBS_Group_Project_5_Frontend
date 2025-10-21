import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech E-Commerce",
  description: "Buy the best tech products online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
