import { FastifyInstance } from "fastify";
import { AdvanceStageSchema, DeviateStageSchema } from "@systrol/types";
import { ProjectsService } from "./projects.service.js";

export async function projectsRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/projects", async (request) => {
    return ProjectsService.listProjects(request.query as any);
  });

  fastify.get("/projects/:id", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getProjectById(id);
  });

  fastify.get("/projects/:id/boq", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getProjectBOQ(id);
  });

  fastify.get("/projects/:id/purchase-orders", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getProjectPOs(id);
  });

  fastify.get("/projects/:id/engineering-docs", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getProjectDocs(id);
  });

  fastify.get("/projects/:id/manufacturing-batches", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getProjectBatches(id);
  });

  fastify.get("/projects/:id/shipments", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getProjectShipments(id);
  });

  fastify.post("/projects/:id/advance-stage", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = AdvanceStageSchema.parse(request.body || {});
      return ProjectsService.advanceStage(id, parsed, request.user.sub);
    },
  });

  fastify.post("/projects/:id/deviate-stage", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = DeviateStageSchema.parse(request.body);
      return ProjectsService.deviateStage(id, parsed, request.user.sub);
    },
  });

  fastify.get("/projects/:id/stage-history", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getStageHistory(id);
  });

  fastify.get("/projects/:id/deviations", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectsService.getDeviations(id);
  });
}
