"use client";

import { AddressSelectionModal } from "@/features/addresses";
import { useCheckout } from "../hooks/useCheckout";
import { CheckoutHeader } from "./CheckoutHeader";
import { ShippingInformation } from "./ShippingInformation";
import { PaymentInformation } from "./PaymentInformation";
import { OrderSummary } from "./OrderSummary";

// CheckoutPage component
export function CheckoutPage() {
  const {
    cart,
    user,
    isLoading,
    isPlacingOrder,
    addresses,
    selectedAddress,
    setSelectedAddress,
    isAddressModalOpen,
    setIsAddressModalOpen,
    handlePlaceOrder,
  } = useCheckout();

  // Loading or empty cart state
  if (isLoading || !user || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Renders checkout page
  return (
    <>
      <div className="min-h-screen bg-black pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CheckoutHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side Forms */}
            <div className="lg:col-span-2 space-y-8">
              <ShippingInformation
                user={user}
                selectedAddress={selectedAddress}
                addressCount={addresses.length}
                onOpenAddressModal={() => setIsAddressModalOpen(true)}
              />
              <PaymentInformation />
            </div>

            {/* Right Side Order Summary */}
            <OrderSummary
              cart={cart}
              isPlacingOrder={isPlacingOrder}
              onPlaceOrder={handlePlaceOrder}
              hasSelectedAddress={!!selectedAddress}
            />
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      <AddressSelectionModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        selectedAddressId={selectedAddress?.id || null}
        onSelect={(address) => {
          setSelectedAddress(address);
        }}
      />
    </>
  );
}
