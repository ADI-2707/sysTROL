import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SystemHealthBeacon } from "./SystemHealthBeacon.js";

const mockUseAuth = vi.fn();
vi.mock("@/lib/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockApiClient = vi.fn();
vi.mock("@/lib/api-client", () => ({
  apiClient: (...args: any[]) => mockApiClient(...args),
}));

describe("SystemHealthBeacon Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders healthy status when api returns healthy payload", async () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@systrol.com", role: "SUPER_ADMIN", isSeededSuperAdmin: true },
    });

    mockApiClient.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "healthy",
        checks: {
          database: { status: "up", latencyMs: 12 },
          redis: { status: "up", latencyMs: 6 },
        },
      }),
    });

    render(<SystemHealthBeacon />);

    await waitFor(() => {
      expect(screen.getByText("SYSTEM HEALTHY")).toBeDefined();
    });
  });

  it("opens diagnostic modal when clicked by super admin", async () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@systrol.com", role: "SUPER_ADMIN", isSeededSuperAdmin: true },
    });

    mockApiClient.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "healthy",
        uptimeSeconds: 3600,
        checks: {
          database: { status: "up", latencyMs: 15 },
          redis: { status: "up", latencyMs: 8 },
          memory: { rssMb: 128 },
        },
      }),
    });

    render(<SystemHealthBeacon />);

    const button = await screen.findByRole("button", { name: /system healthy/i });
    fireEvent.click(button);

    expect(await screen.findByText("Infrastructure Diagnostics")).toBeDefined();
    expect(screen.getByText("Neon PostgreSQL")).toBeDefined();
    expect(screen.getByText("Upstash Redis")).toBeDefined();
  });

  it("shows offline status when api call fails", async () => {
    mockUseAuth.mockReturnValue({
      user: { email: "admin@systrol.com", role: "SUPER_ADMIN", isSeededSuperAdmin: true },
    });

    mockApiClient.mockRejectedValueOnce(new Error("Network failed"));

    render(<SystemHealthBeacon />);

    await waitFor(() => {
      expect(screen.getByText("OFFLINE")).toBeDefined();
    });
  });
});
