import { isTokenValid, parseJwt } from "./token-utils.js";
import {
  getStoredSession,
  clearStoredSession,
  updateStoredToken as storageUpdateToken,
} from "./auth-storage.js";

let inMemoryAccessToken: string | null = null;
let proactiveTimer: ReturnType<typeof setTimeout> | null = null;

export function clearProactiveRefresh(): void {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}

export function scheduleProactiveRefresh(token: string | null): void {
  clearProactiveRefresh();
  if (!token) return;
  const decoded = parseJwt(token);
  if (!decoded || typeof decoded.exp !== "number") return;
  const nowSeconds = Math.floor(Date.now() / 1000);
  const remainingSeconds = decoded.exp - nowSeconds;
  const refreshDelaySeconds = remainingSeconds - 120;
  if (refreshDelaySeconds <= 0) {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    silentRefreshToken().catch(() => {});
    return;
  }
  proactiveTimer = setTimeout(() => {
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    silentRefreshToken().catch(() => {});
  }, refreshDelaySeconds * 1000);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && inMemoryAccessToken) {
      const decoded = parseJwt(inMemoryAccessToken);
      if (decoded && typeof decoded.exp === "number") {
        const remaining = decoded.exp - Math.floor(Date.now() / 1000);
        if (remaining <= 120) {
          silentRefreshToken().catch(() => {});
        } else {
          scheduleProactiveRefresh(inMemoryAccessToken);
        }
      }
    }
  });
}

export function setInMemoryToken(token: string | null): void {
  inMemoryAccessToken = token;
  if (token) {
    scheduleProactiveRefresh(token);
  } else {
    clearProactiveRefresh();
  }
}

export function getInMemoryToken(): string | null {
  return inMemoryAccessToken;
}

export function updateStoredToken(newToken: string, newRefreshToken?: string): void {
  setInMemoryToken(newToken);
  storageUpdateToken(newToken, newRefreshToken);
}

export { getStoredSession, clearStoredSession };

export function resolveApiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (typeof window !== "undefined") {
    if (cleanEndpoint.startsWith("/api/proxy/")) {
      return cleanEndpoint;
    }
    if (cleanEndpoint.startsWith("/api/v1/")) {
      return cleanEndpoint.replace("/api/v1/", "/api/proxy/v1/");
    }
    return `/api/proxy${cleanEndpoint}`;
  }
  const defaultApiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "https://systrol-api.onrender.com";
  const baseUrl = process.env.API_URL || defaultApiUrl;
  return `${baseUrl}${cleanEndpoint}`;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export async function silentRefreshToken(): Promise<string> {
  const session = getStoredSession();
  const refreshUrl = resolveApiUrl("/api/v1/auth/refresh");

  const res = await fetch(refreshUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ refreshToken: (session as any)?.refreshToken || "" }),
  });

  if (!res.ok) {
    setInMemoryToken(null);
    clearStoredSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("systrol:session_expired"));
      try {
        if (window.location && window.location.pathname !== "/login") {
          window.location.href = "/login?session_expired=1";
        }
      } catch {}
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  const newAccessToken = data.accessToken || data.token;
  if (!newAccessToken) {
    setInMemoryToken(null);
    clearStoredSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("systrol:session_expired"));
      try {
        if (window.location && window.location.pathname !== "/login") {
          window.location.href = "/login?session_expired=1";
        }
      } catch {}
    }
    throw new Error("Malformed refresh response");
  }

  setInMemoryToken(newAccessToken);
  storageUpdateToken(newAccessToken, data.refreshToken);
  return newAccessToken;
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = resolveApiUrl(endpoint);
  const headers = new Headers(options.headers || {});
  const session = getStoredSession();
  const tokenToUse = inMemoryAccessToken || (session as any)?.token;

  if (tokenToUse && isTokenValid(tokenToUse)) {
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${tokenToUse}`);
    }
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !url.includes("/auth/login") && !url.includes("/auth/refresh")) {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(url, { ...options, headers, credentials: "include" });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await silentRefreshToken();
      processQueue(null, newToken);
      headers.set("Authorization", `Bearer ${newToken}`);
      return fetch(url, { ...options, headers, credentials: "include" });
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      throw refreshErr;
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}