"use client";

import { useAuth } from "@/features/auth";
import { useModal } from "@/shared/context";
import {
  ListOrdered,
  MapPin,
  CreditCard,
  MessageSquare,
  User,
} from "lucide-react";
import { ProfileCard } from "../index";

// ProfilePage component
export function ProfilePage() {
  const { user } = useAuth();
  const { openModal } = useModal();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-24 h-24 bg-zinc-800 border-4 border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent mb-2">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-400 text-lg">{user.email}</p>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Orders Card */}
          <ProfileCard
            icon={ListOrdered}
            title="My Orders"
            description="View your order history and status"
            href="/profile/orders"
          />

          {/* Addresses Card */}
          <ProfileCard
            icon={MapPin}
            title="My Addresses"
            description="Manage your shipping addresses"
            href="/profile/addresses"
          />

          {/* Payment Methods Card */}
          <ProfileCard
            icon={CreditCard}
            title="Payment Methods"
            description="Manage your saved payment methods"
            isComingSoon={true}
          />

          {/* Contact Us Card */}
          <ProfileCard
            icon={MessageSquare}
            title="Contact Us"
            description="Get in touch with support"
            onClick={() => openModal("contact")}
          />
        </div>
      </div>
    </div>
  );
}
