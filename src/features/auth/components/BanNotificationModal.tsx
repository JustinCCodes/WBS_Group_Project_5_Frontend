"use client";

import React, { useEffect } from "react";
import { useDisableBodyScroll } from "@/shared/lib/useDisableBodyScroll";
import { useAuth } from "@/features/auth";

export function BanNotificationModal() {
  const { banInfo, logout } = useAuth();
  // Disable body scroll when modal is open
  useDisableBodyScroll(!!banInfo);

  // Prevents navigation while banned
  useEffect(() => {
    if (banInfo) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };

      // Blocks navigation
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [banInfo]);

  // If not banned does not render modal
  if (!banInfo) return null;

  // Handles logout action
  const handleLogout = async () => {
    await logout();
  };

  // Formats ban duration for display
  const formatBanDuration = (until?: string) => {
    if (!until) {
      return "permanently";
    }

    // Tries to parse date
    try {
      const date = new Date(until);
      return `until ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    } catch {
      return `until ${until}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ban Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-900/30 border border-red-800 p-4">
            <svg
              className="w-16 h-16 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-red-400 mb-4">
          Account Banned
        </h2>

        {/* Ban Info */}
        <div className="mb-6">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-red-300 mb-2">Reason:</p>
            <p className="text-gray-300">{banInfo.reason}</p>
          </div>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-300 mb-2">
              Duration:
            </p>
            <p className="text-gray-400">
              Your account has been banned{" "}
              <span className="font-semibold text-red-400">
                {formatBanDuration(banInfo.until)}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-400 mb-6 text-sm">
          You have been logged out and cannot access the platform while your
          account is banned.
          {banInfo.until && <> You may return after the ban period expires.</>}
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 bg-red-900/30 border border-red-800 text-red-400 font-semibold rounded-lg hover:bg-red-900/50 transition-all"
        >
          OK, Log Out
        </button>

        {/* Contact Info*/}
        <p className="text-center text-xs text-gray-500 mt-4">
          If you believe this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
}
