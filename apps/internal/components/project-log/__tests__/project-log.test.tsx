import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LogEntryCard } from "../LogEntryCard.js";
import { DayGroup } from "../DayGroup.js";
import { WeekAccordion } from "../WeekAccordion.js";
import { PostUpdateModal } from "../PostUpdateModal.js";
import { ProjectLogTab } from "../ProjectLogTab.js";
import { LifecycleStepsTab } from "../LifecycleStepsTab.js";
import {
  LogEntryCategory,
  LogWeekStatus,
  ProjectLogEntryDto,
  ProjectLogWeekDto,
  LifecycleStage,
} from "@systrol/types";
import * as projectLogApi from "@/lib/project-log-api";

vi.mock("@/lib/project-log-api", () => ({
  fetchLogWeeks: vi.fn(),
  fetchLogEntries: vi.fn(),
  fetchStepEntryCounts: vi.fn(),
  postLogEntry: vi.fn(),
  lockWeek: vi.fn(),
  unlockWeek: vi.fn(),
  deleteLogEntry: vi.fn(),
}));

describe("Project Log Component Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("LogEntryCard", () => {
    const mockEntry: ProjectLogEntryDto = {
      id: "e-1",
      projectId: "p-1",
      weekId: "w-1",
      authorId: "u-1",
      authorName: "Sarah Connor",
      category: LogEntryCategory.PROGRESS,
      stage: LifecycleStage.ERECTION,
      stepId: "step-1",
      stepTitle: "Cold Commissioning",
      content: "Completed cold loop checks on MCC panel 3",
      blockers: "Missing secondary relay part",
      nextAction: "Install replacement relay once delivered",
      attachments: ["https://example.com/check-sheet.pdf"],
      entryDate: "2026-11-18T10:30:00Z",
      createdAt: "2026-11-18T10:30:00Z",
    };

    it("renders category badge, author name and main content", () => {
      render(
        <LogEntryCard
          entry={mockEntry}
          canDelete={false}
          onDelete={vi.fn()}
        />
      );

      expect(screen.getByText("PROGRESS")).toBeDefined();
      expect(screen.getByText("Sarah Connor")).toBeDefined();
      expect(
        screen.getByText("Completed cold loop checks on MCC panel 3")
      ).toBeDefined();
      expect(screen.getByText("Cold Commissioning")).toBeDefined();
    });

    it("renders blockers and nextAction sections when present", () => {
      render(
        <LogEntryCard
          entry={mockEntry}
          canDelete={false}
          onDelete={vi.fn()}
        />
      );

      expect(screen.getByText("Blocker:")).toBeDefined();
      expect(screen.getByText("Missing secondary relay part")).toBeDefined();
      expect(screen.getByText("Next:")).toBeDefined();
      expect(
        screen.getByText(/Install replacement relay once delivered/)
      ).toBeDefined();
    });

    it("renders attachment links when present", () => {
      render(
        <LogEntryCard
          entry={mockEntry}
          canDelete={false}
          onDelete={vi.fn()}
        />
      );

      const link = screen.getByRole("link", { name: /Attachment 1/i });
      expect(link.getAttribute("href")).toBe(
        "https://example.com/check-sheet.pdf"
      );
    });

    it("displays delete button and triggers onDelete when canDelete is true", () => {
      const handleDelete = vi.fn();
      render(
        <LogEntryCard
          entry={mockEntry}
          canDelete={true}
          onDelete={handleDelete}
        />
      );

      const deleteBtn = screen.getByTitle("Delete log entry");
      fireEvent.click(deleteBtn);
      expect(handleDelete).toHaveBeenCalledWith("e-1");
    });

    it("does not render delete button when canDelete is false", () => {
      render(
        <LogEntryCard
          entry={mockEntry}
          canDelete={false}
          onDelete={vi.fn()}
        />
      );

      expect(screen.queryByTitle("Delete log entry")).toBeNull();
    });
  });

  describe("DayGroup", () => {
    const mockEntries: ProjectLogEntryDto[] = [
      {
        id: "e-1",
        projectId: "p-1",
        weekId: "w-1",
        authorId: "u-1",
        authorName: "John Doe",
        category: LogEntryCategory.MILESTONE,
        stage: LifecycleStage.ERECTION,
        stepId: null,
        stepTitle: null,
        content: "Passed high voltage test",
        blockers: null,
        nextAction: null,
        attachments: [],
        entryDate: "2026-11-18T14:00:00Z",
        createdAt: "2026-11-18T14:00:00Z",
      },
      {
        id: "e-2",
        projectId: "p-1",
        weekId: "w-1",
        authorId: "u-1",
        authorName: "John Doe",
        category: LogEntryCategory.NOTE,
        stage: LifecycleStage.ERECTION,
        stepId: null,
        stepTitle: null,
        content: "Toolbox talk completed with 6 workers",
        blockers: null,
        nextAction: null,
        attachments: [],
        entryDate: "2026-11-18T08:00:00Z",
        createdAt: "2026-11-18T08:00:00Z",
      },
    ];

    it("renders formatted date header and correct entry count", () => {
      render(
        <DayGroup
          date="2026-11-18"
          entries={mockEntries}
          canDelete={false}
        />
      );

      expect(screen.getByText(/2026/)).toBeDefined();
      expect(screen.getByText("(2 entries)")).toBeDefined();
      expect(screen.getByText("Passed high voltage test")).toBeDefined();
      expect(
        screen.getByText("Toolbox talk completed with 6 workers")
      ).toBeDefined();
    });
  });

  describe("WeekAccordion", () => {
    const mockWeek: ProjectLogWeekDto = {
      id: "w-47",
      projectId: "p-1",
      weekNumber: 47,
      year: 2026,
      status: LogWeekStatus.OPEN,
      startDate: "2026-11-16T00:00:00.000Z",
      endDate: "2026-11-22T23:59:59.999Z",
      entryCount: 1,
      lockedAt: null,
    };

    const mockWeekEntries: ProjectLogEntryDto[] = [
      {
        id: "entry-1",
        projectId: "p-1",
        weekId: "w-47",
        authorId: "u-1",
        authorName: "Jane Field",
        category: LogEntryCategory.PROGRESS,
        stage: LifecycleStage.ERECTION,
        stepId: null,
        stepTitle: null,
        content: "Sensors calibrated",
        blockers: null,
        nextAction: null,
        attachments: [],
        entryDate: "2026-11-17T11:00:00Z",
        createdAt: "2026-11-17T11:00:00Z",
      },
    ];

    it("renders week header with week number, status badge, and entries", () => {
      render(
        <WeekAccordion
          week={mockWeek}
          defaultOpen={true}
          canLock={true}
          canUnlock={false}
          canDelete={false}
          onLock={vi.fn()}
          onUnlock={vi.fn()}
          entries={mockWeekEntries}
        />
      );

      expect(screen.getByText("WEEK 47")).toBeDefined();
      expect(screen.getByText("OPEN")).toBeDefined();
      expect(screen.getByText("1 entry")).toBeDefined();
      expect(screen.getByText("Sensors calibrated")).toBeDefined();
    });

    it("triggers onLock callback when Lock Week button is clicked", () => {
      const handleLock = vi.fn();
      render(
        <WeekAccordion
          week={mockWeek}
          defaultOpen={true}
          canLock={true}
          canUnlock={false}
          canDelete={false}
          onLock={handleLock}
          onUnlock={vi.fn()}
          entries={mockWeekEntries}
        />
      );

      const lockBtn = screen.getByRole("button", { name: /Lock Week/i });
      fireEvent.click(lockBtn);
      expect(handleLock).toHaveBeenCalledWith("w-47");
    });

    it("triggers onUnlock callback when Unlock Week button is clicked for locked week", () => {
      const lockedWeek: ProjectLogWeekDto = {
        ...mockWeek,
        status: LogWeekStatus.LOCKED,
        lockedAt: "2026-11-23T00:00:00.000Z",
      };
      const handleUnlock = vi.fn();

      render(
        <WeekAccordion
          week={lockedWeek}
          defaultOpen={true}
          canLock={false}
          canUnlock={true}
          canDelete={false}
          onLock={vi.fn()}
          onUnlock={handleUnlock}
          entries={mockWeekEntries}
        />
      );

      expect(screen.getByText("LOCKED")).toBeDefined();
      const unlockBtn = screen.getByRole("button", { name: /Unlock/i });
      fireEvent.click(unlockBtn);
      expect(handleUnlock).toHaveBeenCalledWith("w-47");
    });

    it("collapses and expands content when clicking the header", () => {
      render(
        <WeekAccordion
          week={mockWeek}
          defaultOpen={true}
          canLock={false}
          canUnlock={false}
          canDelete={false}
          onLock={vi.fn()}
          onUnlock={vi.fn()}
          entries={mockWeekEntries}
        />
      );

      expect(screen.getByText("Sensors calibrated")).toBeDefined();
      const header = screen.getByText("WEEK 47");
      fireEvent.click(header);
      expect(screen.queryByText("Sensors calibrated")).toBeNull();
      fireEvent.click(header);
      expect(screen.getByText("Sensors calibrated")).toBeDefined();
    });
  });

  describe("PostUpdateModal", () => {
    const mockSteps = [
      { id: "step-1", title: "Panel Wiring" },
      { id: "step-2", title: "PLC I/O Mapping" },
    ];

    it("renders modal with category selector and character counter labels", () => {
      render(
        <PostUpdateModal
          projectId="proj-1"
          steps={mockSteps}
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );

      expect(screen.getByText("Post Project Update")).toBeDefined();
      expect(screen.getByText("Progress")).toBeDefined();
      expect(screen.getByText("Blocker")).toBeDefined();
      expect(screen.getByText("Milestone")).toBeDefined();
      expect(screen.getByText("Note")).toBeDefined();
      expect(screen.getByText(/3,000/)).toBeDefined();
      expect(screen.getByText(/800/)).toBeDefined();
      expect(screen.getByText(/500/)).toBeDefined();
    });

    it("restricts date selector options strictly to active week days", () => {
      render(
        <PostUpdateModal
          projectId="proj-1"
          steps={mockSteps}
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );

      const comboboxes = screen.getAllByRole("combobox");
      const dateSelect = comboboxes[0] as HTMLSelectElement;
      expect(dateSelect.options.length).toBeGreaterThan(0);
      expect(dateSelect.options.length).toBeLessThanOrEqual(7);
      expect(screen.getByText(/Strictly no backfilling/i)).toBeDefined();
    });

    it("shows validation error if submitted content has fewer than 10 characters", async () => {
      render(
        <PostUpdateModal
          projectId="proj-1"
          steps={mockSteps}
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );

      const textarea = screen.getByPlaceholderText(/Describe work completed/i);
      fireEvent.change(textarea, { target: { value: "Short" } });

      const submitBtn = screen.getByRole("button", { name: /Post Update/i });
      fireEvent.click(submitBtn);

      expect(
        screen.getByText("Update content must be at least 10 characters long")
      ).toBeDefined();
      expect(projectLogApi.postLogEntry).not.toHaveBeenCalled();
    });

    it("validates attachment URL format and adds attachment badge", () => {
      render(
        <PostUpdateModal
          projectId="proj-1"
          steps={mockSteps}
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      );

      const attachInput = screen.getByPlaceholderText(/https:\/\//i);
      const addAttachBtn = screen.getByRole("button", { name: /Add/i });

      fireEvent.change(attachInput, { target: { value: "not-a-valid-url" } });
      fireEvent.click(addAttachBtn);
      expect(
        screen.getByText("Please enter a valid URL for attachment")
      ).toBeDefined();

      fireEvent.change(attachInput, {
        target: { value: "https://systrol.internal/report.pdf" },
      });
      fireEvent.click(addAttachBtn);
      expect(
        screen.getByText("https://systrol.internal/report.pdf")
      ).toBeDefined();
    });

    it("successfully submits valid entry and invokes onSuccess callback", async () => {
      const handleSuccess = vi.fn();
      const mockCreatedEntry: ProjectLogEntryDto = {
        id: "entry-new",
        projectId: "proj-1",
        weekId: "w-47",
        authorId: "u-1",
        authorName: "Test Lead",
        category: LogEntryCategory.PROGRESS,
        stage: LifecycleStage.ERECTION,
        stepId: null,
        stepTitle: null,
        content: "Completed wiring for terminal block TB-104",
        blockers: null,
        nextAction: null,
        attachments: [],
        entryDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      vi.mocked(projectLogApi.postLogEntry).mockResolvedValue(mockCreatedEntry);

      render(
        <PostUpdateModal
          projectId="proj-1"
          steps={mockSteps}
          onClose={vi.fn()}
          onSuccess={handleSuccess}
        />
      );

      const textarea = screen.getByPlaceholderText(/Describe work completed/i);
      fireEvent.change(textarea, {
        target: { value: "Completed wiring for terminal block TB-104" },
      });

      const submitBtn = screen.getByRole("button", { name: /Post Update/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(projectLogApi.postLogEntry).toHaveBeenCalledWith(
          "proj-1",
          expect.objectContaining({
            category: LogEntryCategory.PROGRESS,
            content: "Completed wiring for terminal block TB-104",
          })
        );
        expect(handleSuccess).toHaveBeenCalledWith(mockCreatedEntry);
      });
    });
  });

  describe("ProjectLogTab", () => {
    const mockWeeks: ProjectLogWeekDto[] = [
      {
        id: "week-1",
        projectId: "proj-1",
        weekNumber: 47,
        year: 2026,
        status: LogWeekStatus.OPEN,
        startDate: "2026-11-16T00:00:00.000Z",
        endDate: "2026-11-22T23:59:59.999Z",
        entryCount: 1,
        lockedAt: null,
      },
    ];

    const mockEntries: ProjectLogEntryDto[] = [
      {
        id: "entry-1",
        projectId: "proj-1",
        weekId: "week-1",
        authorId: "u-1",
        authorName: "Sarah Connor",
        category: LogEntryCategory.PROGRESS,
        stage: LifecycleStage.ERECTION,
        stepId: null,
        stepTitle: null,
        content: "Commissioning stage 1 signoff achieved",
        blockers: null,
        nextAction: null,
        attachments: [],
        entryDate: "2026-11-17T09:00:00Z",
        createdAt: "2026-11-17T09:00:00Z",
      },
    ];

    it("fetches data and displays weeks and entries on mount", async () => {
      vi.mocked(projectLogApi.fetchLogWeeks).mockResolvedValue(mockWeeks);
      vi.mocked(projectLogApi.fetchLogEntries).mockResolvedValue({
        data: mockEntries,
        meta: { total: 1, page: 1, limit: 100, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });

      render(
        <ProjectLogTab
          projectId="proj-1"
          steps={[{ id: "s-1", title: "Step 1" }]}
          userRole="SUPER_ADMIN"
        />
      );

      await waitFor(() => {
        expect(screen.getByText("WEEK 47")).toBeDefined();
        expect(
          screen.getByText("Commissioning stage 1 signoff achieved")
        ).toBeDefined();
      });
    });

    it("opens PostUpdateModal when Post Update button is clicked", async () => {
      vi.mocked(projectLogApi.fetchLogWeeks).mockResolvedValue(mockWeeks);
      vi.mocked(projectLogApi.fetchLogEntries).mockResolvedValue({
        data: mockEntries,
        meta: { total: 1, page: 1, limit: 100, totalPages: 1, hasNextPage: false, hasPrevPage: false },
      });

      render(
        <ProjectLogTab
          projectId="proj-1"
          steps={[{ id: "s-1", title: "Step 1" }]}
          userRole="SUPER_ADMIN"
        />
      );

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Post Update/i })).toBeDefined();
      });

      const postBtn = screen.getByRole("button", { name: /Post Update/i });
      fireEvent.click(postBtn);

      expect(screen.getByText("Post Project Update")).toBeDefined();
    });

    it("displays empty state when no entries are recorded", async () => {
      vi.mocked(projectLogApi.fetchLogWeeks).mockResolvedValue([]);
      vi.mocked(projectLogApi.fetchLogEntries).mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 100, totalPages: 0, hasNextPage: false, hasPrevPage: false },
      });

      render(
        <ProjectLogTab
          projectId="proj-1"
          steps={[]}
          userRole="SUPER_ADMIN"
        />
      );

      await waitFor(() => {
        expect(
          screen.getByText(/No project log weeks recorded yet/i)
        ).toBeDefined();
      });
    });

    it("maintains strict project scoping when switching between multiple projects", async () => {
      vi.mocked(projectLogApi.fetchLogWeeks).mockImplementation((pId: string) => {
        return Promise.resolve([
          {
            id: `week-${pId}`,
            projectId: pId,
            weekNumber: 47,
            year: 2026,
            status: LogWeekStatus.OPEN,
            startDate: "2026-11-16T00:00:00.000Z",
            endDate: "2026-11-22T23:59:59.999Z",
            entryCount: 1,
            lockedAt: null,
          },
        ]);
      });

      vi.mocked(projectLogApi.fetchLogEntries).mockImplementation((pId: string) => {
        return Promise.resolve({
          data: [
            {
              id: `entry-${pId}`,
              projectId: pId,
              weekId: `week-${pId}`,
              authorId: "u-1",
              authorName: "Sarah Connor",
              category: LogEntryCategory.PROGRESS,
              stage: LifecycleStage.ERECTION,
              stepId: null,
              stepTitle: null,
              content: `Exclusive update for ${pId}`,
              blockers: null,
              nextAction: null,
              attachments: [],
              entryDate: "2026-11-17T09:00:00Z",
              createdAt: "2026-11-17T09:00:00Z",
            },
          ],
          meta: { total: 1, page: 1, limit: 100, totalPages: 1, hasNextPage: false, hasPrevPage: false },
        });
      });

      const { unmount } = render(
        <ProjectLogTab
          projectId="proj-sohar-steels"
          steps={[{ id: "s-1", title: "Step 1" }]}
          userRole="SUPER_ADMIN"
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Exclusive update for proj-sohar-steels")).toBeDefined();
        expect(projectLogApi.fetchLogWeeks).toHaveBeenCalledWith("proj-sohar-steels");
        expect(projectLogApi.fetchLogEntries).toHaveBeenCalledWith("proj-sohar-steels", expect.any(Object));
      });

      unmount();

      render(
        <ProjectLogTab
          projectId="proj-tata-wire-rod"
          steps={[{ id: "s-1", title: "Step 1" }]}
          userRole="SUPER_ADMIN"
        />
      );

      await waitFor(() => {
        expect(screen.getByText("Exclusive update for proj-tata-wire-rod")).toBeDefined();
        expect(screen.queryByText("Exclusive update for proj-sohar-steels")).toBeNull();
        expect(projectLogApi.fetchLogWeeks).toHaveBeenCalledWith("proj-tata-wire-rod");
        expect(projectLogApi.fetchLogEntries).toHaveBeenCalledWith("proj-tata-wire-rod", expect.any(Object));
      });
    });
  });

  describe("LifecycleStepsTab", () => {
    const mockProject: any = {
      id: "proj-1",
      name: "Line 4 Erection",
      client: "AutoCorp",
      currentStage: LifecycleStage.ERECTION,
      steps: [
        {
          id: "step-1",
          title: "Base Plate Leveling",
          order: 1,
          status: "COMPLETED",
          notes: "Checked with laser alignment",
          assignedTo: "John Doe",
          completedAt: "2026-11-10T10:00:00Z",
          completedByName: "John Doe",
        },
        {
          id: "step-2",
          title: "Frame Assembly",
          order: 2,
          status: "IN_PROGRESS",
          notes: "Bolts torqued to 120Nm",
          assignedTo: "Jane Smith",
        },
      ],
    };

    const mockCounts = {
      "step-1": 3,
      "step-2": 0,
    };

    it("renders steps with status, assignee, and log count badge", () => {
      render(
        <LifecycleStepsTab
          project={mockProject}
          stepEntryCounts={mockCounts}
          onStepFilterSelect={vi.fn()}
          onUpdateStep={vi.fn()}
          onAddSubStep={vi.fn()}
          onDeleteStep={vi.fn()}
        />
      );

      expect(screen.getByText("Base Plate Leveling")).toBeDefined();
      expect(screen.getByText("Frame Assembly")).toBeDefined();
      expect(screen.getByText(/3 log entries/i)).toBeDefined();
      expect(screen.getByText(/Completed by/i)).toBeDefined();
      expect(screen.getByText("John Doe")).toBeDefined();
    });

    it("triggers onStepFilterSelect callback when step log badge is clicked", () => {
      const handleFilterSelect = vi.fn();
      render(
        <LifecycleStepsTab
          project={mockProject}
          stepEntryCounts={mockCounts}
          onStepFilterSelect={handleFilterSelect}
          onUpdateStep={vi.fn()}
          onAddSubStep={vi.fn()}
          onDeleteStep={vi.fn()}
        />
      );

      const logBadgeBtn = screen.getByRole("button", { name: /3 log entries/i });
      fireEvent.click(logBadgeBtn);
      expect(handleFilterSelect).toHaveBeenCalledWith("step-1");
    });

    it("triggers onUpdateStep when step status dropdown changes", () => {
      const handleUpdateStep = vi.fn();
      render(
        <LifecycleStepsTab
          project={mockProject}
          stepEntryCounts={mockCounts}
          onStepFilterSelect={vi.fn()}
          onUpdateStep={handleUpdateStep}
          onAddSubStep={vi.fn()}
          onDeleteStep={vi.fn()}
        />
      );

      const selects = screen.getAllByRole("combobox");
      fireEvent.change(selects[0], { target: { value: "IN_PROGRESS" } });
      expect(handleUpdateStep).toHaveBeenCalledWith("step-1", "IN_PROGRESS");
    });

    it("opens add sub-step modal and submits new step", () => {
      const handleAddSubStep = vi.fn();
      render(
        <LifecycleStepsTab
          project={mockProject}
          stepEntryCounts={mockCounts}
          onStepFilterSelect={vi.fn()}
          onUpdateStep={vi.fn()}
          onAddSubStep={handleAddSubStep}
          onDeleteStep={vi.fn()}
        />
      );

      const addBetweenButtons = screen.getAllByRole("button", {
        name: /Add Step In Between/i,
      });
      fireEvent.click(addBetweenButtons[0]);

      expect(screen.getByText("Insert Intermediate Step")).toBeDefined();

      const titleInput = screen.getByPlaceholderText(/Civil Foundation Curing Signoff/i);
      fireEvent.change(titleInput, { target: { value: "Pre-torque Verification" } });

      const saveBtn = screen.getByRole("button", { name: /Insert Step/i });
      fireEvent.click(saveBtn);

      expect(handleAddSubStep).toHaveBeenCalledWith(
        1,
        "Pre-torque Verification",
        "",
        expect.any(String)
      );
    });
  });
});
