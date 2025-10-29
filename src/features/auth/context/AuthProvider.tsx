"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout } from "@/features/auth/data";
import type { User, BanInfo, AuthContextValue } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import { BanNotificationModal } from "../components/BanNotificationModal";
import { setGlobalBanHandler } from "@/shared/lib/api";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null);

  // Initial user fetch
  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sets up global ban handler
  useEffect(() => {
    setGlobalBanHandler((banInfo) => {
      setBanInfo(banInfo);
    });
  }, []);

  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const doLogout = async () => {
    await logout();
    setUser(null);
    setBanInfo(null);
    router.push("/");
  };

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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
