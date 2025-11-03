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

// Navbar component
export default function Navbar({ categories }: NavbarProps) {
  const { user, loading, logout } = useAuth();
  const { cart, openDrawer } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null); // Closes profile dropdown on outside click

  // Closes dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    // Close profile dropdown on outside click
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
              src="/Company_Logo.png"
              alt="Syntax Logo"
              width={160}
              height={53}
              className="h-14 w-auto transition-transform group-hover:scale-105"
              priority
            />
            <div className="hidden sm:block w-1 h-6 bg-amber-500 rounded-full group-hover:h-8 transition-all"></div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/products"
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?categoryId=${category.id}`}
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
              <div className="hidden lg:flex items-center space-x-3">
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
              <div className="relative hidden lg:block" ref={profileRef}>
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
              className="lg:hidden p-2 text-gray-300 hover:text-amber-400 transition-colors"
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
          <div className="lg:hidden border-t border-zinc-800 py-4 text-center">
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?categoryId=${category.id}`}
                  className="block text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors font-medium capitalize py-2 px-3 border border-zinc-800 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <Link
              href="/about"
              className="block text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors font-medium py-3 border-t border-zinc-800 mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {/* Mobile Auth */}
            {!loading && (
              <div className="border-t border-zinc-800 text-center">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors py-3 border-b border-zinc-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors py-3 border-b border-zinc-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-center text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors py-3"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-gray-300 hover:text-amber-400 hover:bg-zinc-800 transition-colors py-3 border-b border-zinc-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block text-center px-4 py-3 mt-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transition-transform"
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
