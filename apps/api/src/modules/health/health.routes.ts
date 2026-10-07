import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@systrol/database";
import { redis } from "../../common/redis.js";
import { env } from "@systrol/config";
import { latencyTracker } from "../../common/metrics/latency-tracker.js";

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      status: "ok",
      environment: env.NODE_ENV,
      timestamp: Date.now(),
    });
  });

  fastify.get("/metrics/latency", async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send(latencyTracker.getMetrics());
  });

  fastify.get("/health/deep", async (_request: FastifyRequest, reply: FastifyReply) => {
    const dbStart = Date.now();
    let dbStatus = "up";
    let dbLatencyMs = 0;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbLatencyMs = Date.now() - dbStart;
    } catch {
      dbStatus = "down";
    }

    const redisStart = Date.now();
    let redisStatus = "up";
    let redisLatencyMs = 0;
    try {
      const pong = await redis.ping();
      if (pong !== "PONG") {
        redisStatus = "down";
      }
      redisLatencyMs = Date.now() - redisStart;
    } catch {
      redisStatus = "down";
    }

    const isHealthy = dbStatus === "up" && redisStatus === "up";
    const statusCode = isHealthy ? 200 : 503;
    const memory = process.memoryUsage();

    return reply.status(statusCode).send({
      status: isHealthy ? "healthy" : "degraded",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      checks: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
        redis: {
          status: redisStatus,
          latencyMs: redisLatencyMs,
        },
        memory: {
          rssMb: Math.round(memory.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
        },
      },
    });
  });
}
