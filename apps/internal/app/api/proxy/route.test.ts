import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { cleanSetCookieHeader } from "./proxy-helpers.js";
import { GET as handleProxy } from "./[...path]/route.js";

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

  it("Scenario 3.5: handles upstream network crash/fetch failure with 502 Bad Gateway", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

    const req = new NextRequest("http://localhost:3001/api/proxy/v1/projects", {
      method: "GET",
    });

    const res = await handleProxy(req, {
      params: Promise.resolve({ path: ["v1", "projects"] }),
    });

    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.statusCode).toBe(502);
    expect(data.error).toBe("Bad Gateway");
    expect(data.message).toContain("Connection refused");
  });

  it("Scenario 3.6: forwards DELETE and PUT requests with proper HTTP methods", async () => {
    for (const method of ["DELETE", "PUT"]) {
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
      global.fetch = mockFetch;

      const req = new NextRequest("http://localhost:3001/api/proxy/v1/items/42", {
        method,
        headers: { "content-type": "application/json" },
        body: method === "PUT" ? JSON.stringify({ name: "updated" }) : undefined,
      });

      const res = await handleProxy(req, {
        params: Promise.resolve({ path: ["v1", "items", "42"] }),
      });

      expect(res.status).toBe(200);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [calledUrl, calledInit] = mockFetch.mock.calls[0];
      expect(calledUrl).toContain("/api/v1/items/42");
      expect(calledInit.method).toBe(method);
    }
  });

  it("Scenario 3.7: strips content-encoding, content-length, and transfer-encoding to prevent ERR_CONTENT_DECODING_FAILED", async () => {
    const upstreamHeaders = new Headers();
    upstreamHeaders.set("Content-Type", "application/json");
    upstreamHeaders.set("Content-Encoding", "gzip");
    upstreamHeaders.set("Content-Length", "42");
    upstreamHeaders.set("Transfer-Encoding", "chunked");
    upstreamHeaders.set("Connection", "keep-alive");
    upstreamHeaders.set("X-Custom-Header", "preserved-value");

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: "uncompressed body" }), {
        status: 200,
        headers: upstreamHeaders,
      })
    );
    global.fetch = mockFetch;

    const req = new NextRequest("http://localhost:3001/api/proxy/v1/dashboard", {
      method: "GET",
      headers: {
        "accept-encoding": "gzip, deflate, br",
      },
    });

    const res = await handleProxy(req, {
      params: Promise.resolve({ path: ["v1", "dashboard"] }),
    });

    expect(res.status).toBe(200);

    const [, calledInit] = mockFetch.mock.calls[0];
    expect(calledInit.headers.get("accept-encoding")).toBeNull();

    expect(res.headers.get("content-encoding")).toBeNull();
    expect(res.headers.get("content-length")).toBeNull();
    expect(res.headers.get("transfer-encoding")).toBeNull();
    expect(res.headers.get("connection")).toBeNull();

    expect(res.headers.get("content-type")).toBe("application/json");
    expect(res.headers.get("x-custom-header")).toBe("preserved-value");
  });
});
