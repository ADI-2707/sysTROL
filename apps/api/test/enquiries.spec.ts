import { describe, it, expect, vi, beforeEach } from "vitest";
import { EnquiriesService } from "../src/modules/enquiries/enquiries.service.js";
import { prisma } from "@systrol/database";
import { EnquirySource, EnquiryStatus, LifecycleStage } from "@systrol/types";

vi.mock("@systrol/database", () => ({
  prisma: {
    $transaction: vi.fn(),
    enquiry: {
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    project: {
      create: vi.fn(),
    },
  },
}));

describe("EnquiriesService Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Task 6.5: createEnquiry generates zero-padded enquiryCode format ENQ-YYYY-NNNN", async () => {
    const currentYear = new Date().getFullYear();

    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      const tx = {
        enquiry: {
          count: vi.fn().mockResolvedValue(4),
          create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: "mock-id", ...data })),
        },
      };
      return callback(tx);
    });

    const result = await EnquiriesService.createEnquiry({
      source: EnquirySource.WEB_RFQ,
      contactEmail: "plant@jsw.in",
      requirement: "Bar mill revamping 10 stands",
      estimatedValue: 15000000,
    });

    expect(result.enquiryCode).toBe(`ENQ-${currentYear}-0005`);
    expect(result.status).toBe(EnquiryStatus.OPEN);
  });

  it("Task 6.5: disqualifyEnquiry blocks subsequent qualifyEnquiry calls", async () => {
    (prisma.enquiry.findUnique as any).mockResolvedValue({
      id: "enq-disqualified",
      status: EnquiryStatus.DISQUALIFIED,
    });

    await expect(EnquiriesService.qualifyEnquiry("enq-disqualified")).rejects.toThrow(
      "Cannot qualify a disqualified enquiry"
    );
  });

  it("Task 6.5: convertToProject creates Project and ProjectStageHistory atomically in transaction", async () => {
    const year = new Date().getFullYear();
    const mockEnquiry = {
      id: "enq-conv",
      enquiryCode: `ENQ-${year}-0001`,
      status: EnquiryStatus.QUALIFIED,
      clientId: "client-1",
      contactEmail: "eng@steel.com",
    };

    (prisma.enquiry.findUnique as any).mockResolvedValue(mockEnquiry);

    let createdProjectData: any = null;
    let createdStageHistoryData: any = null;
    let updatedEnquiryData: any = null;

    (prisma.$transaction as any).mockImplementation(async (callback: any) => {
      const tx = {
        project: {
          count: vi.fn().mockResolvedValue(0),
          create: vi.fn().mockImplementation(({ data }) => {
            createdProjectData = data;
            return Promise.resolve({ id: "proj-1", ...data });
          }),
        },
        projectStageHistory: {
          create: vi.fn().mockImplementation(({ data }) => {
            createdStageHistoryData = data;
            return Promise.resolve({ id: "hist-1", ...data });
          }),
        },
        enquiry: {
          update: vi.fn().mockImplementation(({ data }) => {
            updatedEnquiryData = data;
            return Promise.resolve({ ...mockEnquiry, ...data });
          }),
        },
      };
      return callback(tx);
    });

    const project = await EnquiriesService.convertToProject(
      "enq-conv",
      {
        name: "Wire Rod Modernization",
        plantLocation: "Bellary Site",
        country: "India",
        millType: "Wire Rod Mill",
        standCount: 8,
      },
      "user-admin-1"
    );

    expect(createdProjectData).toBeDefined();
    expect(createdProjectData.currentStage).toBe(LifecycleStage.ENQUIRY);
    expect(createdProjectData.projectCode).toBe(`PROJ-${year}-0001`);
    expect(createdStageHistoryData.toStage).toBe(LifecycleStage.ENQUIRY);
    expect(updatedEnquiryData.status).toBe(EnquiryStatus.CONVERTED);
    expect(updatedEnquiryData.convertedProjectId).toBe("proj-1");
  });
});
