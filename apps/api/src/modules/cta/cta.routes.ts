import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { PublicCtaEventSchema, UserRole } from "@systrol/types";
import { CtaService } from "./cta.service.js";
import { requireRoles } from "../../common/rbac/rbac.guard.js";
import { redis } from "../../common/redis.js";

const ALLOWED_CTA_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.SALES_EXEC,
  UserRole.COMMISSIONING_LEAD,
  UserRole.FIELD_ENGINEER,
];

export async function ctaRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/public/cta-event",
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: "1 minute",
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = PublicCtaEventSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for CTA event submission",
          issues: parse.error.issues,
        });
      }

      const ip = (request.headers["x-forwarded-for"] as string) || request.ip;
      const userAgent = request.headers["user-agent"];

      const event = await CtaService.recordCtaEvent(parse.data, ip, userAgent);
      return reply.status(201).send({ success: true, eventId: event.id });
    }
  );

  fastify.register(async (scope) => {
    scope.addHook("preHandler", scope.verifyJWT);

    scope.get(
      "/cta/unread-count",
      { preHandler: [requireRoles(...ALLOWED_CTA_ROLES)] },
      async (_request: FastifyRequest, reply: FastifyReply) => {
        const stats = await CtaService.getUnreadCount();
        return reply.send(stats);
      }
    );

    scope.get(
      "/cta/feed",
      { preHandler: [requireRoles(...ALLOWED_CTA_ROLES)] },
      async (request: FastifyRequest, reply: FastifyReply) => {
        const result = await CtaService.listCtaFeed(request.query as any);
        return reply.send(result);
      }
    );

    scope.patch(
      "/cta/enquiries/:id/status",
      { preHandler: [requireRoles(...ALLOWED_CTA_ROLES)] },
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        const { status } = request.body as { status: string };
        const updated = await CtaService.updateEnquiryStatus(id, status);
        return reply.send({ enquiry: updated });
      }
    );

    scope.get(
      "/cta/stream",
      { preHandler: [requireRoles(...ALLOWED_CTA_ROLES)] },
      async (request: FastifyRequest, reply: FastifyReply) => {
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("Access-Control-Allow-Origin", "*");
        reply.raw.flushHeaders();

        const initialStats = await CtaService.getUnreadCount();
        reply.raw.write(`event: count\ndata: ${JSON.stringify(initialStats)}\n\n`);

        const subClient = redis.duplicate();
        await subClient.connect().catch(() => {});

        await subClient.subscribe("systrol:notifications:cta", (err) => {
          if (err) {
            reply.raw.end();
          }
        });

        const onMessage = (_channel: string, message: string) => {
          reply.raw.write(`event: notification\ndata: ${message}\n\n`);
        };

        subClient.on("message", onMessage);

        const keepAliveTimer = setInterval(() => {
          reply.raw.write(": keepalive\n\n");
        }, 20000);

        request.raw.on("close", () => {
          clearInterval(keepAliveTimer);
          subClient.off("message", onMessage);
          subClient.unsubscribe("systrol:notifications:cta").catch(() => {});
          subClient.disconnect();
        });
      }
    );
  });
}
