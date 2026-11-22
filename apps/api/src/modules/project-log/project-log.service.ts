import { prisma } from "@systrol/database";
import {
  CreateLogEntryDto,
  JWTPayload,
  LogEntryCategory,
  LogWeekStatus,
  LockWeekDto,
  UserRole,
} from "@systrol/types";
import { getWeekBounds, startOfDayUTC } from "./week.util.js";

export class ProjectLogService {
  private static formatWeek(w: any) {
    return {
      id: w.id,
      projectId: w.projectId,
      weekNumber: w.weekNumber,
      year: w.year,
      startDate: w.startDate.toISOString(),
      endDate: w.endDate.toISOString(),
      status: w.status,
      lockedAt: w.lockedAt ? w.lockedAt.toISOString() : null,
      entryCount: w._count?.entries ?? 0,
    };
  }

  private static formatEntry(e: any) {
    return {
      id: e.id,
      weekId: e.weekId,
      projectId: e.projectId,
      authorId: e.authorId,
      authorName: e.author?.name || e.authorName || "",
      category: e.category,
      stage: e.stage,
      stepId: e.stepId,
      stepTitle: e.step?.title || e.stepTitle || null,
      content: e.content,
      blockers: e.blockers,
      nextAction: e.nextAction,
      attachments: e.attachments,
      entryDate: e.entryDate.toISOString(),
      createdAt: e.createdAt.toISOString(),
    };
  }

  static async getWeeks(projectId: string, params?: { page?: number; limit?: number }) {
    const page = Math.max(1, Number(params?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params?.limit) || 50));
    const skip = (page - 1) * limit;

