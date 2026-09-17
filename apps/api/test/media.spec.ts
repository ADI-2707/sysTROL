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

describe("MediaService.listPublicMedia Aspect Hint Derivation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const makeAsset = (width: number | null, height: number | null) => ({
    id: `m-${width}-${height}`,
    title: "Test Asset",
    altText: null,
    caption: null,
    category: "GALLERY",
    tags: ["test"],
    fileUrl: "https://example.com/img.webp",
    width,
    height,
    createdAt: new Date(),
  });

  it("assigns featured aspect when width/height ratio > 1.6", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([makeAsset(1920, 1080)]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("featured");
  });

  it("assigns wide aspect when width/height ratio is between 1.3 and 1.6", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([makeAsset(1400, 1000)]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("wide");
  });

  it("assigns tall aspect when width/height ratio < 0.7", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([makeAsset(800, 1200)]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("tall");
  });

  it("assigns standard aspect when width/height ratio is between 0.7 and 1.3", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([makeAsset(1000, 1000)]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("standard");
  });

  it("falls back to standard when width is null", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([makeAsset(null, 1080)]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("standard");
  });

  it("falls back to standard when height is null", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([makeAsset(1920, null)]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("standard");
  });

  it("falls back to standard when height is zero to prevent division by zero", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([makeAsset(1920, 0)]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("standard");
  });

  it("correctly assigns aspect hints for multiple items in a single call", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([
      makeAsset(1920, 1080),
      makeAsset(800, 1200),
      makeAsset(1000, 1000),
      makeAsset(1400, 1000),
    ]);
    const result = await MediaService.listPublicMedia();
    expect((result[0] as any).aspect).toBe("featured");
    expect((result[1] as any).aspect).toBe("tall");
    expect((result[2] as any).aspect).toBe("standard");
    expect((result[3] as any).aspect).toBe("wide");
  });

  it("includes all original asset fields alongside the derived aspect", async () => {
    const testAsset = makeAsset(1920, 1080);
    (prisma.mediaAsset.findMany as any).mockResolvedValue([testAsset]);
    const result = await MediaService.listPublicMedia();
    const item = result[0] as any;
    expect(item.id).toBe(testAsset.id);
    expect(item.title).toBe(testAsset.title);
    expect(item.fileUrl).toBe(testAsset.fileUrl);
    expect(item.tags).toEqual(testAsset.tags);
    expect(item.aspect).toBeDefined();
  });

  it("passes category filter to prisma when provided", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([]);
    await MediaService.listPublicMedia("GALLERY", 10);
    expect(prisma.mediaAsset.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { category: "GALLERY" }, take: 10 })
    );
  });

  it("uses no category filter when category is not provided", async () => {
    (prisma.mediaAsset.findMany as any).mockResolvedValue([]);
    await MediaService.listPublicMedia();
    expect(prisma.mediaAsset.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });
});

