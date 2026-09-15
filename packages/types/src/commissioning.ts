import { z } from "zod";

export enum StepStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
}

export enum StepType {
  PRE_COMM_AUDIT = "PRE_COMM_AUDIT",
  HIL_SIMULATION = "HIL_SIMULATION",
  STAND_TUNING = "STAND_TUNING",
  LOOP_TUNING = "LOOP_TUNING",
  AD_HOC = "AD_HOC",
}

export interface CommissioningStepDto {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  stepType: StepType;
  status: StepStatus;
  order: number;
  dependsOn: string[];
  assignedToId: string | null;
  dueDate: string | null;
  evidenceUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StepSignoffDto {
  id: string;
  stepId: string | null;
  trialId: string | null;
  signedById: string;
  role: string;
  signedAt: string;
  comments: string | null;
}

export const CreateStepSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  stepType: z.nativeEnum(StepType),
  dependsOn: z.array(z.string().uuid()).default([]),
  assignedToId: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
});

export const SignoffSchema = z.object({
  comments: z.string().optional(),
});

export type CreateStepDto = z.infer<typeof CreateStepSchema>;
export type SignoffDto = z.infer<typeof SignoffSchema>;
