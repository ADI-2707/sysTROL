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

  static async listBOQItems(projectId: string, params?: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params?.limit) || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.bOQItem.findMany({
        where: { projectId },
        skip,
        take: limit,
        include: {
          purchaseOrder: {
            select: { id: true, poNumber: true, status: true },
          },
        },
        orderBy: { id: "asc" },
      }),
      prisma.bOQItem.count({ where: { projectId } }),
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
