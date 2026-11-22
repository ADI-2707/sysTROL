import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import DashboardLayout from "./(dashboard)/layout.js";
import AnalyticsDashboardPage from "./(dashboard)/analytics/page.js";
import CtaInquiriesPage from "./(dashboard)/cta/page.js";
import MediaPage from "./(dashboard)/media/page.js";
import DashboardLoading from "./(dashboard)/loading.js";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: {
      id: "u1",
      name: "Alex Vance",
      team: "LEADERSHIP",
      role: "SUPERADMIN",
      designation: "Chief Engineering Officer",
      token: "mock-token",
    },
    isAuthenticated: true,
    isLoading: false,
    logout: vi.fn(),
  }),
}));

vi.mock("@/lib/use-keep-alive", () => ({
  useBackendKeepAlive: vi.fn(),
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        mostDoneMaterial: [],
        topClientsOverYears: [],
        mostDoneLines: [],
        topMaterialAndLineCombinations: [],
        mostEnquiredPages: [],
        mostEffectiveCtaButtons: [],
        employees: [],
        enquiries: [],
        ctaEvents: [],
        totalEnquiries: 0,
        totalEvents: 0,
        unreadCount: 0,
      }),
    })
  ),
}));

describe("Consistent Top Spacing Across Internal Ops", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ assets: [] }),
      })
    ) as any;
  });

  it("ensures DashboardLayout provides standard 24px padding on main container", () => {
    const { container } = render(
      <DashboardLayout>
        <div data-testid="test-child">Child Content</div>
      </DashboardLayout>
    );

    const mainEl = container.querySelector("main.dashboard-main-content") as HTMLElement;
    expect(mainEl).toBeDefined();
    expect(mainEl.style.padding).toBe("24px");
  });

  it("ensures Analytics page container does not define redundant padding", () => {
    const { container } = render(<AnalyticsDashboardPage />);
    const rootDiv = container.firstElementChild as HTMLElement;
    expect(rootDiv).toBeDefined();
    expect(rootDiv.style.padding).toBe("");
    expect(rootDiv.style.paddingTop).toBe("");
    expect(rootDiv.style.maxWidth).toBe("1280px");
  });

  it("ensures CTA Inquiries page container does not define redundant padding", () => {
    const { container } = render(<CtaInquiriesPage />);
    const rootDiv = container.firstElementChild as HTMLElement;
    expect(rootDiv).toBeDefined();
    expect(rootDiv.style.padding).toBe("");
    expect(rootDiv.style.paddingTop).toBe("");
    expect(rootDiv.style.maxWidth).toBe("1280px");
  });

  it("ensures Media page container does not define redundant padding", () => {
    const { container } = render(<MediaPage />);
    const rootDiv = container.firstElementChild as HTMLElement;
    expect(rootDiv).toBeDefined();
    expect(rootDiv.style.padding).toBe("");
    expect(rootDiv.style.paddingTop).toBe("");
    expect(rootDiv.style.maxWidth).toBe("1600px");
  });

  it("ensures DashboardLoading skeleton does not introduce padding offset", () => {
    const { container } = render(<DashboardLoading />);
    const rootDiv = container.firstElementChild as HTMLElement;
    expect(rootDiv).toBeDefined();
    expect(rootDiv.style.padding).toBe("");
    expect(rootDiv.style.paddingTop).toBe("");
  });
});
