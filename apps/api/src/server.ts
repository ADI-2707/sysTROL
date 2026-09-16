import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import websocket from "@fastify/websocket";
import { env } from "@systrol/config";
import { createLogger } from "@systrol/logger";
import { jwtPlugin } from "./common/auth/jwt.plugin.js";
import { auditPlugin } from "./common/audit/audit.interceptor.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { careersRoutes } from "./modules/careers/careers.routes.js";
import { enquiriesRoutes } from "./modules/enquiries/enquiries.routes.js";
import { salesVisitsRoutes } from "./modules/sales-visits/sales-visits.routes.js";
import { procurementRoutes } from "./modules/procurement/procurement.routes.js";
import { engineeringRoutes } from "./modules/engineering/engineering.routes.js";
import { manufacturingRoutes } from "./modules/manufacturing/manufacturing.routes.js";
import { dispatchRoutes } from "./modules/dispatch/dispatch.routes.js";
import { projectsRoutes } from "./modules/lifecycle/projects.routes.js";
import { commissioningRoutes } from "./modules/commissioning/commissioning.routes.js";
import { trialsAndPostCommRoutes } from "./modules/trials/post-comm.routes.js";
import { analyticsRoutes } from "./modules/analytics/analytics.routes.js";

const logger = createLogger("api-server");

export async function buildServer() {
  const server = Fastify({
    logger: false,
  });

  // 1. CORS
  await server.register(cors, {
    origin: [env.PUBLIC_APP_URL, env.INTERNAL_APP_URL, "http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  });

  // 2. Cookie
  await server.register(cookie);

  // 3. JWT Plugin
  await server.register(jwtPlugin);

  // 4. Rate Limit
  await server.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute",
  });

  // 5. Multipart
  await server.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // 6. WebSocket
  await server.register(websocket);

  // 7. Audit interceptor
  await server.register(auditPlugin);

  // Root & Health endpoints
  server.get("/", async () => {
    return {
      service: "sysTROL Industrial Engineering API",
      status: "ONLINE",
      version: "2.4.0",
      timestamp: new Date().toISOString(),
      health: "/api/v1/health",
      publicJobs: "/api/v1/public/jobs",
    };
  });

  server.get("/api/v1/health", async () => {
    return {
      status: "ok",
      environment: env.NODE_ENV,
      timestamp: Date.now(),
    };
  });

  // API v1 prefix routes
  await server.register(
    async (v1) => {
      await v1.register(authRoutes);
      await v1.register(careersRoutes);
      await v1.register(enquiriesRoutes);
      await v1.register(salesVisitsRoutes);
      await v1.register(procurementRoutes);
      await v1.register(engineeringRoutes);
      await v1.register(manufacturingRoutes);
      await v1.register(dispatchRoutes);
      await v1.register(projectsRoutes);
      await v1.register(commissioningRoutes);
      await v1.register(trialsAndPostCommRoutes);
      await v1.register(analyticsRoutes);
    },
    { prefix: "/api/v1" }
  );

  return server;
}

export async function start() {
  const server = await buildServer();
  const port = parseInt(env.PORT, 10) || 4000;

  try {
    const address = await server.listen({ port, host: "0.0.0.0" });
    logger.info({ address, port }, "sysTROL API server started successfully");
    return server;
  } catch (err) {
    logger.error({ err }, "Failed to start API server");
    process.exit(1);
  }
}

// Auto-start when executed directly
if (process.argv[1]?.endsWith("server.ts") || process.argv[1]?.endsWith("server.js")) {
  start();
}
