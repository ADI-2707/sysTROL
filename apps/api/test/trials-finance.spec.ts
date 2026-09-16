import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrialsAndMOMService } from "../src/modules/trials/trials-mom.service.js";
import { FinanceAndAMCService } from "../src/modules/finance/finance-amc.service.js";
import { prisma } from "@systrol/database";
import {
  CreatePGTestSchema,
  CreateInvoiceSchema,
  InvoiceMilestone,
  InvoiceStatus,
} from "@systrol/types";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    trialRecord: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    pGTestResult: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    minutesOfMeeting: {
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
    },
    invoice: {
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    payment: {
      create: vi.fn(),
    },
    retentionSchedule: {
      create: vi.fn(),
      update: vi.fn(),
    },
    aMCContract: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(async (cb) => {
      if (typeof cb === "function") {
        return cb(mPrisma);
      }
      return Promise.all(cb);
    }),
  };
  return { prisma: mPrisma };
});

describe("Trials, MOM, Finance & AMC Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Payload Validation", () => {
    it("validates correct CreatePGTestSchema payload", () => {
      const validPayload = {
        results: [
          {
            kpiName: "Strip Thickness Deviation",
            contractedVal: "±0.025 mm",
            achievedVal: "±0.018 mm",
            passed: true,
          },
        ],
      };
      const result = CreatePGTestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreatePGTestSchema payload with empty results array", () => {
      const invalidPayload = { results: [] };
      const result = CreatePGTestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates correct CreateInvoiceSchema payload", () => {
      const validPayload = {
        projectId: "11111111-1111-1111-1111-111111111111",
        milestone: InvoiceMilestone.COMMISSIONING,
        amount: "1500000.00",
        dueDate: "2026-08-15T00:00:00.000Z",
      };
      const result = CreateInvoiceSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateInvoiceSchema payload with invalid amount format or milestone", () => {
      const invalidPayload = {
        projectId: "11111111-1111-1111-1111-111111111111",
        milestone: "INVALID_STAGE",
        amount: "invalid-amount",
        dueDate: "2026-08-15T00:00:00.000Z",
      };
      const result = CreateInvoiceSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("TrialsAndMOMService", () => {
    it("records a cold or hot trial run", async () => {
      vi.mocked(prisma.trialRecord.create).mockResolvedValue({
        id: "tr-1",
        projectId: "prj-1",
        trialType: "HOT_TRIAL",
      } as any);

      const res = await TrialsAndMOMService.recordTrial("prj-1", {
        trialType: "HOT_TRIAL",
        runDate: "2026-03-25T10:00:00Z",
        observations: "Mill rolled 500 tons without cobbles",
      });

      expect(res.trialType).toBe("HOT_TRIAL");
      expect(prisma.trialRecord.create).toHaveBeenCalled();
    });

    it("records PG test results in bulk", async () => {
      vi.mocked(prisma.pGTestResult.create).mockResolvedValue({
        id: "pg-1",
        kpiName: "Gauge Tolerance",
        passed: true,
      } as any);

      await TrialsAndMOMService.recordPGTestResults("prj-1", {
        results: [
          {
            kpiName: "Gauge Tolerance",
            contractedVal: "±0.025mm",
            achievedVal: "±0.018mm",
            passed: true,
          },
        ],
      });

      expect(prisma.pGTestResult.create).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it("creates and signs off handover Minutes of Meeting (MOM)", async () => {
      vi.mocked(prisma.minutesOfMeeting.create).mockResolvedValue({
        id: "mom-1",
        summary: "Handover signed",
      } as any);

      const mom = await TrialsAndMOMService.createMOM("prj-1", {
        meetingDate: "2026-04-01T10:00:00Z",
        attendees: ["John Doe", "Jane Smith"],
        summary: "Handover signed",
      });

      expect(mom.id).toBe("mom-1");
      expect(prisma.minutesOfMeeting.create).toHaveBeenCalled();

      vi.mocked(prisma.minutesOfMeeting.update).mockResolvedValue({
        id: "mom-1",
        signedByClient: true,
      } as any);

      const signed = await TrialsAndMOMService.signMOM("mom-1", "user-lead-1");
      expect(signed.signedByClient).toBe(true);
      expect(prisma.minutesOfMeeting.update).toHaveBeenCalled();
    });
  });

  describe("FinanceAndAMCService", () => {
    it("creates milestone invoice with sequential format", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "prj-1",
        projectCode: "PRJ-2026-001",
      } as any);

      vi.mocked(prisma.invoice.count).mockResolvedValue(0);
      vi.mocked(prisma.invoice.create).mockResolvedValue({
        id: "inv-1",
        invoiceNumber: "INV-PRJ-2026-001-01",
        amount: "50000",
      } as any);

      const inv = await FinanceAndAMCService.createInvoice("prj-1", {
        milestone: "COMMISSIONING" as any,
        amount: "50000",
        dueDate: "2026-05-01T00:00:00Z",
      });

      expect(inv.invoiceNumber).toBe("INV-PRJ-2026-001-01");
      expect(prisma.invoice.create).toHaveBeenCalled();
    });

    it("records payment and marks invoice PAID if full amount is cleared", async () => {
      vi.mocked(prisma.invoice.findUnique).mockResolvedValue({
        id: "inv-1",
        amount: "10000",
        payments: [{ amountPaid: "5000" }],
      } as any);

      vi.mocked(prisma.payment.create).mockResolvedValue({
        id: "pay-1",
        amountPaid: "5000",
      } as any);

      await FinanceAndAMCService.recordPayment("inv-1", {
        amountPaid: "5000",
        paidAt: "2026-04-15T00:00:00Z",
      });

      expect(prisma.payment.create).toHaveBeenCalled();
      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: "inv-1" },
        data: { status: InvoiceStatus.PAID },
      });
    });

    it("initiates AMC contract with code and start/end dates", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "prj-1",
        projectCode: "PRJ-2026-001",
      } as any);

      vi.mocked(prisma.aMCContract.create).mockResolvedValue({
        id: "amc-1",
        contractCode: "AMC-PRJ-2026-001",
      } as any);

      const amc = await FinanceAndAMCService.createAMCContract("prj-1", {
        startDate: "2026-05-01T00:00:00Z",
        endDate: "2027-05-01T00:00:00Z",
        visitFrequency: "QUARTERLY",
      });

      expect(amc.contractCode).toBe("AMC-PRJ-2026-001");
      expect(prisma.aMCContract.create).toHaveBeenCalled();
    });
  });
});
