"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthProvider";

export function BanNotificationModal() {
  const { banInfo, logout } = useAuth();

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

  if (!banInfo) return null;

  const handleLogout = async () => {
    await logout();
  };

  const formatBanDuration = (until?: string) => {
    if (!until) {
      return "permanently";
    }

    try {
      const date = new Date(until);
      return `until ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    } catch {
      return `until ${until}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ban Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-4">
            <svg
              className="w-16 h-16 text-red-600"
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
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Account Banned
        </h2>

        {/* Ban Info */}
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-red-900 mb-2">Reason:</p>
            <p className="text-gray-800">{banInfo.reason}</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Duration:
            </p>
            <p className="text-gray-800">
              Your account has been banned{" "}
              <span className="font-semibold">
                {formatBanDuration(banInfo.until)}
              </span>
              .
            </p>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6 text-sm">
          You have been logged out and cannot access the platform while your
          account is banned.
          {banInfo.until && <> You may return after the ban period expires.</>}
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
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
