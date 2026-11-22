import { FastifyInstance } from "fastify";
import { CreateLogEntrySchema, LockWeekSchema } from "@systrol/types";
import { ProjectLogService } from "./project-log.service.js";

export async function projectLogRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  fastify.get("/projects/:id/log/weeks", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectLogService.getWeeks(id, request.query as any);
  });

  fastify.get("/projects/:id/log/weeks/current", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectLogService.getCurrentWeek(id);
  });

  fastify.get("/projects/:id/log/weeks/:weekId", async (request) => {
    const { id, weekId } = request.params as { id: string; weekId: string };
    return ProjectLogService.getWeekWithEntries(id, weekId);
  });

  fastify.get("/projects/:id/log/entries", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectLogService.listEntries(id, request.query as any);
  });

  fastify.get("/projects/:id/log/steps/entry-counts", async (request) => {
    const { id } = request.params as { id: string };
    return ProjectLogService.getStepEntryCounts(id);
  });

  fastify.post("/projects/:id/log/entries", {
    preHandler: [
      fastify.authorize(["SUPER_ADMIN", "COMMISSIONING_LEAD", "FIELD_ENGINEER"]),
    ],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = CreateLogEntrySchema.parse(request.body || {});
      return ProjectLogService.createEntry(id, parsed, request.user);
    },
  });

  fastify.patch("/projects/:id/log/weeks/:weekId/lock", {
    preHandler: [
      fastify.authorize(["SUPER_ADMIN", "COMMISSIONING_LEAD"]),
    ],
    handler: async (request) => {
      const { id, weekId } = request.params as { id: string; weekId: string };
      const parsed = LockWeekSchema.parse(request.body || {});
      return ProjectLogService.lockWeek(id, weekId, request.user.sub, parsed);
    },
  });

  fastify.patch("/projects/:id/log/weeks/:weekId/unlock", {
    preHandler: [
      fastify.authorize(["SUPER_ADMIN"]),
    ],
    handler: async (request) => {
      const { id, weekId } = request.params as { id: string; weekId: string };
      return ProjectLogService.unlockWeek(id, weekId);
    },
  });

  fastify.delete("/projects/:id/log/entries/:entryId", {
    preHandler: [
      fastify.authorize(["SUPER_ADMIN"]),
    ],
    handler: async (request) => {
      const { entryId } = request.params as { id: string; entryId: string };
      return ProjectLogService.deleteEntry(entryId);
    },
  });
}
