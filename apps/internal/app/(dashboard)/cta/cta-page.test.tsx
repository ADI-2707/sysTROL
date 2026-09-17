import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CtaInquiriesPage from "./page";

const mockEnquiries = [
  {
    id: "enq-1",
    enquiryCode: "ENQ-2026-0001",
    source: "WEB_RFQ",
    prospectName: "Kailash Mishra (Bhilai Steel Plant)",
    contactEmail: "kailash.m@sail.in",
    contactPhone: "+91 94000 11222",
    requirement: "Seeking complete Level-2 modernization for 16-stand section mill.",
    status: "OPEN",
    ctaId: "navbar_get_in_touch",
    pagePath: "/services/automation-consultancy",
    utmSource: "google",
    utmMedium: "organic",
    createdAt: new Date().toISOString(),
  },
];

const mockCtaEvents = [
  {
    id: "evt-1",
    eventType: "WHATSAPP_CLICK",
    ctaId: "floating_whatsapp",
    pagePath: "/services/trading",
    utmSource: "linkedin",
    createdAt: new Date().toISOString(),
  },
];

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "u1", name: "Admin", team: "SALES", role: "SALES_EXEC" },
    isAuthenticated: true,
  }),
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn((url: string, options?: any) => {
    if (url.includes("/api/v1/cta/feed")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          enquiries: mockEnquiries,
          ctaEvents: mockCtaEvents,
          totalEnquiries: 1,
          totalCtaEvents: 1,
        }),
      });
    }
    if (url.includes("/status")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          enquiry: { id: "enq-1", status: "QUALIFIED" },
        }),
      });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  }),
}));

describe("CTA & Inquiries Hub page tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page title and live telemetry badge", async () => {
    render(<CtaInquiriesPage />);

    expect(screen.getByText("CTA & Website Inquiries Hub")).toBeDefined();
    expect(screen.getByText("Live Telemetry")).toBeDefined();
  });

  it("renders live KPI metric cards", async () => {
    render(<CtaInquiriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Total Actions")).toBeDefined();
      expect(screen.getByText("Pending Review")).toBeDefined();
      expect(screen.getByText("Direct WhatsApp")).toBeDefined();
      expect(screen.getByText("Top Landing Page")).toBeDefined();
    });
  });

  it("renders channel filter buttons", async () => {
    render(<CtaInquiriesPage />);

    expect(screen.getByRole("button", { name: /All Channels/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Web RFQ Form/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /WhatsApp Clicks/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Phone Clicks/i })).toBeDefined();
  });

  it("renders feed items and allows expanding cards on click", async () => {
    render(<CtaInquiriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Kailash Mishra (Bhilai Steel Plant)")).toBeDefined();
      expect(screen.getByText("Direct WHATSAPP CLICK")).toBeDefined();
    });

    const cardTitle = screen.getByText("Kailash Mishra (Bhilai Steel Plant)");
    fireEvent.click(cardTitle);

    await waitFor(() => {
      expect(screen.getByText(/Seeking complete Level-2 modernization/i)).toBeDefined();
      expect(screen.getByText("kailash.m@sail.in")).toBeDefined();
      expect(screen.getByText("+91 94000 11222")).toBeDefined();
      expect(screen.getByText("QUALIFIED")).toBeDefined();
    });
  });

  it("filters feed items when typing into the search input", async () => {
    render(<CtaInquiriesPage />);

    await waitFor(() => {
      expect(screen.getByText("Kailash Mishra (Bhilai Steel Plant)")).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText(/Search prospects/i);
    fireEvent.change(searchInput, { target: { value: "nonexistent query xyz" } });

    await waitFor(() => {
      expect(screen.getByText("No inquiries match the active criteria.")).toBeDefined();
    });
  });
});
