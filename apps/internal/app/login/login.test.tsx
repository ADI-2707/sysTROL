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
  SysTrolLogo: ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div data-testid="logo">{isCollapsed ? "Collapsed Logo" : "Expanded Logo"}</div>
  ),
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

  it("renders two side window with expanded logo on left and login box on right without topbar or theme toggle", () => {
    const { container } = render(<LoginPage />);
    expect(container.querySelector("header")).toBeNull();
    expect(container.querySelector(".login-left-window")?.textContent?.trim()).toBe("Expanded Logo");
    expect(container.querySelector(".login-split-container")?.getAttribute("data-theme")).toBe("light");
    expect(screen.getByRole("heading", { name: "Sign In" })).toBeDefined();
    expect(screen.getByLabelText("Email")).toBeDefined();
    expect(screen.getByLabelText("Password")).toBeDefined();
    expect(screen.getByTestId("submit-btn")).toBeDefined();
    expect(screen.queryByTestId("theme-toggle")).toBeNull();
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

  it("locks UI, disables fields, and displays authenticating spinner during submission", async () => {
    let resolveLogin: (value: { success: boolean }) => void = () => {};
    mockLogin.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveLogin = resolve;
      })
    );

    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText("operator@systrol.com") as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText("••••••••") as HTMLInputElement;
    const submitBtn = screen.getByTestId("submit-btn") as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: "operator@systrol.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    expect(screen.getByTestId("login-ui-lock")).toBeDefined();
    expect(emailInput.disabled).toBe(true);
    expect(passwordInput.disabled).toBe(true);
    expect(submitBtn.disabled).toBe(true);
    expect(screen.getByText("Signing In...")).toBeDefined();

    resolveLogin({ success: true });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
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
