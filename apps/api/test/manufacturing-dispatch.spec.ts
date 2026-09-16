import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@systrol/database";
import { ManufacturingBatchService } from "../src/modules/manufacturing/batch.service.js";
import { QCService } from "../src/modules/manufacturing/qc.service.js";
import { ShipmentService } from "../src/modules/dispatch/shipment.service.js";
import {
  CreateManufacturingBatchSchema,
  CompleteFATSchema,
  BulkQCSchema,
  CreateShipmentSchema,
  UpdateShipmentSchema,
} from "@systrol/types";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    project: {
      findUnique: vi.fn(),
    },
    manufacturingBatch: {
      count: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    qCCheck: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    shipment: {
      count: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((promises) => Promise.all(promises)),
  };
  return { prisma: mPrisma };
});

describe("Manufacturing & Dispatch Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Manufacturing & Dispatch Payload Validation", () => {
    it("validates correct CreateManufacturingBatchSchema payload", () => {
      const validPayload = {
        projectId: "11111111-1111-1111-1111-111111111111",
        panelType: "Main Drive Automation Panel",
      };
      const result = CreateManufacturingBatchSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateManufacturingBatchSchema with non-uuid projectId or short panelType", () => {
      const invalidPayload = {
        projectId: "invalid-uuid",
        panelType: "P",
      };
      const result = CreateManufacturingBatchSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates CompleteFATSchema payload", () => {
      expect(CompleteFATSchema.safeParse({ fatPassed: true }).success).toBe(true);
      expect(CompleteFATSchema.safeParse({ fatPassed: "true" }).success).toBe(false);
    });

    it("validates BulkQCSchema checklist payload", () => {
      const validPayload = {
        checks: [
          { checklistItem: "Wiring insulation check", result: "PASS" as const },
          { checklistItem: "PLC loop test", result: "FAIL" as const },
        ],
      };
      expect(BulkQCSchema.safeParse(validPayload).success).toBe(true);
      expect(BulkQCSchema.safeParse({ checks: [] }).success).toBe(false);
    });

    it("validates CreateShipmentSchema payload", () => {
      const validPayload = {
        projectId: "22222222-2222-2222-2222-222222222222",
        destination: "Toranagallu JSW Plant Site",
      };
      const result = CreateShipmentSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.originCountry).toBe("India");
      }
    });

    it("rejects CreateShipmentSchema with short destination", () => {
      const invalidPayload = {
        projectId: "22222222-2222-2222-2222-222222222222",
        destination: "A",
      };
      const result = CreateShipmentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates UpdateShipmentSchema payload", () => {
      const validPayload = {
        trackingRef: "TRK-987654",
        carrier: "Blue Dart Aviation",
        customsStatus: "CLEARED",
      };
      expect(UpdateShipmentSchema.safeParse(validPayload).success).toBe(true);
    });
  });

  describe("ManufacturingBatchService", () => {
    it("creates a manufacturing batch with formatted batch code", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "prj-1",
        projectCode: "PRJ-2026-001",
      } as any);

      vi.mocked(prisma.manufacturingBatch.count).mockResolvedValue(0);
      vi.mocked(prisma.manufacturingBatch.create).mockResolvedValue({
        id: "batch-1",
        batchCode: "BATCH-PRJ-2026-001-01",
        panelType: "PLC Control Panel",
      } as any);

      const res = await ManufacturingBatchService.createBatch("prj-1", {
        panelType: "PLC Control Panel",
      });

      expect(res.batchCode).toBe("BATCH-PRJ-2026-001-01");
      expect(prisma.manufacturingBatch.create).toHaveBeenCalledWith({
        data: {
          projectId: "prj-1",
          batchCode: "BATCH-PRJ-2026-001-01",
          panelType: "PLC Control Panel",
        },
      });
    });

    it("completes FAT with certification report URL", async () => {
      vi.mocked(prisma.manufacturingBatch.findUnique).mockResolvedValue({
        id: "batch-1",
        batchCode: "BATCH-PRJ-2026-001-01",
      } as any);

      vi.mocked(prisma.manufacturingBatch.update).mockResolvedValue({
        id: "batch-1",
        fatPassed: true,
        fatReportUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/manufacturing/fat-reports/BATCH-PRJ-2026-001-01.pdf",
      } as any);

      const res = await ManufacturingBatchService.completeFAT("batch-1", {
        fatPassed: true,
      });

      expect(res.fatPassed).toBe(true);
      expect(prisma.manufacturingBatch.update).toHaveBeenCalled();
    });
  });

  describe("QCService", () => {
    it("bulk creates QC checklist items within a transaction", async () => {
      vi.mocked(prisma.manufacturingBatch.findUnique).mockResolvedValue({
        id: "batch-1",
      } as any);

      vi.mocked(prisma.qCCheck.create).mockResolvedValue({
        id: "qc-1",
        batchId: "batch-1",
      } as any);

      const checks = [
        { checklistItem: "Wiring continuity", result: "PASS" as const },
        { checklistItem: "HV insulation", result: "PASS" as const },
      ];

      await QCService.bulkCreateQCChecks("batch-1", checks, "user-1");

      expect(prisma.qCCheck.create).toHaveBeenCalledTimes(2);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("ShipmentService", () => {
    it("creates a shipment consignment with sequence number", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "prj-1",
        projectCode: "PRJ-2026-001",
      } as any);

      vi.mocked(prisma.shipment.count).mockResolvedValue(0);
      vi.mocked(prisma.shipment.create).mockResolvedValue({
        id: "shp-1",
        shipmentNo: "SHP-PRJ-2026-001-01",
        carrier: "Blue Dart",
      } as any);

      const res = await ShipmentService.createShipment("prj-1", {
        carrier: "Blue Dart",
      });

      expect(res.shipmentNo).toBe("SHP-PRJ-2026-001-01");
      expect(prisma.shipment.create).toHaveBeenCalled();
    });

    it("updates shipment upon POD upload", async () => {
      vi.mocked(prisma.shipment.findUnique).mockResolvedValue({
        id: "shp-1",
      } as any);

      vi.mocked(prisma.shipment.update).mockResolvedValue({
        id: "shp-1",
        status: "DELIVERED",
        podUrl: "https://pod.pdf",
      } as any);

      const res = await ShipmentService.uploadPOD("shp-1", "https://pod.pdf");

      expect(res.status).toBe("DELIVERED");
      expect(prisma.shipment.update).toHaveBeenCalledWith({
        where: { id: "shp-1" },
        data: {
          podUrl: "https://pod.pdf",
          deliveredAt: expect.any(Date),
          status: "DELIVERED",
        },
      });
    });
  });
});
