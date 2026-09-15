import { prisma } from "@systrol/database";
import { CreateManufacturingBatchDto, CompleteFATDto } from "@systrol/types";

export class ManufacturingBatchService {
  static async createBatch(projectId: string, dto: CreateManufacturingBatchDto) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      const error: any = new Error(`Project '${projectId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const count = await prisma.manufacturingBatch.count({
      where: { projectId },
    });

    const sequence = String(count + 1).padStart(2, "0");
    const batchCode = `BATCH-${project.projectCode}-${sequence}`;

    return prisma.manufacturingBatch.create({
      data: {
        projectId,
        batchCode,
        panelType: dto.panelType,
      },
    });
  }

  static async listBatches(projectId?: string) {
    return prisma.manufacturingBatch.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: { select: { id: true, projectCode: true, name: true } },
        qcChecks: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getBatchById(id: string) {
    const batch = await prisma.manufacturingBatch.findUnique({
      where: { id },
      include: {
        project: true,
        qcChecks: {
          include: { checkedBy: { select: { id: true, name: true } } },
        },
      },
    });

    if (!batch) {
      const error: any = new Error(`Manufacturing batch '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return batch;
  }

  static async completeFAT(batchId: string, dto: CompleteFATDto) {
    const batch = await prisma.manufacturingBatch.findUnique({ where: { id: batchId } });
    if (!batch) {
      const error: any = new Error(`Manufacturing batch '${batchId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.manufacturingBatch.update({
      where: { id: batchId },
      data: {
        fatPassed: dto.fatPassed,
        fatReportUrl: dto.fatReportUrl || `https://systrol-documents.s3.us-east-1.amazonaws.com/manufacturing/fat-reports/${batch.batchCode}.pdf`,
        completedAt: new Date(),
      },
    });
  }
}
