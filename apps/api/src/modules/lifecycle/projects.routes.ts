import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  AdvanceStageSchema,
  DeviateStageSchema,
  CreateProjectSchema,
  UpdateStepStatusSchema,
  PublishProjectSchema,
  UnpublishProjectSchema,
} from "@systrol/types";
import { ProjectsService } from "./projects.service.js";

export async function projectsRoutes(fastify: FastifyInstance) {
  fastify.get("/public/projects", async (request: FastifyRequest, reply: FastifyReply) => {
    const projects = await ProjectsService.listPublicProjects();
    return reply.status(200).send({ projects });
  });

  fastify.get("/public/projects/:slug", async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    const project = await ProjectsService.getPublicProjectBySlug(slug);
    if (!project) {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: `Public case study '${slug}' not found`,
      });
    }
    return reply.status(200).send({ project });
  });

  fastify.register(async (scope) => {
    scope.addHook("onRequest", scope.authenticate);

    scope.get("/projects", async (request) => {
      return ProjectsService.listProjects(request.query as any);
    });

    scope.post("/projects", {
      preHandler: [
        scope.authorize(["ADMIN", "SUPER_ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"]),
      ],
      handler: async (request) => {
        const parsed = CreateProjectSchema.parse(request.body || {});
        return ProjectsService.createProject(parsed, request.user.sub);
      },
    });

    scope.patch("/projects/:id/steps/:stepId", {
      preHandler: [
        scope.authorize([
          "ADMIN",
          "SUPER_ADMIN",
          "PROJECT_MANAGER",
          "COMMISSIONING_LEAD",
          "FIELD_ENGINEER",
        ]),
      ],
      handler: async (request) => {
        const { id, stepId } = request.params as { id: string; stepId: string };
        const parsed = UpdateStepStatusSchema.parse(request.body || {});
        const result = await ProjectsService.updateStepStatus(id, stepId, parsed);
        request.auditBefore = result.previous;
        return result.current;
      },
    });

    scope.get("/projects/:id", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getProjectById(id);
    });

    scope.get("/projects/:id/boq", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getProjectBOQ(id);
    });

    scope.get("/projects/:id/purchase-orders", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getProjectPOs(id);
    });

    scope.get("/projects/:id/engineering-docs", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getProjectDocs(id);
    });

    scope.get("/projects/:id/manufacturing-batches", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getProjectBatches(id);
    });

    scope.get("/projects/:id/shipments", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getProjectShipments(id);
    });

    scope.post("/projects/:id/advance-stage", {
      preHandler: [scope.authorize(["ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"])],
      handler: async (request) => {
        const { id } = request.params as { id: string };
        const parsed = AdvanceStageSchema.parse(request.body || {});
        return ProjectsService.advanceStage(id, parsed, request.user.sub);
      },
    });

    scope.post("/projects/:id/deviate-stage", {
      preHandler: [scope.authorize(["ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"])],
      handler: async (request) => {
        const { id } = request.params as { id: string };
        const parsed = DeviateStageSchema.parse(request.body);
        return ProjectsService.deviateStage(id, parsed, request.user.sub);
      },
    });

    scope.get("/projects/:id/stage-history", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getStageHistory(id);
    });

    scope.get("/projects/:id/deviations", async (request) => {
      const { id } = request.params as { id: string };
      return ProjectsService.getDeviations(id);
    });

    scope.post("/projects/:id/publish", {
      preHandler: [scope.authorize(["ADMIN", "SUPER_ADMIN"])],
      handler: async (request, reply) => {
        const { id } = request.params as { id: string };
        const parsed = PublishProjectSchema.parse(request.body || {});
        const userId = (request.user as any)?.sub || (request.user as any)?.id;
        const result = await ProjectsService.publishProject(id, parsed, userId);
        return reply.status(200).send(result);
      },
    });

    scope.post("/projects/:id/unpublish", {
      preHandler: [scope.authorize(["ADMIN", "SUPER_ADMIN"])],
      handler: async (request, reply) => {
        const { id } = request.params as { id: string };
        const parsed = UnpublishProjectSchema.parse(request.body || {});
        const userId = (request.user as any)?.sub || (request.user as any)?.id;
        const result = await ProjectsService.unpublishProject(id, userId, parsed);
        return reply.status(200).send(result);
      },
    });
  });
}
