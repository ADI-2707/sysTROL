import { describe, it, expect, vi, beforeEach } from "vitest";
import { PurchaseOrderService } from "../src/modules/procurement/purchase-order.service.js";
import { VendorService } from "../src/modules/procurement/vendor.service.js";
import { BOQService } from "../src/modules/procurement/boq.service.js";
import { prisma } from "@systrol/database";
import {
  PurchaseOrderStatus,
  CreateVendorSchema,
  CreatePurchaseOrderSchema,
  CreateBOQItemSchema,
} from "@systrol/types";

vi.mock("@systrol/database", () => ({
  prisma: {
    $transaction: vi.fn(),
    purchaseOrder: {
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    vendor: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    bOQItem: {
      updateMany: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("bullmq", () => {
  return {
    Queue: class {
      add = vi.fn().mockResolvedValue({ id: "job-1" });
    },
  };
});

describe("Procurement Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Procurement Payload Validation", () => {
    it("validates correct CreateVendorSchema payload", () => {
      const validPayload = {
        name: "ABB India Ltd",
        country: "India",
        category: "Electrical Automation",
      };
      const result = CreateVendorSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateVendorSchema payload with short name or category", () => {
      const invalidPayload = {
        name: "A",
        country: "India",
        category: "E",
      };
      const result = CreateVendorSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates correct CreatePurchaseOrderSchema payload", () => {
      const validPayload = {
        vendorId: "11111111-1111-1111-1111-111111111111",
        projectId: "22222222-2222-2222-2222-222222222222",
        totalValue: "1850000.00",
        expectedDeliveryDate: "2026-06-30T00:00:00.000Z",
        itemIds: ["33333333-3333-3333-3333-333333333333"],
      };
      const result = CreatePurchaseOrderSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreatePurchaseOrderSchema with empty itemIds or non-uuid vendorId", () => {
      const invalidPayload = {
        vendorId: "non-uuid",
        projectId: "22222222-2222-2222-2222-222222222222",
        totalValue: "500000",
        itemIds: [],
      };
      const result = CreatePurchaseOrderSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates correct CreateBOQItemSchema payload", () => {
      const validPayload = {
        description: "Variable Frequency Drive 500kW",
        quantity: 4,
        unit: "Nos",
        estimatedUnitCost: 450000,
      };
      const result = CreateBOQItemSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateBOQItemSchema with non-positive quantity or cost", () => {
      const invalidPayload = {
        description: "Cable Tray",
        quantity: 0,
        unit: "Mtr",
        estimatedUnitCost: -100,
      };
      const result = CreateBOQItemSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("Procurement Services", () => {
    it("createPO generates sequence poNumber in PO-YYYY-NNNN format", async () => {
      const year = new Date().getFullYear();

      (prisma.$transaction as any).mockImplementation(async (callback: any) => {
        const tx = {
          purchaseOrder: {
            count: vi.fn().mockResolvedValue(9),
            create: vi.fn().mockImplementation(({ data }) =>
              Promise.resolve({ id: "po-1", ...data })
            ),
          },
          bOQItem: {
            updateMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
        };
        return callback(tx);
      });

      const po = await PurchaseOrderService.createPO({
        vendorId: "11111111-1111-1111-1111-111111111111",
        projectId: "22222222-2222-2222-2222-222222222222",
        totalValue: "1850000",
        itemIds: ["33333333-3333-3333-3333-333333333333"],
      });

      expect(po.poNumber).toBe(`PO-${year}-0010`);
      expect(po.status).toBe(PurchaseOrderStatus.DRAFT);
    });

    it("sendToVendor rejects if PO is already SENT_TO_VENDOR", async () => {
      (prisma.purchaseOrder.findUnique as any).mockResolvedValue({
        id: "po-sent-already",
        poNumber: "PO-2026-0001",
        status: PurchaseOrderStatus.SENT_TO_VENDOR,
        vendor: { name: "Siemens" },
        items: [],
      });

      await expect(PurchaseOrderService.sendToVendor("po-sent-already")).rejects.toThrow(
        "Purchase order is already sent to vendor"
      );
    });

    it("updateDeliveryStatus updates delivery state and date", async () => {
      const deliveryDate = new Date("2026-05-15T12:00:00Z");
      (prisma.purchaseOrder.update as any).mockResolvedValue({
        id: "po-del-1",
        status: PurchaseOrderStatus.DELIVERED,
        actualDeliveryDate: deliveryDate,
      });

      const updated = await PurchaseOrderService.updateDeliveryStatus(
        "po-del-1",
        PurchaseOrderStatus.DELIVERED,
        deliveryDate
      );

      expect(updated.status).toBe(PurchaseOrderStatus.DELIVERED);
      expect(prisma.purchaseOrder.update).toHaveBeenCalledWith({
        where: { id: "po-del-1" },
        data: {
          status: PurchaseOrderStatus.DELIVERED,
          actualDeliveryDate: deliveryDate,
        },
      });
    });

    it("computeVendorRating returns null if vendor has no closed POs", async () => {
      (prisma.vendor.findUnique as any).mockResolvedValue({
        id: "vendor-no-pos",
        name: "New Vendor",
        purchaseOrders: [],
      });

      const rating = await VendorService.computeVendorRating("vendor-no-pos");
      expect(rating).toBeNull();
    });

    it("computeVendorRating computes score accurately on closed POs", async () => {
      const expected = new Date("2026-03-01T00:00:00Z");
      const actualOnTime = new Date("2026-03-01T00:00:00Z");

      (prisma.vendor.findUnique as any).mockResolvedValue({
        id: "vendor-perfect",
        name: "Top Vendor",
        purchaseOrders: [
          {
            status: PurchaseOrderStatus.CLOSED,
            expectedDeliveryDate: expected,
            actualDeliveryDate: actualOnTime,
          },
        ],
      });

      (prisma.vendor.update as any).mockResolvedValue({ id: "vendor-perfect", ratingScore: 5.0 });

      const rating = await VendorService.computeVendorRating("vendor-perfect");
      expect(rating).toBe(5.0);
      expect(prisma.vendor.update).toHaveBeenCalledWith({
        where: { id: "vendor-perfect" },
        data: { ratingScore: 5.0 },
      });
    });

    it("listVendors returns paginated records with total metadata", async () => {
      const mockVendors = [
        { id: "v1", name: "Siemens" },
        { id: "v2", name: "Schneider" },
      ];
      (prisma.vendor.findMany as any).mockResolvedValue(mockVendors);
      (prisma.vendor.count as any).mockResolvedValue(2);

      const res = await VendorService.listVendors({ page: 1, limit: 10 });
      expect(res.data.length).toBe(2);
      expect(res.meta.page).toBe(1);
      expect(res.meta.limit).toBe(10);
      expect(res.meta.total).toBe(2);
      expect(res.meta.totalPages).toBe(1);
    });

    it("listPOs returns paginated purchase orders with calculated offset", async () => {
      (prisma.purchaseOrder.findMany as any).mockResolvedValue([]);
      (prisma.purchaseOrder.count as any).mockResolvedValue(50);

      const res = await PurchaseOrderService.listPOs({ page: 2, limit: 20 });
      expect(res.meta.page).toBe(2);
      expect(res.meta.limit).toBe(20);
      expect(res.meta.total).toBe(50);
      expect(res.meta.totalPages).toBe(3);
      expect(res.meta.hasNextPage).toBe(true);
      expect(res.meta.hasPrevPage).toBe(true);
      expect(prisma.purchaseOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
        })
      );
    });

    it("listBOQItems paginates items for a specific project", async () => {
      const mockItems = [{ id: "boq-1", description: "PLC Module", quantity: 5 }];
      (prisma.bOQItem.findMany as any).mockResolvedValue(mockItems);
      (prisma.bOQItem.count as any).mockResolvedValue(1);

      const res = await BOQService.listBOQItems("proj-1", { page: 1, limit: 10 });
      expect(res.data).toEqual(mockItems);
      expect(res.meta.total).toBe(1);
      expect(res.meta.page).toBe(1);
      expect(prisma.bOQItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { projectId: "proj-1" },
          skip: 0,
          take: 10,
        })
      );
    });
  });
});
