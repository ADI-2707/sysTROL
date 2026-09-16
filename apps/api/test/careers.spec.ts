import { describe, it, expect, vi, beforeEach } from "vitest";
import { CareersService } from "../src/modules/careers/careers.service.js";
import { prisma } from "@systrol/database";
import {
  CreateJobPostingSchema,
  SubmitApplicationSchema,
  JobPostingStatus,
  ApplicationStatus,
} from "@systrol/types";

vi.mock("@systrol/database", () => ({
  prisma: {
    jobPosting: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    jobApplication: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Careers Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Careers Payload Validation", () => {
    it("validates correct SubmitApplicationSchema payload", () => {
      const validPayload = {
        applicantName: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        phone: "+91 9876543210",
        coverNote: "Interested in the senior drives automation engineer position.",
      };
      const result = SubmitApplicationSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects SubmitApplicationSchema payload with invalid email", () => {
      const invalidPayload = {
        applicantName: "Rahul Sharma",
        email: "not-an-email",
        phone: "+91 9876543210",
      };
      const result = SubmitApplicationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects SubmitApplicationSchema payload with missing applicant name", () => {
      const invalidPayload = {
        email: "rahul@example.com",
        phone: "+91 9876543210",
      };
      const result = SubmitApplicationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("validates correct CreateJobPostingSchema payload", () => {
      const validPosting = {
        title: "Senior Drives Commissioning Engineer",
        slug: "senior-drives-commissioning-engineer",
        department: "Field Commissioning",
        location: "Hazira, Gujarat",
        employmentType: "FULL_TIME",
        experienceMin: 5,
        experienceMax: 10,
        description: "Lead field commissioning activities for hot strip mill drives.",
        responsibilities: ["Deploy PLC & drives systems", "Lead cold and hot trials"],
        requirements: ["B.Tech/BE in Electrical", "5+ years commissioning experience"],
      };
      const result = CreateJobPostingSchema.safeParse(validPosting);
      expect(result.success).toBe(true);
    });

    it("rejects CreateJobPostingSchema payload missing required fields", () => {
      const invalidPosting = {
        department: "Field Commissioning",
      };
      const result = CreateJobPostingSchema.safeParse(invalidPosting);
      expect(result.success).toBe(false);
    });
  });

  describe("CareersService", () => {
    it("lists published jobs filtering by department and location", async () => {
      const mockJobs = [
        {
          id: "job-1",
          title: "Commissioning Specialist",
          status: JobPostingStatus.PUBLISHED,
          department: "Commissioning",
          location: "Kolkata",
        },
      ];
      (prisma.jobPosting.findMany as any).mockResolvedValue(mockJobs);

      const jobs = await CareersService.listPublishedJobs({
        department: "Commissioning",
        location: "Kolkata",
      });

      expect(prisma.jobPosting.findMany).toHaveBeenCalledWith({
        where: {
          status: JobPostingStatus.PUBLISHED,
          department: "Commissioning",
          location: { contains: "Kolkata", mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(jobs).toEqual(mockJobs);
    });

    it("returns active job by slug", async () => {
      const mockJob = {
        id: "job-1",
        slug: "automation-engineer",
        status: JobPostingStatus.PUBLISHED,
        title: "Automation Engineer",
      };
      (prisma.jobPosting.findUnique as any).mockResolvedValue(mockJob);

      const job = await CareersService.getJobBySlug("automation-engineer");
      expect(job.slug).toBe("automation-engineer");
      expect(prisma.jobPosting.findUnique).toHaveBeenCalledWith({
        where: { slug: "automation-engineer" },
      });
    });

    it("throws 404 when job slug does not exist or is inactive", async () => {
      (prisma.jobPosting.findUnique as any).mockResolvedValue({
        id: "job-closed",
        slug: "closed-job",
        status: JobPostingStatus.CLOSED,
      });

      await expect(CareersService.getJobBySlug("closed-job")).rejects.toThrow(
        "Job posting 'closed-job' not found or inactive"
      );
    });

    it("submits application for active job posting", async () => {
      (prisma.jobPosting.findUnique as any).mockResolvedValue({
        id: "job-1",
        slug: "lead-engineer",
        status: JobPostingStatus.PUBLISHED,
      });

      const mockApp = {
        id: "app-1",
        applicantName: "Pooja Hegde",
        status: ApplicationStatus.RECEIVED,
      };
      (prisma.jobApplication.create as any).mockResolvedValue(mockApp);

      const app = await CareersService.submitApplication(
        "lead-engineer",
        {
          applicantName: "Pooja Hegde",
          email: "pooja@example.com",
          phone: "+91 9886099001",
        },
        "https://s3.amazonaws.com/resumes/pooja.pdf"
      );

      expect(app.id).toBe("app-1");
      expect(prisma.jobApplication.create).toHaveBeenCalledWith({
        data: {
          jobPostingId: "job-1",
          applicantName: "Pooja Hegde",
          email: "pooja@example.com",
          phone: "+91 9886099001",
          coverNote: null,
          resumeUrl: "https://s3.amazonaws.com/resumes/pooja.pdf",
          status: ApplicationStatus.RECEIVED,
        },
      });
    });

    it("creates job posting and generates auto slug if none provided", async () => {
      (prisma.jobPosting.count as any).mockResolvedValue(0);
      (prisma.jobPosting.create as any).mockImplementation(({ data }) =>
        Promise.resolve({ id: "job-new", ...data })
      );

      const created = await CareersService.createPosting(
        {
          title: "System Engineer Level 2",
          department: "Automation",
          location: "Kalinganagar",
          employmentType: "FULL_TIME",
          experienceMin: 3,
          description: "System engineering role",
          responsibilities: ["Code PLC logic"],
          requirements: ["PLC expertise"],
        },
        "recruiter-1"
      );

      expect(created.slug).toBe("system-engineer-level-2");
      expect(created.status).toBe(JobPostingStatus.PUBLISHED);
      expect(created.postedById).toBe("recruiter-1");
    });

    it("updates application status and reviewer", async () => {
      (prisma.jobApplication.update as any).mockResolvedValue({
        id: "app-1",
        status: ApplicationStatus.SHORTLISTED,
        reviewedById: "recruiter-1",
      });

      const updated = await CareersService.updateApplicationStatus(
        "app-1",
        ApplicationStatus.SHORTLISTED,
        "recruiter-1"
      );

      expect(updated.status).toBe(ApplicationStatus.SHORTLISTED);
      expect(prisma.jobApplication.update).toHaveBeenCalledWith({
        where: { id: "app-1" },
        data: {
          status: ApplicationStatus.SHORTLISTED,
          reviewedById: "recruiter-1",
        },
      });
    });

    it("soft closes job posting", async () => {
      (prisma.jobPosting.update as any).mockResolvedValue({
        id: "job-1",
        status: JobPostingStatus.CLOSED,
      });

      const closed = await CareersService.softClosePosting("job-1");
      expect(closed.status).toBe(JobPostingStatus.CLOSED);
      expect(prisma.jobPosting.update).toHaveBeenCalledWith({
        where: { id: "job-1" },
        data: { status: JobPostingStatus.CLOSED },
      });
    });
  });
});
