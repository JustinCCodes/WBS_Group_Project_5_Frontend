"use client";

import { useEffect, useState, FormEvent } from "react";
import { useDisableBodyScroll } from "@/shared/lib/useDisableBodyScroll";
import { X } from "lucide-react";
import type { AddressFormModalProps, FormData } from "../types";

// Component for adding/editing an address in a modal
export function AddressFormModal({
  isOpen,
  onClose,
  onSave,
  address,
}: AddressFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  // Pre fill form when editing an existing address
  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      // Reset form when opening for "add new"
      setFormData({
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
      });
    }
  }, [address, isOpen]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-w-lg w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {address ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border border-zinc-700 rounded-lg hover:border-amber-500/50"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="off"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="street" className={labelClass}>
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              required
              autoComplete="off"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className={labelClass}>
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                autoComplete="off"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="state" className={labelClass}>
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                autoComplete="off"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="zip" className={labelClass}>
                ZIP Code
              </label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                autoComplete="off"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              autoComplete="off"
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-linear-to-r from-amber-500 to-yellow-600 text-black hover:scale-105"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
