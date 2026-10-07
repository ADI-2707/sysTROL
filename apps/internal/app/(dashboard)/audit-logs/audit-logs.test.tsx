import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuditLogsPage from "./page.js";

const mockUseAuth = vi.fn();
vi.mock("@/lib/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockApiClient = vi.fn();
vi.mock("@/lib/api-client", () => ({
  apiClient: (...args: any[]) => mockApiClient(...args),
}));

describe("AuditLogsPage Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders authorization required barrier when user is not super admin", () => {
    mockUseAuth.mockReturnValue({
      user: { email: "engineer@systrol.com", role: "FIELD_ENGINEER", isSeededSuperAdmin: false },
    });

    render(<AuditLogsPage />);

    expect(screen.getByText("Super Administrator Authorization Required")).toBeDefined();
    expect(screen.getByText("Return to Dashboard")).toBeDefined();
  });

  it("renders audit log table and data when user is super admin", async () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@systrol.com", role: "SUPER_ADMIN", isSeededSuperAdmin: true },
    });

    mockApiClient.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "audit-1",
            actorId: "usr-admin-01",
            action: "POST /api/v1/projects",
            entityType: "projects",
            entityId: "prj-88",
            createdAt: new Date().toISOString(),
            project: { code: "PRJ-01", name: "Steel Mill Revamp" },
            diff: { before: null, after: { name: "Steel Mill Revamp" } },
          },
        ],
        pagination: { total: 1, totalPages: 1, page: 1, limit: 15 },
      }),
    });

    render(<AuditLogsPage />);

    expect(screen.getByText("Audit Trail & Compliance Ledger")).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("POST /api/v1/projects")).toBeDefined();
      expect(screen.getByText("PRJ-01")).toBeDefined();
    });
  });

  it("opens diff viewer drawer when clicking Diff button", async () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@systrol.com", role: "SUPER_ADMIN", isSeededSuperAdmin: true },
    });

    mockApiClient.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "audit-2",
            actorId: "usr-admin-02",
            action: "PATCH /api/v1/lifecycle",
            entityType: "lifecycle",
            entityId: "lc-10",
            createdAt: new Date().toISOString(),
            diff: { before: { status: "DRAFT" }, after: { status: "ACTIVE" } },
          },
        ],
        pagination: { total: 1, totalPages: 1, page: 1, limit: 15 },
      }),
    });

    render(<AuditLogsPage />);

    const diffButton = await screen.findByRole("button", { name: /diff/i });
    fireEvent.click(diffButton);

    expect(await screen.findByText("Mutation Audit Record")).toBeDefined();
    expect(screen.getByText("State Delta (Before / After Snapshot)")).toBeDefined();
  });

  it("renders both tab buttons for Internal Ops Governance and Public Web Telemetry", async () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@systrol.com", role: "SUPER_ADMIN", isSeededSuperAdmin: true },
    });

    mockApiClient.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        pagination: { total: 0, totalPages: 1, page: 1, limit: 15 },
      }),
    });

    render(<AuditLogsPage />);

    expect(screen.getByText("Internal Ops Governance")).toBeDefined();
    expect(screen.getByText("Public Web Telemetry")).toBeDefined();
  });

  it("switches to Public Web Telemetry tab and displays latency monitoring banner and telemetry feed", async () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@systrol.com", role: "SUPER_ADMIN", isSeededSuperAdmin: true },
    });

    mockApiClient.mockImplementation(async (url: string) => {
      if (url.includes("/metrics/latency")) {
        return {
          ok: true,
          json: async () => ({
            totalSamples: 150,
            avgMs: 12.5,
            medianMs: 10.2,
            p95Ms: 24.1,
            p99Ms: 38.6,
            minMs: 2.5,
            maxMs: 65.0,
            recentSamples: [10, 12, 14, 15, 11, 13],
          }),
        };
      }
      if (url.includes("/cta/metrics")) {
        return {
          ok: true,
          json: async () => ({
            totalEvents: 500,
            events24h: 95,
            events7d: 420,
          }),
        };
      }
      if (url.includes("/cta/feed")) {
        return {
          ok: true,
          json: async () => ({
            ctaEvents: [
              {
                id: "cta-evt-1",
                eventType: "CLICK",
                pagePath: "/solutions/rolling-mill-automation",
                ctaId: "quote-cta",
                ipAddress: "203.0.113.195",
                referrer: "https://google.com",
                utmSource: "google",
                utmMedium: "cpc",
                createdAt: new Date().toISOString(),
              },
            ],
            totalCtaEvents: 1,
            totalEnquiries: 1,
            page: 1,
            limit: 15,
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({
          items: [],
          pagination: { total: 0, totalPages: 1, page: 1, limit: 15 },
        }),
      };
    });

    render(<AuditLogsPage />);

    const publicTab = screen.getByText("Public Web Telemetry");
    fireEvent.click(publicTab);

    expect(await screen.findByText("API Latency & Telemetry Diagnostics")).toBeDefined();
    expect(await screen.findByText("203.0.113.195")).toBeDefined();
    expect(screen.getAllByText("quote-cta").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("/solutions/rolling-mill-automation")).toBeDefined();
  });
});
