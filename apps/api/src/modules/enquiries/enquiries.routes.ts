import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { EnquiriesService } from "./enquiries.service.js";
import {
  CreateEnquirySchema,
  ConvertToProjectSchema,
  EnquirySource,
  UserRole,
  PublicEnquirySchema,
} from "@systrol/types";
import { requireRoles } from "../../common/rbac/rbac.guard.js";

export async function enquiriesRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/public/enquiry",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "1 hour",
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = PublicEnquirySchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for public enquiry submission",
          issues: parse.error.issues,
        });
      }

      const { name, company, email, phone, service, message } = parse.data;

      const enquiry = await EnquiriesService.createEnquiry({
        source: EnquirySource.WEB_RFQ,
        prospectName: `${name} (${company})`,
        contactEmail: email,
        contactPhone: phone,
        requirement: `[${service}] ${message}`,
      });

      return reply.status(201).send({ success: true, enquiryId: enquiry.id });
    }
  );

  fastify.register(async (scope) => {
    scope.addHook("preHandler", scope.verifyJWT);

    scope.post("/enquiries", async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = CreateEnquirySchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for enquiry creation",
          issues: parse.error.issues,
        });
      }

      const enquiry = await EnquiriesService.createEnquiry(parse.data);
      return reply.status(201).send({ enquiry });
    });

    scope.get("/enquiries", async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await EnquiriesService.listEnquiries(request.query as any);
      return reply.send({ enquiries: (result as any).data || result, meta: (result as any).meta });
    });

    scope.get("/enquiries/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const enquiry = await EnquiriesService.getEnquiryById(id);
      return reply.send({ enquiry });
    });

    scope.patch("/enquiries/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updated = await EnquiriesService.updateEnquiry(id, request.body as any);
      return reply.send({ enquiry: updated });
    });

    scope.post("/enquiries/:id/qualify", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const enquiry = await EnquiriesService.qualifyEnquiry(id);
      return reply.send({ enquiry });
    });

    scope.post("/enquiries/:id/disqualify", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { reason?: string } | undefined;
      const enquiry = await EnquiriesService.disqualifyEnquiry(id, body?.reason);
      return reply.send({ enquiry });
    });

    scope.post("/enquiries/:id/convert", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const parse = ConvertToProjectSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for project conversion",
          issues: parse.error.issues,
        });
      }

      const project = await EnquiriesService.convertToProject(id, parse.data, request.user.sub);
      return reply.status(201).send({ project });
    });
  });
}
