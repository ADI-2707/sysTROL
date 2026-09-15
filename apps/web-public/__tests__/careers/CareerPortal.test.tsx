import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { CareerPortal } from "@/components/sections/Careers/CareerPortal";
import { vacanciesData } from "@/content/careers";

describe("CareerPortal Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders search input with exact requested placeholder", () => {
    render(<CareerPortal />);
    const searchInput = screen.getByPlaceholderText("keywords/job description/ job post");
    expect(searchInput).toBeInTheDocument();
  });

  it("filters jobs with debounced search query after 300ms delay", () => {
    render(<CareerPortal />);

    const searchInput = screen.getByPlaceholderText("keywords/job description/ job post");
    fireEvent.change(searchInput, { target: { value: "OPC UA" } });

    expect(screen.getAllByRole("article").length).toBe(vacanciesData.length);

    act(() => {
      vi.advanceTimersByTime(350);
    });

    const filteredCards = screen.getAllByRole("article");
    expect(filteredCards.length).toBeGreaterThan(0);
    expect(filteredCards.length).toBeLessThan(vacanciesData.length);
  });

  it("clears search query and restores full list when clear button is clicked", () => {
    render(<CareerPortal />);

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
    expect(screen.getAllByRole("article")).toHaveLength(vacanciesData.length);
  });

  it("filters positions using department select dropdown", () => {
    render(<CareerPortal />);

    const deptSelect = screen.getByRole("combobox", { name: /filter by department/i });
    expect(deptSelect).toBeInTheDocument();

    fireEvent.change(deptSelect, { target: { value: "Process Engineering" } });

    const filteredCards = screen.getAllByRole("article");
    const expectedCount = vacanciesData.filter((v) => v.department === "Process Engineering").length;
    expect(filteredCards).toHaveLength(expectedCount);
  });

  it("filters positions using work location select dropdown", () => {
    render(<CareerPortal />);

    const locSelect = screen.getByRole("combobox", { name: /filter by work location/i });
    expect(locSelect).toBeInTheDocument();

    fireEvent.change(locSelect, { target: { value: "Bengaluru Hybrid" } });

    const filteredCards = screen.getAllByRole("article");
    expect(filteredCards.length).toBeGreaterThan(0);
    expect(filteredCards.length).toBeLessThan(vacanciesData.length);
  });

  it("strictly ensures job description and skill chips are NOT rendered in the job listing card", () => {
    render(<CareerPortal />);

    const targetVacancy = vacanciesData[0];

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
    render(<CareerPortal />);

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

    expect(screen.getAllByRole("article")).toHaveLength(vacanciesData.length);
  });

  it("opens apply modal when Apply button is clicked and submits application", () => {
    render(<CareerPortal />);

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
