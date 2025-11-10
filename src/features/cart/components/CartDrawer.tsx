"use client";

import { useCart } from "../context/CartProvider";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Package, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

// CartDrawer component
export function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  // Prevents body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:max-w-md bg-zinc-950 md:border-l border-zinc-800 z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">
              Cart ({cart.totalItems})
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            className="w-10 h-10 flex items-center justify-center border border-zinc-700 rounded-lg hover:border-amber-500/50 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="shrink-0">
                      <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product.imageUrl ? (
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Package className="w-10 h-10 text-zinc-600" />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.id}`}
                        onClick={closeDrawer}
                        className="text-white font-semibold hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-amber-400 font-bold mt-1">
                        ${item.product.price.toFixed(2)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 bg-zinc-800 border border-zinc-700 rounded hover:border-amber-500/50 transition-colors flex items-center justify-center"
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 bg-zinc-800 border border-zinc-700 rounded hover:border-amber-500/50 transition-colors flex items-center justify-center"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto w-7 h-7 border border-zinc-700 rounded hover:border-red-500/50 hover:bg-red-500/10 transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-zinc-800 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-400">Subtotal</span>
              <span className="text-2xl font-bold text-amber-400">
                ${cart.totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-white font-bold text-center rounded-lg hover:scale-105 transition-transform"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={() => {
                closeDrawer();
              }}
              className="w-full py-3 border border-zinc-700 text-white font-semibold rounded-lg hover:border-amber-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-center block"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
