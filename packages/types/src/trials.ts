import { z } from "zod";

export interface TrialRecordDto {
  id: string;
  projectId: string;
  trialType: "COLD_TRIAL" | "HOT_TRIAL";
  runDate: string;
  observations: string;
  evidenceUrls: string[];
}

export interface PGTestResultDto {
  id: string;
  projectId: string;
  kpiName: string;
  contractedVal: string;
  achievedVal: string;
  passed: boolean;
  testedAt: string;
}

export const CreatePGTestSchema = z.object({
  results: z
    .array(
      z.object({
        kpiName: z.string().min(2),
        contractedVal: z.string(),
        achievedVal: z.string(),
        passed: z.boolean(),
      })
    )
    .min(1),
});

export type CreatePGTestDto = z.infer<typeof CreatePGTestSchema>;
