import { describe, it, expect, vi, beforeEach } from "vitest";
import { EngineeringDocumentService } from "../src/modules/engineering/document.service.js";
import { prisma } from "@systrol/database";
import {
  ReviewStatus,
  CreateEngineeringDocumentSchema,
  CreateDesignReviewSchema,
  UpdateReviewSchema,
} from "@systrol/types";

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

describe("Engineering Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Engineering Payload Validation", () => {
    it("validates correct CreateEngineeringDocumentSchema payload", () => {
      const validPayload = {
        projectId: "11111111-1111-1111-1111-111111111111",
        docType: "GA_DRAWING",
        title: "Main Drive Automation GA Layout",
        fileUrl: "https://s3.amazonaws.com/systrol-docs/ga-layout.dwg",
      };
      const result = CreateEngineeringDocumentSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateEngineeringDocumentSchema with invalid projectId or short title", () => {
      const invalidPayload = {
        projectId: "invalid-uuid",
        docType: "D",
        title: "A",
      };
      const result = CreateEngineeringDocumentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates correct CreateDesignReviewSchema payload", () => {
      const validPayload = {
        documentId: "22222222-2222-2222-2222-222222222222",
        outcome: ReviewStatus.CLIENT_APPROVED,
        comments: "All engineering parameters match site requirements.",
      };
      const result = CreateDesignReviewSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects CreateDesignReviewSchema with short comments or invalid outcome", () => {
      const invalidPayload = {
        documentId: "22222222-2222-2222-2222-222222222222",
        outcome: "INVALID_STATUS",
        comments: "OK",
      };
      const result = CreateDesignReviewSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates UpdateReviewSchema payload", () => {
      expect(UpdateReviewSchema.safeParse({ reviewStatus: ReviewStatus.REVISION_REQUESTED }).success).toBe(true);
      expect(UpdateReviewSchema.safeParse({ reviewStatus: "UNKNOWN" }).success).toBe(false);
    });
  });

  describe("EngineeringDocumentService", () => {
    it("constructS3Key constructs correct S3 key format with projectId and filename", () => {
      const key = EngineeringDocumentService.constructS3Key("proj-123", "layout.pdf");
      expect(key).toMatch(/^engineering\/docs\/proj-123\/[0-9a-f-]+-layout\.pdf$/);
    });

    it("reviseDocument increments document revision and resets reviewStatus to PENDING", async () => {
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

    it("reviseDocument throws 404 if document does not exist", async () => {
      (prisma.engineeringDocument.findUnique as any).mockResolvedValue(null);

      await expect(
        EngineeringDocumentService.reviseDocument("non-existent-doc", "https://s3.amazonaws.com/rev.pdf")
      ).rejects.toThrow("Engineering document 'non-existent-doc' not found");
    });

    it("updateReviewStatus updates review status and reviewedById", async () => {
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
});
