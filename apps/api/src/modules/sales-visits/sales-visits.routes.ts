import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { SalesVisitsService } from "./sales-visits.service.js";
import { CreateSalesVisitSchema } from "@systrol/types";

export async function salesVisitsRoutes(fastify: FastifyInstance) {
  fastify.register(async (scope) => {
    scope.addHook("preHandler", scope.verifyJWT);

    scope.post("/sales-visits", async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = CreateSalesVisitSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for sales visit",
          issues: parse.error.issues,
        });
      }

      const visit = await SalesVisitsService.createVisit(parse.data, request.user.sub);
      return reply.status(201).send({ visit });
    });

    scope.get("/sales-visits", async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { enquiryId?: string; projectId?: string };
      const visits = await SalesVisitsService.listVisits(query);
      return reply.send({ visits });
    });

    scope.get("/sales-visits/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const visit = await SalesVisitsService.getVisitById(id);
      return reply.send({ visit });
    });

    scope.patch("/sales-visits/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updated = await SalesVisitsService.updateVisit(id, request.body as any);
      return reply.send({ visit: updated });
    });

    scope.post("/sales-visits/:id/photos", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { photoUrls: string[] };

      if (!body.photoUrls || !Array.isArray(body.photoUrls)) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "photoUrls array is required",
        });
      }

      const updated = await SalesVisitsService.addPhotos(id, body.photoUrls);
      return reply.send({ visit: updated });
    });
  });
}
