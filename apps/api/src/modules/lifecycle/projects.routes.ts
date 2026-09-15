import { FastifyInstance } from "fastify";
import { AdvanceStageSchema, DeviateStageSchema } from "@systrol/types";
import { ProjectsService } from "./projects.service.js";

export async function projectsRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  // List all projects
  fastify.get("/projects", async () => {
    return ProjectsService.listProjects();
  });

  // Get project by ID with full lifecycle context
  fastify.get("/projects/:id", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getProjectById(id);
  });

  // Advance stage sequentially with gate checks
  fastify.post("/projects/:id/advance-stage", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = AdvanceStageSchema.parse(request.body || {});
      return ProjectsService.advanceStage(id, parsed, request.user.sub);
    },
  });

  // Deviate stage backward or non-sequentially with audit reason & corrective action
  fastify.post("/projects/:id/deviate-stage", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = DeviateStageSchema.parse(request.body);
      return ProjectsService.deviateStage(id, parsed, request.user.sub);
    },
  });

  // Stage transition audit history
  fastify.get("/projects/:id/stage-history", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getStageHistory(id);
  });

  // Deviations register
  fastify.get("/projects/:id/deviations", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getDeviations(id);
  });
}
