import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildServer } from "../src/server.js";
import { prisma } from "@systrol/database";
import { redis } from "../src/common/redis.js";

vi.mock("@systrol/database", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

vi.mock("../src/common/redis.js", () => ({
  redis: {
    ping: vi.fn(),
    on: vi.fn(),
  },
}));

describe("Health Check Endpoints", () => {
  let server: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    server = await buildServer();
  });

  it("returns 200 OK for shallow liveness probe", async () => {
    const res = await server.inject({
      method: "GET",
      url: "/api/v1/health",
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe("ok");
    expect(body).toHaveProperty("timestamp");
  });

  it("returns 200 OK and healthy status when all dependencies are up", async () => {
    (prisma.$queryRaw as any).mockResolvedValueOnce([{ "?column?": 1 }]);
    (redis.ping as any).mockResolvedValueOnce("PONG");

    const res = await server.inject({
      method: "GET",
      url: "/api/v1/health/deep",
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe("healthy");
    expect(body.checks.database.status).toBe("up");
    expect(body.checks.redis.status).toBe("up");
    expect(typeof body.checks.database.latencyMs).toBe("number");
    expect(typeof body.checks.redis.latencyMs).toBe("number");
    expect(body.checks.memory).toHaveProperty("rssMb");
  });

  it("returns 503 Service Unavailable when database fails", async () => {
    (prisma.$queryRaw as any).mockRejectedValueOnce(new Error("Connection timeout"));
    (redis.ping as any).mockResolvedValueOnce("PONG");

    const res = await server.inject({
      method: "GET",
      url: "/api/v1/health/deep",
    });

    expect(res.statusCode).toBe(503);
    const body = JSON.parse(res.body);
    expect(body.status).toBe("degraded");
    expect(body.checks.database.status).toBe("down");
    expect(body.checks.redis.status).toBe("up");
  });

  it("returns 503 Service Unavailable when redis fails", async () => {
    (prisma.$queryRaw as any).mockResolvedValueOnce([{ "?column?": 1 }]);
    (redis.ping as any).mockRejectedValueOnce(new Error("Redis offline"));

    const res = await server.inject({
      method: "GET",
      url: "/api/v1/health/deep",
    });

    expect(res.statusCode).toBe(503);
    const body = JSON.parse(res.body);
    expect(body.status).toBe("degraded");
    expect(body.checks.database.status).toBe("up");
    expect(body.checks.redis.status).toBe("down");
  });
});
