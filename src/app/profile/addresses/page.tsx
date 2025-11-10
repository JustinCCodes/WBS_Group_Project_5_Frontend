import { AddressPage } from "@/features/addresses";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Addresses | Syntax",
  description: "Manage your shipping addresses.",
};

export default function ProfileAddressesPage() {
  return <AddressPage />;
}
