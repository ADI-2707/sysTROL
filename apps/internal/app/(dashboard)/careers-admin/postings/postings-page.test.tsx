import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import PostingsListPage from "./page";

describe("Careers CMS & Job Postings Page", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("renders 'No current jobs posted' empty state when no jobs exist", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ jobs: [] }),
    } as Response);

    const PageComponent = await PostingsListPage();
    render(PageComponent);

    // Verify page header
    expect(screen.getByRole("heading", { name: /Careers CMS & Job Postings/i })).toBeDefined();

    // Verify empty state headline
    expect(screen.getByRole("heading", { name: /No current jobs posted/i })).toBeDefined();

    // Verify empty state description
    expect(
      screen.getByText(/There are currently no job openings published to the public website\./i)
    ).toBeDefined();

    // Verify CTA button inside empty state
    const createButtons = screen.getAllByRole("link", { name: /Create New Posting/i });
    expect(createButtons.length).toBeGreaterThanOrEqual(2); // One in header, one in empty state
    expect(createButtons[1].getAttribute("href")).toBe("/careers-admin/postings/new");
  });

  it("renders the job postings table rows when jobs are returned", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        jobs: [
          {
            id: "job-101",
            slug: "senior-l2-engineer",
            title: "Senior Level-2 Automation Engineer",
            department: "L2 Software Engineering",
            location: "Bengaluru, India",
            employmentType: "FULL_TIME",
            status: "PUBLISHED",
            publishedAt: "2026-03-01T00:00:00.000Z",
            createdAt: "2026-03-01T00:00:00.000Z",
            _count: { applications: 7 },
          },
        ],
      }),
    } as Response);

    const PageComponent = await PostingsListPage();
    render(PageComponent);

    // Should NOT show the empty state
    expect(screen.queryByText(/No current jobs posted/i)).toBeNull();

    // Should render job details
    expect(screen.getByText("Senior Level-2 Automation Engineer")).toBeDefined();
    expect(screen.getByText("/senior-l2-engineer")).toBeDefined();
    expect(screen.getByText("L2 Software Engineering")).toBeDefined();
    expect(screen.getByText("PUBLISHED")).toBeDefined();
    expect(screen.getByText("7 candidates")).toBeDefined();
  });
});
