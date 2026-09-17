import { describe, it, expect, vi, beforeEach } from "vitest";
import { SalesVisitsService } from "../src/modules/sales-visits/sales-visits.service.js";
import { prisma } from "@systrol/database";
import { CreateSalesVisitSchema } from "@systrol/types";

vi.mock("@systrol/database", () => ({
  prisma: {
    salesVisit: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("Sales Visits Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Sales Visit Payload Validation", () => {
    it("validates correct CreateSalesVisitSchema payload", () => {
      const validPayload = {
        plantLocation: "Tata Steel Kalinganagar Stand 1",
        scopeNotes: "Inspected mechanical drive train and motor foundation alignment",
        nextActionAt: "2026-04-10T00:00:00.000Z",
      };
      const result = CreateSalesVisitSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateSalesVisitSchema payload when plantLocation is too short", () => {
      const invalidPayload = {
        plantLocation: "A",
        scopeNotes: "Comprehensive stand inspection and drive testing",
      };
      const result = CreateSalesVisitSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects CreateSalesVisitSchema payload when scopeNotes is shorter than 10 characters", () => {
      const invalidPayload = {
        plantLocation: "Hazira Plant",
        scopeNotes: "Short",
      };
      const result = CreateSalesVisitSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("accepts valid UUIDs for enquiryId and projectId", () => {
      const payload = {
        enquiryId: "11111111-1111-1111-1111-111111111111",
        plantLocation: "Bellary Site",
        scopeNotes: "Survey of electrical control substation room",
      };
      const result = CreateSalesVisitSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  describe("SalesVisitsService", () => {
    it("createVisit sets nextActionAt and equipment details correctly", async () => {
      const nextAction = new Date(Date.now() + 14 * 86400000).toISOString();

      (prisma.salesVisit.create as any).mockImplementation(({ data }) =>
        Promise.resolve({
          id: "visit-test-1",
          ...data,
        })
      );

      const visit = await SalesVisitsService.createVisit(
        {
          plantLocation: "Toranagallu JSW Stand 4",
          scopeNotes: "Inspected mechanical stands and speed cascade sensors",
          nextActionAt: nextAction,
        },
        "engineer-1"
      );

      expect(visit.plantLocation).toBe("Toranagallu JSW Stand 4");
      expect(visit.visitedById).toBe("engineer-1");
      expect(visit.nextActionAt).toEqual(new Date(nextAction));
      expect(prisma.salesVisit.create).toHaveBeenCalled();
    });

    it("listVisits filters by enquiryId or projectId", async () => {
      const mockVisits = [
        { id: "v-1", plantLocation: "Bokaro Steel Plant" },
      ];
      (prisma.salesVisit.findMany as any).mockResolvedValue(mockVisits);

      const res = await SalesVisitsService.listVisits({ enquiryId: "enq-123" });
      expect(prisma.salesVisit.findMany).toHaveBeenCalledWith({
        where: { enquiryId: "enq-123" },
        include: {
          visitedBy: {
            select: { id: true, name: true, email: true },
          },
          enquiry: {
            select: { id: true, enquiryCode: true, requirement: true },
          },
          project: {
            select: { id: true, projectCode: true, name: true },
          },
        },
        orderBy: { visitDate: "desc" },
      });
      expect(res).toEqual(mockVisits);
    });

    it("listVisits supports bounded pagination when page and limit are specified", async () => {
      const mockVisits = [{ id: "v-1", plantLocation: "Bokaro" }];
      (prisma.salesVisit.findMany as any).mockResolvedValue(mockVisits);
      (prisma.salesVisit.count as any).mockResolvedValue(1);

      const res = await SalesVisitsService.listVisits({ page: 1, limit: 10 });
      expect((res as any).data).toEqual(mockVisits);
      expect((res as any).meta.total).toBe(1);
      expect((res as any).meta.page).toBe(1);
      expect((res as any).meta.limit).toBe(10);
      expect(prisma.salesVisit.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        })
      );
    });

    it("getVisitById throws 404 if visit does not exist", async () => {
      (prisma.salesVisit.findUnique as any).mockResolvedValue(null);

      await expect(SalesVisitsService.getVisitById("v-nonexistent")).rejects.toThrow(
        "Sales visit 'v-nonexistent' not found"
      );
    });

    it("addPhotos correctly appends new photo URLs to existing photoUrls[] array", async () => {
      const existingPhotos = [
        "https://s3.amazonaws.com/systrol-documents/sales-visits/photo1.jpg",
      ];

      (prisma.salesVisit.findUnique as any).mockResolvedValue({
        id: "visit-test-1",
        photoUrls: existingPhotos,
      });

      (prisma.salesVisit.update as any).mockImplementation(({ data }) =>
        Promise.resolve({
          id: "visit-test-1",
          photoUrls: data.photoUrls,
        })
      );

      const newPhotos = [
        "https://s3.amazonaws.com/systrol-documents/sales-visits/photo2.jpg",
        "https://s3.amazonaws.com/systrol-documents/sales-visits/photo3.jpg",
      ];

      const result = await SalesVisitsService.addPhotos("visit-test-1", newPhotos);

      expect(result.photoUrls).toHaveLength(3);
      expect(result.photoUrls).toEqual([...existingPhotos, ...newPhotos]);
      expect(prisma.salesVisit.update).toHaveBeenCalledWith({
        where: { id: "visit-test-1" },
        data: {
          photoUrls: [...existingPhotos, ...newPhotos],
        },
      });
    });
  });
});
