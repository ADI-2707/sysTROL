import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { LatencyMonitoringBanner } from "./LatencyMonitoringBanner.js";

const mockApiClient = vi.fn();
vi.mock("@/lib/api-client", () => ({
  apiClient: (...args: any[]) => mockApiClient(...args),
}));

describe("LatencyMonitoringBanner Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders latency metrics, percentiles, and telemetry counts when API succeeds", async () => {
    mockApiClient.mockImplementation(async (url: string) => {
      if (url.includes("/metrics/latency")) {
        return {
          ok: true,
          json: async () => ({
            totalSamples: 200,
            avgMs: 15.4,
            medianMs: 12.0,
            p95Ms: 35.8,
            p99Ms: 52.1,
            minMs: 2.1,
            maxMs: 74.0,
            recentSamples: [10, 15, 20, 25, 30],
          }),
        };
      }
      if (url.includes("/cta/metrics")) {
        return {
          ok: true,
          json: async () => ({
            totalEvents: 1240,
            events24h: 310,
            events7d: 890,
          }),
        };
      }
      return { ok: false };
    });

    render(<LatencyMonitoringBanner />);

    await waitFor(() => {
      expect(screen.getByText("15.4 ms")).toBeDefined();
      expect(screen.getByText("35.8 ms")).toBeDefined();
      expect(screen.getByText("52.1 ms")).toBeDefined();
      expect(screen.getByText("310")).toBeDefined();
      expect(screen.getByText("Optimal SLA")).toBeDefined();
    });
  });

  it("falls back gracefully to offline defaults when API request fails", async () => {
    mockApiClient.mockRejectedValue(new Error("Network Error"));

    render(<LatencyMonitoringBanner />);

    await waitFor(() => {
      expect(screen.getByText("API Latency & Telemetry Diagnostics")).toBeDefined();
      expect(screen.getByText("14.2 ms")).toBeDefined();
      expect(screen.getByText("32.5 ms")).toBeDefined();
      expect(screen.getByText("48.0 ms")).toBeDefined();
    });
  });

  it("halts repeated polling on 401 response", async () => {
    vi.useFakeTimers();
    mockApiClient.mockResolvedValue({
      status: 401,
      ok: false,
    });

    render(<LatencyMonitoringBanner />);

    await vi.advanceTimersByTimeAsync(0);
    const initialCalls = mockApiClient.mock.calls.length;

    await vi.advanceTimersByTimeAsync(90000);
    expect(mockApiClient.mock.calls.length).toBe(initialCalls);

    vi.useRealTimers();
  });
});
