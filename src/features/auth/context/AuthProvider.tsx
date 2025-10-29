"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getMe, logout } from "@/features/auth/data";
import type { User, BanInfo, AuthContextValue } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import { BanNotificationModal } from "../components/BanNotificationModal";
import { setGlobalBanHandler, proactiveRefresh } from "@/shared/lib/api";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Refresh tokens every 12 minutes (before 15min expiry)
const REFRESH_INTERVAL = 12 * 60 * 1000; // 12 minutes in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Proactive token refresh - runs periodically when user is logged in
  useEffect(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Only set up refresh interval if user is logged in
    if (user) {
      // Immediately refresh on login to ensure fresh tokens
      proactiveRefresh().catch(console.error);

      // Then set up periodic refresh
      refreshIntervalRef.current = setInterval(async () => {
        // Only refresh if tab is visible to avoid unnecessary requests
        if (document.visibilityState === "visible") {
          const success = await proactiveRefresh();
          if (!success) {
            // If refresh fails, try to get user again
            try {
              await getMe();
            } catch {
              // If getting user also fails, log out
              setUser(null);
              if (!window.location.pathname.match(/^\/(login|register)/)) {
                router.push("/login");
              }
            }
          }
        }
      }, REFRESH_INTERVAL);
    }

    // Cleanup interval on unmount or when user changes
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user, router]);

  // Handle visibility change - refresh when tab becomes visible
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        // Tab became visible, refresh token to ensure it's fresh
        const success = await proactiveRefresh();
        if (success) {
          // Verify user is still valid
          try {
            const me = await getMe();
            setUser(me);
          } catch {
            setUser(null);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const refreshUser = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const doLogout = async () => {
    // Clear refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

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
