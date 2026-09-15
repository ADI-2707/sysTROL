import { prisma } from "@systrol/database";
import { CreateShipmentDto, UpdateShipmentDto } from "@systrol/types";

export class ShipmentService {
  static async createShipment(projectId: string, dto: CreateShipmentDto) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      const error: any = new Error(`Project '${projectId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const count = await prisma.shipment.count({
      where: { projectId },
    });

    const sequence = String(count + 1).padStart(2, "0");
    const shipmentNo = `SHP-${project.projectCode}-${sequence}`;

    return prisma.shipment.create({
      data: {
        projectId,
        shipmentNo,
        carrier: dto.carrier,
        trackingNo: dto.trackingNo,
        etd: dto.etd ? new Date(dto.etd) : undefined,
        eta: dto.eta ? new Date(dto.eta) : undefined,
        isExport: dto.isExport ?? false,
      },
      include: {
        project: { select: { id: true, projectCode: true, name: true } },
      },
    });
  }

  static async listShipments(projectId?: string) {
    return prisma.shipment.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: { select: { id: true, projectCode: true, name: true } },
        customsClearance: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getShipmentById(id: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        project: true,
        customsClearance: true,
      },
    });

    if (!shipment) {
      const error: any = new Error(`Shipment '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return shipment;
  }

  static async updateShipment(id: string, dto: UpdateShipmentDto) {
    const existing = await prisma.shipment.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Shipment '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.shipment.update({
      where: { id },
      data: {
        status: dto.status,
        deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : undefined,
        podUrl: dto.podUrl,
        eta: dto.eta ? new Date(dto.eta) : undefined,
      },
    });
  }

  static async uploadPOD(id: string, podUrl: string) {
    const existing = await prisma.shipment.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error(`Shipment '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.shipment.update({
      where: { id },
      data: {
        podUrl,
        deliveredAt: new Date(),
        status: "DELIVERED",
      },
    });
  }
}
