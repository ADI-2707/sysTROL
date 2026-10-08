import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth-context.js";
import { setStoredSession, getStoredSession } from "./auth-storage.js";
import { getInMemoryToken, setInMemoryToken } from "./api-client.js";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

function createValidToken(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }));
  return `${header}.${payload}.sig`;
}

describe("AuthProvider & useAuth unit tests", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    setInMemoryToken(null);
    mockPush.mockClear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    localStorage.clear();
    setInMemoryToken(null);
  });

  it("throws an error when useAuth is accessed outside of AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow("useAuth must be used within an AuthProvider");
  });

  it("initializes in unauthenticated state when no stored session exists", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.hasValidToken).toBe(false);
  });

  it("hydrates stored user on mount and performs silent token refresh", async () => {
    const validToken = createValidToken();
    const storedUser = {
      id: "usr-hydrated-01",
      email: "engineer@systrol.com",
      name: "Site Engineer",
      role: "OPERATOR",
      team: "FIELD_OPS",
      designation: "Lead Commissioning",
    };

    setStoredSession({ user: storedUser as any });

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/auth/refresh")) {
        return Promise.resolve(
          new Response(JSON.stringify({ accessToken: validToken }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      }
      return Promise.resolve(new Response("Not Found", { status: 404 }));
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.id).toBe("usr-hydrated-01");
    expect(result.current.user?.token).toBe(validToken);
    expect(result.current.hasValidToken).toBe(true);
    expect(getInMemoryToken()).toBe(validToken);
  });

  it("handles systrol:session_expired event by clearing session, token, and redirecting", async () => {
    const validToken = createValidToken();
    setInMemoryToken(validToken);
    setStoredSession({
      user: {
        id: "usr-active-01",
        email: "active@systrol.com",
        name: "Active User",
        role: "ADMIN",
        team: "LEADERSHIP",
        designation: "Director",
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      window.dispatchEvent(new CustomEvent("systrol:session_expired"));
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(getInMemoryToken()).toBeNull();
    expect(getStoredSession()).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/login?session_expired=1");
  });

  it("successfully logs in user via API, sets in-memory token, and stores sanitized profile", async () => {
    const token = createValidToken();
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: token,
          user: {
            id: "usr-login-01",
            email: "operator@systrol.com",
            name: "Field Operator",
            role: "OPERATOR",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await Promise.resolve();
    });

    let loginRes: { success: boolean; error?: string } = { success: false };
    await act(async () => {
      loginRes = await result.current.login("operator@systrol.com", "validPass123");
    });

    expect(loginRes.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("operator@systrol.com");
    expect(result.current.user?.token).toBe(token);
    expect(getInMemoryToken()).toBe(token);

    // Stored session should NOT retain sensitive tokens
    const stored = getStoredSession();
    expect(stored?.user?.email).toBe("operator@systrol.com");
    expect((stored as any)?.token).toBeUndefined();
    expect((stored as any)?.refreshToken).toBeUndefined();
  });

  it("returns error on invalid credentials during login", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    );
    global.fetch = mockFetch;

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await Promise.resolve();
    });

    let loginRes: { success: boolean; error?: string } = { success: false };
    await act(async () => {
      loginRes = await result.current.login("unknown@systrol.com", "wrongpassword");
    });

    expect(loginRes.success).toBe(false);
    expect(loginRes.error).toBe("Invalid email or password");
    expect(result.current.isAuthenticated).toBe(false);
    expect(getInMemoryToken()).toBeNull();
  });

  it("clears user, in-memory token, stored session, and routes to /login on logout", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    global.fetch = mockFetch;

    setInMemoryToken("tok-logout");
    setStoredSession({
      user: {
        id: "usr-logout-01",
        email: "user@systrol.com",
        name: "User",
        role: "USER",
        team: "FIELD_OPS",
        designation: "Tech",
      },
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(getInMemoryToken()).toBeNull();
    expect(getStoredSession()).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/login");

    // Verifies logout endpoint was called with credentials: "include"
    const logoutCall = mockFetch.mock.calls.find((c) => c[0] === "/api/proxy/v1/auth/logout");
    expect(logoutCall).toBeDefined();
    expect(logoutCall?.[1]?.credentials).toBe("include");
  });

  it("validates changePassword behavior", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    });

    await act(async () => {
      await Promise.resolve();
    });

    // Unauthenticated attempt
    let res = await result.current.changePassword("old", "newpass123");
    expect(res.success).toBe(false);
    expect(res.error).toBe("Not authenticated");

    // Login default admin
    await act(async () => {
      await result.current.login("admin@systrol.com", "admin123");
    });

    // Password too short
    res = await result.current.changePassword("admin123", "123");
    expect(res.success).toBe(false);
    expect(res.error).toContain("at least 6 characters");

    // Incorrect current password
    res = await result.current.changePassword("wrong", "newpass123");
    expect(res.success).toBe(false);
    expect(res.error).toBe("Current password is not correct.");

    // Successful password change
    res = await result.current.changePassword("admin123", "newSecret2026");
    expect(res.success).toBe(true);
    expect(localStorage.getItem("systrol_custom_pass_admin@systrol.com")).toBe("newSecret2026");
  });
});
