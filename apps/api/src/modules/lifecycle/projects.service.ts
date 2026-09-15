import { prisma } from "@systrol/database";
import {
  LifecycleStage,
  STAGE_ORDER,
  AdvanceStageDto,
  DeviateStageDto,
} from "@systrol/types";
import { StageGateEngine } from "./stage-gate.engine.js";

export class ProjectsService {
  static async listProjects() {
    return prisma.project.findMany({
      include: {
        client: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: true,
        createdBy: { select: { id: true, name: true } },
        stageHistory: {
          include: { changedBy: { select: { id: true, name: true } } },
          orderBy: { changedAt: "desc" },
        },
        boqItems: true,
        purchaseOrders: true,
        engineeringDocs: true,
        manufacturingBatches: true,
        shipments: true,
        steps: true,
        minutesOfMeetings: true,
      },
    });

    if (!project) {
      const error: any = new Error(`Project '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return project;
  }

  static async advanceStage(projectId: string, dto: AdvanceStageDto, userId: string) {
    const project = await this.getProjectById(projectId);
    const currentIndex = STAGE_ORDER.indexOf(project.currentStage as LifecycleStage);

    if (currentIndex >= STAGE_ORDER.length - 1) {
      const error: any = new Error("Project is already at terminal stage (AMC)");
      error.statusCode = 400;
      throw error;
    }

    const gateResult = StageGateEngine.evaluateAdvanceGates({
      project: {
        id: project.id,
        currentStage: project.currentStage as LifecycleStage,
        boqItems: project.boqItems,
        purchaseOrders: project.purchaseOrders,
        engineeringDocs: project.engineeringDocs,
        manufacturingBatches: project.manufacturingBatches,
        shipments: project.shipments,
        steps: project.steps,
        minutesOfMeetings: project.minutesOfMeetings,
      },
    });

    if (!gateResult.allowed) {
      const error: any = new Error(
        `Stage advancement blocked: ${gateResult.blockers.join("; ")}`
      );
      error.statusCode = 422;
      error.blockers = gateResult.blockers;
      throw error;
    }

    const nextStage = STAGE_ORDER[currentIndex + 1];

    return prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: projectId },
        data: { currentStage: nextStage },
      });

      await tx.projectStageHistory.create({
        data: {
          projectId,
          fromStage: project.currentStage as LifecycleStage,
          toStage: nextStage,
          changedById: userId,
          reason: dto.reason || `Advanced sequentially to ${nextStage}`,
          isDeviation: false,
        },
      });

      return updated;
    });
  }

  static async deviateStage(projectId: string, dto: DeviateStageDto, userId: string) {
    const project = await this.getProjectById(projectId);

    const validation = StageGateEngine.validateDeviation(
      project.currentStage as LifecycleStage,
      dto.targetStage,
      dto.reason,
      dto.correctiveAction
    );

    if (!validation.valid) {
      const error: any = new Error(validation.error);
      error.statusCode = 400;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id: projectId },
        data: { currentStage: dto.targetStage },
      });

      await tx.projectStageHistory.create({
        data: {
          projectId,
          fromStage: project.currentStage as LifecycleStage,
          toStage: dto.targetStage,
          changedById: userId,
          reason: dto.reason,
          isDeviation: true,
        },
      });

      await tx.deviationRecord.create({
        data: {
          projectId,
          failedStage: project.currentStage as LifecycleStage,
          reason: dto.reason,
          correctiveAction: dto.correctiveAction,
          raisedById: userId,
        },
      });

      return updated;
    });
  }

  static async getStageHistory(projectId: string) {
    return prisma.projectStageHistory.findMany({
      where: { projectId },
      include: {
        changedBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { changedAt: "desc" },
    });
  }

  static async getDeviations(projectId?: string) {
    return prisma.deviationRecord.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { failedStage: "asc" },
    });
  }
}
