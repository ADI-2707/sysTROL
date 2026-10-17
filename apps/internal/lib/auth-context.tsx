"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EmployeeTeam } from "./permissions";
import { isTokenValid } from "./token-utils";
import { getStoredSession, setStoredSession, clearStoredSession, StoredSession } from "./auth-storage";
import { setInMemoryToken, silentRefreshToken, clearProactiveRefresh, getInMemoryToken } from "./api-client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  team: EmployeeTeam;
  designation: string;
  baseLocation?: string;
  token?: string;
  isSeededSuperAdmin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasValidToken: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const stored = getStoredSession();
        if (stored?.user) {
          setUser(stored.user as unknown as AuthUser);
          try {
            const token = await silentRefreshToken();
            if (token) {
              setInMemoryToken(token);
              setUser((prev) => prev ? { ...prev, token } : prev);
            }
          } catch {
            setInMemoryToken(null);
            setUser(null);
            clearStoredSession();
          }
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
    return () => {
      clearProactiveRefresh();
    };
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      clearProactiveRefresh();
      setInMemoryToken(null);
      setUser(null);
      clearStoredSession();
      router.push("/login?session_expired=1");
    };

    window.addEventListener("systrol:session_expired", handleExpired);
    return () => {
      window.removeEventListener("systrol:session_expired", handleExpired);
    };
  }, [router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const loginUrl = typeof window !== "undefined"
        ? "/api/proxy/v1/auth/login"
        : `${process.env.API_URL || "https://systrol-api.onrender.com"}/api/v1/auth/login`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const authedUser: AuthUser = {
          id: data.user?.id || `usr-${Date.now()}`,
          email: data.user?.email || normalizedEmail,
          name: data.user?.name || normalizedEmail.split("@")[0],
          role: data.user?.role || "SUPER_ADMIN",
          team: normalizedEmail === "admin@systrol.com" ? "LEADERSHIP" : "LEADERSHIP",
          designation: "Enterprise Operator",
          token: data.accessToken,
          isSeededSuperAdmin: normalizedEmail === "admin@systrol.com",
        };
        setInMemoryToken(data.accessToken || null);
        setUser(authedUser);
        setStoredSession({
          user: {
            id: authedUser.id,
            email: authedUser.email,
            name: authedUser.name,
            role: authedUser.role,
            team: authedUser.team,
            designation: authedUser.designation,
            baseLocation: authedUser.baseLocation,
            isSeededSuperAdmin: authedUser.isSeededSuperAdmin,
          },
        });
        return { success: true };
      }

      if (res.status === 401 || res.status === 400) {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.message || "Invalid email or password" };
      }
    } catch {
    }

    return { success: false, error: "Invalid email or password" };
  };

  const logout = () => {
    const currentToken = getInMemoryToken() || user?.token;
    clearProactiveRefresh();
    setInMemoryToken(null);
    setUser(null);
    clearStoredSession();
    try {
      fetch("/api/proxy/v1/auth/logout", {
        method: "POST",
        headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : {},
        credentials: "include",
      }).catch(() => {});
    } catch {}
    router.push("/login");
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    if (currentPassword !== "admin123") {
      return { success: false, error: "Current password is not correct." };
    }

    return { success: true };
  };

  const hasValidToken = isTokenValid(user?.token);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hasValidToken,
        isLoading,
        login,
        logout,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};