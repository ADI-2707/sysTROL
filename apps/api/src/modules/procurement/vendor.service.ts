import { prisma } from "@systrol/database";
import { CreateVendorDto, PurchaseOrderStatus } from "@systrol/types";

export class VendorService {
  static async createVendor(dto: CreateVendorDto) {
    return prisma.vendor.create({
      data: {
        name: dto.name,
        country: dto.country,
        category: dto.category,
      },
    });
  }

  static async listVendors(filters?: { category?: string; country?: string }) {
    return prisma.vendor.findMany({
      where: {
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.country ? { country: filters.country } : {}),
      },
      include: {
        _count: {
          select: { purchaseOrders: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async getVendorById(id: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        purchaseOrders: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!vendor) {
      const error: any = new Error(`Vendor '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return vendor;
  }

  static async updateVendor(id: string, dto: Partial<CreateVendorDto>) {
    return prisma.vendor.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.country ? { country: dto.country } : {}),
        ...(dto.category ? { category: dto.category } : {}),
      },
    });
  }

  static async deleteVendor(id: string) {
    return prisma.vendor.delete({
      where: { id },
    });
  }

  static async computeVendorRating(vendorId: string) {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        purchaseOrders: {
          where: {
            status: PurchaseOrderStatus.CLOSED,
            expectedDeliveryDate: { not: null },
            actualDeliveryDate: { not: null },
          },
        },
      },
    });

    if (!vendor) {
      const error: any = new Error(`Vendor '${vendorId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const closedPOs = vendor.purchaseOrders;
    if (closedPOs.length === 0) {
      return null;
    }

    // Rating formula:
    // Base 5.0 score. Deduct 0.2 points per average day of delivery delay.
    let totalDelayDays = 0;
    for (const po of closedPOs) {
      if (po.actualDeliveryDate && po.expectedDeliveryDate) {
        const diffMs = po.actualDeliveryDate.getTime() - po.expectedDeliveryDate.getTime();
        const diffDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
        totalDelayDays += diffDays;
      }
    }

    const avgDelayDays = totalDelayDays / closedPOs.length;
    const score = Math.max(1.0, Math.min(5.0, Number((5.0 - avgDelayDays * 0.2).toFixed(1))));

    await prisma.vendor.update({
      where: { id: vendorId },
      data: { ratingScore: score },
    });

    return score;
  }
}
