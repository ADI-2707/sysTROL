import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import LoginPage from "./page.js";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

const mockLogin = vi.fn();
vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    login: mockLogin,
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

describe("LoginPage unit and integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue({ success: true });
    delete (window as any).location;
    (window as any).location = new URL("http://localhost:3001/login");
  });

  it("does not render session expired banner by default", () => {
    render(<LoginPage />);
    expect(screen.queryByTestId("session-expired-banner")).toBeNull();
  });

  it("renders session expired banner when session_expired=1 is in URL search", () => {
    (window as any).location = new URL("http://localhost:3001/login?session_expired=1");

    render(<LoginPage />);
    const banner = screen.getByTestId("session-expired-banner");
    expect(banner).toBeDefined();
    expect(banner.textContent).toContain("Your session has expired. Please sign in again to continue.");
  });

  it("toggles password visibility between password and text input types", () => {
    render(<LoginPage />);
    const passwordInput = screen.getByPlaceholderText("••••••••") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    const toggleButton = screen.getByLabelText("Show password");
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    expect(screen.getByLabelText("Hide password")).toBeDefined();

    fireEvent.click(screen.getByLabelText("Hide password"));
    expect(passwordInput.type).toBe("password");
  });

  it("populates email and password when quick fill role button is clicked", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("operator@systrol.com") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("••••••••") as HTMLInputElement;

    const adminButton = screen.getByText("Super Admin");
    fireEvent.click(adminButton);

    expect(emailInput.value).toBe("admin@systrol.com");
    expect(passwordInput.value).toBe("admin123");
  });

  it("renders error message when submitting empty fields", async () => {
    const { container } = render(<LoginPage />);
    const form = container.querySelector("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(screen.getByText("Please provide both email and password.")).toBeDefined();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("submits credentials successfully and pushes route to dashboard", async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("operator@systrol.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByTestId("submit-btn");

    fireEvent.change(emailInput, { target: { value: "operator@systrol.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("operator@systrol.com", "secret123");
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays error message returned from failed authentication", async () => {
    mockLogin.mockResolvedValueOnce({ success: false, error: "Invalid credentials" });

    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("operator@systrol.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const submitBtn = screen.getByTestId("submit-btn");

    fireEvent.change(emailInput, { target: { value: "wrong@systrol.com" } });
    fireEvent.change(passwordInput, { target: { value: "badpass" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeDefined();
    });
  });
});
