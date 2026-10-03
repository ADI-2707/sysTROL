import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { cleanSetCookieHeader, handleProxy } from "./[...path]/route.js";

describe("BFF Proxy Route Unit & Scenario Tests", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("Scenario 3.3a: cleans upstream Set-Cookie header by stripping domain and setting first-party flags", () => {
    const upstreamCookie = "refreshToken=secret123; Domain=systrol-api.onrender.com; Path=/; HttpOnly; SameSite=None; Partitioned; Secure";
    const cleaned = cleanSetCookieHeader(upstreamCookie);

    expect(cleaned).toContain("refreshToken=secret123");
    expect(cleaned).not.toContain("Domain=");
    expect(cleaned).not.toContain("SameSite=None");
    expect(cleaned).not.toContain("Partitioned");
    expect(cleaned).toContain("SameSite=Lax");
    expect(cleaned).toContain("HttpOnly");
    expect(cleaned).toContain("Secure");
    expect(cleaned).toContain("Path=/");
  });

  it("Scenario 3.1: forwards GET request with query params and authorization headers", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ projects: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    global.fetch = mockFetch;

    const req = new NextRequest("http://localhost:3001/api/proxy/v1/projects?status=ACTIVE", {
      method: "GET",
      headers: {
        authorization: "Bearer test-jwt-token",
        cookie: "refreshToken=test-refresh-cookie",
      },
    });

    const res = await handleProxy(req, {
      params: Promise.resolve({ path: ["v1", "projects"] }),
    });

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [calledUrl, calledInit] = mockFetch.mock.calls[0];
    expect(calledUrl).toContain("/api/v1/projects?status=ACTIVE");
    expect(calledInit.method).toBe("GET");
    expect(calledInit.headers.get("authorization")).toBe("Bearer test-jwt-token");
    expect(calledInit.headers.get("cookie")).toBe("refreshToken=test-refresh-cookie");
  });

  it("Scenario 3.2: forwards POST request with JSON body and empty body defense", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    global.fetch = mockFetch;

    const req = new NextRequest("http://localhost:3001/api/proxy/v1/auth/refresh", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ refreshToken: "body-token-abc" }),
    });

    const res = await handleProxy(req, {
      params: Promise.resolve({ path: ["v1", "auth", "refresh"] }),
    });

    expect(res.status).toBe(200);
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const [calledUrl, calledInit] = mockFetch.mock.calls[0];
    expect(calledUrl).toContain("/api/v1/auth/refresh");
    expect(calledInit.method).toBe("POST");
    expect(calledInit.body).toBe(JSON.stringify({ refreshToken: "body-token-abc" }));
  });

  it("Scenario 3.3b: rewrites upstream Set-Cookie into first-party cookie in proxy response", async () => {
    const mockHeaders = new Headers();
    mockHeaders.set("Content-Type", "application/json");
    mockHeaders.set("Set-Cookie", "refreshToken=rotated456; Domain=onrender.com; Path=/; Secure; SameSite=None");

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ accessToken: "new-access" }), {
        status: 200,
        headers: mockHeaders,
      })
    );
    global.fetch = mockFetch;

    const req = new NextRequest("http://localhost:3001/api/proxy/v1/auth/refresh", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    const res = await handleProxy(req, {
      params: Promise.resolve({ path: ["v1", "auth", "refresh"] }),
    });

    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("refreshToken=rotated456");
    expect(setCookie).not.toContain("onrender.com");
    expect(setCookie).toContain("SameSite=Lax");
  });

  it("Scenario 3.4: propagates upstream 401, 403, and 500 error status codes cleanly", async () => {
    for (const statusCode of [401, 403, 500]) {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: `Error ${statusCode}` }), {
          status: statusCode,
          headers: { "Content-Type": "application/json" },
        })
      );
      global.fetch = mockFetch;

      const req = new NextRequest("http://localhost:3001/api/proxy/v1/secure", {
        method: "GET",
      });

      const res = await handleProxy(req, {
        params: Promise.resolve({ path: ["v1", "secure"] }),
      });

      expect(res.status).toBe(statusCode);
    }
  });
});
