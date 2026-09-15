import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { EngineeringDocumentService } from "./document.service.js";
import { DesignReviewService } from "./design-review.service.js";
import {
  CreateEngineeringDocumentSchema,
  CreateDesignReviewSchema,
  UpdateReviewSchema,
  ReviewStatus,
} from "@systrol/types";

export async function engineeringRoutes(fastify: FastifyInstance) {
  fastify.register(async (scope) => {
    scope.addHook("preHandler", scope.verifyJWT);

    // --- Document Register ---
    scope.get("/engineering/documents", async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { projectId?: string; docType?: string; reviewStatus?: ReviewStatus };
      const documents = await EngineeringDocumentService.listDocuments(query.projectId, query);
      return reply.send({ documents });
    });

    scope.post("/engineering/documents", async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = CreateEngineeringDocumentSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for engineering document",
          issues: parse.error.issues,
        });
      }

      const fileUrl =
        parse.data.fileUrl ||
        `https://systrol-documents.s3.us-east-1.amazonaws.com/${EngineeringDocumentService.constructS3Key(
          parse.data.projectId,
          "doc.pdf"
        )}`;

      const document = await EngineeringDocumentService.uploadDocument(
        parse.data.projectId,
        parse.data,
        fileUrl
      );

      return reply.status(201).send({ document });
    });

    scope.get("/engineering/documents/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const document = await EngineeringDocumentService.getDocumentById(id);
      return reply.send({ document });
    });

    scope.post("/engineering/documents/:id/revise", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { fileUrl?: string } | undefined;
      const fileUrl = body?.fileUrl || `https://systrol-documents.s3.us-east-1.amazonaws.com/engineering/docs/revised-${Date.now()}.pdf`;

      const revised = await EngineeringDocumentService.reviseDocument(id, fileUrl);
      return reply.send({ document: revised });
    });

    scope.patch("/engineering/documents/:id/review", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parse = UpdateReviewSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for review update",
          issues: parse.error.issues,
        });
      }

      const updated = await EngineeringDocumentService.updateReviewStatus(
        id,
        parse.data,
        request.user.sub
      );
      return reply.send({ document: updated });
    });

    // --- Design Reviews ---
    scope.get("/engineering/design-reviews", async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { projectId?: string };
      const pendingReviews = await DesignReviewService.listPendingReviews(query.projectId);
      return reply.send({ pendingReviews });
    });

    scope.post("/engineering/design-reviews", async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = CreateDesignReviewSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for design review",
          issues: parse.error.issues,
        });
      }

      const review = await DesignReviewService.createDesignReview(parse.data, request.user.sub);
      return reply.status(201).send({ review });
    });
  });
}
