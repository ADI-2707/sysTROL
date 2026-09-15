import { prisma } from "@systrol/database";
import {
  JobPostingStatus,
  ApplicationStatus,
  CreateJobPostingDto,
  SubmitApplicationDto,
} from "@systrol/types";

export class CareersService {
  static async listPublishedJobs(filters?: { department?: string; location?: string }) {
    return prisma.jobPosting.findMany({
      where: {
        status: JobPostingStatus.PUBLISHED,
        ...(filters?.department ? { department: filters.department } : {}),
        ...(filters?.location ? { location: { contains: filters.location, mode: "insensitive" } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getJobBySlug(slug: string) {
    const job = await prisma.jobPosting.findUnique({
      where: { slug },
    });

    if (!job || job.status !== JobPostingStatus.PUBLISHED) {
      const error: any = new Error(`Job posting '${slug}' not found or inactive`);
      error.statusCode = 404;
      throw error;
    }

    return job;
  }

  static async getJobById(id: string) {
    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      const error: any = new Error(`Job posting '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    return job;
  }

  static async submitApplication(
    slug: string,
    dto: SubmitApplicationDto,
    resumeUrl: string
  ) {
    const job = await prisma.jobPosting.findUnique({
      where: { slug },
    });

    if (!job || job.status !== JobPostingStatus.PUBLISHED) {
      const error: any = new Error(`Cannot apply to inactive job posting '${slug}'`);
      error.statusCode = 400;
      throw error;
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobPostingId: job.id,
        applicantName: dto.applicantName,
        email: dto.email,
        phone: dto.phone,
        coverNote: dto.coverNote || null,
        resumeUrl,
        status: ApplicationStatus.RECEIVED,
      },
    });

    return application;
  }

  static async createPosting(dto: CreateJobPostingDto, postedById: string) {
    let slug = dto.slug;
    if (!slug) {
      slug = dto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      const count = await prisma.jobPosting.count({
        where: { slug: { startsWith: slug } },
      });
      if (count > 0) {
        slug = `${slug}-${count + 1}`;
      }
    }

    return prisma.jobPosting.create({
      data: {
        title: dto.title,
        slug,
        department: dto.department,
        location: dto.location,
        employmentType: dto.employmentType,
        experienceMin: dto.experienceMin,
        experienceMax: dto.experienceMax ?? null,
        description: dto.description,
        responsibilities: dto.responsibilities,
        requirements: dto.requirements,
        closesAt: dto.closesAt ? new Date(dto.closesAt) : null,
        status: JobPostingStatus.PUBLISHED,
        publishedAt: new Date(),
        postedById,
      },
    });
  }

  static async updatePosting(
    id: string,
    dto: Partial<CreateJobPostingDto> & { status?: JobPostingStatus }
  ) {
    return prisma.jobPosting.update({
      where: { id },
      data: {
        ...(dto.title ? { title: dto.title } : {}),
        ...(dto.slug ? { slug: dto.slug } : {}),
        ...(dto.department ? { department: dto.department } : {}),
        ...(dto.location ? { location: dto.location } : {}),
        ...(dto.employmentType ? { employmentType: dto.employmentType } : {}),
        ...(dto.experienceMin !== undefined ? { experienceMin: dto.experienceMin } : {}),
        ...(dto.experienceMax !== undefined ? { experienceMax: dto.experienceMax } : {}),
        ...(dto.description ? { description: dto.description } : {}),
        ...(dto.responsibilities ? { responsibilities: dto.responsibilities } : {}),
        ...(dto.requirements ? { requirements: dto.requirements } : {}),
        ...(dto.status ? { status: dto.status } : {}),
        ...(dto.closesAt ? { closesAt: new Date(dto.closesAt) } : {}),
      },
    });
  }

  static async softClosePosting(id: string) {
    return prisma.jobPosting.update({
      where: { id },
      data: { status: JobPostingStatus.CLOSED },
    });
  }

  static async listAllPostings(filters?: { status?: JobPostingStatus }) {
    return prisma.jobPosting.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
      },
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async listApplications(jobPostingId?: string, status?: ApplicationStatus) {
    return prisma.jobApplication.findMany({
      where: {
        ...(jobPostingId ? { jobPostingId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        jobPosting: {
          select: {
            id: true,
            title: true,
            slug: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    reviewedById?: string
  ) {
    return prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        ...(reviewedById ? { reviewedById } : {}),
      },
    });
  }
}
