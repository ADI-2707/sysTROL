import { z } from "zod";

export enum JobPostingStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  PAUSED = "PAUSED",
  CLOSED = "CLOSED",
}

export enum ApplicationStatus {
  RECEIVED = "RECEIVED",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED",
  OFFERED = "OFFERED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export interface JobPostingDto {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experienceMin: number;
  experienceMax: number | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: JobPostingStatus;
  publishedAt: string | null;
  closesAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationDto {
  id: string;
  jobPostingId: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverNote: string | null;
  status: ApplicationStatus;
  createdAt: string;
}

export const CreateJobPostingSchema = z.object({
  title: z.string().min(3),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  department: z.string().min(1),
  location: z.string().min(1),
  employmentType: z.enum(["FULL_TIME", "CONTRACT", "INTERNSHIP"]),
  experienceMin: z.number().int().min(0),
  experienceMax: z.number().int().min(0).optional(),
  description: z.string().min(20),
  responsibilities: z.array(z.string().min(3)).min(1),
  requirements: z.array(z.string().min(3)).min(1),
  closesAt: z.string().datetime().optional(),
});

export const SubmitApplicationSchema = z.object({
  applicantName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  coverNote: z.string().optional(),
});

export type CreateJobPostingDto = z.infer<typeof CreateJobPostingSchema>;
export type SubmitApplicationDto = z.infer<typeof SubmitApplicationSchema>;
