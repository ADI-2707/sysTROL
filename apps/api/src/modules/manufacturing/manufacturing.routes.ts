import { FastifyInstance } from "fastify";
import { CreateManufacturingBatchSchema, CompleteFATSchema, BulkQCSchema } from "@systrol/types";
import { ManufacturingBatchService } from "./batch.service.js";
import { QCService } from "./qc.service.js";

export async function manufacturingRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  // Batches
  fastify.get("/batches", async (request) => {
    const { projectId } = request.query as { projectId?: string };
    return ManufacturingBatchService.listBatches(projectId);
  });

  fastify.get("/batches/:id", async (request) => {
    const { id } = request.params as { id: string };
    return ManufacturingBatchService.getBatchById(id);
  });

  fastify.post("/projects/:projectId/batches", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "ENGINEER"])],
    handler: async (request, reply) => {
      const { projectId } = request.params as { projectId: string };
      const parsed = CreateManufacturingBatchSchema.parse(request.body);
      const batch = await ManufacturingBatchService.createBatch(projectId, parsed);
      return reply.code(201).send(batch);
    },
  });

  fastify.patch("/batches/:id/fat", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "ENGINEER"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = CompleteFATSchema.parse(request.body);
      return ManufacturingBatchService.completeFAT(id, parsed);
    },
  });

  // QC Checks
  fastify.get("/batches/:batchId/qc-checks", async (request) => {
    const { batchId } = request.params as { batchId: string };
    return QCService.listQCChecks(batchId);
  });

  fastify.post("/batches/:batchId/qc-checks/bulk", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "ENGINEER"])],
    handler: async (request, reply) => {
      const { batchId } = request.params as { batchId: string };
      const parsed = BulkQCSchema.parse(request.body);
      const checks = await QCService.bulkCreateQCChecks(batchId, parsed.checks, request.user.sub);
      return reply.code(201).send(checks);
    },
  });
}
