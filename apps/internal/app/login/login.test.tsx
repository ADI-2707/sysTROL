import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import LoginPage from "./page.js";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ success: true }),
    isAuthenticated: false,
    isLoading: false,
    logout: vi.fn(),
  }),
}));

vi.mock("@/components/brand/SysTrolLogo", () => ({
  SysTrolLogo: () => <div data-testid="logo">sysTROL Logo</div>,
}));

vi.mock("../theme-toggle", () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme</button>,
}));

describe("LoginPage session expiration banner tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Scenario 5.2a: does not render session expired banner by default", () => {
    delete (window as any).location;
    (window as any).location = new URL("http://localhost:3001/login");

    render(<LoginPage />);
    expect(screen.queryByTestId("session-expired-banner")).toBeNull();
  });

  it("Scenario 5.2b: renders session expired banner when session_expired=1 is in URL search", () => {
    delete (window as any).location;
    (window as any).location = new URL("http://localhost:3001/login?session_expired=1");

    render(<LoginPage />);
    const banner = screen.getByTestId("session-expired-banner");
    expect(banner).toBeDefined();
    expect(banner.textContent).toContain("Your session has expired. Please sign in again to continue.");
  });
});
