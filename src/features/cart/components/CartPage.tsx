"use client";

import { useCart } from "../context/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Package } from "lucide-react";

// CartPage component
export function CartPage() {
  // Get clearCart from context
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  // Renders empty cart state
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-zinc-700 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-400 mb-8">
              Add items to your cart to get started.
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Renders cart with items
  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-gray-400 mt-2">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="shrink-0">
                    <div className="w-24 h-24 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-zinc-600" />
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="grow">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-xl font-semibold text-white hover:text-amber-400 transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {item.product.description}
                    </p>

                    {/* Stock Warning */}
                    {item.product.stock < item.quantity && (
                      <div className="mt-2 px-3 py-1 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-xs">
                        Only {item.product.stock} left in stock!
                      </div>
                    )}
                    {item.product.stock > 0 &&
                      item.product.stock <= 5 &&
                      item.product.stock >= item.quantity && (
                        <div className="mt-2 px-3 py-1 bg-amber-900/20 border border-amber-500/50 rounded text-amber-400 text-xs">
                          Only {item.product.stock} left in stock
                        </div>
                      )}

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-amber-500/50 transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-amber-500/50 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-400">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${item.product.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="shrink-0 w-10 h-10 border border-zinc-700 rounded-lg hover:border-red-500/50 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-semibold">FREE</span>
                </div>
                <div className="border-t border-zinc-800 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-amber-400">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-4 bg-linear-to-r from-amber-500 to-yellow-600 text-white font-bold text-lg rounded-lg hover:scale-105 transition-transform shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="block w-full py-3 mt-3 border border-zinc-700 text-white font-semibold text-center rounded-lg hover:border-amber-500/50 transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-zinc-800 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>2-Year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
