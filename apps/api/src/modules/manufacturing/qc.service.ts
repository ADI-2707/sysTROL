import { prisma } from "@systrol/database";
import { BulkQCDto } from "@systrol/types";

export class QCService {
  static async bulkCreateQCChecks(
    batchId: string,
    checks: BulkQCDto["checks"],
    checkedById: string
  ) {
    const batch = await prisma.manufacturingBatch.findUnique({ where: { id: batchId } });
    if (!batch) {
      const error: any = new Error(`Manufacturing batch '${batchId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.$transaction(
      checks.map((check) =>
        prisma.qCCheck.create({
          data: {
            batchId,
            checklistItem: check.checklistItem,
            result: check.result,
            checkedById,
          },
        })
      )
    );
  }

  static async listQCChecks(batchId: string) {
    return prisma.qCCheck.findMany({
      where: { batchId },
      include: {
        checkedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { checkedAt: "asc" },
    });
  }
}
