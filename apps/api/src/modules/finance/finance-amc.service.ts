import { prisma } from "@systrol/database";
import { CreateInvoiceDto, InvoiceMilestone, InvoiceStatus } from "@systrol/types";

export class FinanceAndAMCService {
  // Invoicing
  static async createInvoice(dto: CreateInvoiceDto) {
    const project = await prisma.project.findUnique({ where: { id: dto.projectId } });
    if (!project) {
      const error: any = new Error(`Project '${dto.projectId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const count = await prisma.invoice.count({ where: { projectId: dto.projectId } });
    const sequence = String(count + 1).padStart(2, "0");
    const invoiceNumber = `INV-${project.projectCode}-${sequence}`;

    return prisma.invoice.create({
      data: {
        projectId: dto.projectId,
        invoiceNumber,
        milestone: dto.milestone,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        status: InvoiceStatus.SENT,
      },
    });
  }

  static async recordPayment(invoiceId: string, data: { amountPaid: string; reference?: string }) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (!invoice) {
      const error: any = new Error(`Invoice '${invoiceId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amountPaid: data.amountPaid,
          reference: data.reference,
          paidAt: new Date(),
        },
      });

      const totalPaid =
        invoice.payments.reduce((acc, p) => acc + Number(p.amountPaid), 0) +
        Number(data.amountPaid);

      const status =
        totalPaid >= Number(invoice.amount) ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID;

      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status },
      });

      return payment;
    });
  }

  static async listInvoices(projectId?: string) {
    return prisma.invoice.findMany({
      where: projectId ? { projectId } : {},
      include: {
        payments: true,
        project: { select: { id: true, projectCode: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Retention
  static async createRetentionSchedule(
    projectId: string,
    data: { percentage: number; releaseDate: string }
  ) {
    return prisma.retentionSchedule.create({
      data: {
        projectId,
        percentage: data.percentage,
        releaseDate: new Date(data.releaseDate),
      },
    });
  }

  static async releaseRetention(id: string) {
    return prisma.retentionSchedule.update({
      where: { id },
      data: { releasedAt: new Date() },
    });
  }

  // AMC Contracts
  static async createAMCContract(
    projectId: string,
    data: { startDate: string; endDate: string; visitFrequency: string }
  ) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      const error: any = new Error(`Project '${projectId}' not found`);
      error.statusCode = 404;
      throw error;
    }

    const contractCode = `AMC-${project.projectCode}`;

    return prisma.aMCContract.create({
      data: {
        projectId,
        contractCode,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        visitFrequency: data.visitFrequency,
        renewed: false,
      },
    });
  }

  static async listAMCContracts(projectId?: string) {
    return prisma.aMCContract.findMany({
      where: projectId ? { projectId } : {},
      include: {
        visits: true,
        project: { select: { id: true, projectCode: true, name: true } },
      },
      orderBy: { startDate: "desc" },
    });
  }
}
