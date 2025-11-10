import { CheckoutPage } from "@/features/checkout/components/CheckoutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Syntax",
  description: "Complete your purchase.",
};

export default function Checkout() {
  return <CheckoutPage />;
}
