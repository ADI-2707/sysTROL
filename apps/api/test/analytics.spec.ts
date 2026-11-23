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
    project: {
      findMany: vi.fn(),
    },
    ctaEvent: {
      findMany: vi.fn(),
    },
    employeeProfile: {
      findMany: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
    },
  };
  return { prisma: mPrisma };
});

describe("AnalyticsService tests", () => {
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

  it("returns empty array for stage dwell times when history is empty", async () => {
    vi.mocked(prisma.projectStageHistory.findMany).mockResolvedValue([]);
    const dwell = await AnalyticsService.getStageDwellTimes();
    expect(dwell).toEqual([]);
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

  it("calculates real projects analytics with material, lines, combinations and fastest cutover", async () => {
    vi.mocked(prisma.project.findMany).mockResolvedValue([
      {
        id: "p1",
        projectCode: "PRJ-001",
        name: "Bar Mill Modernization",
        material: "Alloy Steel (EN19/EN24)",
        lineType: "Continuous TMT Bar Mill",
        millType: "Steel Rolling Mills",
        clientId: "c1",
        client: { name: "Tata Steel" },
        startDate: new Date("2024-01-01T00:00:00Z"),
        actualCutoverDate: new Date("2024-02-15T00:00:00Z"),
      },
      {
        id: "p2",
        projectCode: "PRJ-002",
        name: "Wire Rod Line Upgrade",
        material: "Alloy Steel (EN19/EN24)",
        lineType: "Wire Rod Block",
        millType: "Steel Rolling Mills",
        clientId: "c1",
        client: { name: "Tata Steel" },
        startDate: new Date("2024-03-01T00:00:00Z"),
        actualCutoverDate: new Date("2024-04-10T00:00:00Z"),
      },
      {
        id: "p3",
        projectCode: "PRJ-003",
        name: "Hot Strip Revamp",
        material: null,
        lineType: null,
        millType: "Hot Strip Mill",
        clientId: "c2",
        client: { name: "JSW Steel" },
        startDate: new Date("2025-01-01T00:00:00Z"),
        actualCutoverDate: null,
      },
    ] as any);

    const result = await AnalyticsService.getProjectsAnalytics();

    expect(result.mostDoneMaterial).toEqual([
      { material: "Alloy Steel (EN19/EN24)", count: 2 },
      { material: "Unspecified", count: 1 },
    ]);

    expect(result.mostDoneLines).toEqual([
      { lineType: "Continuous TMT Bar Mill", count: 1 },
      { lineType: "Wire Rod Block", count: 1 },
      { lineType: "Hot Strip Mill", count: 1 },
    ]);

    expect(result.topClientsOverYears).toEqual([
      { clientId: "c1", clientName: "Tata Steel", projectCount: 2, years: [2024] },
      { clientId: "c2", clientName: "JSW Steel", projectCount: 1, years: [2025] },
    ]);

    expect(result.fastestExecutionCombination).toEqual({
      material: "Alloy Steel (EN19/EN24)",
      lineType: "Wire Rod Block",
      minDays: 40,
      projectCode: "PRJ-002",
      projectName: "Wire Rod Line Upgrade",
    });
  });

  it("returns clean empty data when no projects exist in database", async () => {
    vi.mocked(prisma.project.findMany).mockResolvedValue([]);

    const result = await AnalyticsService.getProjectsAnalytics();

    expect(result.mostDoneMaterial).toEqual([]);
    expect(result.mostDoneLines).toEqual([]);
    expect(result.topClientsOverYears).toEqual([]);
    expect(result.topMaterialAndLineCombinations).toEqual([]);
    expect(result.fastestExecutionCombination).toBeNull();
  });

  it("calculates real CTA analytics and returns 0 counts for empty database", async () => {
    vi.mocked(prisma.enquiry.findMany).mockResolvedValue([
      { pagePath: "/services/consulting", ctaId: "btn-quote", source: "WEB" },
      { pagePath: "/services/consulting", ctaId: "btn-quote", source: "WEB" },
    ] as any);

    vi.mocked(prisma.ctaEvent.findMany).mockResolvedValue([
      { pagePath: "/contact", ctaId: "btn-whatsapp", eventType: "WHATSAPP_CLICK" },
    ] as any);

    const withData = await AnalyticsService.getCtaAnalytics();
    expect(withData.totalEnquiries).toBe(2);
    expect(withData.totalCtaEvents).toBe(1);
    expect(withData.directWhatsappCount).toBe(1);
    expect(withData.mostEnquiredPages[0]).toEqual({ pagePath: "/services/consulting", count: 2 });

    vi.mocked(prisma.enquiry.findMany).mockResolvedValue([]);
    vi.mocked(prisma.ctaEvent.findMany).mockResolvedValue([]);

    const empty = await AnalyticsService.getCtaAnalytics();
    expect(empty.totalEnquiries).toBe(0);
    expect(empty.totalCtaEvents).toBe(0);
    expect(empty.directWhatsappCount).toBe(0);
    expect(empty.mostEnquiredPages).toEqual([]);
    expect(empty.mostEffectiveCtaButtons).toEqual([]);
  });

  it("calculates real employee deployments and returns 0 counts when empty", async () => {
    vi.mocked(prisma.user.findMany).mockResolvedValue([
      { id: "u1", name: "Suresh Patel" },
    ] as any);

    vi.mocked(prisma.employeeProfile.findMany).mockResolvedValue([
      {
        id: "emp-1",
        userId: "u1",
        designation: "Lead Engineer",
        deployments: [
          { country: "India", endDate: new Date("2020-01-01T00:00:00Z") },
          { country: "Oman", endDate: new Date("2020-01-01T00:00:00Z") },
          { country: "India", endDate: new Date("2099-01-01T00:00:00Z") },
        ],
      },
    ] as any);

    const withData = await AnalyticsService.getEmployeesAnalytics();
    expect(withData.totalCompletedSites).toBe(2);
    expect(withData.totalIndiaSites).toBe(2);
    expect(withData.totalOverseasSites).toBe(1);
    expect(withData.employees[0].employeeName).toBe("Suresh Patel");
    expect(withData.employees[0].totalSites).toBe(3);
    expect(withData.employees[0].completedSites).toBe(2);

    vi.mocked(prisma.employeeProfile.findMany).mockResolvedValue([]);
    vi.mocked(prisma.user.findMany).mockResolvedValue([]);

    const empty = await AnalyticsService.getEmployeesAnalytics();
    expect(empty.totalCompletedSites).toBe(0);
    expect(empty.totalIndiaSites).toBe(0);
    expect(empty.totalOverseasSites).toBe(0);
    expect(empty.employees).toEqual([]);
  });
});
