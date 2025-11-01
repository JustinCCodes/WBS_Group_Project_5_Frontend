"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout } from "@/features/auth/data";
import type { User, BanInfo, AuthContextValue } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import { BanNotificationModal } from "../components/BanNotificationModal";
import { setGlobalBanHandler } from "@/shared/lib/api";

// Create authentication context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Provides authentication context to children components
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null);

  // Initial user fetch
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) {
          setUser(me);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Sets up global ban handler
  useEffect(() => {
    setGlobalBanHandler((banInfo) => {
      setBanInfo(banInfo);
    });
  }, []);

  // Refreshes the current user data
  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  // Handles user logout
  const doLogout = async () => {
    await logout();
    setUser(null);
    setBanInfo(null);
    router.push("/");
  };

  // Provides context values to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        banInfo,
        setBanInfo,
        refreshUser,
        logout: doLogout,
      }}
    >
      <BanNotificationModal />
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access authentication context
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
