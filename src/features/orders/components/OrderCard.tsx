"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  OrderCardProps,
  OrderSummaryHeader,
  OrderActions,
  OrderProductList,
} from "../index";
import toast from "react-hot-toast";

// Component to display individual order card
export function OrderCard({ order, onCancel, isCancelling }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownloadBill = () => {
    toast.error("Downloading bills is not implemented yet.", {
      icon: "😅",
    });
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <article
      className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all hover:border-amber-500/50 "
      aria-label={`Order ${order.id.slice(-8).toUpperCase()}`}
    >
      {/* Collapsed Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={handleToggleExpand}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && handleToggleExpand()
        }
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`order-details-${order.id}`}
      >
        <OrderSummaryHeader order={order} />
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          id={`order-details-${order.id}`}
          className="bg-zinc-950/50 border-t border-zinc-800 p-6"
        >
          {/* Product List */}
          <OrderProductList products={order.products} />
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-6 border-t border-zinc-800 bg-zinc-900/50">
        <OrderActions
          order={order}
          isCancelling={isCancelling}
          onCancel={() => onCancel(order.id, order.status)}
          onDownloadBill={handleDownloadBill}
        />
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={handleToggleExpand}
        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white"
        aria-label={
          isExpanded ? "Collapse order details" : "Expand order details"
        }
        aria-expanded={isExpanded}
        aria-controls={`order-details-${order.id}`}
      >
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
    </article>
  );
}
