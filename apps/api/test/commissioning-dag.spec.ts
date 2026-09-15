import { describe, it, expect, vi, beforeEach } from "vitest";
import { DAGEngine, DAGNode } from "../src/modules/commissioning/dag.engine.js";
import { CommissioningService } from "../src/modules/commissioning/commissioning.service.js";
import { prisma } from "@systrol/database";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    commissioningStep: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    stepSignoff: {
      create: vi.fn(),
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

describe("Phase 11: Commissioning DAG Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DAGEngine", () => {
    it("detects cycles in cyclic dependency graph", () => {
      const cyclicNodes: DAGNode[] = [
        { id: "A", title: "A", status: "PENDING", dependsOn: ["C"] },
        { id: "B", title: "B", status: "PENDING", dependsOn: ["A"] },
        { id: "C", title: "C", status: "PENDING", dependsOn: ["B"] },
      ];

      expect(DAGEngine.hasCycle(cyclicNodes)).toBe(true);
    });

    it("verifies acyclic graph and produces topological sorting", () => {
      const validNodes: DAGNode[] = [
        { id: "A", title: "A", status: "COMPLETED", dependsOn: [] },
        { id: "B", title: "B", status: "PENDING", dependsOn: ["A"] },
        { id: "C", title: "C", status: "PENDING", dependsOn: ["A"] },
        { id: "D", title: "D", status: "PENDING", dependsOn: ["B", "C"] },
      ];

      expect(DAGEngine.hasCycle(validNodes)).toBe(false);
      const order = DAGEngine.topologicalSort(validNodes);
      expect(order.indexOf("A")).toBeLessThan(order.indexOf("B"));
      expect(order.indexOf("A")).toBeLessThan(order.indexOf("C"));
      expect(order.indexOf("B")).toBeLessThan(order.indexOf("D"));
      expect(order.indexOf("C")).toBeLessThan(order.indexOf("D"));
    });

    it("computes the critical path correctly", () => {
      const nodes: DAGNode[] = [
        { id: "A", title: "A", status: "COMPLETED", dependsOn: [], estimatedDurationHours: 10 },
        { id: "B", title: "B", status: "PENDING", dependsOn: ["A"], estimatedDurationHours: 20 },
        { id: "C", title: "C", status: "PENDING", dependsOn: ["A"], estimatedDurationHours: 5 },
        { id: "D", title: "D", status: "PENDING", dependsOn: ["B", "C"], estimatedDurationHours: 15 },
      ];

      const res = DAGEngine.computeCriticalPath(nodes);
      expect(res.criticalPath).toEqual(["A", "B", "D"]);
      expect(res.totalDuration).toBe(45);
    });

    it("prevents starting step when predecessor is not completed", () => {
      const nodes: DAGNode[] = [
        { id: "A", title: "A", status: "IN_PROGRESS", dependsOn: [] },
        { id: "B", title: "B", status: "PENDING", dependsOn: ["A"] },
      ];

      const check = DAGEngine.canStartStep("B", nodes);
      expect(check.canStart).toBe(false);
      expect(check.uncompletedDependencies[0]).toBe("A");
    });
  });

  describe("CommissioningService", () => {
    it("creates a new commissioning step when DAG remains acyclic", async () => {
      vi.mocked(prisma.commissioningStep.findMany).mockResolvedValue([
        { id: "step-1", title: "Cold Check", status: "COMPLETED", dependsOn: [] } as any,
      ]);

      vi.mocked(prisma.commissioningStep.create).mockResolvedValue({
        id: "step-2",
        projectId: "prj-1",
        title: "HIL Simulation",
        order: 2,
        dependsOn: ["step-1"],
      } as any);

      const res = await CommissioningService.createStep("prj-1", {
        title: "HIL Simulation",
        stepType: "HIL_SIMULATION" as any,
        dependsOn: ["step-1"],
      });

      expect(res.id).toBe("step-2");
      expect(prisma.commissioningStep.create).toHaveBeenCalled();
    });

    it("signs off step and transitions status to COMPLETED", async () => {
      vi.mocked(prisma.commissioningStep.findUnique).mockResolvedValue({
        id: "step-1",
        projectId: "prj-1",
      } as any);

      vi.mocked(prisma.stepSignoff.create).mockResolvedValue({
        id: "signoff-1",
        stepId: "step-1",
        signedById: "user-1",
      } as any);

      vi.mocked(prisma.commissioningStep.update).mockResolvedValue({
        id: "step-1",
        status: "COMPLETED",
      } as any);

      const res = await CommissioningService.signoffStep(
        "step-1",
        { comments: "Inspections cleared" },
        { id: "user-1", role: "COMMISSIONING_LEAD" }
      );

      expect(res.step.status).toBe("COMPLETED");
      expect(prisma.stepSignoff.create).toHaveBeenCalled();
      expect(prisma.commissioningStep.update).toHaveBeenCalled();
    });
  });
});
