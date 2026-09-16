import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { MediaService } from "./media.service.js";
import {
  PresignMediaInputSchema,
  ConfirmMediaInputSchema,
  UpdateMediaInputSchema,
  MediaQuerySchema,
} from "@systrol/types";

export async function mediaRoutes(fastify: FastifyInstance) {
  fastify.get("/public/media", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { category?: string; limit?: string };
    const limit = query.limit ? parseInt(query.limit, 10) : 60;
    const media = await MediaService.listPublicMedia(query.category, limit);
    return reply.send({ media });
  });

  fastify.register(async (scope) => {
    scope.addHook("preHandler", scope.verifyJWT);

    scope.post("/media/presign", async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = PresignMediaInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid media upload parameters",
          issues: parsed.error.issues,
        });
      }

      const userId = (request.user as any)?.id;
      const result = await MediaService.generatePresignedUploadUrl(parsed.data, userId);
      return reply.status(200).send(result);
    });

    scope.post("/media/confirm", async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = ConfirmMediaInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid media confirmation payload",
          issues: parsed.error.issues,
        });
      }

      const userId = (request.user as any)?.id;
      const asset = await MediaService.confirmMediaAsset(parsed.data, userId);
      return reply.status(201).send({ asset });
    });

    scope.get("/media", async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = MediaQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid media query parameters",
          issues: parsed.error.issues,
        });
      }

      const result = await MediaService.listMedia(parsed.data);
      return reply.send(result);
    });

    scope.get("/media/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const asset = await MediaService.getMediaById(id);
      return reply.send({ asset });
    });

    scope.patch("/media/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parsed = UpdateMediaInputSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid media update payload",
          issues: parsed.error.issues,
        });
      }

      const asset = await MediaService.updateMedia(id, parsed.data);
      return reply.send({ asset });
    });

    scope.delete("/media/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const result = await MediaService.deleteMedia(id);
      return reply.send(result);
    });
  });
}
