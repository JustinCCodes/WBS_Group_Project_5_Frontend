import type { Cart } from "@/features/cart";
import type { User } from "@/features/auth";
import type { Address } from "@/features/addresses";
import type { useCart } from "@/features/cart";

// Props for OrderSummary component
export interface OrderSummaryProps {
  cart: Cart;
  isPlacingOrder: boolean;
  onPlaceOrder: () => void;
  hasSelectedAddress: boolean;
}

// Props for CheckoutPage component
export interface ShippingInformationProps {
  user: User;
  selectedAddress: Address | null;
  addressCount: number;
  onOpenAddressModal: () => void;
}

// Props for PaymentInformation component
export interface UseCheckoutReturn {
  cart: ReturnType<typeof useCart>["cart"];
  user: User | null;
  isLoading: boolean;
  isPlacingOrder: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  handlePlaceOrder: () => Promise<void>;
}
