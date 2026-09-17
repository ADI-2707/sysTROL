import { FastifyInstance } from "fastify";
import { AnalyticsService } from "./analytics.service.js";

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  // Stage Dwell Times
  fastify.get("/analytics/stage-dwell", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "SUPER_ADMIN"])],
    handler: async () => {
      return AnalyticsService.getStageDwellTimes();
    },
  });

  // Enquiry Conversion Funnel
  fastify.get("/analytics/enquiry-funnel", {
    preHandler: [fastify.authorize(["ADMIN", "SALES_EXEC", "SUPER_ADMIN"])],
    handler: async () => {
      return AnalyticsService.getEnquiryFunnel();
    },
  });

  // Payment Aging Buckets
  fastify.get("/analytics/payment-aging", {
    preHandler: [fastify.authorize(["ADMIN", "FINANCE_MANAGER", "SUPER_ADMIN"])],
    handler: async () => {
      return AnalyticsService.getPaymentAging();
    },
  });

  fastify.get("/analytics/amc-forecast", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "SUPER_ADMIN"])],
    handler: async () => {
      return AnalyticsService.getAMCForecast();
    },
  });

  fastify.get("/analytics/projects", {
    preHandler: [
      fastify.authorize([
        "ADMIN",
        "SUPER_ADMIN",
        "SALES_EXEC",
        "COMMISSIONING_LEAD",
        "FIELD_ENGINEER",
        "PROJECT_MANAGER",
      ]),
    ],
    handler: async () => {
      return AnalyticsService.getProjectsAnalytics();
    },
  });

  fastify.get("/analytics/cta", {
    preHandler: [
      fastify.authorize([
        "ADMIN",
        "SUPER_ADMIN",
        "SALES_EXEC",
        "COMMISSIONING_LEAD",
        "FIELD_ENGINEER",
        "PROJECT_MANAGER",
      ]),
    ],
    handler: async () => {
      return AnalyticsService.getCtaAnalytics();
    },
  });

  fastify.get("/analytics/employees", {
    preHandler: [
      fastify.authorize([
        "ADMIN",
        "SUPER_ADMIN",
        "SALES_EXEC",
        "COMMISSIONING_LEAD",
        "FIELD_ENGINEER",
        "PROJECT_MANAGER",
      ]),
    ],
    handler: async () => {
      return AnalyticsService.getEmployeesAnalytics();
    },
  });
}
