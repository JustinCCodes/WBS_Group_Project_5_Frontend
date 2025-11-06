"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Package, Shield, Truck } from "lucide-react";
import { useCart } from "@/features/cart/context/CartProvider";
import type { ProductDetailProps } from "@/features/products/types";
import { getCategoryName } from "@/shared/lib/utils";

// ProductDetail component
export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="relative max-w-2xl mx-auto w-full">
            <div className="aspect-square bg-linear-to-br from-zinc-900 to-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center overflow-hidden group relative">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 to-transparent"></div>
                  <Package className="w-32 h-32 text-zinc-700" />
                </div>
              )}
            </div>

            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-4 right-4 px-4 py-2 bg-amber-500 text-black font-bold rounded-lg shadow-lg">
                Featured
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6 pb-32 lg:pb-6">
            {/* Category Badge */}
            <div className="inline-block px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-amber-400 text-sm font-semibold">
              {getCategoryName(product)}
            </div>

            {/* Product Name */}
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                {product.name}
              </span>
            </h1>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-400 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-bold text-amber-400 mb-4">
                Product Specifications
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Product ID</span>
                <span className="text-white font-mono">
                  {product.id.slice(-8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <span className="text-white">{getCategoryName(product)}</span>
              </div>
              {product.createdAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Added</span>
                  <span className="text-white">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 z-40 lg:z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left Section - Price & Availability */}
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Price</div>
                  <div className="text-3xl font-bold text-amber-400">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                <div className="h-12 w-px bg-zinc-800"></div>
                <div className="flex items-center gap-2">
                  {product.stock > 0 ? (
                    <>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400 font-semibold">
                        {product.stock} in Stock
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-sm text-red-400 font-semibold">
                        Out of Stock
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Middle Section - Quick Info (Hidden on mobile) */}
              <div className="hidden lg:flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>Ships in 1-2 Days</span>
                </div>
              </div>

              {/* Right Section - Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="flex-1 md:flex-none px-8 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transition-all shadow-lg hover:shadow-amber-500/50 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  disabled={product.stock === 0}
                  className="hidden md:block px-8 py-3 border-2 border-zinc-700 text-gray-300 font-semibold rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
