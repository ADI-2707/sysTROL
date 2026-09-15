import { z } from "zod";

export enum LifecycleStage {
  ENQUIRY = "ENQUIRY",
  SALES_VISIT = "SALES_VISIT",
  PROCUREMENT = "PROCUREMENT",
  ENGINEERING = "ENGINEERING",
  MANUFACTURING = "MANUFACTURING",
  DISPATCH = "DISPATCH",
  ERECTION = "ERECTION",
  COMMISSIONING = "COMMISSIONING",
  COLD_TRIAL = "COLD_TRIAL",
  HOT_TRIAL = "HOT_TRIAL",
  PERFORMANCE_GUARANTEE_TEST = "PERFORMANCE_GUARANTEE_TEST",
  MOM_AND_HANDOVER = "MOM_AND_HANDOVER",
  PAYMENT = "PAYMENT",
  AMC = "AMC",
}

export const STAGE_ORDER: LifecycleStage[] = [
  LifecycleStage.ENQUIRY,
  LifecycleStage.SALES_VISIT,
  LifecycleStage.PROCUREMENT,
  LifecycleStage.ENGINEERING,
  LifecycleStage.MANUFACTURING,
  LifecycleStage.DISPATCH,
  LifecycleStage.ERECTION,
  LifecycleStage.COMMISSIONING,
  LifecycleStage.COLD_TRIAL,
  LifecycleStage.HOT_TRIAL,
  LifecycleStage.PERFORMANCE_GUARANTEE_TEST,
  LifecycleStage.MOM_AND_HANDOVER,
  LifecycleStage.PAYMENT,
  LifecycleStage.AMC,
];

export interface ProjectStageHistoryDto {
  id: string;
  projectId: string;
  fromStage: LifecycleStage | null;
  toStage: LifecycleStage;
  changedById: string;
  reason: string | null;
  isDeviation: boolean;
  changedAt: string;
}

export interface DeviationRecordDto {
  id: string;
  projectId: string;
  failedStage: LifecycleStage;
  reason: string;
  correctiveAction: string;
  raisedById: string;
  resolvedAt: string | null;
}

export const AdvanceStageSchema = z.object({
  reason: z.string().optional(),
});

export const DeviateStageSchema = z.object({
  targetStage: z.nativeEnum(LifecycleStage),
  reason: z.string().min(10),
  correctiveAction: z.string().min(10),
});

export type AdvanceStageDto = z.infer<typeof AdvanceStageSchema>;
export type DeviateStageDto = z.infer<typeof DeviateStageSchema>;
