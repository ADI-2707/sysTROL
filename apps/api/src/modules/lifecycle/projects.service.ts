import { prisma } from "@systrol/database";
import {
  LifecycleStage,
  STAGE_ORDER,
  AdvanceStageDto,
  DeviateStageDto,
  CreateProjectDto,
  UpdateStepStatusDto,
} from "@systrol/types";
import { StageGateEngine } from "./stage-gate.engine.js";

const PREDEFINED_STEPS = [
  "Enquiry",
  "Sales visit",
  "Procurement",
  "Engineering phase",
  "Material / Manufacturing",
  "Dispatch",
  "Erection and commissioning",
  "Cold trial / Hot trial",
  "Performance and guarantee testing",
  "MOM",
  "Payment",
  "AMC (Annual Maintenance)",
];

export class ProjectsService {
  static async listProjects(params?: { page?: number; limit?: number; search?: string }) {
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params?.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { projectCode: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: true,
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
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
      },
    });

    if (!project) {
      const error: any = new Error(`Project '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return project;
  }

  static async getProjectWithGates(id: string) {
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

  static async getProjectBOQ(projectId: string) {
    return prisma.bOQItem.findMany({
      where: { projectId },
      orderBy: { id: "asc" },
    });
  }

  static async getProjectPOs(projectId: string) {
    return prisma.purchaseOrder.findMany({
      where: { projectId },
      include: { vendor: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProjectDocs(projectId: string) {
    return prisma.engineeringDoc.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProjectBatches(projectId: string) {
    return prisma.manufacturingBatch.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProjectShipments(projectId: string) {
    return prisma.shipment.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async advanceStage(projectId: string, dto: AdvanceStageDto, userId: string) {
    const project = await this.getProjectWithGates(projectId);
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

  static async createProject(dto: CreateProjectDto, userId: string) {
    let client = await prisma.clientCompany.findFirst({
      where: { name: { equals: dto.clientName, mode: "insensitive" } },
    });

    if (!client) {
      client = await prisma.clientCompany.create({
        data: {
          name: dto.clientName,
          country: dto.country || "India",
          sector: "Steel & Metallurgy",
          contactEmail: `contact@${dto.clientName.toLowerCase().replace(/[^a-z0-9]/g, "") || "client"}.com`,
        },
      });
    }

    const count = await prisma.project.count();
    const projectCode = `PROJ-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;
    const isCommissioned = dto.status === "COMMISSIONED";

    return prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          projectCode,
          name: dto.name,
          clientId: client.id,
          plantLocation: dto.location,
          country: dto.country || "India",
          millType: dto.millType || "Rolling Mill",
          lineType: dto.lineName,
          standCount: dto.standCount || 10,
          currentStage: isCommissioned ? LifecycleStage.AMC : LifecycleStage.ENQUIRY,
          createdById: userId,
          startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
          targetCutoverDate: dto.targetCutoverDate
            ? new Date(dto.targetCutoverDate)
            : new Date(Date.now() + 86400000 * 180),
        },
      });

      const stepsToCreate = PREDEFINED_STEPS.map((title, idx) => ({
        projectId: project.id,
        title,
        stepType: "COMMISSIONING",
        status: isCommissioned ? "COMPLETED" : idx === 0 ? "IN_PROGRESS" : "PENDING",
        order: (idx + 1) * 100,
      }));

      await tx.commissioningStep.createMany({
        data: stepsToCreate,
      });

      await tx.projectStageHistory.create({
        data: {
          projectId: project.id,
          fromStage: null,
          toStage: isCommissioned ? LifecycleStage.AMC : LifecycleStage.ENQUIRY,
          changedById: userId,
          reason: "Project created in ops portal",
          isDeviation: false,
        },
      });

      return tx.project.findUnique({
        where: { id: project.id },
        include: {
          client: true,
          steps: { orderBy: { order: "asc" } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      });
    });
  }

  static async updateStepStatus(
    projectId: string,
    stepIdentifier: string,
    dto: UpdateStepStatusDto
  ) {
    let step = await prisma.commissioningStep.findFirst({
      where: {
        projectId,
        OR: [
          { id: stepIdentifier },
          { title: { equals: stepIdentifier, mode: "insensitive" } },
        ],
      },
    });

    if (!step && stepIdentifier.startsWith("step-")) {
      const stepIndex = parseInt(stepIdentifier.replace("step-", ""), 10);
      if (!isNaN(stepIndex)) {
        step = await prisma.commissioningStep.findFirst({
          where: {
            projectId,
            order: stepIndex * 100,
          },
        });
      }
    }

    if (!step) {
      const stepTitle = stepIdentifier.startsWith("step-")
        ? PREDEFINED_STEPS[parseInt(stepIdentifier.replace("step-", ""), 10) - 1] || stepIdentifier
        : stepIdentifier;

      step = await prisma.commissioningStep.create({
        data: {
          projectId,
          title: stepTitle,
          stepType: "COMMISSIONING",
          status: "PENDING",
          order: 100,
        },
      });
    }

    const updated = await prisma.commissioningStep.update({
      where: { id: step.id },
      data: {
        status: dto.status,
        description: dto.notes !== undefined ? dto.notes : step.description,
      },
    });

    return {
      previous: step,
      current: updated,
    };
  }
}
