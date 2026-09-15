import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Sparkles, ArrowRight } from "lucide-react";

describe("Badge Component", () => {
  it("renders children text correctly", () => {
    render(<Badge>Active Status</Badge>);
    expect(screen.getByText("Active Status")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    render(<Badge icon={<Sparkles data-testid="sparkle-icon" size={12} />}>Featured</Badge>);
    expect(screen.getByTestId("sparkle-icon")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });
});

describe("Button Component", () => {
  it("renders button element with text and handles click", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const btn = screen.getByRole("button", { name: "Click Me" });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as anchor link when href is supplied", () => {
    render(<Button href="/contact">Get Started</Button>);
    const link = screen.getByRole("link", { name: "Get Started" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/contact");
  });

  it("renders loading spinner and disables click when isLoading is true", () => {
    const handleClick = vi.fn();
    render(<Button isLoading onClick={handleClick}>Save Changes</Button>);

    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();

    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders with leftIcon and rightIcon", () => {
    render(
      <Button
        leftIcon={<Sparkles data-testid="btn-left-icon" size={14} />}
        rightIcon={<ArrowRight data-testid="btn-right-icon" size={14} />}
      >
        Explore Solutions
      </Button>
    );

    expect(screen.getByTestId("btn-left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("btn-right-icon")).toBeInTheDocument();
    expect(screen.getByText("Explore Solutions")).toBeInTheDocument();
  });
});

describe("SectionHeading Component", () => {
  it("renders eyebrow, title, and subtitle", () => {
    render(
      <SectionHeading
        eyebrow="Proven Engineering"
        title="Industrial Automation Systems"
        subtitle="Turnkey commissioning and L2 mathematical mill control."
      />
    );

    expect(screen.getByText("Proven Engineering")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Industrial Automation Systems" })).toBeInTheDocument();
    expect(screen.getByText("Turnkey commissioning and L2 mathematical mill control.")).toBeInTheDocument();
  });

  it("renders two-tone heading with emphasized span accent", () => {
    render(
      <SectionHeading
        eyebrow="Specialized Division"
        title={<>Engineered Solutions for <span>Steel Plants</span></>}
        subtitle="Precision L2 supervisory automation."
      />
    );

    const heading = screen.getByRole("heading", { name: "Engineered Solutions for Steel Plants" });
    expect(heading).toBeInTheDocument();
    const accentSpan = screen.getByText("Steel Plants");
    expect(accentSpan).toBeInTheDocument();
    expect(accentSpan.tagName).toBe("SPAN");
  });
});
