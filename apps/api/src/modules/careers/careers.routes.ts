import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CareersService } from "./careers.service.js";
import { requireRoles } from "../../common/rbac/rbac.guard.js";
import {
  UserRole,
  CreateJobPostingSchema,
  SubmitApplicationSchema,
  JobPostingStatus,
  ApplicationStatus,
} from "@systrol/types";
import { Queue } from "bullmq";
import { env } from "@systrol/config";

const emailQueue = new Queue("email-notifications", {
  connection: {
    host: new URL(env.REDIS_URL).hostname || "localhost",
    port: parseInt(new URL(env.REDIS_URL).port || "6379", 10),
  },
});

export async function careersRoutes(fastify: FastifyInstance) {
  // --- Public Routes ---
  fastify.get("/public/jobs", async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { department?: string; location?: string } | undefined;
    const jobs = await CareersService.listPublishedJobs(query);
    return reply.send({ jobs });
  });

  fastify.get("/public/jobs/:slug", async (request: FastifyRequest, reply: FastifyReply) => {
    const { slug } = request.params as { slug: string };
    const job = await CareersService.getJobBySlug(slug);
    return reply.send({ job });
  });

  fastify.post(
    "/public/jobs/:slug/apply",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minutes",
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { slug } = request.params as { slug: string };
      const body = request.body as any;

      const parseResult = SubmitApplicationSchema.safeParse(body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid application submission payload",
          issues: parseResult.error.issues,
        });
      }

      const resumeUrl = body.resumeUrl || `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/careers/resumes/default.pdf`;
      const application = await CareersService.submitApplication(slug, parseResult.data, resumeUrl);

      // Queue email notification
      try {
        const job = await CareersService.getJobBySlug(slug);
        await emailQueue.add("new-application", {
          applicantName: parseResult.data.applicantName,
          email: parseResult.data.email,
          jobTitle: job.title,
          applicationId: application.id,
        });
      } catch {
        // Logged if Redis/queue is offline
      }

      return reply.status(201).send({
        success: true,
        message: "Application submitted successfully",
        applicationId: application.id,
      });
    }
  );

  // --- Admin Routes ---
  fastify.register(async (adminScope) => {
    adminScope.addHook("preHandler", adminScope.verifyJWT);
    adminScope.addHook("preHandler", requireRoles(UserRole.HR_RECRUITER, UserRole.SUPER_ADMIN));

    adminScope.get("/admin/jobs", async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { status?: JobPostingStatus };
      const jobs = await CareersService.listAllPostings(query);
      return reply.send({ jobs });
    });

    adminScope.post("/admin/jobs", async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = CreateJobPostingSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for job posting",
          issues: parseResult.error.issues,
        });
      }

      const posting = await CareersService.createPosting(parseResult.data, request.user.sub);
      return reply.status(201).send({ job: posting });
    });

    adminScope.patch("/admin/jobs/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updated = await CareersService.updatePosting(id, request.body as any);
      return reply.send({ job: updated });
    });

    adminScope.delete("/admin/jobs/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const closed = await CareersService.softClosePosting(id);
      return reply.send({ job: closed });
    });

    adminScope.get("/admin/jobs/:id/applications", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const query = request.query as { status?: ApplicationStatus };
      const applications = await CareersService.listApplications(id, query?.status);
      return reply.send({ applications });
    });

    adminScope.get("/admin/applications", async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { status?: ApplicationStatus };
      const applications = await CareersService.listApplications(undefined, query?.status);
      return reply.send({ applications });
    });

    adminScope.patch(
      "/admin/jobs/:id/applications/:appId",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { appId } = request.params as { appId: string };
        const body = request.body as { status: ApplicationStatus };

        const updated = await CareersService.updateApplicationStatus(
          appId,
          body.status,
          request.user.sub
        );
        return reply.send({ application: updated });
      }
    );
  });
}
