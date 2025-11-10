"use client";

import { Star, Edit, Trash2 } from "lucide-react";
import type { AddressCardProps } from "../types";

// Component to display an address card
export function AddressCard({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div
      className={`bg-zinc-900 border rounded-lg p-6 transition-all ${
        isDefault
          ? "border-amber-500/50"
          : "border-zinc-800 hover:border-zinc-700"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{address.name}</h3>
          <div className="text-gray-400 space-y-1">
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state} {address.zip}
            </p>
            <p>{address.phone}</p>
          </div>
        </div>
        {isDefault && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-900/30 border border-amber-800 rounded-full text-xs text-amber-300 font-semibold">
            <Star className="w-3 h-3" />
            Default
          </div>
        )}
      </div>
      <div className="border-t border-zinc-800 mt-4 pt-4 flex items-center gap-3">
        {!isDefault && (
          <button
            onClick={onSetDefault}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-amber-500 hover:text-amber-400 transition-all text-sm font-medium"
          >
            <Star className="w-4 h-4" />
            Set as Default
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all text-sm font-medium"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-red-500 hover:text-red-400 transition-all text-sm font-medium ml-auto"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
