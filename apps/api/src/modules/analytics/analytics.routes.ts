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

  // AMC Expiry & Spares Forecast
  fastify.get("/analytics/amc-forecast", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "SUPER_ADMIN"])],
    handler: async () => {
      return AnalyticsService.getAMCForecast();
    },
  });
}
