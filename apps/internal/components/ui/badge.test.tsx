import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge component", () => {
  it("renders with default neutral styling", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge).toBeDefined();
    expect(badge.style.backgroundColor).toBe("var(--bg-hover)");
  });

  it("applies blue, green, amber, and red variants", () => {
    const { rerender } = render(<Badge variant="blue">Blue</Badge>);
    expect(screen.getByText("Blue").style.color).toBe("var(--sys-blue-primary)");

    rerender(<Badge variant="green">Green</Badge>);
    expect(screen.getByText("Green").style.color).toBe("var(--sys-green-accent)");

    rerender(<Badge variant="amber">Amber</Badge>);
    expect(screen.getByText("Amber").style.color).toBe("var(--status-warning)");

    rerender(<Badge variant="red">Red</Badge>);
    expect(screen.getByText("Red").style.color).toBe("var(--status-danger)");
  });

  it("applies small and medium sizes", () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText("Small").style.fontSize).toBe("10.5px");

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText("Medium").style.fontSize).toBe("11.5px");
  });
});
