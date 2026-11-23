import fp from "fastify-plugin";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@systrol/database";
import { createLogger } from "@systrol/logger";

const log = createLogger("audit-interceptor");

function isValidUuid(val?: string | null): boolean {
  return typeof val === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function computeChangedFields(before: any, after: any): string[] {
  if (!before || typeof before !== "object" || !after || typeof after !== "object") {
    return [];
  }
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changed: string[] = [];
  for (const key of keys) {
    if (["updatedAt", "createdAt"].includes(key)) continue;
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changed.push(key);
    }
  }
  return changed;
}

async function auditInterceptorPlugin(fastify: FastifyInstance) {
  fastify.addHook("preHandler", async (request: FastifyRequest) => {
    const method = request.method.toUpperCase();
    if (!["PATCH", "PUT", "DELETE"].includes(method)) {
      return;
    }

    if (request.auditBefore) {
      return;
    }

    const params = (request.params as Record<string, string>) || {};
    const targetId = params.stepId || params.id;
    if (!targetId) {
      return;
    }

    const pathSegments = request.url.split("?")[0].split("/").filter(Boolean);
    const entityType = pathSegments.find((s) => !["api", "v1", "public", "admin"].includes(s)) || "unknown";

    try {
      let snapshot: unknown = null;
      if (entityType === "projects" && (prisma as any).project) {
        snapshot = await (prisma as any).project.findUnique({ where: { id: targetId } });
      } else if (entityType === "enquiries" && (prisma as any).enquiry) {
        snapshot = await (prisma as any).enquiry.findUnique({ where: { id: targetId } });
      } else if (entityType === "trials" && (prisma as any).trial) {
        snapshot = await (prisma as any).trial.findUnique({ where: { id: targetId } });
      } else if (entityType === "careers" && (prisma as any).jobPosting) {
        snapshot = await (prisma as any).jobPosting.findUnique({ where: { id: targetId } });
      } else if (entityType === "media" && (prisma as any).mediaAsset) {
        snapshot = await (prisma as any).mediaAsset.findUnique({ where: { id: targetId } });
      } else if (entityType === "procurement" && (prisma as any).purchaseOrder) {
        snapshot = await (prisma as any).purchaseOrder.findUnique({ where: { id: targetId } });
      }
      if (snapshot) {
        request.auditBefore = snapshot;
      }
    } catch {}
  });

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

    const user = request.user;
    const actorId = user?.sub || "system";
    const userId = user?.sub && isValidUuid(user.sub) ? user.sub : null;
    const employeeCode = user?.employeeCode || null;
    const actorRole = (user?.role as string) || (actorId === "system" ? "SYSTEM" : null);
    const clientIp = (request.headers["cf-connecting-ip"] as string) || (request.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || request.ip;
    const userAgent = (request.headers["user-agent"] as string) || null;
    const statusCode = reply.statusCode;
    const requestId = (request.headers["x-request-id"] as string) || request.id || null;
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

    const changedFields = computeChangedFields(request.auditBefore, afterData);
    const diff = {
      before: request.auditBefore ?? null,
      after: afterData,
      changedFields: changedFields.length > 0 ? changedFields : undefined,
    };

    const candidateProjectId =
      params.projectId ||
      (entityType === "projects" && params.id ? params.id : undefined) ||
      (request.body as Record<string, string> | undefined)?.projectId ||
      ((afterData as any)?.projectId || (entityType === "projects" && (afterData as any)?.id ? (afterData as any).id : undefined));

    const endpoint = request.url.split("?")[0];

    setImmediate(async () => {
      try {
        await prisma.auditLog.create({
          data: {
            requestId,
            actorId,
            userId,
            employeeCode,
            actorRole,
            clientIp,
            userAgent,
            httpMethod: method,
            endpoint,
            statusCode,
            action: `${method} ${endpoint}`,
            entityType,
            entityId: String(entityId),
            projectId: isValidUuid(candidateProjectId) ? candidateProjectId : null,
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
