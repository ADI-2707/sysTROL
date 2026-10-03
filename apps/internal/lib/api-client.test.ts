import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiClient, silentRefreshToken, getStoredSession, updateStoredToken, resolveApiUrl } from "./api-client.js";
import { SYSTROL_SESSION_STORAGE_KEY, setStoredSession } from "./auth-storage.js";

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

  it("Scenario 4.2a: resolves API endpoints to BFF proxy route in browser", () => {
    expect(resolveApiUrl("/api/v1/projects")).toBe("/api/proxy/v1/projects");
    expect(resolveApiUrl("api/v1/analytics")).toBe("/api/proxy/v1/analytics");
    expect(resolveApiUrl("/api/proxy/v1/health")).toBe("/api/proxy/v1/health");
    expect(resolveApiUrl("https://external.com/api")).toBe("https://external.com/api");
  });

  it("Scenario 4.1: injects valid bearer token into authorization header", async () => {
    const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
      btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })) +
      ".signature";
    setStoredSession({ token: validToken, user: { id: "1", email: "a@b.com", name: "A", role: "ADMIN", team: "L", designation: "D" } });

    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = mockFetch;

    const res = await apiClient("/api/v1/projects");
    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toBe("/api/proxy/v1/projects");
    const headers = callArgs[1].headers as Headers;
    expect(headers.get("Authorization")).toBe(`Bearer ${validToken}`);
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("Scenario 4.2b: does not inject authorization header when no session exists", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = mockFetch;

    await apiClient("/api/v1/public-ping");
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toBe("/api/proxy/v1/public-ping");
    const headers = callArgs[1].headers as Headers;
    expect(headers.get("Authorization")).toBeNull();
  });

  it("Scenario 4.3: refreshes token silently on 401 response and retries request with new token", async () => {
    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
      btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 100 })) +
      ".sig";
    setStoredSession({ token: expiredToken, refreshToken: "old-refresh-token", user: { id: "u1", email: "a@b.com", name: "A", role: "ADMIN", team: "L", designation: "D" } });

    const newAccessToken = "newToken999";
    const newRefreshToken = "newRefresh999";

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/auth/refresh")) {
        return Promise.resolve(
          new Response(JSON.stringify({ accessToken: newAccessToken, refreshToken: newRefreshToken }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      if (url.includes("/api/proxy/v1/projects")) {
        const lastCall = mockFetch.mock.calls.find((c) => c[0].includes("/api/proxy/v1/projects") && (c[1]?.headers as Headers)?.get("Authorization") === `Bearer ${newAccessToken}`);
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
    expect(updatedSession?.refreshToken).toBe(newRefreshToken);
  });

  it("Scenario 4.4: queues concurrent calls during token refresh to avoid duplicate refresh calls", async () => {
    const newAccessToken = "queuedNewToken";
    let refreshCallsCount = 0;

    const mockFetch = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/auth/refresh")) {
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

  it("Scenario 4.5: purges stored session and dispatches session_expired event when refresh request fails", async () => {
    setStoredSession({ token: "invalid", user: { id: "1", email: "a@b.com", name: "A", role: "ADMIN", team: "L", designation: "D" } });

    let eventFired = false;
    const listener = () => {
      eventFired = true;
    };
    window.addEventListener("systrol:session_expired", listener);

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/auth/refresh")) {
        return Promise.resolve(new Response(JSON.stringify({ error: "Token expired" }), { status: 401 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
    });

    global.fetch = mockFetch;

    await expect(apiClient("/api/v1/sensitive-data")).rejects.toThrow("Session expired");
    expect(localStorage.getItem(SYSTROL_SESSION_STORAGE_KEY)).toBeNull();
    expect(getStoredSession()).toBeNull();
    expect(eventFired).toBe(true);

    window.removeEventListener("systrol:session_expired", listener);
  });

  it("Scenario 4.6: does not loop refresh for login endpoint returning 401", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 }));
    global.fetch = mockFetch;

    const res = await apiClient("/api/v1/auth/login", { method: "POST" });
    expect(res.status).toBe(401);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
