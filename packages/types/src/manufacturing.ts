import { z } from "zod";

export interface ManufacturingBatchDto {
  id: string;
  projectId: string;
  batchCode: string;
  panelType: string;
  fatReportUrl: string | null;
  fatPassed: boolean | null;
  completedAt: string | null;
}

export interface QCCheckDto {
  id: string;
  batchId: string;
  checklistItem: string;
  result: "PASS" | "FAIL" | "NA";
  checkedById: string;
  checkedAt: string;
}

export const CreateManufacturingBatchSchema = z.object({
  projectId: z.string().uuid(),
  panelType: z.string().min(2),
});

export const CompleteFATSchema = z.object({
  fatPassed: z.boolean(),
  fatReportUrl: z.string().optional(),
});

export const BulkQCSchema = z.object({
  checks: z
    .array(
      z.object({
        checklistItem: z.string().min(3),
        result: z.enum(["PASS", "FAIL", "NA"]),
      })
    )
    .min(1),
});

export type CreateManufacturingBatchDto = z.infer<typeof CreateManufacturingBatchSchema>;
export type CompleteFATDto = z.infer<typeof CompleteFATSchema>;
export type BulkQCDto = z.infer<typeof BulkQCSchema>;
