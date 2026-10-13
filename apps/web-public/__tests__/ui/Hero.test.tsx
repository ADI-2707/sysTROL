import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll } from "vitest";
import { Hero } from "@/components/sections/Hero/Hero";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

describe("Hero Component", () => {
  it("renders call to action buttons with contact and projects destinations", () => {
    render(<Hero />);

    const contactBtn = screen.getByRole("link", { name: /get in touch/i });
    expect(contactBtn).toBeInTheDocument();
    expect(contactBtn).toHaveAttribute("href", "/contact");

    const projectsBtn = screen.getByRole("link", { name: /view projects/i });
    expect(projectsBtn).toBeInTheDocument();
    expect(projectsBtn).toHaveAttribute("href", "/projects");
  });

  it("renders arrow icons inside both cta buttons", () => {
    const { container } = render(<Hero />);
    const projectsBtn = screen.getByRole("link", { name: /view projects/i });
    const arrowSvg = projectsBtn.querySelector("svg");
    expect(arrowSvg).toBeInTheDocument();
  });
});
