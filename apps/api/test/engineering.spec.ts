import { describe, it, expect, vi, beforeEach } from "vitest";
import { EngineeringDocumentService } from "../src/modules/engineering/document.service.js";
import { prisma } from "@systrol/database";
import { ReviewStatus } from "@systrol/types";

vi.mock("@systrol/database", () => ({
  prisma: {
    engineeringDocument: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("EngineeringDocumentService Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Task 8.5: constructS3Key constructs correct S3 key format with projectId and filename", () => {
    const key = EngineeringDocumentService.constructS3Key("proj-123", "layout.pdf");
    expect(key).toMatch(/^engineering\/docs\/proj-123\/[0-9a-f-]+-layout\.pdf$/);
  });

  it("Task 8.5: reviseDocument increments document revision and resets reviewStatus to PENDING", async () => {
    (prisma.engineeringDocument.findUnique as any).mockResolvedValue({
      id: "doc-1",
      revision: 2,
      reviewStatus: ReviewStatus.CLIENT_APPROVED,
    });

    (prisma.engineeringDocument.update as any).mockImplementation(({ data }) =>
      Promise.resolve({
        id: "doc-1",
        ...data,
      })
    );

    const revised = await EngineeringDocumentService.reviseDocument(
      "doc-1",
      "https://s3.amazonaws.com/.../rev3.pdf"
    );

    expect(revised.revision).toBe(3);
    expect(revised.reviewStatus).toBe(ReviewStatus.PENDING);
    expect(revised.reviewedById).toBeNull();
    expect(prisma.engineeringDocument.update).toHaveBeenCalledWith({
      where: { id: "doc-1" },
      data: {
        revision: 3,
        fileUrl: "https://s3.amazonaws.com/.../rev3.pdf",
        reviewStatus: ReviewStatus.PENDING,
        reviewedById: null,
      },
    });
  });

  it("Task 8.5: updateReviewStatus updates review status and reviewedById", async () => {
    (prisma.engineeringDocument.findUnique as any).mockResolvedValue({
      id: "doc-2",
      revision: 1,
      reviewStatus: ReviewStatus.PENDING,
    });

    (prisma.engineeringDocument.update as any).mockImplementation(({ data }) =>
      Promise.resolve({
        id: "doc-2",
        ...data,
      })
    );

    const updated = await EngineeringDocumentService.updateReviewStatus(
      "doc-2",
      { reviewStatus: ReviewStatus.CLIENT_APPROVED },
      "reviewer-lead-1"
    );

    expect(updated.reviewStatus).toBe(ReviewStatus.CLIENT_APPROVED);
    expect(updated.reviewedById).toBe("reviewer-lead-1");
  });
});
