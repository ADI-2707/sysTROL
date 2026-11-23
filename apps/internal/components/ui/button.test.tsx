import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

describe("Button component", () => {
  it("renders with default primary variant and medium size", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeDefined();
    expect(button.style.backgroundColor).toBe("var(--btn-primary-bg)");
    expect(button.style.height).toBe("36px");
  });

  it("applies accent, outline, ghost, and danger variants", () => {
    const { rerender } = render(<Button variant="accent">Accent</Button>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("var(--btn-accent-bg)");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("transparent");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button").style.backgroundColor).toBe("transparent");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button").style.color).toBe("var(--status-danger)");
  });

  it("applies small and large sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").style.height).toBe("30px");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").style.height).toBe("42px");
  });

  it("handles click events and disabled state", () => {
    const handleClick = vi.fn();
    const { rerender } = render(<Button onClick={handleClick}>Submit</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);

    rerender(<Button disabled onClick={handleClick}>Disabled</Button>);
    const disabledBtn = screen.getByRole("button");
    expect(disabledBtn.hasAttribute("disabled")).toBe(true);
    fireEvent.click(disabledBtn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders icon element alongside children", () => {
    render(<Button icon={<span data-testid="icon-slot">Icon</span>}>With Icon</Button>);
    expect(screen.getByTestId("icon-slot")).toBeDefined();
    expect(screen.getByText("With Icon")).toBeDefined();
  });
});
