import { prisma } from "@systrol/database";
import { CreateSalesVisitDto } from "@systrol/types";

export class SalesVisitsService {
  static async createVisit(dto: CreateSalesVisitDto, visitedById: string) {
    return prisma.salesVisit.create({
      data: {
        enquiryId: dto.enquiryId || null,
        projectId: dto.projectId || null,
        visitedById,
        visitDate: dto.visitDate ? new Date(dto.visitDate) : new Date(),
        plantLocation: dto.plantLocation,
        scopeNotes: dto.scopeNotes,
        photoUrls: dto.photoUrls || [],
        nextActionAt: dto.nextActionAt ? new Date(dto.nextActionAt) : null,
      },
      include: {
        visitedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        enquiry: {
          select: { id: true, enquiryCode: true, requirement: true },
        },
        project: {
          select: { id: true, projectCode: true, name: true },
        },
      },
    });
  }

  static async listVisits(filters?: { enquiryId?: string; projectId?: string; visitedById?: string }) {
    return prisma.salesVisit.findMany({
      where: {
        ...(filters?.enquiryId ? { enquiryId: filters.enquiryId } : {}),
        ...(filters?.projectId ? { projectId: filters.projectId } : {}),
        ...(filters?.visitedById ? { visitedById: filters.visitedById } : {}),
      },
      include: {
        visitedBy: {
          select: { id: true, name: true, email: true },
        },
        enquiry: {
          select: { id: true, enquiryCode: true, requirement: true },
        },
        project: {
          select: { id: true, projectCode: true, name: true },
        },
      },
      orderBy: { visitDate: "desc" },
    });
  }

  static async getVisitById(id: string) {
    const visit = await prisma.salesVisit.findUnique({
      where: { id },
      include: {
        visitedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
        enquiry: true,
        project: true,
      },
    });

    if (!visit) {
      const error: any = new Error(`Sales visit '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return visit;
  }

  static async updateVisit(id: string, dto: Partial<CreateSalesVisitDto>) {
    return prisma.salesVisit.update({
      where: { id },
      data: {
        ...(dto.plantLocation ? { plantLocation: dto.plantLocation } : {}),
        ...(dto.scopeNotes ? { scopeNotes: dto.scopeNotes } : {}),
        ...(dto.visitDate ? { visitDate: new Date(dto.visitDate) } : {}),
        ...(dto.nextActionAt !== undefined
          ? { nextActionAt: dto.nextActionAt ? new Date(dto.nextActionAt) : null }
          : {}),
        ...(dto.photoUrls ? { photoUrls: dto.photoUrls } : {}),
      },
      include: {
        visitedBy: { select: { id: true, name: true } },
      },
    });
  }

  static async addPhotos(id: string, newPhotoUrls: string[]) {
    const visit = await prisma.salesVisit.findUnique({ where: { id } });
    if (!visit) {
      const error: any = new Error(`Sales visit '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const updatedUrls = [...visit.photoUrls, ...newPhotoUrls];

    return prisma.salesVisit.update({
      where: { id },
      data: {
        photoUrls: updatedUrls,
      },
    });
  }
}
