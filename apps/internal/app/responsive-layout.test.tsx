import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardLayout from "./(dashboard)/layout.js";

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

describe("Dashboard responsive layout & mobile lock screen tests", () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renders the mobile lock screen with the required desktop guidance message", () => {
    render(
      <DashboardLayout>
        <div data-testid="test-content">Dashboard Content</div>
      </DashboardLayout>
    );

    const lockScreen = screen.getByTestId("mobile-lock-screen");
    expect(lockScreen).toBeDefined();

    const heading = screen.getByText("Please open in desktop to operate the internal tool");
    expect(heading).toBeDefined();

    expect(screen.getByText("DESKTOP WORKSTATION REQUIRED")).toBeDefined();
  });

  it("renders topbar user profile in place of system online with user initials and team", () => {
    render(
      <DashboardLayout>
        <div data-testid="test-content">Dashboard Content</div>
      </DashboardLayout>
    );

    const topbarProfile = screen.getByTestId("topbar-user-profile");
    expect(topbarProfile).toBeDefined();

    expect(screen.getByText("Alex Vance")).toBeDefined();
    expect(screen.getByText("AL")).toBeDefined();
    expect(screen.getByText("Chief Engineering Officer")).toBeDefined();
    expect(screen.getByText("Leadership Team")).toBeDefined();
  });

  it("renders desktop portal root container with sidebar and main content", () => {
    render(
      <DashboardLayout>
        <div data-testid="test-content">Dashboard Content</div>
      </DashboardLayout>
    );

    const portalRoot = screen.getByTestId("desktop-portal-root");
    expect(portalRoot).toBeDefined();

    const mainContent = screen.getByTestId("test-content");
    expect(mainContent).toBeDefined();
    expect(mainContent.textContent).toBe("Dashboard Content");
  });

  it("auto-collapses sidebar on tablet screen widths when no saved preference exists", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });

    const { container } = render(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    const aside = container.querySelector("aside");
    expect(aside).toBeDefined();
    expect(aside?.style.width).toBe("60px");
  });
});
