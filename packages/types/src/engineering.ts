import { z } from "zod";

export enum ReviewStatus {
  PENDING = "PENDING",
  CLIENT_APPROVED = "CLIENT_APPROVED",
  REVISION_REQUESTED = "REVISION_REQUESTED",
}

export interface EngineeringDocumentDto {
  id: string;
  projectId: string;
  docType: string;
  title: string;
  revision: number;
  fileUrl: string;
  reviewStatus: ReviewStatus;
  reviewedById: string | null;
  createdAt: string;
}

export const CreateEngineeringDocumentSchema = z.object({
  projectId: z.string().uuid(),
  docType: z.string().min(2),
  title: z.string().min(2),
  fileUrl: z.string().optional(),
});

export const CreateDesignReviewSchema = z.object({
  documentId: z.string().uuid(),
  outcome: z.nativeEnum(ReviewStatus),
  comments: z.string().min(5),
});

export const UpdateReviewSchema = z.object({
  reviewStatus: z.nativeEnum(ReviewStatus),
  comments: z.string().optional(),
});

export type CreateEngineeringDocumentDto = z.infer<typeof CreateEngineeringDocumentSchema>;
export type CreateDesignReviewDto = z.infer<typeof CreateDesignReviewSchema>;
export type UpdateReviewDto = z.infer<typeof UpdateReviewSchema>;
