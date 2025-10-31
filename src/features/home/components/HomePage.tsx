"use client";
import Link from "next/link";
import {
  Headphones,
  Mouse,
  Keyboard,
  Gamepad2,
  Armchair,
  RectangleHorizontal,
  Shield,
  Truck,
  Zap,
  Headset,
} from "lucide-react";
import type { Product, Category } from "@/features/products/types";

interface HomePageProps {
  categories: Category[];
  featuredProducts: Product[];
}

// Icon mapping for categories
const categoryIconMap: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  headsets: Headphones,
  headset: Headphones,
  mice: Mouse,
  mouse: Mouse,
  keyboards: Keyboard,
  keyboard: Keyboard,
  "mouse mats": RectangleHorizontal,
  "mouse mat": RectangleHorizontal,
  mousepad: RectangleHorizontal,
  mousepads: RectangleHorizontal,
  controllers: Gamepad2,
  controller: Gamepad2,
  chairs: Armchair,
  chair: Armchair,
};

const trustIndicators = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $50" },
  { icon: Shield, title: "2-Year Warranty", description: "Premium protection" },
  { icon: Zap, title: "Pro-Grade Quality", description: "Tournament approved" },
  { icon: Headset, title: "24/7 Support", description: "Expert assistance" },
];

// Gets icon for category name
function getCategoryIcon(
  categoryName: string
): React.ComponentType<{ className?: string }> {
  const normalized = categoryName.toLowerCase().trim();
  return categoryIconMap[normalized] || Keyboard; // Default to keyboard icon
}

export default function HomePage({
  categories,
  featuredProducts,
}: HomePageProps) {
  // Gets category name from product
  const getCategoryName = (product: Product): string => {
    if (typeof product.categoryId === "object" && product.categoryId !== null) {
      return product.categoryId.name;
    }
    return "Product";
  };
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Static background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-black via-zinc-900 to-black"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-linear-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-semibold tracking-wider">
              PRO-GRADE PERIPHERALS
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
            Elevate Your Game
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Precision-engineered peripherals trusted by professionals.
            Experience the perfect blend of performance and luxury.
          </p>

          <div className="flex justify-center items-center">
            <Link
              href="/products"
              className="group relative px-8 py-4 bg-linear-to-r from-amber-500 to-yellow-600 rounded-lg font-semibold text-black text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(218,165,32,0.5)]"
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-linear-to-r from-yellow-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">
                100K+
              </div>
              <div className="text-sm text-gray-500 mt-1">Pro Gamers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">
                50+
              </div>
              <div className="text-sm text-gray-500 mt-1">Countries</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-amber-400">
                5-Star
              </div>
              <div className="text-sm text-gray-500 mt-1">Rated</div>
            </div>
          </div>
        </div>
      </section>

      {/* RGB Border */}
      <div className="rgb-border"></div>

      {/* Categories Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                Shop by Category
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Discover premium peripherals tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.length > 0 ? (
              // Real categories from API
              categories.map((category) => {
                const IconComponent = getCategoryIcon(category.name);
                const categoryId = category._id || category.id;
                return (
                  <Link
                    key={categoryId}
                    href={`/products?categoryId=${categoryId}`}
                    className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-linear-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-transparent transition-all duration-300"></div>

                    <div className="relative z-10 text-center md:text-left">
                      <div className="w-16 h-16 bg-linear-to-br from-amber-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto md:mx-0">
                        <IconComponent className="w-8 h-8 text-amber-400" />
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-gray-500 text-sm mb-4">
                        Premium {category.name.toLowerCase()} for professionals
                      </p>

                      <div className="flex items-center justify-center md:justify-start text-amber-400 text-sm font-semibold">
                        Explore
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              // No categories message
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  Categories coming soon! Check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RGB Border */}
      <div className="rgb-border"></div>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Handpicked by professionals, loved by gamers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link
                  key={product.id || product._id}
                  href={`/products/${product.id || product._id}`}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300"
                >
                  {/* Product image placeholder */}
                  <div className="aspect-square bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-transparent group-hover:from-amber-500/10 transition-all"></div>
                    <span className="text-gray-600 text-sm font-semibold">
                      {getCategoryName(product)}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-400">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-lg text-amber-400 text-sm font-semibold group-hover:bg-amber-500 group-hover:text-black transition-all">
                        View
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // No featured products message
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No featured products yet.
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block px-8 py-4 border-2 border-amber-500/50 rounded-lg font-semibold text-amber-400 hover:bg-amber-500/10 transition-all duration-300 hover:border-amber-500"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* RGB Border */}
      <div className="rgb-border"></div>

      {/* Trust Indicators */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((indicator) => {
              const IconComponent = indicator.icon;
              return (
                <div key={indicator.title} className="text-center group">
                  <div className="w-20 h-20 bg-linear-to-br from-amber-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {indicator.title}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {indicator.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RGB Border */}
      <div className="rgb-border"></div>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/10 via-yellow-600/10 to-amber-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(218,165,32,0.15),transparent_70%)]"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
              Level Up?
            </span>
          </h2>
          <p className="text-gray-400 text-xl mb-8">
            Join thousands of professionals who trust our premium peripherals
          </p>
          <Link
            href="/products"
            className="inline-block px-10 py-5 bg-linear-to-r from-amber-500 to-yellow-600 rounded-lg font-bold text-black text-lg hover:scale-105 transition-all duration-300 hover:shadow-[0_0_40px_rgba(218,165,32,0.6)]"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
