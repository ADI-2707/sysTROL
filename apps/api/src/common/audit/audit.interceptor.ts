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

    if (reply.statusCode >= 400) {
      return payload;
    }

    if (
      request.url.includes("/auth/login") ||
      request.url.includes("/auth/refresh") ||
      request.url.includes("/public/")
    ) {
      return payload;
    }

    const actorId = request.user?.sub || "system";
    const pathSegments = request.url.split("?")[0].split("/").filter(Boolean);
    const entityType = pathSegments.find((s) => !["api", "v1", "public", "admin"].includes(s)) || "unknown";
    const params = (request.params as Record<string, string>) || {};
    
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

    const entityId =
      params.stepId ||
      params.id ||
      params.slug ||
      params.code ||
      (afterData && typeof afterData === "object" && "id" in (afterData as any) ? (afterData as any).id : "root");

    const diff = {
      before: request.auditBefore ?? null,
      after: afterData,
    };

    const projectId =
      params.projectId ||
      (entityType === "projects" && params.id ? params.id : undefined) ||
      (request.body as Record<string, string> | undefined)?.projectId ||
      ((afterData as any)?.projectId || (entityType === "projects" && (afterData as any)?.id ? (afterData as any).id : undefined));

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
