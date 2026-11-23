import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KpiCard } from "./kpi-card";

describe("KpiCard component", () => {
  it("renders title, value, unit, and subtitle", () => {
    render(
      <KpiCard
        title="Active Projects"
        value={12}
        unit="sites"
        subtitle="Across all domains"
      />
    );
    expect(screen.getByText("Active Projects")).toBeDefined();
    expect(screen.getByText("12")).toBeDefined();
    expect(screen.getByText("sites")).toBeDefined();
    expect(screen.getByText("Across all domains")).toBeDefined();
  });

  it("renders positive and negative trend indicators", () => {
    const { rerender } = render(
      <KpiCard
        title="Revenue"
        value="1.2M"
        trend={{ value: "14%", isPositive: true }}
      />
    );
    expect(screen.getByText("↑ 14%")).toBeDefined();

    rerender(
      <KpiCard
        title="Downtime"
        value="3.4h"
        trend={{ value: "5%", isPositive: false }}
      />
    );
    expect(screen.getByText("↓ 5%")).toBeDefined();
  });

  it("renders badge and handles card click", () => {
    const handleClick = vi.fn();
    render(
      <KpiCard
        title="Efficiency"
        value="98.5%"
        badge="Optimal"
        onClick={handleClick}
      />
    );
    expect(screen.getByText("Optimal")).toBeDefined();
    const card = screen.getByRole("button");
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
