import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "./theme-provider.js";
import { ThemeToggle } from "./theme-toggle.js";

describe("ThemeToggle mechanical rocker switch component tests", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
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
    document.documentElement.removeAttribute("data-theme");
  });

  it("renders with role switch and initial light state", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const switchBtn = screen.getByRole("switch");
    expect(switchBtn).toBeDefined();
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");
    expect(screen.getByTestId("mechanical-rocker-lever")).toBeDefined();
    expect(screen.getByTestId("mechanical-micro-led")).toBeDefined();
  });

  it("toggles theme state on click from light to dark and updates DOM attributes and localStorage", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const switchBtn = screen.getByRole("switch");
    expect(switchBtn.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(switchBtn);

    expect(switchBtn.getAttribute("aria-checked")).toBe("true");
    expect(localStorage.getItem("systrol_theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    fireEvent.click(switchBtn);

    expect(switchBtn.getAttribute("aria-checked")).toBe("false");
    expect(localStorage.getItem("systrol_theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("initializes to dark mode if saved in localStorage", () => {
    localStorage.setItem("systrol_theme", "dark");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const switchBtn = screen.getByRole("switch");
    expect(switchBtn.getAttribute("aria-checked")).toBe("true");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
