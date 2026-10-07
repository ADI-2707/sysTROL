import { prisma } from "@systrol/database";
import { PublicCtaEventDto } from "@systrol/types";
import { redis } from "../../common/redis.js";

export class CtaService {
  static async recordCtaEvent(dto: PublicCtaEventDto, ip?: string, userAgent?: string) {
    const event = await prisma.ctaEvent.create({
      data: {
        eventType: dto.eventType,
        pagePath: dto.pagePath,
        ctaId: dto.ctaId,
        ipHash: ip || null,
        userAgent: userAgent || null,
        utmSource: dto.utmSource || null,
        utmMedium: dto.utmMedium || null,
        utmCampaign: dto.utmCampaign || null,
        utmContent: dto.utmContent || null,
        referrer: dto.referrer || null,
        metadata: dto.metadata ? (dto.metadata as any) : undefined,
      },
    });

    try {
      await redis.publish(
        "systrol:notifications:cta",
        JSON.stringify({
          type: "CTA_EVENT",
          id: event.id,
          eventType: event.eventType,
          ctaId: event.ctaId,
          pagePath: event.pagePath,
          timestamp: event.createdAt.toISOString(),
        })
      );
    } catch {}

    return event;
  }

  static async getUnreadCount() {
    const [openEnquiries, recentCtaEvents] = await Promise.all([
      prisma.enquiry.count({
        where: {
          status: "OPEN",
        },
      }),
      prisma.ctaEvent.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const latestEnquiry = await prisma.enquiry.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    return {
      unreadCount: openEnquiries + recentCtaEvents,
      openEnquiries,
      recentCtaEvents,
      latestEventAt: latestEnquiry?.createdAt?.toISOString(),
    };
  }

  static async listCtaFeed(options?: {
    limit?: number;
    page?: number;
    pagePath?: string;
    ctaId?: string;
    search?: string;
  }) {
    const limit = Math.min(100, Math.max(1, Number(options?.limit) || 30));
    const page = Math.max(1, Number(options?.page) || 1);
    const skip = (page - 1) * limit;

    const ctaWhere: Record<string, unknown> = {};
    if (options?.pagePath && options.pagePath !== "ALL") {
      ctaWhere.pagePath = options.pagePath;
    }
    if (options?.ctaId && options.ctaId !== "ALL") {
      ctaWhere.ctaId = options.ctaId;
    }
    if (options?.search && options.search.trim()) {
      const q = options.search.trim();
      ctaWhere.OR = [
        { pagePath: { contains: q, mode: "insensitive" } },
        { ctaId: { contains: q, mode: "insensitive" } },
        { ipHash: { contains: q, mode: "insensitive" } },
        { referrer: { contains: q, mode: "insensitive" } },
      ];
    }

    const [enquiries, ctaEvents, totalEnquiries, totalCtaEvents] = await Promise.all([
      prisma.enquiry.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.ctaEvent.findMany({
        where: Object.keys(ctaWhere).length > 0 ? ctaWhere : undefined,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.count(),
      prisma.ctaEvent.count({
        where: Object.keys(ctaWhere).length > 0 ? ctaWhere : undefined,
      }),
    ]);

    return {
      enquiries,
      ctaEvents,
      totalEnquiries,
      totalCtaEvents,
      page,
      limit,
    };
  }

  static async getCtaMetrics() {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [totalEvents, events24h, events7d] = await Promise.all([
      prisma.ctaEvent.count(),
      prisma.ctaEvent.count({ where: { createdAt: { gte: since24h } } }),
      prisma.ctaEvent.count({ where: { createdAt: { gte: since7d } } }),
    ]);

    return {
      totalEvents,
      events24h,
      events7d,
    };
  }

  static async updateEnquiryStatus(id: string, status: string) {
    return prisma.enquiry.update({
      where: { id },
      data: { status },
    });
  }
}
