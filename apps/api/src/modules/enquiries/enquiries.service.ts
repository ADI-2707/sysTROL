import { prisma } from "@systrol/database";
import {
  CreateEnquiryDto,
  ConvertToProjectDto,
  EnquirySource,
  EnquiryStatus,
  LifecycleStage,
} from "@systrol/types";

export class EnquiriesService {
  static async createEnquiry(dto: CreateEnquiryDto) {
    const year = new Date().getFullYear();

    return prisma.$transaction(async (tx) => {
      const count = await tx.enquiry.count({
        where: {
          enquiryCode: { startsWith: `ENQ-${year}` },
        },
      });

      const sequence = String(count + 1).padStart(4, "0");
      const enquiryCode = `ENQ-${year}-${sequence}`;

      return tx.enquiry.create({
        data: {
          enquiryCode,
          source: dto.source as any,
          clientId: dto.clientId || null,
          prospectName: dto.prospectName || null,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone || null,
          requirement: dto.requirement,
          estimatedValue: dto.estimatedValue ? dto.estimatedValue : null,
          assignedToId: dto.assignedToId || null,
          status: EnquiryStatus.OPEN,
        },
        include: {
          client: true,
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });
  }

  static async listEnquiries(filters?: { status?: string; source?: EnquirySource }) {
    return prisma.enquiry.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.source ? { source: filters.source as any } : {}),
      },
      include: {
        client: true,
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        convertedProject: {
          select: { id: true, projectCode: true, name: true, currentStage: true },
        },
        salesVisits: {
          select: { id: true, visitDate: true, plantLocation: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getEnquiryById(id: string) {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        client: true,
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        convertedProject: true,
        salesVisits: {
          include: {
            visitedBy: { select: { id: true, name: true } },
          },
          orderBy: { visitDate: "desc" },
        },
      },
    });

    if (!enquiry) {
      const error: any = new Error(`Enquiry '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return enquiry;
  }

  static async updateEnquiry(id: string, dto: Partial<CreateEnquiryDto>) {
    return prisma.enquiry.update({
      where: { id },
      data: {
        ...(dto.source ? { source: dto.source as any } : {}),
        ...(dto.clientId ? { clientId: dto.clientId } : {}),
        ...(dto.prospectName ? { prospectName: dto.prospectName } : {}),
        ...(dto.contactEmail ? { contactEmail: dto.contactEmail } : {}),
        ...(dto.contactPhone ? { contactPhone: dto.contactPhone } : {}),
        ...(dto.requirement ? { requirement: dto.requirement } : {}),
        ...(dto.estimatedValue !== undefined ? { estimatedValue: dto.estimatedValue } : {}),
        ...(dto.assignedToId ? { assignedToId: dto.assignedToId } : {}),
      },
      include: {
        client: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async qualifyEnquiry(id: string) {
    const enquiry = await prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) {
      const error: any = new Error(`Enquiry '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    if (enquiry.status === EnquiryStatus.DISQUALIFIED) {
      const error: any = new Error("Cannot qualify a disqualified enquiry");
      error.statusCode = 400;
      throw error;
    }

    return prisma.enquiry.update({
      where: { id },
      data: { status: EnquiryStatus.QUALIFIED },
    });
  }

  static async disqualifyEnquiry(id: string, reason?: string) {
    const enquiry = await prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) {
      const error: any = new Error(`Enquiry '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    if (enquiry.status === EnquiryStatus.CONVERTED) {
      const error: any = new Error("Cannot disqualify an already converted enquiry");
      error.statusCode = 400;
      throw error;
    }

    return prisma.enquiry.update({
      where: { id },
      data: { status: EnquiryStatus.DISQUALIFIED },
    });
  }

  static async convertToProject(id: string, dto: ConvertToProjectDto, userId: string) {
    const enquiry = await prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) {
      const error: any = new Error(`Enquiry '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    if (enquiry.status === EnquiryStatus.CONVERTED) {
      const error: any = new Error("Enquiry has already been converted to a project");
      error.statusCode = 400;
      throw error;
    }

    const year = new Date().getFullYear();

    return prisma.$transaction(async (tx) => {
      // Ensure client company exists
      let clientId = enquiry.clientId;
      if (!clientId) {
        const client = await tx.clientCompany.create({
          data: {
            name: enquiry.prospectName || "Standard Enterprise Client",
            country: dto.country || "India",
            sector: "Steel & Rolling Mills",
            contactEmail: enquiry.contactEmail,
            contactPhone: enquiry.contactPhone,
          },
        });
        clientId = client.id;
      }

      const projCount = await tx.project.count({
        where: { projectCode: { startsWith: `PROJ-${year}` } },
      });
      const seq = String(projCount + 1).padStart(4, "0");
      const projectCode = `PROJ-${year}-${seq}`;

      const project = await tx.project.create({
        data: {
          projectCode,
          name: dto.name,
          clientId,
          plantLocation: dto.plantLocation,
          country: dto.country,
          millType: dto.millType,
          standCount: dto.standCount,
          currentStage: LifecycleStage.ENQUIRY,
          createdById: userId,
          startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
          targetCutoverDate: dto.targetCutoverDate
            ? new Date(dto.targetCutoverDate)
            : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        },
      });

      await tx.projectStageHistory.create({
        data: {
          projectId: project.id,
          fromStage: null,
          toStage: LifecycleStage.ENQUIRY,
          changedById: userId,
          reason: `Converted from enquiry ${enquiry.enquiryCode}`,
          isDeviation: false,
        },
      });

      await tx.enquiry.update({
        where: { id },
        data: {
          status: EnquiryStatus.CONVERTED,
          convertedProjectId: project.id,
        },
      });

      return project;
    });
  }
}
