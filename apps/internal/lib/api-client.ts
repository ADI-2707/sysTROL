import { isTokenValid } from "./token-utils.js";

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";

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

export function getStoredSession(): { token?: string; user?: any } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("systrol_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function updateStoredToken(newToken: string): void {
  if (typeof window === "undefined") return;
  try {
    const session = getStoredSession();
    if (session) {
      session.token = newToken;
      localStorage.setItem("systrol_user", JSON.stringify(session));
    }
  } catch {
  }
}

export async function silentRefreshToken(): Promise<string> {
  const apiUrl = DEFAULT_API_URL;
  const res = await fetch(`${apiUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("systrol_user");
    }
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  const newAccessToken = data.accessToken || data.token;
  if (!newAccessToken) {
    throw new Error("Malformed refresh response");
  }

  updateStoredToken(newAccessToken);
  return newAccessToken;
}

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiUrl = DEFAULT_API_URL;
  const url = endpoint.startsWith("http") ? endpoint : `${apiUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

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

  if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
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
