import { prisma } from "@systrol/database";
import { CreateBOQItemDto } from "@systrol/types";

export class BOQService {
  static async createBOQItems(projectId: string, items: CreateBOQItemDto[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.bOQItem.create({
          data: {
            projectId,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            estimatedUnitCost: item.estimatedUnitCost,
            purchaseOrderId: item.purchaseOrderId || null,
          },
        })
      )
    );
  }

  static async listBOQItems(projectId: string) {
    return prisma.bOQItem.findMany({
      where: { projectId },
      include: {
        purchaseOrder: {
          select: { id: true, poNumber: true, status: true },
        },
      },
      orderBy: { id: "asc" },
    });
  }

  static async updateBOQItem(id: string, dto: Partial<CreateBOQItemDto>) {
    return prisma.bOQItem.update({
      where: { id },
      data: {
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.quantity !== undefined ? { quantity: dto.quantity } : {}),
        ...(dto.unit ? { unit: dto.unit } : {}),
        ...(dto.estimatedUnitCost !== undefined ? { estimatedUnitCost: dto.estimatedUnitCost } : {}),
        ...(dto.purchaseOrderId !== undefined ? { purchaseOrderId: dto.purchaseOrderId } : {}),
      },
    });
  }

  static async deleteBOQItem(id: string) {
    return prisma.bOQItem.delete({
      where: { id },
    });
  }

  static async linkToPO(boqItemId: string, purchaseOrderId: string) {
    return prisma.bOQItem.update({
      where: { id: boqItemId },
      data: { purchaseOrderId },
    });
  }
}
