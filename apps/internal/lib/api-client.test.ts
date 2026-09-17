import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient, silentRefreshToken, getStoredSession, updateStoredToken } from "./api-client.js";

describe("apiClient & silentRefreshToken unit tests", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear();
  });

  it("injects valid bearer token into authorization header", async () => {
    const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
      btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })) +
      ".signature";
    localStorage.setItem("systrol_user", JSON.stringify({ token: validToken, user: { id: "1" } }));

    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = mockFetch;

    const res = await apiClient("/api/v1/projects");
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const callArgs = mockFetch.mock.calls[0];
    const headers = callArgs[1].headers as Headers;
    expect(headers.get("Authorization")).toBe(`Bearer ${validToken}`);
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("does not inject authorization header when no session exists", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = mockFetch;

    await apiClient("/api/v1/public-ping");
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const callArgs = mockFetch.mock.calls[0];
    const headers = callArgs[1].headers as Headers;
    expect(headers.get("Authorization")).toBeNull();
  });

  it("refreshes token silently on 401 response and retries request with new token", async () => {
    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
      btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 100 })) +
      ".sig";
    localStorage.setItem("systrol_user", JSON.stringify({ token: expiredToken, user: { id: "u1" } }));

    const newAccessToken = "newToken999";

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/v1/auth/refresh")) {
        return Promise.resolve(
          new Response(JSON.stringify({ accessToken: newAccessToken }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      if (url.includes("/api/v1/projects")) {
        const lastCall = mockFetch.mock.calls.find((c) => c[0].includes("/api/v1/projects") && (c[1]?.headers as Headers)?.get("Authorization") === `Bearer ${newAccessToken}`);
        if (lastCall) {
          return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
        }
        return Promise.resolve(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
      }
      return Promise.resolve(new Response("{}", { status: 404 }));
    });

    global.fetch = mockFetch;

    const response = await apiClient("/api/v1/projects");
    expect(response.status).toBe(200);

    const updatedSession = getStoredSession();
    expect(updatedSession?.token).toBe(newAccessToken);
  });

  it("queues concurrent calls during token refresh to avoid duplicate refresh calls", async () => {
    const newAccessToken = "queuedNewToken";
    let refreshCallsCount = 0;

    const mockFetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/api/v1/auth/refresh")) {
        refreshCallsCount++;
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              new Response(JSON.stringify({ accessToken: newAccessToken }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              })
            );
          }, 50);
        });
      }

      const auth = (init?.headers as Headers)?.get("Authorization");
      if (auth === `Bearer ${newAccessToken}`) {
        return Promise.resolve(new Response(JSON.stringify({ data: "ok" }), { status: 200 }));
      }

      return Promise.resolve(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
    });

    global.fetch = mockFetch;

    const [res1, res2] = await Promise.all([
      apiClient("/api/v1/projects"),
      apiClient("/api/v1/enquiries"),
    ]);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(refreshCallsCount).toBe(1);
  });

  it("purges stored session and throws error when refresh request fails", async () => {
    localStorage.setItem("systrol_user", JSON.stringify({ token: "invalid", user: { id: "1" } }));

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/v1/auth/refresh")) {
        return Promise.resolve(new Response(JSON.stringify({ error: "Token expired" }), { status: 401 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
    });

    global.fetch = mockFetch;

    await expect(apiClient("/api/v1/sensitive-data")).rejects.toThrow("Session expired");
    expect(localStorage.getItem("systrol_user")).toBeNull();
  });

  it("does not loop refresh for login endpoint returning 401", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 }));
    global.fetch = mockFetch;

    const res = await apiClient("/api/v1/auth/login", { method: "POST" });
    expect(res.status).toBe(401);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
