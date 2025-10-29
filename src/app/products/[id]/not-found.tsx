import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-20">
          <Package className="w-24 h-24 text-zinc-700 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-semibold rounded-lg hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
