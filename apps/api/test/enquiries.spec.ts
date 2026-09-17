import { describe, it, expect, vi, beforeEach } from "vitest";
import { EnquiriesService } from "../src/modules/enquiries/enquiries.service.js";
import { prisma } from "@systrol/database";
import {
  CreateEnquirySchema,
  ConvertToProjectSchema,
  EnquirySource,
  EnquiryStatus,
  LifecycleStage,
} from "@systrol/types";

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

describe("Enquiries Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Enquiry Payload Validation", () => {
    it("validates correct CreateEnquirySchema payload", () => {
      const validPayload = {
        source: EnquirySource.WEB_RFQ,
        contactEmail: "purchasing@tata.com",
        requirement: "Turnkey automation revamping for hot strip mill",
        estimatedValue: 25000000,
      };
      const result = CreateEnquirySchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateEnquirySchema payload with invalid email", () => {
      const invalidPayload = {
        source: EnquirySource.EMAIL,
        contactEmail: "invalid-email-address",
        requirement: "Automation upgrade",
      };
      const result = CreateEnquirySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateEnquirySchema payload with requirement shorter than 5 characters", () => {
      const invalidPayload = {
        source: EnquirySource.REFERRAL,
        contactEmail: "client@steel.in",
        requirement: "Mill",
      };
      const result = CreateEnquirySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateEnquirySchema payload with negative estimatedValue", () => {
      const invalidPayload = {
        source: EnquirySource.REPEAT_CLIENT,
        contactEmail: "client@steel.in",
        requirement: "Cold roll mill automation",
        estimatedValue: -5000,
      };
      const result = CreateEnquirySchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates ConvertToProjectSchema payload applying defaults", () => {
      const validPayload = {
        name: "Jamshedpur Wire Rod Modernization",
        plantLocation: "Jamshedpur Plant 2",
      };
      const result = ConvertToProjectSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.country).toBe("India");
        expect(result.data.millType).toBe("Bar Mill");
        expect(result.data.standCount).toBe(10);
      }
    });

    it("rejects ConvertToProjectSchema payload with short name or location", () => {
      const invalidPayload = {
        name: "AB",
        plantLocation: "X",
      };
      const result = ConvertToProjectSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe("EnquiriesService", () => {
    it("createEnquiry generates zero-padded enquiryCode format ENQ-YYYY-NNNN", async () => {
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

    it("disqualifyEnquiry blocks subsequent qualifyEnquiry calls", async () => {
      (prisma.enquiry.findUnique as any).mockResolvedValue({
        id: "enq-disqualified",
        status: EnquiryStatus.DISQUALIFIED,
      });

      await expect(EnquiriesService.qualifyEnquiry("enq-disqualified")).rejects.toThrow(
        "Cannot qualify a disqualified enquiry"
      );
    });

    it("updateEnquiry patches requirement and estimated value", async () => {
      const updatedMock = {
        id: "enq-1",
        requirement: "Updated requirement scope notes",
        estimatedValue: 18000000,
      };
      (prisma.enquiry.update as any).mockResolvedValue(updatedMock);

      const result = await EnquiriesService.updateEnquiry("enq-1", {
        requirement: "Updated requirement scope notes",
        estimatedValue: 18000000,
      });

      expect(result.requirement).toBe("Updated requirement scope notes");
      expect(prisma.enquiry.update).toHaveBeenCalledWith({
        where: { id: "enq-1" },
        data: {
          requirement: "Updated requirement scope notes",
          estimatedValue: 18000000,
        },
        include: {
          client: true,
          assignedTo: {
            select: { id: true, name: true, email: true },
          },
        },
      });
    });

    it("convertToProject creates Project and ProjectStageHistory atomically in transaction", async () => {
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
});

import { PublicEnquirySchema, EnquirySource as EnquirySourceAlias } from "@systrol/types";

describe("PublicEnquirySchema Validation", () => {
  const validPublicPayload = {
    name: "Rajesh Kumar",
    company: "Steel Plant Ltd",
    email: "rajesh@steel.com",
    phone: "+91 9845012345",
    service: "L2 Automation Consultancy",
    message: "We need Level-2 automation for our 16-stand bar mill configuration.",
  };

  it("accepts a fully valid public enquiry payload", () => {
    const result = PublicEnquirySchema.safeParse(validPublicPayload);
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, name: "A" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("name");
  });

  it("rejects name longer than 120 characters", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, name: "A".repeat(121) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("name");
  });

  it("rejects company shorter than 2 characters", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, company: "X" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("company");
  });

  it("rejects invalid email address", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("email");
  });

  it("rejects phone shorter than 8 characters", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, phone: "123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("phone");
  });

  it("rejects phone with invalid characters like letters", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, phone: "ABCDEFGH" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("phone");
  });

  it("rejects empty service string", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, service: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("service");
  });

  it("rejects message shorter than 10 characters", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, message: "Short." });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("message");
  });

  it("rejects message longer than 2000 characters", () => {
    const result = PublicEnquirySchema.safeParse({ ...validPublicPayload, message: "A".repeat(2001) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path[0]).toBe("message");
  });

  it("rejects payload missing required fields", () => {
    const result = PublicEnquirySchema.safeParse({ name: "Rajesh" });
    expect(result.success).toBe(false);
    const missingPaths = result.error?.issues.map((i) => i.path[0]);
    expect(missingPaths).toContain("company");
    expect(missingPaths).toContain("email");
    expect(missingPaths).toContain("phone");
    expect(missingPaths).toContain("service");
    expect(missingPaths).toContain("message");
  });

  it("maps parsed public enquiry data correctly to internal createEnquiry shape", () => {
    const result = PublicEnquirySchema.safeParse(validPublicPayload);
    expect(result.success).toBe(true);
    const { name, company, email, phone, service, message } = result.data!;

    const internalPayload = {
      source: EnquirySourceAlias.WEB_RFQ,
      prospectName: `${name} (${company})`,
      contactEmail: email,
      contactPhone: phone,
      requirement: `[${service}] ${message}`,
    };

    expect(internalPayload.source).toBe("WEB_RFQ");
    expect(internalPayload.prospectName).toBe("Rajesh Kumar (Steel Plant Ltd)");
    expect(internalPayload.contactEmail).toBe("rajesh@steel.com");
    expect(internalPayload.contactPhone).toBe("+91 9845012345");
    expect(internalPayload.requirement).toContain("[L2 Automation Consultancy]");
    expect(internalPayload.requirement).toContain("16-stand bar mill");
  });
});

