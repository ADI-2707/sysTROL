import { prisma } from "@systrol/database";
import {
  StageDwellDto,
  EnquiryFunnelDto,
  PaymentAgingDto,
  AMCForecastDto,
} from "@systrol/types";

export class AnalyticsService {
  static async getStageDwellTimes(): Promise<StageDwellDto[]> {
    const history = await prisma.projectStageHistory.findMany({
      include: {
        project: { select: { millType: true } },
      },
      orderBy: { changedAt: "asc" },
    });

    const dwellBuckets: Record<string, { count: number; totalDays: number; millType: string }> = {};

    for (let i = 0; i < history.length - 1; i++) {
      const curr = history[i];
      const next = history[i + 1];

      if (curr.projectId === next.projectId && curr.toStage) {
        const diffMs = new Date(next.changedAt).getTime() - new Date(curr.changedAt).getTime();
        const days = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
        const key = `${curr.toStage}_${curr.project.millType}`;

        if (!dwellBuckets[key]) {
          dwellBuckets[key] = { count: 0, totalDays: 0, millType: curr.project.millType };
        }
        dwellBuckets[key].count += 1;
        dwellBuckets[key].totalDays += days;
      }
    }

    return Object.entries(dwellBuckets).map(([key, data]) => {
      const stage = key.split("_")[0];
      return {
        stage,
        millType: data.millType,
        avgDays: Math.round(data.totalDays / data.count),
        projectCount: data.count,
      };
    });
  }

  static async getEnquiryFunnel(): Promise<EnquiryFunnelDto[]> {
    const enquiries = await prisma.enquiry.findMany();

    const funnelMap: Record<string, Record<string, number>> = {};

    enquiries.forEach((e) => {
      const src = e.source || "OTHER";
      if (!funnelMap[src]) {
        funnelMap[src] = {};
      }
      funnelMap[src][e.status] = (funnelMap[src][e.status] || 0) + 1;
    });

    return Object.entries(funnelMap).map(([source, statusBreakdown]) => ({
      source,
      statusBreakdown,
      total: Object.values(statusBreakdown).reduce((a, b) => a + b, 0),
    }));
  }

