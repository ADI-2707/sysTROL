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

  static async listCtaFeed(options?: { limit?: number; page?: number }) {
    const limit = Math.min(100, Math.max(1, Number(options?.limit) || 30));
    const page = Math.max(1, Number(options?.page) || 1);
    const skip = (page - 1) * limit;

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
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.enquiry.count(),
      prisma.ctaEvent.count(),
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

  static async updateEnquiryStatus(id: string, status: string) {
    return prisma.enquiry.update({
      where: { id },
      data: { status },
    });
  }
}
