import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { UserRole } from "@systrol/types";
import { requireRoles } from "../../common/rbac/rbac.guard.js";
import { AuditService } from "./audit.service.js";

export async function auditRoutes(fastify: FastifyInstance) {
  fastify.register(async (scope) => {
    scope.addHook("preHandler", scope.verifyJWT);

    scope.get(
      "/audit-logs",
      { preHandler: [requireRoles(UserRole.SUPER_ADMIN)] },
      async (request: FastifyRequest, reply: FastifyReply) => {
        const query = request.query as Record<string, string | undefined>;
        const result = await AuditService.listAuditLogs(query);
        return reply.status(200).send(result);
      }
    );

    scope.get(
      "/audit-logs/:id",
      { preHandler: [requireRoles(UserRole.SUPER_ADMIN)] },
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const item = await AuditService.getAuditLogById(id);
        if (!item) {
          return reply.status(404).send({
            statusCode: 404,
            error: "Not Found",
            message: `Audit log record with ID ${id} not found`,
          });
        }
        return reply.status(200).send(item);
      }
    );
  });
}
