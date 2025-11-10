import Link from "next/link";
import { Truck, ChevronDown } from "lucide-react";
import { ShippingInformationProps } from "../types";

// ShippingInformation component
export function ShippingInformation({
  user,
  selectedAddress,
  addressCount,
  onOpenAddressModal,
}: ShippingInformationProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Truck className="w-6 h-6 text-amber-400" />
          Shipping Information
        </h2>
        {addressCount > 0 && (
          <button
            onClick={onOpenAddressModal}
            className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 font-semibold"
          >
            Change <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>
      {/* Address Display */}
      {selectedAddress ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={selectedAddress.name}
                autoComplete="off"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Email</label>
              <input
                type="email"
                disabled
                value={user.email}
                autoComplete="off"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Address</label>
            <input
              type="text"
              disabled
              value={selectedAddress.street}
              autoComplete="off"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">City</label>
              <input
                type="text"
                disabled
                value={selectedAddress.city}
                autoComplete="off"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">State</label>
              <input
                type="text"
                disabled
                value={selectedAddress.state}
                autoComplete="off"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">
                ZIP Code
              </label>
              <input
                type="text"
                disabled
                value={selectedAddress.zip}
                autoComplete="off"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white opacity-70"
              />
            </div>
          </div>
        </div>
      ) : (
        // No Address Selected
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">You have no saved addresses.</p>
          <Link
            href="/profile/addresses"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:scale-105 transition-transform"
          >
            Add Address in Profile
          </Link>
        </div>
      )}
    </div>
  );
}
