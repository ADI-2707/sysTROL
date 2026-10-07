import { describe, it, expect, beforeEach } from "vitest";
import { latencyTracker } from "../src/common/metrics/latency-tracker.js";
import { buildServer } from "../src/server.js";

describe("Latency Tracker & Metrics Endpoint Tests", () => {
  beforeEach(() => {
    latencyTracker.reset();
  });

  it("returns zero metrics when tracker is empty", () => {
    const metrics = latencyTracker.getMetrics();
    expect(metrics.count).toBe(0);
    expect(metrics.avgMs).toBe(0);
    expect(metrics.p95Ms).toBe(0);
    expect(metrics.p99Ms).toBe(0);
    expect(metrics.recentSamples).toEqual([]);
  });

  it("calculates average, median, p95, and p99 accurately from recorded samples", () => {
    for (let i = 1; i <= 100; i++) {
      latencyTracker.recordLatency(i * 10);
    }

    const metrics = latencyTracker.getMetrics();
    expect(metrics.count).toBe(100);
    expect(metrics.minMs).toBe(10);
    expect(metrics.maxMs).toBe(1000);
    expect(metrics.avgMs).toBe(505);
    expect(metrics.medianMs).toBe(510);
    expect(metrics.p95Ms).toBe(960);
    expect(metrics.p99Ms).toBe(1000);
    expect(metrics.recentSamples.length).toBeLessThanOrEqual(24);
  });

  it("ignores negative or invalid latency values", () => {
    latencyTracker.recordLatency(-5);
    latencyTracker.recordLatency(NaN);
    expect(latencyTracker.getMetrics().count).toBe(0);

    latencyTracker.recordLatency(42.5);
    expect(latencyTracker.getMetrics().count).toBe(1);
    expect(latencyTracker.getMetrics().avgMs).toBe(42.5);
  });

  it("serves GET /api/v1/metrics/latency via Fastify server", async () => {
    const server = await buildServer();
    latencyTracker.recordLatency(25);
    latencyTracker.recordLatency(75);

    const res = await server.inject({
      method: "GET",
      url: "/api/v1/metrics/latency",
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.count).toBe(2);
    expect(body.avgMs).toBe(50);
  });
});
