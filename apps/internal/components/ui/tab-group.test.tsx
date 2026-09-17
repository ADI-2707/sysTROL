import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabGroup, TabItem } from "./tab-group";

describe("shared TabGroup component tests", () => {
  const mockTabs: TabItem[] = [
    { id: "projects", label: "Projects Intelligence", badge: 12 },
    { id: "cta", label: "CTA & Conversions", badge: "Live" },
    { id: "employees", label: "Employee Deployments" },
  ];

  it("renders all provided tabs with their respective labels and badges", () => {
    render(
      <TabGroup tabs={mockTabs} activeTab="projects" onChange={() => {}} />
    );

    expect(screen.getByText("Projects Intelligence")).toBeDefined();
    expect(screen.getByText("CTA & Conversions")).toBeDefined();
    expect(screen.getByText("Employee Deployments")).toBeDefined();
    expect(screen.getByText("12")).toBeDefined();
    expect(screen.getByText("Live")).toBeDefined();
  });

  it("applies active background styling to the currently active tab", () => {
    render(
      <TabGroup tabs={mockTabs} activeTab="cta" onChange={() => {}} />
    );

    const ctaButton = screen.getByRole("button", { name: /CTA & Conversions/i });
    expect(ctaButton.style.backgroundColor).toBe("var(--sys-green-accent)");
    expect(ctaButton.style.color).toBe("rgb(255, 255, 255)");

    const projectsButton = screen.getByRole("button", { name: /Projects Intelligence/i });
    expect(projectsButton.style.backgroundColor).toBe("transparent");
  });

  it("triggers onChange callback with the clicked tab ID", () => {
    const handleChange = vi.fn();
    render(
      <TabGroup tabs={mockTabs} activeTab="projects" onChange={handleChange} />
    );

    const employeesButton = screen.getByRole("button", { name: /Employee Deployments/i });
    fireEvent.click(employeesButton);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith("employees");
  });

  it("renders icons inside tabs when provided", () => {
    const tabsWithIcons: TabItem[] = [
      {
        id: "tab-1",
        label: "Tab With Icon",
        icon: <span data-testid="custom-tab-icon">★</span>,
      },
    ];

    render(
      <TabGroup tabs={tabsWithIcons} activeTab="tab-1" onChange={() => {}} />
    );

    expect(screen.getByTestId("custom-tab-icon")).toBeDefined();
  });

  it("renders an empty container without crashing when given an empty tabs list", () => {
    const { container } = render(
      <TabGroup tabs={[]} activeTab="" onChange={() => {}} />
    );
    expect(container.firstChild).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });
});
