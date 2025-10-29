"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { useCart } from "@/features/cart/context/CartProvider";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import type { Category } from "@/features/products/types";

interface NavbarProps {
  categories: Category[];
}

export default function Navbar({ categories }: NavbarProps) {
  const { user, loading, logout } = useAuth();
  const { cart, openDrawer } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null); // Closes profile dropdown on outside click

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/ChatGPT Image 29. Okt. 2025, 15_49_39.png"
              alt="Syntax Logo"
              width={160}
              height={53}
              className="h-14 w-auto transition-transform group-hover:scale-105"
              priority
            />
            <div className="hidden sm:block w-1 h-6 bg-amber-500 rounded-full group-hover:h-8 transition-all"></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category._id || category.id}
                href={`/products?categoryId=${category._id || category.id}`}
                className="text-gray-300 hover:text-amber-400 transition-colors font-medium capitalize"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
            >
              About
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons */}
            {!loading && !user && (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-bold bg-linear-to-r from-amber-500 to-yellow-600 text-black rounded-lg hover:scale-105 transition-transform"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <button
              onClick={openDrawer}
              className="p-2 text-gray-300 hover:text-amber-400 transition-colors relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </button>

            {/* User Profile Icon */}
            {user && (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <User className="w-6 h-6" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-3 text-amber-400 hover:bg-zinc-800 transition-colors font-semibold"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-zinc-800">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-300 hover:bg-zinc-800 hover:text-amber-400 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-amber-400 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 py-4 space-y-4">
            {categories.map((category) => (
              <Link
                key={category._id || category.id}
                href={`/products?categoryId=${category._id || category.id}`}
                className="block text-gray-300 hover:text-amber-400 transition-colors font-medium capitalize"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="block text-gray-300 hover:text-amber-400 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {/* Mobile Auth */}
            {!loading && (
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block text-gray-300 hover:text-amber-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block text-gray-300 hover:text-amber-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        className="block text-amber-400 font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-gray-300 hover:text-amber-400 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-gray-300 hover:text-amber-400 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block text-center px-4 py-2 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
