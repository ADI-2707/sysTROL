import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PublishCaseStudyModal } from "./PublishCaseStudyModal";
import { INITIAL_PROJECTS } from "@/lib/projects-data";

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

vi.mock("@systrol/ui", () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock("@/lib/auth-context", () => ({
  useAuth: () => ({
    user: { id: "usr-admin-01", name: "Admin Controls", role: "SUPER_ADMIN" },
  }),
}));

const mockApiClient = vi.fn();
vi.mock("@/lib/api-client", () => ({
  apiClient: (...args: any[]) => mockApiClient(...args),
}));

describe("PublishCaseStudyModal API synchronization and toast handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const testProject = INITIAL_PROJECTS[0];

  it("handles successful API publish with success toast, onSuccess callback, and modal close", async () => {
    mockApiClient.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: testProject.id, isPublished: true }),
    });

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <PublishCaseStudyModal
        isOpen={true}
        project={testProject}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Publish Case Study/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalledWith(
        `/api/v1/projects/${testProject.id}/publish`,
        expect.objectContaining({ method: "POST" })
      );
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith("Case study published to public website!");
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("handles API failure with error toast, preserves modal state, and does not trigger onSuccess", async () => {
    mockApiClient.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Project 'proj-1' not found on server" }),
    });

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(
      <PublishCaseStudyModal
        isOpen={true}
        project={testProject}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Publish Case Study/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockApiClient).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith("Project 'proj-1' not found on server");
    });

    expect(handleSuccess).not.toHaveBeenCalled();
    expect(handleClose).not.toHaveBeenCalled();
    expect(screen.getByText("Project 'proj-1' not found on server")).toBeDefined();
  });
});
