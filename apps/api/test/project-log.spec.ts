import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CreateLogEntrySchema,
  LockWeekSchema,
  LogEntryCategory,
  LogWeekStatus,
  LifecycleStage,
  UserRole,
} from "@systrol/types";
import { ProjectLogService } from "../src/modules/project-log/project-log.service.js";
import {
  getWeekBounds,
  startOfDayUTC,
} from "../src/modules/project-log/week.util.js";
import { processAutoLockWeeks } from "../src/modules/project-log/jobs/auto-lock-weeks.job.js";
import { prisma } from "@systrol/database";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    projectLogWeek: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
    },
    projectLogEntry: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      groupBy: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findUniqueOrThrow: vi.fn(),
    },
    siteDeployment: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(async (cb) => {
      if (typeof cb === "function") {
        return cb(mPrisma);
      }
      return Promise.all(cb);
    }),
  };
  return { prisma: mPrisma };
});

describe("Project Log Module Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Project Log - Zod Schema Validation", () => {
    it("validates correct CreateLogEntrySchema payload with content, category and optional fields", () => {
      const payload = {
        category: LogEntryCategory.PROGRESS,
        content: "Completed cold commissioning for drives stand 1 to 3",
        blockers: "Waiting on client engineer signoff",
        nextAction: "Resume stand 4 cabling",
        stepId: "11111111-1111-1111-1111-111111111111",
        attachments: ["https://example.com/site-report.pdf"],
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateLogEntrySchema when content is under 10 characters", () => {
      const payload = {
        category: LogEntryCategory.PROGRESS,
        content: "Too short",
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateLogEntrySchema when content exceeds 3000 characters", () => {
      const payload = {
        category: LogEntryCategory.PROGRESS,
        content: "a".repeat(3001),
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateLogEntrySchema when blockers exceed 800 characters", () => {
      const payload = {
        content: "Valid log entry description with enough characters",
        blockers: "b".repeat(801),
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateLogEntrySchema when nextAction exceeds 500 characters", () => {
      const payload = {
        content: "Valid log entry description with enough characters",
        nextAction: "c".repeat(501),
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateLogEntrySchema when attachments exceed 5 items", () => {
      const payload = {
        content: "Valid log entry description with enough characters",
        attachments: [
          "https://example.com/1.pdf",
          "https://example.com/2.pdf",
          "https://example.com/3.pdf",
          "https://example.com/4.pdf",
          "https://example.com/5.pdf",
          "https://example.com/6.pdf",
        ],
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateLogEntrySchema when stepId is not a valid UUID", () => {
      const payload = {
        content: "Valid log entry description with enough characters",
        stepId: "invalid-uuid-string",
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("accepts CreateLogEntrySchema with default category PROGRESS when category omitted", () => {
      const payload = {
        content: "Work progress logged without explicit category",
      };
      const result = CreateLogEntrySchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category).toBe(LogEntryCategory.PROGRESS);
      }
    });

    it("validates LockWeekSchema with optional reason field", () => {
      expect(LockWeekSchema.safeParse({ reason: "Weekly signoff complete" }).success).toBe(true);
      expect(LockWeekSchema.safeParse({}).success).toBe(true);
    });
  });

  describe("ProjectLogService - Week Resolution", () => {
    it("getWeekBounds returns correct Monday start and Sunday end for a given date", () => {
      const testDate = new Date(Date.UTC(2026, 10, 18, 12, 0, 0));
      const bounds = getWeekBounds(testDate);

      expect(bounds.startDate.getUTCDay()).toBe(1);
      expect(bounds.startDate.getUTCHours()).toBe(0);
      expect(bounds.endDate.getUTCDay()).toBe(0);
      expect(bounds.endDate.getUTCHours()).toBe(23);
      expect(bounds.weekNumber).toBeGreaterThan(0);
      expect(bounds.year).toBe(2026);
    });

    it("getWeekBounds handles year boundary correctly when week 1 starts in December", () => {
      const endOfYear = new Date(Date.UTC(2025, 11, 30));
      const bounds = getWeekBounds(endOfYear);
      expect(bounds.weekNumber).toBe(1);
      expect(bounds.year).toBe(2026);
    });

    it("startOfDayUTC normalizes any datetime to midnight UTC", () => {
      const input = new Date(Date.UTC(2026, 5, 15, 18, 45, 30, 250));
      const result = startOfDayUTC(input);
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      expect(result.getUTCMilliseconds()).toBe(0);
      expect(result.getUTCDate()).toBe(15);
    });
  });

  describe("ProjectLogService - createEntry", () => {
    it("creates entry and upserts week block when no existing block for that week", async () => {
      vi.mocked(prisma.projectLogWeek.upsert).mockResolvedValue({
        id: "week-1",
        projectId: "proj-1",
        weekNumber: 47,
        year: 2026,
        status: LogWeekStatus.OPEN,
        startDate: new Date(),
        endDate: new Date(),
        lockedById: null,
        lockedAt: null,
        createdAt: new Date(),
      } as any);

      vi.mocked(prisma.project.findUniqueOrThrow).mockResolvedValue({
        currentStage: LifecycleStage.ERECTION,
      } as any);

      vi.mocked(prisma.projectLogEntry.create).mockResolvedValue({
        id: "entry-1",
        weekId: "week-1",
        projectId: "proj-1",
        authorId: "usr-admin",
        author: { id: "usr-admin", name: "Admin" },
        category: LogEntryCategory.PROGRESS,
        stage: LifecycleStage.ERECTION,
        stepId: null,
        step: null,
        content: "Completed civil foundation inspection",
        blockers: null,
        nextAction: null,
        attachments: [],
        entryDate: new Date(),
        createdAt: new Date(),
      } as any);

      const result = await ProjectLogService.createEntry(
        "proj-1",
        { content: "Completed civil foundation inspection", category: LogEntryCategory.PROGRESS, attachments: [] },
        { sub: "usr-admin", role: UserRole.SUPER_ADMIN, iat: 0, exp: 0 }
      );

      expect(result.id).toBe("entry-1");
      expect(result.stage).toBe(LifecycleStage.ERECTION);
      expect(prisma.projectLogWeek.upsert).toHaveBeenCalled();
      expect(prisma.projectLogEntry.create).toHaveBeenCalled();
    });

    it("throws 403 when FIELD_ENGINEER attempts to post to unassigned project", async () => {
      vi.mocked(prisma.siteDeployment.findFirst).mockResolvedValue(null);

      await expect(
        ProjectLogService.createEntry(
          "proj-unassigned",
          { content: "Trying to post to unassigned project", category: LogEntryCategory.PROGRESS, attachments: [] },
          { sub: "usr-fe-1", role: UserRole.FIELD_ENGINEER, iat: 0, exp: 0 }
        )
      ).rejects.toThrow("Field engineer can only access assigned projects");
    });

    it("throws 403 when CLIENT_AUDITOR attempts to post any entry", async () => {
      await expect(
        ProjectLogService.createEntry(
          "proj-1",
          { content: "Client auditor attempting log creation", category: LogEntryCategory.NOTE, attachments: [] },
          { sub: "usr-auditor", role: UserRole.CLIENT_AUDITOR, iat: 0, exp: 0 }
        )
      ).rejects.toThrow("Client auditor is restricted to read-only access");
    });

    it("throws 422 when week is LOCKED and user is not SUPER_ADMIN", async () => {
      vi.mocked(prisma.projectLogWeek.upsert).mockResolvedValue({
        id: "week-locked",
        status: LogWeekStatus.LOCKED,
      } as any);

      await expect(
        ProjectLogService.createEntry(
          "proj-1",
          { content: "Attempting write to closed week without super admin", category: LogEntryCategory.PROGRESS, attachments: [] },
          { sub: "usr-lead", role: UserRole.COMMISSIONING_LEAD, iat: 0, exp: 0 }
        )
      ).rejects.toThrow("This week is locked");
    });

    it("throws 422 when entryDate is from a past week (strict anti-backfill)", async () => {
      const pastDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

      await expect(
        ProjectLogService.createEntry(
          "proj-1",
          {
            content: "Attempting to backfill update from two weeks ago",
            category: LogEntryCategory.PROGRESS,
            entryDate: pastDate,
            attachments: [],
          },
          { sub: "usr-super", role: UserRole.SUPER_ADMIN, iat: 0, exp: 0 }
        )
      ).rejects.toThrow("Strict anti-backfill: Cannot log updates for past weeks");
    });

    it("throws 422 when entryDate is in the future", async () => {
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      await expect(
        ProjectLogService.createEntry(
          "proj-1",
          {
            content: "Attempting to post for next week in advance",
            category: LogEntryCategory.PROGRESS,
            entryDate: futureDate,
            attachments: [],
          },
          { sub: "usr-super", role: UserRole.SUPER_ADMIN, iat: 0, exp: 0 }
        )
      ).rejects.toThrow("Cannot log updates for future dates");
    });

    it("allows logging an earlier day within the current active week (day-wise logging)", async () => {
      const bounds = getWeekBounds(new Date());
      const mondayStr = bounds.startDate.toISOString();

      vi.mocked(prisma.projectLogWeek.upsert).mockResolvedValue({
        id: "week-current",
        status: LogWeekStatus.OPEN,
      } as any);

      vi.mocked(prisma.project.findUniqueOrThrow).mockResolvedValue({
        currentStage: LifecycleStage.COMMISSIONING,
      } as any);

      vi.mocked(prisma.projectLogEntry.create).mockResolvedValue({
        id: "entry-monday",
        weekId: "week-current",
        projectId: "proj-1",
        authorId: "usr-lead",
        author: { id: "usr-lead", name: "Lead Engineer" },
        category: LogEntryCategory.PROGRESS,
        stage: LifecycleStage.COMMISSIONING,
        stepId: null,
        step: null,
        content: "Logged Monday site work at end of week",
        blockers: null,
        nextAction: null,
        attachments: [],
        entryDate: bounds.startDate,
        createdAt: new Date(),
      } as any);

      const result = await ProjectLogService.createEntry(
        "proj-1",
        {
          content: "Logged Monday site work at end of week",
          category: LogEntryCategory.PROGRESS,
          entryDate: mondayStr,
          attachments: [],
        },
        { sub: "usr-lead", role: UserRole.COMMISSIONING_LEAD, iat: 0, exp: 0 }
      );

      expect(result.id).toBe("entry-monday");
      expect(prisma.projectLogEntry.create).toHaveBeenCalled();
    });

    it("snapshots project.currentStage at time of entry creation", async () => {
      vi.mocked(prisma.projectLogWeek.upsert).mockResolvedValue({
        id: "week-1",
        status: LogWeekStatus.OPEN,
      } as any);

      vi.mocked(prisma.project.findUniqueOrThrow).mockResolvedValue({
        currentStage: LifecycleStage.HOT_TRIAL,
      } as any);

      vi.mocked(prisma.projectLogEntry.create).mockResolvedValue({
        id: "entry-stage-check",
        stage: LifecycleStage.HOT_TRIAL,
        author: { id: "u-1", name: "Lead" },
        category: LogEntryCategory.PROGRESS,
        attachments: [],
        entryDate: new Date(),
        createdAt: new Date(),
      } as any);

      const result = await ProjectLogService.createEntry(
        "proj-1",
        { content: "Hot trial run completed with steel billet pass", category: LogEntryCategory.PROGRESS, attachments: [] },
        { sub: "u-1", role: UserRole.COMMISSIONING_LEAD, iat: 0, exp: 0 }
      );

      expect(result.stage).toBe(LifecycleStage.HOT_TRIAL);
      expect(prisma.projectLogEntry.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            stage: LifecycleStage.HOT_TRIAL,
          }),
        })
      );
    });

    it("does not throw when FIELD_ENGINEER posts to an assigned project", async () => {
      vi.mocked(prisma.siteDeployment.findFirst).mockResolvedValue({
        id: "deployment-1",
        projectId: "proj-1",
        employeeId: "emp-1",
      } as any);

      vi.mocked(prisma.projectLogWeek.upsert).mockResolvedValue({
        id: "week-1",
        status: LogWeekStatus.OPEN,
      } as any);

      vi.mocked(prisma.project.findUniqueOrThrow).mockResolvedValue({
        currentStage: LifecycleStage.ERECTION,
      } as any);

      vi.mocked(prisma.projectLogEntry.create).mockResolvedValue({
        id: "entry-fe",
        author: { id: "usr-fe", name: "Field Engineer" },
        category: LogEntryCategory.PROGRESS,
        attachments: [],
        entryDate: new Date(),
        createdAt: new Date(),
      } as any);

      const res = await ProjectLogService.createEntry(
        "proj-1",
        { content: "Field engineer daily inspection logged successfully", category: LogEntryCategory.PROGRESS, attachments: [] },
        { sub: "usr-fe", role: UserRole.FIELD_ENGINEER, iat: 0, exp: 0 }
      );

      expect(res.id).toBe("entry-fe");
    });
  });

  describe("ProjectLogService - Week Management", () => {
    it("lockWeek sets status LOCKED and records lockedById and lockedAt", async () => {
      vi.mocked(prisma.projectLogWeek.findFirst).mockResolvedValue({
        id: "w-1",
        projectId: "p-1",
        status: LogWeekStatus.OPEN,
      } as any);

      vi.mocked(prisma.projectLogWeek.update).mockResolvedValue({
        id: "w-1",
        status: LogWeekStatus.LOCKED,
      } as any);

      await ProjectLogService.lockWeek("p-1", "w-1", "usr-lead", { reason: "End of sprint" });

      expect(prisma.projectLogWeek.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "w-1" },
          data: expect.objectContaining({
            status: LogWeekStatus.LOCKED,
            lockedById: "usr-lead",
          }),
        })
      );
    });

    it("lockWeek throws 422 when week is already LOCKED", async () => {
      vi.mocked(prisma.projectLogWeek.findFirst).mockResolvedValue({
        id: "w-1",
        projectId: "p-1",
        status: LogWeekStatus.LOCKED,
      } as any);

      await expect(
        ProjectLogService.lockWeek("p-1", "w-1", "usr-lead")
      ).rejects.toThrow("Week is already locked");
    });

    it("lockWeek throws 404 when weekId does not belong to the project", async () => {
      vi.mocked(prisma.projectLogWeek.findFirst).mockResolvedValue(null);

      await expect(
        ProjectLogService.lockWeek("p-1", "w-invalid", "usr-lead")
      ).rejects.toThrow("Week block 'w-invalid' not found");
    });

    it("unlockWeek resets status to OPEN and clears lockedById and lockedAt", async () => {
      vi.mocked(prisma.projectLogWeek.findFirst).mockResolvedValue({
        id: "w-1",
        projectId: "p-1",
        status: LogWeekStatus.LOCKED,
      } as any);

      vi.mocked(prisma.projectLogWeek.update).mockResolvedValue({
        id: "w-1",
        status: LogWeekStatus.OPEN,
      } as any);

      await ProjectLogService.unlockWeek("p-1", "w-1");

      expect(prisma.projectLogWeek.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "w-1" },
          data: {
            status: LogWeekStatus.OPEN,
            lockedById: null,
            lockedAt: null,
          },
        })
      );
    });
  });

  describe("ProjectLogService - Query Methods", () => {
    it("listEntries returns paginated results with correct meta", async () => {
      const mockEntries = [
        {
          id: "e-1",
          author: { id: "u-1", name: "Lead" },
          step: { id: "s-1", title: "Enquiry" },
          entryDate: new Date(),
          createdAt: new Date(),
          attachments: [],
        },
      ];
      vi.mocked(prisma.projectLogEntry.findMany).mockResolvedValue(mockEntries as any);
      vi.mocked(prisma.projectLogEntry.count).mockResolvedValue(1);

      const res = await ProjectLogService.listEntries("p-1", { page: 1, limit: 10 });
      expect(res.data.length).toBe(1);
      expect(res.meta.total).toBe(1);
      expect(res.meta.totalPages).toBe(1);
    });

    it("listEntries filters by stepId when provided", async () => {
      vi.mocked(prisma.projectLogEntry.findMany).mockResolvedValue([]);
      vi.mocked(prisma.projectLogEntry.count).mockResolvedValue(0);

      await ProjectLogService.listEntries("p-1", { stepId: "step-100" });

      expect(prisma.projectLogEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            stepId: "step-100",
          }),
        })
      );
    });

    it("listEntries filters by category when provided", async () => {
      vi.mocked(prisma.projectLogEntry.findMany).mockResolvedValue([]);
      vi.mocked(prisma.projectLogEntry.count).mockResolvedValue(0);

      await ProjectLogService.listEntries("p-1", { category: LogEntryCategory.BLOCKER });

      expect(prisma.projectLogEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: LogEntryCategory.BLOCKER,
          }),
        })
      );
    });

    it("getStepEntryCounts returns a map of stepId to count for the project", async () => {
      vi.mocked(prisma.projectLogEntry.groupBy).mockResolvedValue([
        { stepId: "step-1", _count: { stepId: 5 } },
        { stepId: "step-2", _count: { stepId: 12 } },
      ] as any);

      const counts = await ProjectLogService.getStepEntryCounts("p-1");
      expect(counts["step-1"]).toBe(5);
      expect(counts["step-2"]).toBe(12);
    });
  });

  describe("Auto-lock weeks job", () => {
    it("updateMany locks all OPEN weeks whose endDate is before current time", async () => {
      vi.mocked(prisma.projectLogWeek.updateMany).mockResolvedValue({ count: 3 });

      const lockedCount = await processAutoLockWeeks();

      expect(lockedCount).toBe(3);
      expect(prisma.projectLogWeek.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: LogWeekStatus.OPEN,
          }),
          data: expect.objectContaining({
            status: LogWeekStatus.LOCKED,
          }),
        })
      );
    });
  });
});
