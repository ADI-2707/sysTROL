import { prisma } from "@systrol/database";
import { CreateStepDto, SignoffDto, StepStatus } from "@systrol/types";
import { DAGEngine, DAGNode } from "./dag.engine.js";

export class CommissioningService {
  static async listSteps(projectId: string) {
    const steps = await prisma.commissioningStep.findMany({
      where: { projectId },
      include: {
        signoffs: {
          include: { signedBy: { select: { id: true, name: true, role: true } } },
        },
      },
      orderBy: { order: "asc" },
    });

    return steps;
  }

  static async getStepById(id: string) {
    const step = await prisma.commissioningStep.findUnique({
      where: { id },
      include: {
        signoffs: {
          include: { signedBy: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    if (!step) {
      const error: any = new Error(`Commissioning step '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return step;
  }

  static async createStep(projectId: string, dto: CreateStepDto) {
    const existingSteps = await prisma.commissioningStep.findMany({
      where: { projectId },
    });

    // Check for potential cycles if dependencies are supplied
    if (dto.dependsOn && dto.dependsOn.length > 0) {
      const simulatedNodes: DAGNode[] = [
        ...existingSteps.map((s) => ({
          id: s.id,
          title: s.title,
          status: s.status,
          dependsOn: s.dependsOn,
        })),
        {
          id: "temp-new-step",
          title: dto.title,
          status: "PENDING",
          dependsOn: dto.dependsOn,
        },
      ];

      if (DAGEngine.hasCycle(simulatedNodes)) {
        const error: any = new Error("Adding this dependency creates a circular dependency cycle in the DAG");
        error.statusCode = 400;
        throw error;
      }
    }

    const order = existingSteps.length + 1;

    return prisma.commissioningStep.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        stepType: dto.stepType,
        order,
        dependsOn: dto.dependsOn || [],
        assignedToId: dto.assignedToId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  static async startStep(stepId: string) {
    const step = await this.getStepById(stepId);
    const allSteps = await prisma.commissioningStep.findMany({
      where: { projectId: step.projectId },
    });

    const dagNodes: DAGNode[] = allSteps.map((s) => ({
      id: s.id,
      title: s.title,
      status: s.status,
      dependsOn: s.dependsOn,
    }));

    const check = DAGEngine.canStartStep(stepId, dagNodes);
    if (!check.canStart) {
      const error: any = new Error(
        `Cannot start step. Predecessor steps not completed: ${check.uncompletedDependencies.join(", ")}`
      );
      error.statusCode = 422;
      throw error;
    }

    return prisma.commissioningStep.update({
      where: { id: stepId },
      data: { status: StepStatus.IN_PROGRESS },
    });
  }

  static async signoffStep(stepId: string, dto: SignoffDto, user: { id: string; role: string }) {
    const step = await this.getStepById(stepId);

    return prisma.$transaction(async (tx) => {
      const signoff = await tx.stepSignoff.create({
        data: {
          stepId,
          signedById: user.id,
          role: user.role,
          comments: dto.comments,
        },
      });

      const updatedStep = await tx.commissioningStep.update({
        where: { id: stepId },
        data: { status: StepStatus.COMPLETED },
      });

      return { step: updatedStep, signoff };
    });
  }

  static async getCriticalPath(projectId: string) {
    const steps = await prisma.commissioningStep.findMany({
      where: { projectId },
    });

    if (steps.length === 0) {
      return { criticalPath: [], totalDuration: 0 };
    }

    const dagNodes: DAGNode[] = steps.map((s) => ({
      id: s.id,
      title: s.title,
      status: s.status,
      dependsOn: s.dependsOn,
    }));

    return DAGEngine.computeCriticalPath(dagNodes);
  }
}
