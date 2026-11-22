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
  content: z.string().min(10, "Update must be at least 10 characters"),
  blockers: z.string().optional(),
  nextAction: z.string().optional(),
  stepId: z.string().uuid().optional(),
  entryDate: z.string().datetime().optional(),
  attachments: z.array(z.string().url()).default([]),
});

export const LockWeekSchema = z.object({
  reason: z.string().optional(),
});

export type CreateLogEntryDto = z.infer<typeof CreateLogEntrySchema>;
export type LockWeekDto = z.infer<typeof LockWeekSchema>;
