"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { getProducts } from "@/features/products/data";
import { useCart } from "@/features/cart/context/CartProvider";
import type {
  Product,
  Category,
  ProductListProps,
} from "@/features/products/types";
import { getCategoryName } from "@/shared/lib/utils";

// ProductList component
export default function ProductList({
  initialProducts,
  initialTotalPages,
  categories,
}: ProductListProps) {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Updates selected category when categoryId changes
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const category = categories.find((cat) => cat.id === categoryId);
      setSelectedCategory(category || null);
    } else {
      setSelectedCategory(null);
    }
  }, [categoryId, categories]);

  // Fetches products when page or category changes (client side pagination/filtering)
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const productsData = await getProducts({
          categoryId: categoryId || undefined,
          page: currentPage,
          limit: 12,
        });

        setProducts(productsData.data);
        setTotalPages(productsData.pagination.totalPages);
      } catch {
        // Error is handled silently products will remain as initial data
      } finally {
        setLoading(false);
      }
    }

    // Only fetches if not initial load or if page/category changed
    if (currentPage !== 1 || categoryId) {
      fetchProducts();
    }
  }, [categoryId, currentPage]);

  return (
    <div className="bg-black text-white">
      {/* Header Section */}
      <section className="py-12 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {selectedCategory ? (
              <>
                <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                  {selectedCategory.name}
                </span>
              </>
            ) : (
              <>
                <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                  All Products
                </span>
              </>
            )}
          </h1>
          <p className="text-gray-400 text-lg">
            {selectedCategory
              ? `Browse our premium ${selectedCategory.name.toLowerCase()} collection`
              : "Discover our complete range of premium gaming peripherals"}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-zinc-800"></div>
                  <div className="p-6">
                    <div className="h-6 bg-zinc-800 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-zinc-800 rounded mb-4 w-full"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-8 bg-zinc-800 rounded w-1/3"></div>
                      <div className="h-10 bg-zinc-800 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            // Products grid
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 640px"
                          />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                            <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent group-hover:from-amber-500/10 transition-all"></div>
                            <span className="text-gray-600 text-sm font-semibold">
                              {getCategoryName(product)}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-6">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      {/* Stock Badge */}
                      <div className="mb-3">
                        {product.stock > 0 ? (
                          <span className="text-xs text-green-400 font-semibold">
                            {product.stock} in stock
                          </span>
                        ) : (
                          <span className="text-xs text-red-400 font-semibold">
                            Out of stock
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-2xl font-bold text-amber-400">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (product.stock > 0) {
                              addToCart(product);
                            }
                          }}
                          disabled={product.stock === 0}
                          className="px-4 py-2 bg-linear-to-r from-amber-500 to-yellow-600 text-black rounded-lg font-semibold hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.stock === 0 ? "Sold Out" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-gray-300 hover:border-amber-500/50 hover:text-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-gray-300 hover:border-amber-500/50 hover:text-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            // No products found
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl mb-4">
                No products found
                {selectedCategory && ` in ${selectedCategory.name}`}
              </p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-600 transition-all"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
