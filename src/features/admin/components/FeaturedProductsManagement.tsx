"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import {
  getProducts,
  featureProduct,
  unfeatureProduct,
} from "@/features/products/data";
import type { Product } from "@/features/products/types";

export default function FeaturedProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts({ page: currentPage, limit: 20 });
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const productId = product.id || product._id;
    setUpdatingId(productId);
    setError(null);

    try {
      if (product.featured) {
        await unfeatureProduct(productId);
      } else {
        await featureProduct(productId);
      }
      // Refreshes the products list
      await fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update product");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const featuredCount = products.filter((p) => p.featured).length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Featured Products
            </span>
          </h1>
          <p className="text-gray-400">
            Manage which products appear in the homepage featured section
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-gray-300">
              <span className="font-bold text-amber-400">{featuredCount}</span>{" "}
              featured products
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 bg-zinc-800 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-zinc-800 rounded mb-4 w-full"></div>
                <div className="h-10 bg-zinc-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const categoryName =
                  typeof product.categoryId === "object" &&
                  product.categoryId !== null
                    ? product.categoryId.name
                    : "Unknown";
                const productId = product.id || product._id;

                return (
                  <div
                    key={productId}
                    className={`bg-zinc-900 border rounded-xl p-6 transition-all ${
                      product.featured
                        ? "border-amber-500/50 bg-amber-500/5"
                        : "border-zinc-800"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{categoryName}</p>
                      </div>
                      {product.featured && (
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400 ml-2 shrink-0" />
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-amber-400">
                        ${product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        disabled={updatingId === productId}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          product.featured
                            ? "bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                            : "bg-zinc-800 border border-zinc-700 text-gray-300 hover:border-amber-500/50 hover:text-amber-400"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updatingId === product._id
                          ? "Updating..."
                          : product.featured
                          ? "Remove Featured"
                          : "Make Featured"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-gray-300 hover:border-amber-500/50 hover:text-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-gray-300 hover:border-amber-500/50 hover:text-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
