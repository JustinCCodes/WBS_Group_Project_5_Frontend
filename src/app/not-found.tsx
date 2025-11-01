import Link from "next/link";
import { Package } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative bg-black text-white flex items-center justify-center py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-900 to-black"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <Package className="w-24 h-24 text-zinc-700 mx-auto mb-6" />
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
          404 - Page Not Found
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Sorry, the page you are looking for does not exist.
          <br />
          Return to the homepage or explore our products.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-linear-to-r from-amber-500 to-yellow-600 rounded-lg font-semibold text-black text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)]"
          >
            <span className="relative z-10">Go to Homepage</span>
            <div className="absolute inset-0 bg-linear-to-r from-yellow-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
          <Link
            href="/products"
            className="group relative px-8 py-4 bg-zinc-800 border border-zinc-700 rounded-lg font-semibold text-white text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-amber-500"
          >
            <span className="relative z-10">Browse Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
