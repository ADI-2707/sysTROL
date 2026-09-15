import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { VendorService } from "./vendor.service.js";
import { BOQService } from "./boq.service.js";
import { PurchaseOrderService } from "./purchase-order.service.js";
import {
  CreateVendorSchema,
  CreatePurchaseOrderSchema,
  CreateBOQItemSchema,
  PurchaseOrderStatus,
} from "@systrol/types";
import { z } from "zod";

export async function procurementRoutes(fastify: FastifyInstance) {
  fastify.register(async (scope) => {
    scope.addHook("preHandler", scope.verifyJWT);

    // --- Vendors ---
    scope.get("/procurement/vendors", async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { category?: string; country?: string };
      const vendors = await VendorService.listVendors(query);
      return reply.send({ vendors });
    });

    scope.post("/procurement/vendors", async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = CreateVendorSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for vendor",
          issues: parse.error.issues,
        });
      }
      const vendor = await VendorService.createVendor(parse.data);
      return reply.status(201).send({ vendor });
    });

    scope.get("/procurement/vendors/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const vendor = await VendorService.getVendorById(id);
      return reply.send({ vendor });
    });

    scope.patch("/procurement/vendors/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updated = await VendorService.updateVendor(id, request.body as any);
      return reply.send({ vendor: updated });
    });

    scope.delete("/procurement/vendors/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      await VendorService.deleteVendor(id);
      return reply.send({ success: true, message: "Vendor deleted" });
    });

    scope.post("/procurement/vendors/:id/recompute-rating", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const rating = await VendorService.computeVendorRating(id);
      return reply.send({ ratingScore: rating });
    });

    // --- BOQ ---
    scope.get("/procurement/boq/:projectId", async (request: FastifyRequest, reply: FastifyReply) => {
      const { projectId } = request.params as { projectId: string };
      const items = await BOQService.listBOQItems(projectId);
      return reply.send({ items });
    });

    scope.post("/procurement/boq/:projectId", async (request: FastifyRequest, reply: FastifyReply) => {
      const { projectId } = request.params as { projectId: string };
      const body = request.body as { items: any[] };

      if (!body.items || !Array.isArray(body.items)) {
        return reply.status(400).send({ statusCode: 400, message: "items array is required" });
      }

      const items = await BOQService.createBOQItems(projectId, body.items);
      return reply.status(201).send({ items });
    });

    scope.patch("/procurement/boq/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updated = await BOQService.updateBOQItem(id, request.body as any);
      return reply.send({ item: updated });
    });

    scope.delete("/procurement/boq/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      await BOQService.deleteBOQItem(id);
      return reply.send({ success: true, message: "BOQ item deleted" });
    });

    scope.post("/procurement/boq/:id/link-po", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { purchaseOrderId: string };
      const updated = await BOQService.linkToPO(id, body.purchaseOrderId);
      return reply.send({ item: updated });
    });

    // --- Purchase Orders ---
    scope.get("/procurement/purchase-orders", async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { vendorId?: string; projectId?: string; status?: PurchaseOrderStatus };
      const purchaseOrders = await PurchaseOrderService.listPOs(query);
      return reply.send({ purchaseOrders });
    });

    scope.post("/procurement/purchase-orders", async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = CreatePurchaseOrderSchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed for purchase order",
          issues: parse.error.issues,
        });
      }

      const po = await PurchaseOrderService.createPO(parse.data);
      return reply.status(201).send({ purchaseOrder: po });
    });

    scope.get("/procurement/purchase-orders/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const po = await PurchaseOrderService.getPOById(id);
      return reply.send({ purchaseOrder: po });
    });

    scope.post("/procurement/purchase-orders/:id/send", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const updated = await PurchaseOrderService.sendToVendor(id);
      return reply.send({ purchaseOrder: updated });
    });

    scope.patch("/procurement/purchase-orders/:id/delivery", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as { status: PurchaseOrderStatus; actualDeliveryDate?: string };
      const updated = await PurchaseOrderService.updateDeliveryStatus(
        id,
        body.status,
        body.actualDeliveryDate ? new Date(body.actualDeliveryDate) : undefined
      );
      return reply.send({ purchaseOrder: updated });
    });
  });
}
