import { describe, it, expect, vi, beforeEach } from "vitest";
import { PurchaseOrderService } from "../src/modules/procurement/purchase-order.service.js";
import { VendorService } from "../src/modules/procurement/vendor.service.js";
import { prisma } from "@systrol/database";
import { PurchaseOrderStatus } from "@systrol/types";

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
    },
    bOQItem: {
      updateMany: vi.fn(),
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

describe("Procurement Services Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Task 7.6: createPO generates sequence poNumber in PO-YYYY-NNNN format", async () => {
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
      vendorId: "v-1",
      projectId: "proj-1",
      totalValue: "1850000",
      itemIds: ["item-1", "item-2"],
    });

    expect(po.poNumber).toBe(`PO-${year}-0010`);
    expect(po.status).toBe(PurchaseOrderStatus.DRAFT);
  });

  it("Task 7.6: sendToVendor rejects if PO is already SENT_TO_VENDOR", async () => {
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

  it("Task 7.6: computeVendorRating returns null if vendor has no closed POs", async () => {
    (prisma.vendor.findUnique as any).mockResolvedValue({
      id: "vendor-no-pos",
      name: "New Vendor",
      purchaseOrders: [],
    });

    const rating = await VendorService.computeVendorRating("vendor-no-pos");
    expect(rating).toBeNull();
  });

  it("Task 7.6: computeVendorRating computes score accurately on closed POs", async () => {
    const expected = new Date("2026-03-01T00:00:00Z");
    const actualOnTime = new Date("2026-03-01T00:00:00Z");

    (prisma.vendor.findUnique as any).mockResolvedValue({
      id: "vendor-perfect",
      name: "Top Vendor",
      purchaseOrders: [
        {
          id: "po-1",
          status: PurchaseOrderStatus.CLOSED,
          expectedDeliveryDate: expected,
          actualDeliveryDate: actualOnTime,
        },
      ],
    });

    const rating = await VendorService.computeVendorRating("vendor-perfect");
    expect(rating).toBe(5.0);
    expect(prisma.vendor.update).toHaveBeenCalledWith({
      where: { id: "vendor-perfect" },
      data: { ratingScore: 5.0 },
    });
  });
});
