import { describe, it, expect, vi, beforeEach } from "vitest";
import { LifecycleStage } from "@systrol/types";
import { StageGateEngine } from "../src/modules/lifecycle/stage-gate.engine.js";
import { ProjectsService } from "../src/modules/lifecycle/projects.service.js";
import { prisma } from "@systrol/database";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    project: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
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

describe("Phase 10: Projects & 12-Stage Lifecycle Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
        projectCode: "PRJ-2026-001",
        currentStage: LifecycleStage.PROCUREMENT,
        boqItems: [{ id: "boq-1" }],
        purchaseOrders: [],
        engineeringDocs: [],
        manufacturingBatches: [],
        shipments: [],
        steps: [],
        minutesOfMeetings: [],
      } as any);

      vi.mocked(prisma.project.update).mockResolvedValue({
        id: "p1",
        currentStage: LifecycleStage.ENGINEERING,
      } as any);

      const res = await ProjectsService.advanceStage("p1", { reason: "BOQ finalized" }, "user-1");

      expect(res.currentStage).toBe(LifecycleStage.ENGINEERING);
      expect(prisma.projectStageHistory.create).toHaveBeenCalledWith({
        data: {
          projectId: "p1",
          fromStage: LifecycleStage.PROCUREMENT,
          toStage: LifecycleStage.ENGINEERING,
          changedById: "user-1",
          reason: "BOQ finalized",
          isDeviation: false,
        },
      });
    });

    it("records a deviation when deviating stage backwards", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue({
        id: "p1",
        projectCode: "PRJ-2026-001",
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
          reason: "Critical PLC motor overload logic redesign needed",
          correctiveAction: "Re-issue logic flowcharts and patch firmware",
        },
        "user-lead"
      );

      expect(res.currentStage).toBe(LifecycleStage.ENGINEERING);
      expect(prisma.deviationRecord.create).toHaveBeenCalledWith({
        data: {
          projectId: "p1",
          failedStage: LifecycleStage.COMMISSIONING,
          reason: "Critical PLC motor overload logic redesign needed",
          correctiveAction: "Re-issue logic flowcharts and patch firmware",
          raisedById: "user-lead",
        },
      });
    });
  });
});
