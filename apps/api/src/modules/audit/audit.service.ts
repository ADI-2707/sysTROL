import { prisma } from "@systrol/database";

export interface AuditLogQuery {
  page?: string | number;
  limit?: string | number;
  entityType?: string;
  actorId?: string;
  projectId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export class AuditService {
  static async listAuditLogs(query: AuditLogQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.entityType && query.entityType.trim() !== "") {
      where.entityType = query.entityType.trim();
    }

    if (query.actorId && query.actorId.trim() !== "") {
      where.actorId = query.actorId.trim();
    }

    if (query.projectId && query.projectId.trim() !== "") {
      where.projectId = query.projectId.trim();
    }

    if (query.action && query.action.trim() !== "") {
      where.action = { contains: query.action.trim(), mode: "insensitive" };
    }

    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        where.createdAt.lte = new Date(query.endDate);
      }
    }

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            select: {
              id: true,
              projectCode: true,
              name: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getAuditLogById(id: string) {
    const item = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            projectCode: true,
            name: true,
          },
        },
      },
    });

    return item;
  }
}
