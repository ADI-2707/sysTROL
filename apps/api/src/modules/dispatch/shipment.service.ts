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

    return (prisma.shipment as any).create({
      data: {
        projectId,
        shipmentNo,
        carrier: dto.carrier,
        trackingNo: (dto as any).trackingNo,
        etd: (dto as any).etd ? new Date((dto as any).etd) : undefined,
        eta: (dto as any).eta ? new Date((dto as any).eta) : undefined,
        isExport: (dto as any).isExport ?? false,
      },
      include: {
        project: { select: { id: true, projectCode: true, name: true } },
      },
    });
  }

  static async listShipments(projectId?: string) {
    return (prisma.shipment as any).findMany({
      where: {
        ...(projectId ? { projectId } : {}),
      },
      include: {
        project: { select: { id: true, projectCode: true, name: true } },
        customsClearance: true,
      },
      orderBy: { id: "desc" },
    });
  }

  static async getShipmentById(id: string) {
    const shipment = await (prisma.shipment as any).findUnique({
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

    return (prisma.shipment as any).update({
      where: { id },
      data: {
        status: (dto as any).status,
        deliveredAt: (dto as any).deliveredAt ? new Date((dto as any).deliveredAt) : undefined,
        podUrl: (dto as any).podUrl,
        eta: (dto as any).eta ? new Date((dto as any).eta) : undefined,
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

    return (prisma.shipment as any).update({
      where: { id },
      data: {
        podUrl,
        deliveredAt: new Date(),
        status: "DELIVERED",
      },
    });
  }
}
