import { describe, it, expect, vi, beforeEach } from "vitest";
import { MediaService } from "../src/modules/media/media.service.js";
import { prisma } from "@systrol/database";
import {
  PresignMediaInputSchema,
  ConfirmMediaInputSchema,
  UpdateMediaInputSchema,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_MEDIA_FILE_SIZE,
} from "@systrol/types";

vi.mock("@systrol/database", () => ({
  prisma: {
    mediaAsset: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

vi.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: class {
      send = vi.fn().mockResolvedValue({});
    },
    PutObjectCommand: vi.fn(),
    HeadObjectCommand: vi.fn(),
    DeleteObjectCommand: vi.fn(),
  };
});

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn().mockResolvedValue("https://fake-s3-upload-url.com/upload"),
}));

describe("Media Module Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Media Validation Schemas", () => {
    it("accepts valid presign input", () => {
      const input = {
        filename: "rolling-mill-pulpit.webp",
        mimeType: "image/webp",
        sizeBytes: 1024 * 500,
        width: 1920,
        height: 1080,
        category: "GALLERY",
      };

      const result = PresignMediaInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("rejects unsupported MIME types", () => {
      const input = {
        filename: "script.exe",
        mimeType: "application/x-msdownload",
        sizeBytes: 1000,
      };

      const result = PresignMediaInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("rejects file exceeding 5MB limit", () => {
      const input = {
        filename: "huge-image.jpg",
        mimeType: "image/jpeg",
        sizeBytes: MAX_MEDIA_FILE_SIZE + 1024,
      };

      const result = PresignMediaInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("rejects resolution smaller than 1200x800", () => {
      const input = {
        filename: "lowres.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 10000,
        width: 640,
        height: 480,
      };

      const result = PresignMediaInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("validates confirm media input", () => {
      const input = {
        title: "Level-2 Pulpit Overview",
        altText: "Engineers monitoring continuous hot rolling mill pulpit",
        category: "GALLERY",
        tags: ["l2", "rolling-mill", "automation"],
        fileUrl: "https://jvbwajcypzryqbvmuirv.storage.supabase.co/storage/v1/object/public/systrol-media/gallery/test.webp",
        s3Key: "gallery/test.webp",
        mimeType: "image/webp",
        sizeBytes: 250000,
        width: 1920,
        height: 1080,
      };

      const result = ConfirmMediaInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe("MediaService", () => {
    it("generates presigned upload URL and public URL", async () => {
      const result = await MediaService.generatePresignedUploadUrl({
        filename: "furnace-view.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 50000,
        category: "PROJECTS",
      });

      expect(result.uploadUrl).toBe("https://fake-s3-upload-url.com/upload");
      expect(result.s3Key).toContain("projects/");
      expect(result.publicUrl).toContain("systrol-media");
      expect(result.expiresInSeconds).toBe(900);
    });

    it("lists public media without auth", async () => {
      const mockItems = [
        {
          id: "m1",
          title: "Continuous Caster Pulpit",
          altText: "Pulpit view",
          caption: null,
          category: "GALLERY",
          tags: ["caster"],
          fileUrl: "https://cdn.example.com/caster.webp",
          width: 1920,
          height: 1080,
          createdAt: new Date(),
        },
      ];

      (prisma.mediaAsset.findMany as any).mockResolvedValue(mockItems);

      const items = await MediaService.listPublicMedia("GALLERY", 10);
      expect(items).toEqual(mockItems);
      expect(prisma.mediaAsset.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { category: "GALLERY" },
          take: 10,
        })
      );
    });
  });
});
