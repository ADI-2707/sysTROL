import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@systrol/database";
import { createLogger } from "@systrol/logger";

const log = createLogger("audit-interceptor");

async function auditInterceptorPlugin(fastify: FastifyInstance) {
  fastify.addHook("onSend", async (request: FastifyRequest, reply: FastifyReply, payload: unknown) => {
    const method = request.method.toUpperCase();
    if (!["POST", "PATCH", "PUT", "DELETE"].includes(method)) {
      return payload;
    }

    // If request failed with 4xx or 5xx, do not log successful mutation
    if (reply.statusCode >= 400) {
      return payload;
    }

    // Skip auth endpoints like login/refresh to avoid logging credentials or token payloads
    if (request.url.includes("/auth/login") || request.url.includes("/auth/refresh")) {
      return payload;
    }

    const actorId = request.user?.sub || "system";
    const pathSegments = request.url.split("?")[0].split("/").filter(Boolean);
    // e.g. /api/v1/projects/:id -> entityType: "projects"
    const entityType = pathSegments.find((s) => !["api", "v1", "public", "admin"].includes(s)) || "unknown";
    const params = (request.params as Record<string, string>) || {};
    const entityId = params.id || params.slug || params.code || "root";

    let afterData: unknown = null;
    if (typeof payload === "string") {
      try {
        afterData = JSON.parse(payload);
      } catch {
        afterData = payload;
      }
    } else {
      afterData = payload;
    }

    const diff = {
      before: request.auditBefore ?? null,
      after: afterData,
    };

    const projectId = params.projectId || (request.body as Record<string, string> | undefined)?.projectId || undefined;

    // Asynchronously log without blocking response
    setImmediate(async () => {
      try {
        await prisma.auditLog.create({
          data: {
            actorId,
            action: `${method} ${request.url}`,
            entityType,
            entityId,
            projectId: projectId ?? null,
            diff: diff as any,
          },
        });
      } catch (err: any) {
        log.warn({ err: err.message, url: request.url }, "Failed to write audit log record");
      }
    });

    return payload;
  });
}

export const auditPlugin = fp(auditInterceptorPlugin, {
  name: "audit-plugin",
});