    const [weeks, total] = await Promise.all([
      prisma.projectLogWeek.findMany({
        where: { projectId },
        skip,
        take: limit,
        orderBy: [{ year: "desc" }, { weekNumber: "desc" }],
        include: {
          _count: {
            select: { entries: true },
          },
        },
      }),
      prisma.projectLogWeek.count({ where: { projectId } }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: weeks.map((w: any) => this.formatWeek(w)),
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

  static async getCurrentWeek(projectId: string) {
    const { weekNumber, year, startDate, endDate } = getWeekBounds(new Date());

    const week = await prisma.projectLogWeek.upsert({
      where: {
        projectId_weekNumber_year: {
          projectId,
          weekNumber,
          year,
        },
      },
      create: {
        projectId,
        weekNumber,
        year,
        startDate,
        endDate,
        status: LogWeekStatus.OPEN,
      },
      update: {},
      include: {
        _count: {
          select: { entries: true },
        },
      },
    });

    return this.formatWeek(week);
  }

  static async getWeekWithEntries(projectId: string, weekId: string) {
    const week = await prisma.projectLogWeek.findFirst({
      where: { id: weekId, projectId },
      include: {
        _count: {
          select: { entries: true },
        },
        entries: {
          orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
          include: {
            author: { select: { id: true, name: true } },
            step: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!week) {
      const error: any = new Error(`Week block '${weekId}' not found for project '${projectId}'`);
      error.statusCode = 404;
      throw error;
    }

    return {
      ...this.formatWeek(week),
      entries: week.entries.map((e: any) => this.formatEntry(e)),
    };
  }

  static async listEntries(
    projectId: string,
    filters?: {
      stepId?: string;
      category?: LogEntryCategory;
      authorId?: string;
      weekId?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters?.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { projectId };
    if (filters?.stepId) where.stepId = filters.stepId;
    if (filters?.category) where.category = filters.category;
    if (filters?.authorId) where.authorId = filters.authorId;
    if (filters?.weekId) where.weekId = filters.weekId;

    const [entries, total] = await Promise.all([
      prisma.projectLogEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
        include: {
          author: { select: { id: true, name: true } },
          step: { select: { id: true, title: true } },
        },
      }),
      prisma.projectLogEntry.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: entries.map((e: any) => this.formatEntry(e)),
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

  static async createEntry(projectId: string, dto: CreateLogEntryDto, user: JWTPayload) {
    if (user.role === UserRole.FIELD_ENGINEER) {
      const deployment = await prisma.siteDeployment.findFirst({
        where: {
          projectId,
          employee: { userId: user.sub },
          endDate: null,
        },
      });
      if (!deployment) {
        const error: any = new Error("Field engineer can only access assigned projects");
        error.statusCode = 403;
        throw error;
      }
    }

    if (user.role === UserRole.CLIENT_AUDITOR) {
      const error: any = new Error("Client auditor is restricted to read-only access");
      error.statusCode = 403;
      throw error;
    }

    const entryDate = dto.entryDate
      ? startOfDayUTC(new Date(dto.entryDate))
      : startOfDayUTC(new Date());

    const now = new Date();
    const currentActiveWeek = getWeekBounds(now);

    if (entryDate < currentActiveWeek.startDate) {
      const error: any = new Error("Strict anti-backfill: Cannot log updates for past weeks");
      error.statusCode = 422;
      throw error;
    }

    const endOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)
    );
    if (entryDate > endOfToday) {
      const error: any = new Error("Cannot log updates for future dates");
      error.statusCode = 422;
      throw error;
    }

    const { weekNumber, year, startDate, endDate } = getWeekBounds(entryDate);

    const week = await prisma.projectLogWeek.upsert({
      where: {
        projectId_weekNumber_year: {
          projectId,
          weekNumber,
          year,
        },
      },
      create: {
        projectId,
        weekNumber,
        year,
        startDate,
        endDate,
        status: LogWeekStatus.OPEN,
      },
      update: {},
    });

    if (week.status === LogWeekStatus.LOCKED) {
      const error: any = new Error("This week is locked");
      error.statusCode = 422;
      throw error;
    }

    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { currentStage: true },
    });

    const created = await prisma.projectLogEntry.create({
      data: {
        weekId: week.id,
        projectId,
        authorId: user.sub,
        category: dto.category,
        stage: project.currentStage,
        stepId: dto.stepId || null,
        content: dto.content,
        blockers: dto.blockers || null,
        nextAction: dto.nextAction || null,
        attachments: dto.attachments || [],
        entryDate,
      },
      include: {
        author: { select: { id: true, name: true } },
        step: { select: { id: true, title: true } },
      },
    });

    return this.formatEntry(created);
  }

  static async lockWeek(projectId: string, weekId: string, userId: string, _dto?: LockWeekDto) {
    const week = await prisma.projectLogWeek.findFirst({
      where: { id: weekId, projectId },
    });

    if (!week) {
      const error: any = new Error(`Week block '${weekId}' not found for project '${projectId}'`);
      error.statusCode = 404;
      throw error;
    }

    if (week.status === LogWeekStatus.LOCKED) {
      const error: any = new Error("Week is already locked");
      error.statusCode = 422;
      throw error;
    }

    return prisma.projectLogWeek.update({
      where: { id: weekId },
      data: {
        status: LogWeekStatus.LOCKED,
        lockedById: userId,
        lockedAt: new Date(),
      },
    });
  }

  static async unlockWeek(projectId: string, weekId: string) {
    const week = await prisma.projectLogWeek.findFirst({
      where: { id: weekId, projectId },
    });

    if (!week) {
      const error: any = new Error(`Week block '${weekId}' not found for project '${projectId}'`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.projectLogWeek.update({
      where: { id: weekId },
      data: {
        status: LogWeekStatus.OPEN,
        lockedById: null,
        lockedAt: null,
      },
    });
  }

  static async deleteEntry(entryId: string) {
    return prisma.projectLogEntry.delete({
      where: { id: entryId },
    });
  }

  static async getStepEntryCounts(projectId: string): Promise<Record<string, number>> {
    const groups = await prisma.projectLogEntry.groupBy({
      by: ["stepId"],
      where: {
        projectId,
        stepId: { not: null },
      },
      _count: {
        stepId: true,
      },
    });

    const result: Record<string, number> = {};
    for (const g of groups) {
      if (g.stepId) {
        result[g.stepId] = g._count.stepId;
      }
    }
    return result;
  }
}
