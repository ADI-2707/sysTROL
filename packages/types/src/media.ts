import { z } from "zod";

export const GallerySectionEnum = z.enum([
  "WORKPLACE",
  "TEAM",
  "DEPLOYMENTS",
]);

export type GallerySection = z.infer<typeof GallerySectionEnum>;

export const MediaCategoryEnum = z.enum([
  "GALLERY",
  "PROJECTS",
  "PRODUCTS",
  "FACILITIES",
  "BRANDING",
]);

export type MediaCategory = z.infer<typeof MediaCategoryEnum>;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/avif",
] as const;

export const MAX_MEDIA_FILE_SIZE = 5 * 1024 * 1024;
export const MIN_IMAGE_WIDTH = 1200;
export const MIN_IMAGE_HEIGHT = 800;
export const MAX_IMAGE_WIDTH = 4096;
export const MAX_IMAGE_HEIGHT = 4096;

export const PresignMediaInputSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.enum(ALLOWED_IMAGE_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_MEDIA_FILE_SIZE),
  width: z.number().int().min(MIN_IMAGE_WIDTH).max(MAX_IMAGE_WIDTH).optional(),
  height: z.number().int().min(MIN_IMAGE_HEIGHT).max(MAX_IMAGE_HEIGHT).optional(),
  category: MediaCategoryEnum.default("GALLERY"),
  gallerySection: GallerySectionEnum.optional(),
  projectId: z.string().uuid().optional(),
});

export type PresignMediaInput = z.infer<typeof PresignMediaInputSchema>;

export const ConfirmMediaInputSchema = z.object({
  title: z.string().min(1).max(200),
  altText: z.string().max(255).optional(),
  caption: z.string().max(1000).optional(),
  category: MediaCategoryEnum.default("GALLERY"),
  gallerySection: GallerySectionEnum.optional(),
  tags: z.array(z.string().min(1).max(50)).default([]),
  fileUrl: z.string().url(),
  s3Key: z.string().min(1),
  mimeType: z.enum(ALLOWED_IMAGE_MIME_TYPES),
  sizeBytes: z.number().int().positive().max(MAX_MEDIA_FILE_SIZE),
  width: z.number().int().min(MIN_IMAGE_WIDTH).max(MAX_IMAGE_WIDTH).optional(),
  height: z.number().int().min(MIN_IMAGE_HEIGHT).max(MAX_IMAGE_HEIGHT).optional(),
  projectId: z.string().uuid().optional(),
});

export type ConfirmMediaInput = z.infer<typeof ConfirmMediaInputSchema>;

export const UpdateMediaInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  altText: z.string().max(255).optional(),
  caption: z.string().max(1000).optional(),
  category: MediaCategoryEnum.optional(),
  gallerySection: GallerySectionEnum.nullable().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
  projectId: z.string().uuid().nullable().optional(),
});

export type UpdateMediaInput = z.infer<typeof UpdateMediaInputSchema>;

export const MediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: MediaCategoryEnum.optional(),
  gallerySection: GallerySectionEnum.optional(),
  search: z.string().optional(),
  projectId: z.string().uuid().optional(),
});

export type MediaQuery = z.infer<typeof MediaQuerySchema>;

export interface PresignMediaResponse {
  uploadUrl: string;
  s3Key: string;
  publicUrl: string;
  expiresInSeconds: number;
}

export interface MediaAssetDto {
  id: string;
  title: string;
  altText: string | null;
  caption: string | null;
  category: MediaCategory;
  gallerySection?: GallerySection | null;
  tags: string[];
  fileUrl: string;
  s3Key: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  uploadedById: string | null;
  projectId: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  project?: {
    id: string;
    projectCode: string;
    name: string;
  } | null;
}
