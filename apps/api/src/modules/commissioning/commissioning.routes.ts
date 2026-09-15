import { FastifyInstance } from "fastify";
import { CreateStepSchema, SignoffSchema } from "@systrol/types";
import { CommissioningService } from "./commissioning.service.js";

export async function commissioningRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  // List steps for a project
  fastify.get("/projects/:projectId/commissioning/steps", async (request) => {
    const { projectId } = request.params as { projectId: string };
    return CommissioningService.listSteps(projectId);
  });

  // Create new commissioning step
  fastify.post("/projects/:projectId/commissioning/steps", {
    preHandler: [fastify.authorize(["ADMIN", "COMMISSIONING_LEAD", "PROJECT_MANAGER"])],
    handler: async (request, reply) => {
      const { projectId } = request.params as { projectId: string };
      const parsed = CreateStepSchema.parse(request.body);
      const step = await CommissioningService.createStep(projectId, parsed);
      return reply.code(201).send(step);
    },
  });

  // Start step
  fastify.post("/commissioning/steps/:id/start", {
    preHandler: [fastify.authorize(["ADMIN", "COMMISSIONING_LEAD", "FIELD_ENGINEER"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      return CommissioningService.startStep(id);
    },
  });

  // Formal signoff of step
  fastify.post("/commissioning/steps/:id/signoff", {
    preHandler: [fastify.authorize(["ADMIN", "COMMISSIONING_LEAD", "FIELD_ENGINEER", "CLIENT_AUDITOR"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = SignoffSchema.parse(request.body || {});
      return CommissioningService.signoffStep(id, parsed, {
        id: request.user.sub,
        role: request.user.role,
      });
    },
  });

  // Critical path analysis
  fastify.get("/projects/:projectId/commissioning/critical-path", async (request) => {
    const { projectId } = request.params as { projectId: string };
    return CommissioningService.getCriticalPath(projectId);
  });
}
