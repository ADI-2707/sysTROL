import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBackendKeepAlive } from "./use-keep-alive.js";

function createJwt(expOffsetSeconds: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expOffsetSeconds }));
  return `${header}.${payload}.sig`;
}

describe("useBackendKeepAlive unit tests", () => {
  const originalFetch = global.fetch;
  const apiUrl = "https://api.systrol.test";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("pings /api/v1/health when no token is provided and marks status online if 200 OK", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "healthy" }), { status: 200 }));
    global.fetch = mockFetch;

    const { result } = renderHook(() => useBackendKeepAlive(apiUrl));

    await act(async () => {
      // allow initial async ping to settle
      await Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/api/v1/health`);
    expect(result.current.status).toBe("online");
    expect(result.current.lastPingAt).toBeInstanceOf(Date);
    expect(result.current.isTokenActive).toBe(false);
  });

  it("pings /api/v1/auth/me with Bearer token when a valid token is provided", async () => {
    const validToken = createJwt(3600);
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "user-1" }), { status: 200 }));
    global.fetch = mockFetch;

    const { result } = renderHook(() => useBackendKeepAlive(apiUrl, validToken));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${validToken}`,
      },
    });
    expect(result.current.status).toBe("online");
    expect(result.current.isTokenActive).toBe(true);
  });

  it("triggers onTokenInvalid callback and falls back to /api/v1/health upon 401 response", async () => {
    const validToken = createJwt(3600);
    const onTokenInvalid = vi.fn();

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/v1/auth/me")) {
        return Promise.resolve(new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }));
      }
      if (url.includes("/api/v1/health")) {
        return Promise.resolve(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
      }
      return Promise.resolve(new Response("Not Found", { status: 404 }));
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useBackendKeepAlive(apiUrl, validToken, { onTokenInvalid })
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(onTokenInvalid).toHaveBeenCalledTimes(1);
    expect(result.current.isTokenActive).toBe(false);
    expect(result.current.status).toBe("online");
    expect(mockFetch).toHaveBeenCalledWith(`${apiUrl}/api/v1/health`);
  });

  it("sets status to offline if network request fails", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network Error"));
    global.fetch = mockFetch;

    const { result } = renderHook(() => useBackendKeepAlive(apiUrl));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.status).toBe("offline");
  });

  it("triggers periodic ping on interval expiration", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
    global.fetch = mockFetch;

    renderHook(() => useBackendKeepAlive(apiUrl, undefined, { intervalMs: 5000 }));

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(mockFetch).toHaveBeenCalledTimes(2);

    await act(async () => {
      vi.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("triggers ping on visibilitychange when document becomes visible", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
    global.fetch = mockFetch;

    renderHook(() => useBackendKeepAlive(apiUrl));

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      writable: true,
      configurable: true,
    });

    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
      await Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("triggers ping on window focus", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
    global.fetch = mockFetch;

    renderHook(() => useBackendKeepAlive(apiUrl));

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      window.dispatchEvent(new Event("focus"));
      await Promise.resolve();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("cleans up intervals and event listeners on unmount", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
    global.fetch = mockFetch;

    const { unmount } = renderHook(() => useBackendKeepAlive(apiUrl, undefined, { intervalMs: 3000 }));

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    unmount();

    await act(async () => {
      vi.advanceTimersByTime(10000);
      window.dispatchEvent(new Event("focus"));
      await Promise.resolve();
    });

    // Should not have received any additional ping calls after unmount
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
