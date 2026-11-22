import { z } from "zod";

export enum LogWeekStatus {
  OPEN = "OPEN",
  LOCKED = "LOCKED",
}

export enum LogEntryCategory {
  PROGRESS = "PROGRESS",
  BLOCKER = "BLOCKER",
  MILESTONE = "MILESTONE",
  NOTE = "NOTE",
}

export interface ProjectLogEntryDto {
  id: string;
  weekId: string;
  projectId: string;
  authorId: string;
  authorName: string;
  category: LogEntryCategory;
  stage: string;
  stepId: string | null;
  stepTitle: string | null;
  content: string;
  blockers: string | null;
  nextAction: string | null;
  attachments: string[];
  entryDate: string;
  createdAt: string;
}

export interface ProjectLogWeekDto {
  id: string;
  projectId: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  status: LogWeekStatus;
  lockedAt: string | null;
  entryCount: number;
  entries?: ProjectLogEntryDto[];
}

export const CreateLogEntrySchema = z.object({
  category: z.nativeEnum(LogEntryCategory).default(LogEntryCategory.PROGRESS),
  content: z
    .string()
    .min(10, "Update must be at least 10 characters")
    .max(3000, "Content cannot exceed 3,000 characters"),
  blockers: z
    .string()
    .max(800, "Blockers cannot exceed 800 characters")
    .optional(),
  nextAction: z
    .string()
    .max(500, "Next action cannot exceed 500 characters")
    .optional(),
  stepId: z.string().uuid().optional(),
  entryDate: z.string().datetime().optional(),
  attachments: z
    .array(z.string().url().max(1000, "Attachment URL cannot exceed 1,000 characters"))
    .max(5, "Maximum 5 attachments allowed")
    .default([]),
});

export const LockWeekSchema = z.object({
  reason: z.string().optional(),
});

export type CreateLogEntryDto = z.infer<typeof CreateLogEntrySchema>;
export type LockWeekDto = z.infer<typeof LockWeekSchema>;
