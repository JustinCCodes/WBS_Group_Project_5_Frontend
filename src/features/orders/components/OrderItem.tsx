import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import type { OrderItemProps } from "../types";

// Component to display individual order item
export function OrderItem({ item }: OrderItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
      {/* Product Image */}
      <Link
        href={`/products/${item.productId.id}`}
        className="relative w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden group"
      >
        {item.productId.imageUrl ? (
          <Image
            src={item.productId.imageUrl}
            alt={item.productId.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform"
            sizes="80px"
          />
        ) : (
          <Package className="w-8 h-8 text-zinc-600" aria-hidden="true" />
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productId.id}`}
          className="text-white font-semibold hover:text-amber-400 transition-colors line-clamp-1 block mb-1"
        >
          {item.productId.name}
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>
            Quantity:{" "}
            <span className="font-bold text-white">{item.quantity}</span>
          </span>
          <span>Price: ${item.productId.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
