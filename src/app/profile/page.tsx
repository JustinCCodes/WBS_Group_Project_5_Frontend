import { ProfilePage } from "@/features/profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Syntax",
  description: "Manage your profile, orders, and settings.",
};

export default function Profile() {
  return <ProfilePage />;
}
