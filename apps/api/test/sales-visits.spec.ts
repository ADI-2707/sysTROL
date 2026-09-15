import { describe, it, expect, vi, beforeEach } from "vitest";
import { SalesVisitsService } from "../src/modules/sales-visits/sales-visits.service.js";
import { prisma } from "@systrol/database";

vi.mock("@systrol/database", () => ({
  prisma: {
    salesVisit: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("SalesVisitsService Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Task 6.6: createVisit sets nextActionAt and equipment details correctly", async () => {
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

  it("Task 6.6: addPhotos correctly appends new photo URLs to existing photoUrls[] array", async () => {
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
