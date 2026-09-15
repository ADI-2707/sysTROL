import { FastifyInstance } from "fastify";
import { CreateShipmentSchema, UpdateShipmentSchema } from "@systrol/types";
import { ShipmentService } from "./shipment.service.js";

export async function dispatchRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  // Shipments
  fastify.get("/shipments", async (request) => {
    const { projectId } = request.query as { projectId?: string };
    return ShipmentService.listShipments(projectId);
  });

  fastify.get("/shipments/:id", async (request) => {
    const { id } = request.params as { id: string };
    return ShipmentService.getShipmentById(id);
  });

  fastify.post("/projects/:projectId/shipments", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "LOGISTICS"])],
    handler: async (request, reply) => {
      const { projectId } = request.params as { projectId: string };
      const parsed = CreateShipmentSchema.parse(request.body);
      const shipment = await ShipmentService.createShipment(projectId, parsed);
      return reply.code(201).send(shipment);
    },
  });

  fastify.patch("/shipments/:id", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "LOGISTICS"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const parsed = UpdateShipmentSchema.parse(request.body);
      return ShipmentService.updateShipment(id, parsed);
    },
  });

  fastify.post("/shipments/:id/pod", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "LOGISTICS"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      const { podUrl } = request.body as { podUrl: string };
      if (!podUrl) {
        const error: any = new Error("podUrl is required");
        error.statusCode = 400;
        throw error;
      }
      return ShipmentService.uploadPOD(id, podUrl);
    },
  });
}
