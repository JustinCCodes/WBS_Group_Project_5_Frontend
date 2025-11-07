"use client";
import Link from "next/link";
import { Github, Twitter, Instagram, Youtube } from "lucide-react";
import { useModal } from "@/shared/context/ModalProvider";

// Footer component
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { openModal } = useModal();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-gray-400">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4 text-center lg:text-left col-span-3 lg:col-span-1">
            <div className="text-2xl font-bold">
              <span className="bg-linear-to-r from-amber-200 to-yellow-600 bg-clip-text text-transparent">
                Syntax
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Premium peripherals engineered for professionals. Elevate your
              setup with cutting-edge design and performance.
            </p>
          </div>

          {/* Shop Section */}
          <div className="text-center lg:text-left">
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-400 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=headsets"
                  className="hover:text-amber-400 transition-colors"
                >
                  Headsets
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=mice"
                  className="hover:text-amber-400 transition-colors"
                >
                  Mice
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=keyboards"
                  className="hover:text-amber-400 transition-colors"
                >
                  Keyboards
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="hover:text-amber-400 transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="text-center lg:text-left">
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openModal("faq")}
                  className="hover:text-amber-400 transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal("shipping")}
                  className="hover:text-amber-400 transition-colors"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal("returns")}
                  className="hover:text-amber-400 transition-colors"
                >
                  Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal("warranty")}
                  className="hover:text-amber-400 transition-colors"
                >
                  Warranty
                </button>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="text-center lg:text-left">
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links - Centered on small/medium screens, below the content */}
        <div className="flex space-x-4 justify-center lg:justify-start pt-8 border-t border-zinc-800 lg:border-0 lg:pt-0">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-amber-500/50 hover:text-amber-400 transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {currentYear} Syntax. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <button
                onClick={() => openModal("privacy")}
                className="hover:text-amber-400 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openModal("terms")}
                className="hover:text-amber-400 transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => openModal("cookies")}
                className="hover:text-amber-400 transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
