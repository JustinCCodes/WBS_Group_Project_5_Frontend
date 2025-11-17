"use client";

import { X, CheckCircle, Circle } from "lucide-react";
import type { AddressSelectionModalProps } from "../types";
import { useEffect } from "react";
import { useDisableBodyScroll } from "@/shared/lib/useDisableBodyScroll";

// Modal component for selecting an address
export function AddressSelectionModal({
  isOpen,
  onClose,
  onSelect,
  addresses,
  selectedAddressId,
}: AddressSelectionModalProps) {
  // Disable body scroll when modal is open
  useDisableBodyScroll(isOpen);

  // Add Escape key handler to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Select Address</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border border-zinc-700 rounded-lg hover:border-amber-500/50"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;
            return (
              <div
                key={address.id}
                onClick={() => {
                  onSelect(address);
                  onClose();
                }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-amber-500 bg-zinc-800"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start gap-4">
                  {isSelected ? (
                    <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600 shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{address.name}</h3>
                    <div className="text-sm text-gray-400">
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
