import { prisma } from "@systrol/database";
import { CreateDesignReviewDto, ReviewStatus } from "@systrol/types";

export class DesignReviewService {
  static async createDesignReview(dto: CreateDesignReviewDto, reviewerId: string) {
    const doc = await prisma.engineeringDocument.findUnique({
      where: { id: dto.documentId },
    });

    if (!doc) {
      const error: any = new Error(`Engineering document '${dto.documentId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const updatedDoc = await prisma.engineeringDocument.update({
      where: { id: dto.documentId },
      data: {
        reviewStatus: dto.outcome,
        reviewedById: reviewerId,
      },
      include: {
        reviewedBy: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    return {
      documentId: dto.documentId,
      outcome: dto.outcome,
      comments: dto.comments,
      reviewerId,
      reviewedAt: new Date(),
      document: updatedDoc,
    };
  }

  static async listPendingReviews(projectId?: string) {
    return prisma.engineeringDocument.findMany({
      where: {
        reviewStatus: ReviewStatus.PENDING,
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: { select: { id: true, projectCode: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
