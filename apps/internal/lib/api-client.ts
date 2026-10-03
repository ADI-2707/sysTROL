import { isTokenValid } from "./token-utils.js";
import {
  getStoredSession,
  updateStoredToken,
  clearStoredSession,
} from "./auth-storage.js";

export { getStoredSession, updateStoredToken, clearStoredSession };

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
  const baseUrl = process.env.API_URL || "https://systrol-api.onrender.com";
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
    body: JSON.stringify({ refreshToken: session?.refreshToken || "" }),
  });

  if (!res.ok) {
    clearStoredSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("systrol:session_expired"));
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  const newAccessToken = data.accessToken || data.token;
  if (!newAccessToken) {
    clearStoredSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("systrol:session_expired"));
    }
    throw new Error("Malformed refresh response");
  }

  updateStoredToken(newAccessToken, data.refreshToken);
  return newAccessToken;
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = resolveApiUrl(endpoint);

  const headers = new Headers(options.headers || {});
  const session = getStoredSession();

  if (session?.token && isTokenValid(session.token)) {
    if (!headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${session.token}`);
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
