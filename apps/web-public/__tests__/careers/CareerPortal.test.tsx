import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CareerPortal } from "@/components/sections/Careers/CareerPortal";
import { Vacancy } from "@/content/careers";

const mockVacancies: Vacancy[] = [
  {
    id: "l2-lead-engineer",
    title: "Lead Level-2 Automation Engineer (C# / .NET 8)",
    department: "L2 Software Engineering",
    location: "Bengaluru Hybrid",
    type: "Full-time",
    experience: "5 - 8 Years",
    description: "Architect and deploy Level-2 automation software.",
    responsibilities: ["Develop C# services", "Coordinate trials"],
    requirements: ["5+ years C#", "OPC UA knowledge"],
    skills: ["C# / .NET 8", "OPC UA", "SQL Server"],
  },
  {
    id: "process-metallurgist",
    title: "Process Metallurgist & Roll Pass Schedule Designer",
    department: "Process Engineering",
    location: "Bengaluru HQ",
    type: "Full-time",
    experience: "4 - 8 Years",
    description: "Calculate roll pass designs and groove geometries.",
    responsibilities: ["Compute pass sequences", "Validate coefficients"],
    requirements: ["Degree in Metallurgy", "4+ years pass design"],
    skills: ["Pass Design", "Metallurgy", "CAD"],
  },
];

describe("CareerPortal Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders search input with exact requested placeholder", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);
    const searchInput = screen.getByPlaceholderText("keywords/job description/ job post");
    expect(searchInput).toBeInTheDocument();
  });

  it("filters jobs with debounced search query after 300ms delay", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);

    const searchInput = screen.getByPlaceholderText("keywords/job description/ job post");
    fireEvent.change(searchInput, { target: { value: "OPC UA" } });

    expect(screen.getAllByRole("article").length).toBe(mockVacancies.length);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    const filteredCards = screen.getAllByRole("article");
    expect(filteredCards.length).toBe(1);
  });

  it("clears search query and restores full list when clear button is clicked", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);

    const searchInput = screen.getByPlaceholderText("keywords/job description/ job post");
    fireEvent.change(searchInput, { target: { value: "Metallurgist" } });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    const clearBtn = screen.getByRole("button", { name: /clear search/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(searchInput).toHaveValue("");
    expect(screen.getAllByRole("article")).toHaveLength(mockVacancies.length);
  });

  it("filters positions using department select dropdown", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);

    const deptSelect = screen.getByRole("combobox", { name: /filter by department/i });
    expect(deptSelect).toBeInTheDocument();

    fireEvent.change(deptSelect, { target: { value: "Process Engineering" } });

    const filteredCards = screen.getAllByRole("article");
    expect(filteredCards).toHaveLength(1);
  });

  it("filters positions using work location select dropdown", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);

    const locSelect = screen.getByRole("combobox", { name: /filter by work location/i });
    expect(locSelect).toBeInTheDocument();

    fireEvent.change(locSelect, { target: { value: "Bengaluru Hybrid" } });

    const filteredCards = screen.getAllByRole("article");
    expect(filteredCards).toHaveLength(1);
  });

  it("strictly ensures job description and skill chips are NOT rendered in the job listing card", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);

    const targetVacancy = mockVacancies[0];

    expect(screen.getByText(targetVacancy.title)).toBeInTheDocument();
    expect(screen.getAllByText(targetVacancy.department).length).toBeGreaterThan(0);
    expect(screen.getAllByText(targetVacancy.location).length).toBeGreaterThan(0);
    expect(screen.getAllByText(targetVacancy.experience).length).toBeGreaterThan(0);

    expect(screen.queryByText(targetVacancy.description)).not.toBeInTheDocument();

    targetVacancy.skills.forEach((skill) => {
      expect(screen.queryByText(skill)).not.toBeInTheDocument();
    });
  });

  it("displays empty state when no positions match query, and resets when button is clicked", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);

    const searchInput = screen.getByPlaceholderText("keywords/job description/ job post");
    fireEvent.change(searchInput, { target: { value: "NonExistentTechnology999" } });

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(screen.getByText(/no matching positions found/i)).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();

    const clearAllBtn = screen.getByRole("button", { name: /clear all filters/i });
    fireEvent.click(clearAllBtn);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(screen.getAllByRole("article")).toHaveLength(mockVacancies.length);
  });

  it("opens apply modal when Apply button is clicked and submits application", () => {
    render(<CareerPortal initialVacancies={mockVacancies} />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const applyButtons = screen.getAllByRole("button", { name: /apply/i });
    fireEvent.click(applyButtons[0]);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("John Doe");
    const emailInput = screen.getByPlaceholderText("john@example.com");
    const phoneInput = screen.getByPlaceholderText("+91 98765 43210");
    const expInput = screen.getByPlaceholderText("e.g. 5 Years");
    const msgInput = screen.getByPlaceholderText(/briefly describe your experience/i);

    fireEvent.change(nameInput, { target: { value: "Test Applicant" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "+91 99999 88888" } });
    fireEvent.change(expInput, { target: { value: "6 Years" } });
    fireEvent.change(msgInput, { target: { value: "Expert in Level-2 automation." } });

    const submitBtn = screen.getByRole("button", { name: /submit application/i });
    fireEvent.click(submitBtn);

    act(() => {
      vi.advanceTimersByTime(700);
    });

    expect(screen.getByText(/application received/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /close window/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/application received/i)).not.toBeInTheDocument();
  });
});
