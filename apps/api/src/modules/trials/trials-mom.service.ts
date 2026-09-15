import { prisma } from "@systrol/database";
import { CreatePGTestDto } from "@systrol/types";

export class TrialsAndMOMService {
  // Trials
  static async recordTrial(
    projectId: string,
    data: { trialType: "COLD_TRIAL" | "HOT_TRIAL"; runDate: string; observations: string; evidenceUrls?: string[] }
  ) {
    return prisma.trialRecord.create({
      data: {
        projectId,
        trialType: data.trialType,
        runDate: new Date(data.runDate),
        observations: data.observations,
        evidenceUrls: data.evidenceUrls || [],
      },
    });
  }

  static async listTrials(projectId: string) {
    return prisma.trialRecord.findMany({
      where: { projectId },
      include: {
        signoffs: {
          include: { signedBy: { select: { id: true, name: true, role: true } } },
        },
      },
      orderBy: { runDate: "desc" },
    });
  }

  // PG Test
  static async recordPGTestResults(projectId: string, dto: CreatePGTestDto) {
    return prisma.$transaction(
      dto.results.map((r) =>
        prisma.pGTestResult.create({
          data: {
            projectId,
            kpiName: r.kpiName,
            contractedVal: r.contractedVal,
            achievedVal: r.achievedVal,
            passed: r.passed,
          },
        })
      )
    );
  }

  static async listPGTestResults(projectId: string) {
    return prisma.pGTestResult.findMany({
      where: { projectId },
      orderBy: { testedAt: "desc" },
    });
  }

  // MOM & Handover
  static async createMOM(
    projectId: string,
    data: { meetingDate: string; attendees: string[]; summary: string; actionItems?: any; documentUrl?: string }
  ) {
    return prisma.minutesOfMeeting.create({
      data: {
        projectId,
        meetingDate: new Date(data.meetingDate),
        attendees: data.attendees,
        summary: data.summary,
        actionItems: data.actionItems,
        documentUrl: data.documentUrl,
        signedByClient: false,
      },
    });
  }

  static async signMOM(momId: string, signedById: string) {
    return prisma.minutesOfMeeting.update({
      where: { id: momId },
      data: {
        signedByClient: true,
        signedById,
      },
    });
  }

  static async listMOMs(projectId: string) {
    return prisma.minutesOfMeeting.findMany({
      where: { projectId },
      include: {
        signedBy: { select: { id: true, name: true } },
      },
      orderBy: { meetingDate: "desc" },
    });
  }
}
