import { prisma } from "@systrol/database";
import { CreatePurchaseOrderDto, PurchaseOrderStatus } from "@systrol/types";
import { Queue } from "bullmq";
import { env } from "@systrol/config";
import { VendorService } from "./vendor.service.js";

const emailQueue = new Queue("email-notifications", {
  connection: {
    host: new URL(env.REDIS_URL).hostname || "localhost",
    port: parseInt(new URL(env.REDIS_URL).port || "6379", 10),
  },
});

export class PurchaseOrderService {
  static async createPO(dto: CreatePurchaseOrderDto) {
    const year = new Date().getFullYear();

    return prisma.$transaction(async (tx) => {
      const count = await tx.purchaseOrder.count({
        where: { poNumber: { startsWith: `PO-${year}` } },
      });

      const sequence = String(count + 1).padStart(4, "0");
      const poNumber = `PO-${year}-${sequence}`;

      const po = await tx.purchaseOrder.create({
        data: {
          poNumber,
          vendorId: dto.vendorId,
          projectId: dto.projectId,
          totalValue: parseFloat(dto.totalValue),
          expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : null,
          status: PurchaseOrderStatus.DRAFT,
        },
      });

      // Link items
      if (dto.itemIds && dto.itemIds.length > 0) {
        await tx.bOQItem.updateMany({
          where: { id: { in: dto.itemIds } },
          data: { purchaseOrderId: po.id },
        });
      }

      return po;
    });
  }

  static async listPOs(filters?: { vendorId?: string; projectId?: string; status?: PurchaseOrderStatus }) {
    return prisma.purchaseOrder.findMany({
      where: {
        ...(filters?.vendorId ? { vendorId: filters.vendorId } : {}),
        ...(filters?.projectId ? { projectId: filters.projectId } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
      },
      include: {
        vendor: { select: { id: true, name: true, category: true, country: true } },
        project: { select: { id: true, projectCode: true, name: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getPOById(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        vendor: true,
        project: true,
        items: true,
      },
    });

    if (!po) {
      const error: any = new Error(`Purchase order '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return po;
  }

  static async sendToVendor(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { vendor: true, items: true },
    });

    if (!po) {
      const error: any = new Error(`Purchase order '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    if (po.status === PurchaseOrderStatus.SENT_TO_VENDOR) {
      const error: any = new Error("Purchase order is already sent to vendor");
      error.statusCode = 400;
      throw error;
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id },
      data: { status: PurchaseOrderStatus.SENT_TO_VENDOR },
    });

    try {
      await emailQueue.add("po-sent", {
        poId: po.id,
        poNumber: po.poNumber,
        vendorName: po.vendor.name,
        vendorEmail: "vendor@example.com",
        totalValue: po.totalValue.toString(),
        expectedDeliveryDate: po.expectedDeliveryDate?.toISOString(),
      });
    } catch {
      // offline fallback
    }

    return updated;
  }

  static async updateDeliveryStatus(id: string, status: PurchaseOrderStatus, actualDate?: Date) {
    const po = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status,
        ...(actualDate ? { actualDeliveryDate: actualDate } : {}),
      },
    });

    if (status === PurchaseOrderStatus.CLOSED) {
      try {
        await VendorService.computeVendorRating(po.vendorId);
      } catch {
        // rating recomputation fallback
      }
    }

    return po;
  }
}
