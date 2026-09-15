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

export const UpdateReviewSchema = z.object({
  reviewStatus: z.nativeEnum(ReviewStatus),
  comments: z.string().optional(),
});

export type UpdateReviewDto = z.infer<typeof UpdateReviewSchema>;
