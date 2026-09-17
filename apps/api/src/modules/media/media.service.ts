import { PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@systrol/database";
import {
  PresignMediaInput,
  ConfirmMediaInput,
  UpdateMediaInput,
  MediaQuery,
  PresignMediaResponse,
} from "@systrol/types";
import { s3Client, MEDIA_BUCKET, getPublicMediaUrl } from "../../common/s3.js";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
}

export class MediaService {
  static async generatePresignedUploadUrl(
    input: PresignMediaInput,
    userId?: string
  ): Promise<PresignMediaResponse> {
    const cleanName = sanitizeFilename(input.filename);
    const categoryFolder = input.category.toLowerCase();
    const s3Key = `${categoryFolder}/${Date.now()}-${cleanName}`;

    const command = new PutObjectCommand({
      Bucket: MEDIA_BUCKET,
      Key: s3Key,
      ContentType: input.mimeType,
    });

    const expiresInSeconds = 900;
    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    const publicUrl = getPublicMediaUrl(s3Key);

    return {
      uploadUrl,
      s3Key,
      publicUrl,
      expiresInSeconds,
    };
  }

  static async confirmMediaAsset(input: ConfirmMediaInput, userId?: string) {
    try {
      const headCmd = new HeadObjectCommand({
        Bucket: MEDIA_BUCKET,
        Key: input.s3Key,
      });
      await s3Client.send(headCmd);
    } catch (err: any) {
      const error: any = new Error("Uploaded file was not found in storage bucket");
      error.statusCode = 400;
      throw error;
    }

    return prisma.mediaAsset.create({
      data: {
        title: input.title,
        altText: input.altText || null,
        caption: input.caption || null,
        category: input.category,
        gallerySection: input.gallerySection || null,
        tags: input.tags || [],
        fileUrl: input.fileUrl,
        s3Key: input.s3Key,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        width: input.width || null,
        height: input.height || null,
        uploadedById: userId || null,
        projectId: input.projectId || null,
      },
      include: {
        project: {
          select: { id: true, projectCode: true, name: true },
        },
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async listMedia(query: MediaQuery) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.category) {
      where.category = query.category;
    }
    if (query.gallerySection) {
      where.gallerySection = query.gallerySection;
    }
    if (query.projectId) {
      where.projectId = query.projectId;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { altText: { contains: query.search, mode: "insensitive" } },
        { caption: { contains: query.search, mode: "insensitive" } },
        { tags: { has: query.search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            select: { id: true, projectCode: true, name: true },
          },
          uploadedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getMediaById(id: string) {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, projectCode: true, name: true },
        },
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!asset) {
      const error: any = new Error(`Media asset '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return asset;
  }

  static async updateMedia(id: string, input: UpdateMediaInput) {
    await this.getMediaById(id);

    return prisma.mediaAsset.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.altText !== undefined ? { altText: input.altText } : {}),
        ...(input.caption !== undefined ? { caption: input.caption } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.gallerySection !== undefined ? { gallerySection: input.gallerySection } : {}),
        ...(input.tags !== undefined ? { tags: input.tags } : {}),
        ...(input.projectId !== undefined ? { projectId: input.projectId } : {}),
      },
      include: {
        project: {
          select: { id: true, projectCode: true, name: true },
        },
      },
    });
  }

  static async deleteMedia(id: string) {
    const asset = await this.getMediaById(id);

    try {
      const delCmd = new DeleteObjectCommand({
        Bucket: MEDIA_BUCKET,
        Key: asset.s3Key,
      });
      await s3Client.send(delCmd);
    } catch {}

    await prisma.mediaAsset.delete({
      where: { id },
    });

    return { success: true, id };
  }

  static async listPublicMedia(category?: string, limit: number = 60) {
    const where: any = {};
    if (category) {
      where.category = category;
    }

    const rows = await prisma.mediaAsset.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        altText: true,
        caption: true,
        category: true,
        gallerySection: true,
        tags: true,
        fileUrl: true,
        width: true,
        height: true,
        createdAt: true,
      },
    });

    return rows.map((asset) => {
      let aspect: "featured" | "tall" | "wide" | "standard" = "standard";
      if (asset.width && asset.height && asset.height > 0) {
        const ratio = asset.width / asset.height;
        if (ratio > 1.6) {
          aspect = "featured";
        } else if (ratio > 1.3) {
          aspect = "wide";
        } else if (ratio < 0.7) {
          aspect = "tall";
        }
      }
      return { ...asset, aspect };
    });
  }
}
