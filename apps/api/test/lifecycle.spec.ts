import { describe, it, expect, vi, beforeEach } from "vitest";
import { LifecycleStage, AdvanceStageSchema, DeviateStageSchema } from "@systrol/types";
import { StageGateEngine } from "../src/modules/lifecycle/stage-gate.engine.js";
import { ProjectsService } from "../src/modules/lifecycle/projects.service.js";
import { prisma } from "@systrol/database";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    project: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    projectStageHistory: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    deviationRecord: {
      create: vi.fn(),
      findMany: vi.fn(),
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

describe("Projects & 12-Stage Lifecycle Engine Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Lifecycle Payload Validation", () => {
    it("validates correct DeviateStageSchema payload", () => {
      const validPayload = {
        targetStage: LifecycleStage.ENGINEERING,
        reason: "Motor foundation modification requested by client",
        correctiveAction: "Reissue structural engineering drawings for review",
      };
      const result = DeviateStageSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects DeviateStageSchema with short reason or corrective action", () => {
      const invalidPayload = {
        targetStage: LifecycleStage.ENGINEERING,
        reason: "Issue",
        correctiveAction: "Fix it",
      };
      const result = DeviateStageSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates AdvanceStageSchema payload", () => {
      expect(AdvanceStageSchema.safeParse({ reason: "Gates cleared" }).success).toBe(true);
      expect(AdvanceStageSchema.safeParse({}).success).toBe(true);
    });
  });

  describe("StageGateEngine", () => {
    it("blocks advancing from MANUFACTURING to DISPATCH if FAT has not passed", () => {
      const res = StageGateEngine.evaluateAdvanceGates({
        project: {
          id: "p1",
          currentStage: LifecycleStage.MANUFACTURING,
          manufacturingBatches: [
            { id: "b1", fatPassed: true },
            { id: "b2", fatPassed: false },
          ],
        },
      });

      expect(res.allowed).toBe(false);
      expect(res.blockers[0]).toContain("Factory Acceptance Testing");
    });

    it("allows advancing from MANUFACTURING to DISPATCH when all batches passed FAT", () => {
      const res = StageGateEngine.evaluateAdvanceGates({
        project: {
          id: "p1",
          currentStage: LifecycleStage.MANUFACTURING,
          manufacturingBatches: [
            { id: "b1", fatPassed: true },
            { id: "b2", fatPassed: true },
          ],
        },
      });

      expect(res.allowed).toBe(true);
      expect(res.blockers.length).toBe(0);
    });

    it("blocks advancing from DISPATCH if shipments are undelivered", () => {
      const res = StageGateEngine.evaluateAdvanceGates({
        project: {
          id: "p1",
          currentStage: LifecycleStage.DISPATCH,
          shipments: [
            { id: "s1", deliveredAt: null },
          ],
        },
      });

      expect(res.allowed).toBe(false);
      expect(res.blockers[0]).toContain("shipments are still in transit");
    });

    it("validates deviation parameters rejecting trivial reasons", () => {
      const res = StageGateEngine.validateDeviation(
        LifecycleStage.COMMISSIONING,
        LifecycleStage.ENGINEERING,
        "short",
        "also short"
      );

      expect(res.valid).toBe(false);
      expect(res.error).toContain("at least 10 characters");
    });
  });

  describe("ProjectsService", () => {
    it("advances stage sequentially when prerequisites are satisfied", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "p1",
        currentStage: LifecycleStage.ERECTION,
        manufacturingBatches: [],
        shipments: [],
      } as any);

      vi.mocked(prisma.project.update).mockResolvedValue({
        id: "p1",
        currentStage: LifecycleStage.COMMISSIONING,
      } as any);

      const res = await ProjectsService.advanceStage("p1", {}, "user-1");
      expect(res.currentStage).toBe(LifecycleStage.COMMISSIONING);
      expect(prisma.projectStageHistory.create).toHaveBeenCalled();
      expect(prisma.project.update).toHaveBeenCalled();
    });

    it("records out-of-order deviation and creates deviation record", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "p1",
        currentStage: LifecycleStage.COMMISSIONING,
      } as any);

      vi.mocked(prisma.project.update).mockResolvedValue({
        id: "p1",
        currentStage: LifecycleStage.ENGINEERING,
      } as any);

      const res = await ProjectsService.deviateStage(
        "p1",
        {
          targetStage: LifecycleStage.ENGINEERING,
          reason: "Customer requested complete redesign of motor drives cascade",
          correctiveAction: "Re-engineering drive calculations and issuing revision 2 GA drawings",
        },
        "user-lead-1"
      );

      expect(res.currentStage).toBe(LifecycleStage.ENGINEERING);
      expect(prisma.deviationRecord.create).toHaveBeenCalled();
      expect(prisma.projectStageHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isDeviation: true,
          }),
        })
      );
    });

    it("default pagination returns page 1 with 20 limit and total count", async () => {
      const mockProjects = Array.from({ length: 20 }, (_, i) => ({ id: `p-${i}`, name: `Project ${i}` }));
      vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects as any);
      vi.mocked(prisma.project.count).mockResolvedValue(45);

      const result = await ProjectsService.listProjects();
      expect(result.data.length).toBe(20);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(20);
      expect(result.meta.total).toBe(45);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPrevPage).toBe(false);
      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 20,
        })
      );
    });

    it("custom page and limit calculate correct skip offset", async () => {
      vi.mocked(prisma.project.findMany).mockResolvedValue([]);
      vi.mocked(prisma.project.count).mockResolvedValue(100);

      await ProjectsService.listProjects({ page: 3, limit: 15 });
      expect(prisma.project.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 30,
          take: 15,
        })
      );
    });

    it("requesting page beyond total count returns empty data with totalPages", async () => {
      vi.mocked(prisma.project.findMany).mockResolvedValue([]);
      vi.mocked(prisma.project.count).mockResolvedValue(10);

      const result = await ProjectsService.listProjects({ page: 5, limit: 10 });
      expect(result.data).toEqual([]);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPrevPage).toBe(true);
    });

    it("decoupled getProjectById excludes large subresource arrays from include", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "proj-100",
        name: "Steel Plant Mill Drive",
        client: { id: "c-1", name: "JSW" },
        createdBy: { id: "u-1", name: "Admin" },
        stageHistory: [],
      } as any);

      const project = await ProjectsService.getProjectById("proj-100");
      expect(project.id).toBe("proj-100");
      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: "proj-100" },
        include: {
          client: true,
          createdBy: { select: { id: true, name: true } },
          stageHistory: {
            include: { changedBy: { select: { id: true, name: true } } },
            orderBy: { changedAt: "desc" },
          },
        },
      });
    });
  });
});
