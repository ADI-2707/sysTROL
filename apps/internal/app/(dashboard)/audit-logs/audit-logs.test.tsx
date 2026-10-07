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
});
