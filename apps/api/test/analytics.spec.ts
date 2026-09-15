import { describe, it, expect, vi, beforeEach } from "vitest";
import { AnalyticsService } from "../src/modules/analytics/analytics.service.js";
import { prisma } from "@systrol/database";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    projectStageHistory: {
      findMany: vi.fn(),
    },
    enquiry: {
      findMany: vi.fn(),
    },
    invoice: {
      findMany: vi.fn(),
    },
    aMCContract: {
      findMany: vi.fn(),
    },
  };
  return { prisma: mPrisma };
});

describe("Phase 13: Executive Analytics Read Models", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates stage dwell time between stage transitions", async () => {
    vi.mocked(prisma.projectStageHistory.findMany).mockResolvedValue([
      {
        projectId: "p1",
        toStage: "ENGINEERING",
        changedAt: new Date("2026-01-01T00:00:00Z"),
        project: { millType: "HOT_STRIP_MILL" },
      },
      {
        projectId: "p1",
        toStage: "MANUFACTURING",
        changedAt: new Date("2026-01-21T00:00:00Z"),
        project: { millType: "HOT_STRIP_MILL" },
      },
    ] as any);

    const dwell = await AnalyticsService.getStageDwellTimes();
    expect(dwell.length).toBeGreaterThan(0);
    const eng = dwell.find((d) => d.stage === "ENGINEERING");
    expect(eng?.avgDays).toBe(20);
    expect(eng?.millType).toBe("HOT_STRIP_MILL");
  });

  it("aggregates enquiry conversion funnel by source", async () => {
    vi.mocked(prisma.enquiry.findMany).mockResolvedValue([
      { source: "TRADE_SHOW", status: "OPEN" },
      { source: "TRADE_SHOW", status: "CONVERTED" },
      { source: "WEB_RFQ", status: "CONVERTED" },
    ] as any);

    const funnel = await AnalyticsService.getEnquiryFunnel();
    expect(funnel.length).toBe(2);
    const tradeShow = funnel.find((f) => f.source === "TRADE_SHOW");
    expect(tradeShow?.total).toBe(2);
    expect(tradeShow?.statusBreakdown["OPEN"]).toBe(1);
    expect(tradeShow?.statusBreakdown["CONVERTED"]).toBe(1);
  });

  it("computes payment aging into current and overdue buckets", async () => {
    const now = new Date();
    const futureDue = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    const pastDue15 = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);

    vi.mocked(prisma.invoice.findMany).mockResolvedValue([
      {
        amount: "5000",
        dueDate: futureDue,
        payments: [],
      },
      {
        amount: "2000",
        dueDate: pastDue15,
        payments: [{ amountPaid: "500" }],
      },
    ] as any);

    const aging = await AnalyticsService.getPaymentAging();
    const current = aging.find((a) => a.bucket === "current");
    const bucket30 = aging.find((a) => a.bucket === "30");

    expect(current?.totalAmount).toBe("5000.00");
    expect(bucket30?.totalAmount).toBe("1500.00");
  });

  it("generates AMC renewal forecast with spares alert", async () => {
    const now = new Date();
    const nearExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    vi.mocked(prisma.aMCContract.findMany).mockResolvedValue([
      {
        id: "amc-1",
        endDate: nearExpiry,
        project: { name: "ArcelorMittal HSM" },
      },
    ] as any);

    const forecast = await AnalyticsService.getAMCForecast();
    expect(forecast.length).toBe(1);
    expect(forecast[0].daysUntilExpiry).toBeLessThanOrEqual(30);
    expect(forecast[0].sparesAlertCount).toBe(3);
  });
});
