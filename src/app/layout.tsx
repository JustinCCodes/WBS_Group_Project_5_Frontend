import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/shared/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Syntax | The Art of Performance",
  description:
    "Experience cutting-edge design and engineering. Syntax builds premium PC components and peripherals to elevate your entire setup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </body>
    </html>
  );
}
