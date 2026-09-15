import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrialsAndMOMService } from "../src/modules/trials/trials-mom.service.js";
import { FinanceAndAMCService } from "../src/modules/finance/finance-amc.service.js";
import { prisma } from "@systrol/database";

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

describe("Phase 12: Trials, MOM, Finance & AMC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

      vi.mocked(prisma.minutesOfMeeting.update).mockResolvedValue({
        id: "mom-1",
        signedByClient: true,
      } as any);

      await TrialsAndMOMService.createMOM("prj-1", {
        meetingDate: "2026-04-01T10:00:00Z",
        attendees: ["Preet", "Client VP"],
        summary: "Handover signed",
      });

      const signed = await TrialsAndMOMService.signMOM("mom-1", "user-client");
      expect(signed.signedByClient).toBe(true);
      expect(prisma.minutesOfMeeting.update).toHaveBeenCalled();
    });
  });

  describe("FinanceAndAMCService", () => {
    it("creates a milestone invoice with sequence number", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "prj-1",
        projectCode: "PRJ-2026-001",
      } as any);

      vi.mocked(prisma.invoice.count).mockResolvedValue(0);
      vi.mocked(prisma.invoice.create).mockResolvedValue({
        id: "inv-1",
        invoiceNumber: "INV-PRJ-2026-001-01",
      } as any);

      const res = await FinanceAndAMCService.createInvoice({
        projectId: "prj-1",
        milestone: "ADVANCE" as any,
        amount: "1850000.00",
        dueDate: "2026-01-30T00:00:00Z",
      });

      expect(res.invoiceNumber).toBe("INV-PRJ-2026-001-01");
      expect(prisma.invoice.create).toHaveBeenCalled();
    });

    it("records payment and marks invoice PAID if fully settled", async () => {
      vi.mocked(prisma.invoice.findUnique).mockResolvedValue({
        id: "inv-1",
        amount: "1000",
        payments: [{ amountPaid: "500" }],
      } as any);

      vi.mocked(prisma.payment.create).mockResolvedValue({
        id: "pay-1",
        amountPaid: "500",
      } as any);

      await FinanceAndAMCService.recordPayment("inv-1", {
        amountPaid: "500",
        reference: "NEFT-889102",
      });

      expect(prisma.payment.create).toHaveBeenCalled();
      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: "inv-1" },
        data: { status: "PAID" },
      });
    });

    it("creates an AMC contract with contract code", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "prj-1",
        projectCode: "PRJ-2026-001",
      } as any);

      vi.mocked(prisma.aMCContract.create).mockResolvedValue({
        id: "amc-1",
        contractCode: "AMC-PRJ-2026-001",
      } as any);

      const res = await FinanceAndAMCService.createAMCContract("prj-1", {
        startDate: "2026-05-01T00:00:00Z",
        endDate: "2027-04-30T00:00:00Z",
        visitFrequency: "QUARTERLY",
      });

      expect(res.contractCode).toBe("AMC-PRJ-2026-001");
      expect(prisma.aMCContract.create).toHaveBeenCalled();
    });
  });
});
