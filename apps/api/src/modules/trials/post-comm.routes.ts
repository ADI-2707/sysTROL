import { FastifyInstance } from "fastify";
import { CreatePGTestSchema, CreateInvoiceSchema } from "@systrol/types";
import { TrialsAndMOMService } from "./trials-mom.service.js";
import { FinanceAndAMCService } from "../finance/finance-amc.service.js";

export async function trialsAndPostCommRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", fastify.authenticate);

  // Trials
  fastify.get("/projects/:projectId/trials", async (request) => {
    const { projectId } = request.params as { projectId: string };
    return TrialsAndMOMService.listTrials(projectId);
  });

  fastify.post("/projects/:projectId/trials", {
    preHandler: [fastify.authorize(["ADMIN", "COMMISSIONING_LEAD", "FIELD_ENGINEER"])],
    handler: async (request, reply) => {
      const { projectId } = request.params as { projectId: string };
      const body = request.body as any;
      const trial = await TrialsAndMOMService.recordTrial(projectId, body);
      return reply.code(201).send(trial);
    },
  });

  // PG Test
  fastify.get("/projects/:projectId/pg-test", async (request) => {
    const { projectId } = request.params as { projectId: string };
    return TrialsAndMOMService.listPGTestResults(projectId);
  });

  fastify.post("/projects/:projectId/pg-test", {
    preHandler: [fastify.authorize(["ADMIN", "COMMISSIONING_LEAD", "METALLURGY_SPECIALIST"])],
    handler: async (request, reply) => {
      const { projectId } = request.params as { projectId: string };
      const parsed = CreatePGTestSchema.parse(request.body);
      const results = await TrialsAndMOMService.recordPGTestResults(projectId, parsed);
      return reply.code(201).send(results);
    },
  });

  // Minutes of Meeting (MOM) & Handover
  fastify.get("/projects/:projectId/moms", async (request) => {
    const { projectId } = request.params as { projectId: string };
    return TrialsAndMOMService.listMOMs(projectId);
  });

  fastify.post("/projects/:projectId/moms", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "COMMISSIONING_LEAD"])],
    handler: async (request, reply) => {
      const { projectId } = request.params as { projectId: string };
      const body = request.body as any;
      const mom = await TrialsAndMOMService.createMOM(projectId, body);
      return reply.code(201).send(mom);
    },
  });

  fastify.patch("/moms/:id/sign", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER", "CLIENT_AUDITOR"])],
    handler: async (request) => {
      const { id } = request.params as { id: string };
      return TrialsAndMOMService.signMOM(id, request.user.sub);
    },
  });

  // Invoices & Payments
  fastify.get("/invoices", async (request) => {
    const { projectId } = request.query as { projectId?: string };
    return FinanceAndAMCService.listInvoices(projectId);
  });

  fastify.post("/invoices", {
    preHandler: [fastify.authorize(["ADMIN", "FINANCE_MANAGER"])],
    handler: async (request, reply) => {
      const parsed = CreateInvoiceSchema.parse(request.body);
      const invoice = await FinanceAndAMCService.createInvoice(parsed);
      return reply.code(201).send(invoice);
    },
  });

  fastify.post("/invoices/:id/payments", {
    preHandler: [fastify.authorize(["ADMIN", "FINANCE_MANAGER"])],
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { amountPaid: string; reference?: string };
      const payment = await FinanceAndAMCService.recordPayment(id, body);
      return reply.code(201).send(payment);
    },
  });

  // AMC Contracts
  fastify.get("/amc-contracts", async (request) => {
    const { projectId } = request.query as { projectId?: string };
    return FinanceAndAMCService.listAMCContracts(projectId);
  });

  fastify.post("/projects/:projectId/amc-contracts", {
    preHandler: [fastify.authorize(["ADMIN", "PROJECT_MANAGER"])],
    handler: async (request, reply) => {
      const { projectId } = request.params as { projectId: string };
      const body = request.body as any;
      const contract = await FinanceAndAMCService.createAMCContract(projectId, body);
      return reply.code(201).send(contract);
    },
  });
}
