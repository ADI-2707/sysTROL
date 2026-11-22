import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProjectManagementPage from "./page";

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "usr-admin-01", name: "Admin Controls", role: "SUPER_ADMIN", token: "mock-token" },
    isAuthenticated: true,
    hasValidToken: true,
  }),
}));

describe("ProjectManagementPage with 3-tab system and publishing workflow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the page heading and all three standardized tabs with badges", () => {
    render(<ProjectManagementPage />);

    expect(screen.getByRole("heading", { name: /Project Management/i })).toBeDefined();

    const heading = screen.getByRole("heading", { name: /Project Management/i });
    expect(heading.querySelector("svg")).toBeNull();
    expect(heading.textContent?.trim()).toBe("Project Management");

    const ongoingTab = screen.getByRole("button", { name: /Ongoing Projects/i });
    const commissionedTab = screen.getByRole("button", { name: /Commissioned Projects/i });
    const publishedTab = screen.getByRole("button", { name: /Published on Website/i });

    expect(ongoingTab).toBeDefined();
    expect(commissionedTab).toBeDefined();
    expect(publishedTab).toBeDefined();
  });

  it("displays ongoing projects by default and does not show Publish to Website button", () => {
    render(<ProjectManagementPage />);

    expect(screen.getByText("Bar & Wire Rod Dual-Line Automation Retrofit")).toBeDefined();
    expect(screen.queryByRole("button", { name: /Publish to Website/i })).toBeNull();
  });

  it("switches to Commissioned Projects tab and shows Publish to Website CTA", () => {
    render(<ProjectManagementPage />);

    const commissionedTab = screen.getByRole("button", { name: /Commissioned Projects/i });
    fireEvent.click(commissionedTab);

    expect(screen.getByText("Bloom Caster Pinch Roll & Dummy Bar Extraction Upgrade")).toBeDefined();
    const publishBtn = screen.getByRole("button", { name: /Publish to Website/i });
    expect(publishBtn).toBeDefined();
  });

  it("switches to Published on Website tab and displays mirrored public case studies", () => {
    render(<ProjectManagementPage />);

    const publishedTab = screen.getByRole("button", { name: /Published on Website/i });
    fireEvent.click(publishedTab);

    expect(screen.getByText("Level-2 Automation Modernization for 650,000 TPA Bar Mill")).toBeDefined();
    expect(screen.getByText("Reheating Furnace Level-2 Thermal Tracking & Mill Pacing")).toBeDefined();
    expect(screen.getByText("Finishing Block Speed Cascade & Looper Control for 110 m/s Wire Rod Mill")).toBeDefined();
    expect(screen.getByText("Hydraulic AGC Servo Valve & Cylinder Retrofit for Narrow Strip Mill")).toBeDefined();
    expect(screen.getByText("Tungsten Carbide Roll Ring Supply & Technical Pairing for Wire Rod Block")).toBeDefined();
    expect(screen.getByText("Structural ERW Tube Mill Forming & Sizing Level-2 Automation")).toBeDefined();

    const liveBadges = screen.getAllByText("Published Live");
    expect(liveBadges.length).toBeGreaterThanOrEqual(6);

    const editButtons = screen.getAllByRole("button", { name: /Edit Case Study/i });
    expect(editButtons.length).toBeGreaterThanOrEqual(6);

    const unpublishButtons = screen.getAllByRole("button", { name: /Unpublish/i });
    expect(unpublishButtons.length).toBeGreaterThanOrEqual(6);
  });

  it("opens PublishCaseStudyModal when clicking Publish to Website on commissioned project", () => {
    render(<ProjectManagementPage />);

    const commissionedTab = screen.getByRole("button", { name: /Commissioned Projects/i });
    fireEvent.click(commissionedTab);

    const publishBtn = screen.getByRole("button", { name: /Publish to Website/i });
    fireEvent.click(publishBtn);

    expect(screen.getByText("Publish Case Study to Public Website")).toBeDefined();
    expect(screen.getByText("1. Project Images & Card Thumbnail Selection (Strictly 3 Images)")).toBeDefined();
    expect(screen.getByText("2. Custom KPI Outcome Cards (Min 2, Max 4)")).toBeDefined();
    expect(screen.getByRole("button", { name: /Publish Case Study/i })).toBeDefined();
  });

  it("filters projects according to search query", () => {
    render(<ProjectManagementPage />);

    const publishedTab = screen.getByRole("button", { name: /Published on Website/i });
    fireEvent.click(publishedTab);

    const searchInput = screen.getByPlaceholderText(/Search by client, line, or location/i);
    fireEvent.change(searchInput, { target: { value: "Reheating" } });

    expect(screen.getByText("Reheating Furnace Level-2 Thermal Tracking & Mill Pacing")).toBeDefined();
    expect(screen.queryByText("Structural ERW Tube Mill Forming & Sizing Level-2 Automation")).toBeNull();
  });

  it("renders card display images with onError fallback handling", () => {
    render(<ProjectManagementPage />);

    const publishedTab = screen.getByRole("button", { name: /Published on Website/i });
    fireEvent.click(publishedTab);

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(6);

    const firstImage = images[0] as HTMLImageElement;
    expect(firstImage.src).toBeTruthy();

    fireEvent.error(firstImage);
    expect(firstImage.src).toContain("data:image/svg+xml");
  });
});