  static async getPaymentAging(): Promise<PaymentAgingDto[]> {
    const invoices = await prisma.invoice.findMany({
      where: {
        status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] },
      },
      include: { payments: true },
    });

    const now = new Date().getTime();
    const buckets: Record<"current" | "30" | "60" | "90plus", { total: number; count: number }> = {
      current: { total: 0, count: 0 },
      "30": { total: 0, count: 0 },
      "60": { total: 0, count: 0 },
      "90plus": { total: 0, count: 0 },
    };

    invoices.forEach((inv) => {
      const paid = inv.payments.reduce((acc, p) => acc + Number(p.amountPaid), 0);
      const remaining = Math.max(0, Number(inv.amount) - paid);
      const dueTime = new Date(inv.dueDate).getTime();
      const diffDays = Math.floor((now - dueTime) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        buckets.current.total += remaining;
        buckets.current.count += 1;
      } else if (diffDays <= 30) {
        buckets["30"].total += remaining;
        buckets["30"].count += 1;
      } else if (diffDays <= 60) {
        buckets["60"].total += remaining;
        buckets["60"].count += 1;
      } else {
        buckets["90plus"].total += remaining;
        buckets["90plus"].count += 1;
      }
    });

    return [
      { bucket: "current", totalAmount: buckets.current.total.toFixed(2), invoiceCount: buckets.current.count },
      { bucket: "30", totalAmount: buckets["30"].total.toFixed(2), invoiceCount: buckets["30"].count },
      { bucket: "60", totalAmount: buckets["60"].total.toFixed(2), invoiceCount: buckets["60"].count },
      { bucket: "90plus", totalAmount: buckets["90plus"].total.toFixed(2), invoiceCount: buckets["90plus"].count },
    ];
  }

  static async getAMCForecast(): Promise<AMCForecastDto[]> {
    const contracts = await prisma.aMCContract.findMany({
      include: {
        project: { select: { name: true } },
      },
    });

    const now = new Date().getTime();
    return contracts.map((c) => {
      const end = new Date(c.endDate).getTime();
      const daysUntilExpiry = Math.round((end - now) / (1000 * 60 * 60 * 24));

      return {
        contractId: c.id,
        projectName: c.project.name,
        endDate: c.endDate.toISOString(),
        daysUntilExpiry,
        sparesAlertCount: daysUntilExpiry < 60 ? 3 : 0,
      };
    });
  }

  static async getProjectsAnalytics() {
    const projects = await prisma.project.findMany({
      include: {
        client: true,
      },
    });

    const materialCounts: Record<string, number> = {};
    const lineCounts: Record<string, number> = {};
    const clientMap: Record<string, { clientName: string; projectCount: number; years: Set<number> }> = {};
    const comboCounts: Record<string, { material: string; lineType: string; count: number }> = {};
    let fastestCombo: {
      material: string;
      lineType: string;
      minDays: number;
      projectCode: string;
      projectName: string;
    } | null = null;

    for (const p of projects) {
      const mat = p.material?.trim() || "Unspecified";
      const line = p.lineType?.trim() || p.millType?.trim() || "Unspecified";

      materialCounts[mat] = (materialCounts[mat] || 0) + 1;
      lineCounts[line] = (lineCounts[line] || 0) + 1;

      const comboKey = `${mat}___${line}`;
      if (!comboCounts[comboKey]) {
        comboCounts[comboKey] = { material: mat, lineType: line, count: 0 };
      }
      comboCounts[comboKey].count += 1;

      if (p.client) {
        if (!clientMap[p.clientId]) {
          clientMap[p.clientId] = {
            clientName: p.client.name,
            projectCount: 0,
            years: new Set<number>(),
          };
        }
        clientMap[p.clientId].projectCount += 1;
        clientMap[p.clientId].years.add(new Date(p.startDate).getFullYear());
      }

      if (p.actualCutoverDate && p.startDate) {
        const start = new Date(p.startDate).getTime();
        const actual = new Date(p.actualCutoverDate).getTime();
        if (actual > start) {
          const diffDays = Math.max(
            1,
            Math.round((actual - start) / (1000 * 60 * 60 * 24))
          );

          if (!fastestCombo || diffDays < fastestCombo.minDays) {
            fastestCombo = {
              material: mat,
              lineType: line,
              minDays: diffDays,
              projectCode: p.projectCode,
              projectName: p.name,
            };
          }
        }
      }
    }

    const mostDoneMaterial = Object.entries(materialCounts)
      .map(([material, count]) => ({ material, count }))
      .sort((a, b) => b.count - a.count);

    const mostDoneLines = Object.entries(lineCounts)
      .map(([lineType, count]) => ({ lineType, count }))
      .sort((a, b) => b.count - a.count);

    const topClientsOverYears = Object.entries(clientMap)
      .map(([clientId, data]) => ({
        clientId,
        clientName: data.clientName,
        projectCount: data.projectCount,
        years: Array.from(data.years).sort(),
      }))
      .sort((a, b) => b.projectCount - a.projectCount);

    const topMaterialAndLineCombinations = Object.values(comboCounts).sort(
      (a, b) => b.count - a.count
    );

    return {
      mostDoneMaterial,
      topClientsOverYears,
      mostDoneLines,
      topMaterialAndLineCombinations,
      fastestExecutionCombination: fastestCombo,
    };
  }

  static async getCtaAnalytics() {
    const [enquiries, ctaEvents] = await Promise.all([
      prisma.enquiry.findMany({
        select: { pagePath: true, ctaId: true, source: true },
      }),
      prisma.ctaEvent.findMany({
        select: { pagePath: true, ctaId: true, eventType: true },
      }),
    ]);

    const pageCounts: Record<string, number> = {};
    const ctaCounts: Record<string, number> = {};
    let whatsappCount = 0;

    for (const e of enquiries) {
      if (e.pagePath) {
        pageCounts[e.pagePath] = (pageCounts[e.pagePath] || 0) + 1;
      }
      if (e.ctaId) {
        ctaCounts[e.ctaId] = (ctaCounts[e.ctaId] || 0) + 1;
      }
    }

    for (const ev of ctaEvents) {
      if (ev.pagePath) {
        pageCounts[ev.pagePath] = (pageCounts[ev.pagePath] || 0) + 1;
      }
      if (ev.ctaId) {
        ctaCounts[ev.ctaId] = (ctaCounts[ev.ctaId] || 0) + 1;
      }
      if (ev.eventType === "WHATSAPP_CLICK") {
        whatsappCount += 1;
      }
    }

    const mostEnquiredPages = Object.entries(pageCounts)
      .map(([pagePath, count]) => ({ pagePath, count }))
      .sort((a, b) => b.count - a.count);

    const mostEffectiveCtaButtons = Object.entries(ctaCounts)
      .map(([ctaId, count]) => ({ ctaId, count }))
      .sort((a, b) => b.count - a.count);

    return {
      mostEnquiredPages,
      mostEffectiveCtaButtons,
      directWhatsappCount: whatsappCount,
      totalCtaEvents: ctaEvents.length,
      totalEnquiries: enquiries.length,
    };
  }

  static async getEmployeesAnalytics() {
    const employees = await prisma.employeeProfile.findMany({
      include: {
        deployments: true,
      },
    });

    const users = await prisma.user.findMany({
      select: { id: true, name: true },
    });
    const userNameMap = new Map(users.map((u) => [u.id, u.name]));

    const employeeStats = employees.map((emp) => {
      const totalSites = emp.deployments.length;
      const completedSites = emp.deployments.filter(
        (d) => d.endDate && new Date(d.endDate) <= new Date()
      ).length;
      const indiaSites = emp.deployments.filter((d) =>
        (d.country || "").toLowerCase().includes("india")
      ).length;
      const overseasSites = emp.deployments.filter(
        (d) => !(d.country || "").toLowerCase().includes("india")
      ).length;

      return {
        employeeId: emp.id,
        employeeName: userNameMap.get(emp.userId) || emp.designation,
        totalSites,
        completedSites,
        indiaSites,
        overseasSites,
      };
    });

    let totalCompletedSites = 0;
    let totalIndiaSites = 0;
    let totalOverseasSites = 0;

    for (const s of employeeStats) {
      totalCompletedSites += s.completedSites;
      totalIndiaSites += s.indiaSites;
      totalOverseasSites += s.overseasSites;
    }

    return {
      employees: employeeStats,
      totalCompletedSites,
      totalIndiaSites,
      totalOverseasSites,
    };
  }
}
