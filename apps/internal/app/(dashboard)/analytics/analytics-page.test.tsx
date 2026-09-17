import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AnalyticsDashboardPage from "./page";

const mockProjects = {
  mostDoneMaterial: [
    { material: "Carbon Steel (IS 2062)", count: 20 },
    { material: "Alloy Steel (EN19/EN24)", count: 10 },
  ],
  topClientsOverYears: [
    { clientId: "c1", clientName: "Tata Steel Ltd", projectCount: 8, years: [2022, 2024] },
  ],
  mostDoneLines: [
    { lineType: "Continuous TMT Bar Mill", count: 15 },
  ],
  topMaterialAndLineCombinations: [
    { material: "Carbon Steel (IS 2062)", lineType: "Continuous TMT Bar Mill", count: 12 },
  ],
  fastestExecutionCombination: {
    material: "Carbon Steel (IS 2062)",
    lineType: "Continuous TMT Bar Mill",
    minDays: 28,
    projectCode: "PRJ-2024-TEST",
    projectName: "Test Cutover Project",
  },
};

const mockCta = {
  mostEnquiredPages: [
    { pagePath: "/services/automation-consultancy", count: 50 },
  ],
  mostEffectiveCtaButtons: [
    { ctaId: "floating_whatsapp", count: 40 },
  ],
  directWhatsappCount: 40,
  totalCtaEvents: 80,
  totalEnquiries: 30,
};

const mockEmployees = {
  employees: [
    {
      employeeId: "e1",
      employeeName: "Rajesh Sharma",
      totalSites: 10,
      completedSites: 9,
      indiaSites: 7,
      overseasSites: 3,
    },
  ],
  totalCompletedSites: 9,
  totalIndiaSites: 7,
  totalOverseasSites: 3,
};

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn((url: string) => {
    if (url.includes("/api/v1/analytics/projects")) {
      return Promise.resolve({ ok: true, json: async () => mockProjects });
    }
    if (url.includes("/api/v1/analytics/cta")) {
      return Promise.resolve({ ok: true, json: async () => mockCta });
    }
    if (url.includes("/api/v1/analytics/employees")) {
      return Promise.resolve({ ok: true, json: async () => mockEmployees });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  }),
}));

describe("multi-tab analytics dashboard tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title and all three tab headers", () => {
    render(<AnalyticsDashboardPage />);

    expect(screen.getByText("Industrial Analytics & Performance Center")).toBeDefined();
    expect(screen.getByText("Projects Intelligence")).toBeDefined();
    expect(screen.getByText("CTA & Conversion Attributions")).toBeDefined();
    expect(screen.getByText("Employee Site Deployments")).toBeDefined();
  });

  it("renders Projects tab metrics by default", async () => {
    render(<AnalyticsDashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Top Processed Materials")).toBeDefined();
      expect(screen.getByText("Top Mill Lines")).toBeDefined();
      expect(screen.getByText("Top Material & Line Combination")).toBeDefined();
      expect(screen.getByText("Fastest Cutover Execution Record")).toBeDefined();
      expect(screen.getByText("Top Clients Over the Years")).toBeDefined();
    });
  });

  it("switches to CTA tab and displays CTA conversion metrics", async () => {
    render(<AnalyticsDashboardPage />);

    const ctaTab = screen.getByRole("button", { name: /CTA & Conversion Attributions/i });
    fireEvent.click(ctaTab);

    await waitFor(() => {
      expect(screen.getByText("Direct WhatsApp Conversions")).toBeDefined();
      expect(screen.getByText("Most Inquired Landing Pages")).toBeDefined();
      expect(screen.getByText("Most Effective CTA Buttons")).toBeDefined();
    });
  });

  it("switches to Employees tab and displays deployment records", async () => {
    render(<AnalyticsDashboardPage />);

    const empTab = screen.getByRole("button", { name: /Employee Site Deployments/i });
    fireEvent.click(empTab);

    await waitFor(() => {
      expect(screen.getByText("Total Completed Sites")).toBeDefined();
      expect(screen.getByText("India Sites (Domestic)")).toBeDefined();
      expect(screen.getByText("Overseas Sites (Global)")).toBeDefined();
      expect(screen.getByText("Engineer Site Deployments & Field Records")).toBeDefined();
    });
  });
});
