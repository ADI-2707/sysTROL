import { prisma } from "@systrol/database";
import {
  CreateEngineeringDocumentDto,
  UpdateReviewDto,
  ReviewStatus,
} from "@systrol/types";
import crypto from "crypto";

export class EngineeringDocumentService {
  static constructS3Key(projectId: string, filename: string): string {
    const uuid = crypto.randomUUID();
    return `engineering/docs/${projectId}/${uuid}-${filename}`;
  }

  static async uploadDocument(
    projectId: string,
    dto: CreateEngineeringDocumentDto,
    fileUrl: string
  ) {
    return prisma.engineeringDocument.create({
      data: {
        projectId,
        docType: dto.docType,
        title: dto.title,
        revision: 1,
        fileUrl,
        reviewStatus: ReviewStatus.PENDING,
      },
    });
  }

  static async listDocuments(
    projectId?: string,
    filters?: { docType?: string; reviewStatus?: ReviewStatus }
  ) {
    return prisma.engineeringDocument.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        ...(filters?.docType ? { docType: filters.docType } : {}),
        ...(filters?.reviewStatus ? { reviewStatus: filters.reviewStatus } : {}),
      },
      include: {
        project: {
          select: { id: true, projectCode: true, name: true },
        },
        reviewedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getDocumentById(id: string) {
    const doc = await prisma.engineeringDocument.findUnique({
      where: { id },
      include: {
        project: true,
        reviewedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!doc) {
      const error: any = new Error(`Engineering document '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return doc;
  }

  static async reviseDocument(id: string, newFileUrl: string) {
    const doc = await prisma.engineeringDocument.findUnique({ where: { id } });
    if (!doc) {
      const error: any = new Error(`Engineering document '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.engineeringDocument.update({
      where: { id },
      data: {
        revision: doc.revision + 1,
        fileUrl: newFileUrl,
        reviewStatus: ReviewStatus.PENDING,
        reviewedById: null,
      },
    });
  }

  static async updateReviewStatus(
    id: string,
    dto: UpdateReviewDto,
    reviewerId: string
  ) {
    const doc = await prisma.engineeringDocument.findUnique({ where: { id } });
    if (!doc) {
      const error: any = new Error(`Engineering document '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.engineeringDocument.update({
      where: { id },
      data: {
        reviewStatus: dto.reviewStatus,
        reviewedById: reviewerId,
      },
    });
  }
}
