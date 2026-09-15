import { FastifyRequest, FastifyReply } from "fastify";
import { UserRole, JWTPayload } from "@systrol/types";

export function requireRoles(...allowedRoles: UserRole[]) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const user = request.user;
    if (!user) {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Authentication required before role check",
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      reply.status(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: `User role '${user.role}' does not have sufficient permissions for this resource`,
      });
      return;
    }
  };
}

export function assertClientScope(user: JWTPayload, targetClientId: string, userClientId?: string | null): void {
  if (user.role === UserRole.CLIENT_AUDITOR) {
    if (!userClientId || userClientId !== targetClientId) {
      const error: any = new Error("Client auditor is restricted to their own organization");
      error.statusCode = 403;
      throw error;
    }
  }
}

export function assertProjectScope(user: JWTPayload, assignedUserIds: string[]): void {
  if (user.role === UserRole.FIELD_ENGINEER) {
    if (!assignedUserIds.includes(user.sub)) {
      const error: any = new Error("Field engineer can only access assigned projects");
      error.statusCode = 403;
      throw error;
    }
  }
}
