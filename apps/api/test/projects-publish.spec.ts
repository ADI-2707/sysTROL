import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  LifecycleStage,
  PublishProjectSchema,
  UnpublishProjectSchema,
} from "@systrol/types";
import { ProjectsService } from "../src/modules/lifecycle/projects.service.js";
import { prisma } from "@systrol/database";

vi.mock("@systrol/database", () => {
  const mPrisma = {
    project: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };
  return { prisma: mPrisma };
});

describe("Project Publishing & Case Study Lifecycle Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validCaseStudyPayload = {
    caseStudy: {
      projectName: "Level-2 Automation Modernization for 650,000 TPA Bar Mill",
      slug: "rolling-mill-l2-automation-upgrade",
      challengeTitle: "Legacy VMS Automation Cobble Rates",
      challengeDescription: "The mill faced frequent cobble rates during rebar section changeovers.",
      solutionTitle: "Physics-Based Dynamic Pass Scheduling",
      solutionDescription: "Engineered high-speed C# .NET automation suite with OPC UA gateways.",
      technologies: ["C#", ".NET 8", "OPC UA", "Siemens S7-400"],
      kpiCards: [
        { label: "Changeover Time Reduction", value: "82%", description: "Down from 45m to <8m" },
        { label: "Cobble Rate Reduction", value: "38%", description: "Verified across rolling shifts" },
      ],
      images: [
        { url: "/images/hero-rolling-mill.jpg", caption: "Continuous bar mill train", altText: "Bar mill train", isShowingCard: true },
        { url: "/images/projects/gallery/bar-mill-pulpit.jpg", caption: "Engineering pulpit", altText: "Pulpit console", isShowingCard: false },
        { url: "/images/projects/gallery/bar-mill-cooling-bed.jpg", caption: "Cooling bed alignment", altText: "Cooling bed", isShowingCard: false },
      ],
    },
  };

  describe("PublishProjectSchema validation", () => {
    it("accepts valid publication payload with exactly 3 images and 1 showing card", () => {
      const result = PublishProjectSchema.safeParse(validCaseStudyPayload);
      expect(result.success).toBe(true);
    });

    it("rejects publication payload if images count is not exactly 3", () => {
      const invalid = {
        caseStudy: {
          ...validCaseStudyPayload.caseStudy,
          images: [
            { url: "/images/hero-rolling-mill.jpg", caption: "1", altText: "1", isShowingCard: true },
            { url: "/images/pulpit.jpg", caption: "2", altText: "2", isShowingCard: false },
          ],
        },
      };
      const result = PublishProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects publication payload if no image is designated as the card thumbnail", () => {
      const invalid = {
        caseStudy: {
          ...validCaseStudyPayload.caseStudy,
          images: [
            { url: "/images/1.jpg", caption: "1", altText: "1", isShowingCard: false },
            { url: "/images/2.jpg", caption: "2", altText: "2", isShowingCard: false },
            { url: "/images/3.jpg", caption: "3", altText: "3", isShowingCard: false },
          ],
        },
      };
      const result = PublishProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects publication payload if multiple images are marked as showing card", () => {
      const invalid = {
        caseStudy: {
          ...validCaseStudyPayload.caseStudy,
          images: [
            { url: "/images/1.jpg", caption: "1", altText: "1", isShowingCard: true },
            { url: "/images/2.jpg", caption: "2", altText: "2", isShowingCard: true },
            { url: "/images/3.jpg", caption: "3", altText: "3", isShowingCard: false },
          ],
        },
      };
      const result = PublishProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects publication payload if fewer than 2 KPI cards are provided", () => {
      const invalid = {
        caseStudy: {
          ...validCaseStudyPayload.caseStudy,
          kpiCards: [{ label: "Solo KPI", value: "100%" }],
        },
      };
      const result = PublishProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("ProjectsService.publishProject lifecycle enforcement", () => {
    it("successfully publishes a commissioned project and records audit log", async () => {
      const mockProject = {
        id: "proj-comm-1",
        name: "Test Bar Mill",
        currentStage: LifecycleStage.COMMISSIONING,
        isPublished: false,
      };

      const mockUpdated = {
        ...mockProject,
        isPublished: true,
        publicSlug: validCaseStudyPayload.caseStudy.slug,
        caseStudy: validCaseStudyPayload.caseStudy,
      };

      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);
      vi.mocked(prisma.project.update).mockResolvedValue(mockUpdated as any);
      vi.mocked(prisma.auditLog.create).mockResolvedValue({ id: "audit-1" } as any);

      const result = await ProjectsService.publishProject(
        "proj-comm-1",
        validCaseStudyPayload,
        "user-super-admin"
      );

      expect(result.isPublished).toBe(true);
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj-comm-1" },
        data: expect.objectContaining({
          isPublished: true,
          publishedById: "user-super-admin",
          publicSlug: "rolling-mill-l2-automation-upgrade",
        }),
      });
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          projectId: "proj-comm-1",
          actorId: "user-super-admin",
          action: "PROJECT_PUBLISHED",
        }),
      });
    });

    it("strictly rejects publication when project is in an uncompleted stage", async () => {
      const ongoingProject = {
        id: "proj-ongoing-1",
        name: "Early Engineering Project",
        currentStage: LifecycleStage.ENGINEERING,
        isPublished: false,
      };

      vi.mocked(prisma.project.findUnique).mockResolvedValue(ongoingProject as any);

      await expect(
        ProjectsService.publishProject("proj-ongoing-1", validCaseStudyPayload, "user-super-admin")
      ).rejects.toThrow("Only completed or commissioned projects can be published to the public website");

      expect(prisma.project.update).not.toHaveBeenCalled();
    });

    it("throws 404 when project id does not exist", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        ProjectsService.publishProject("proj-nonexistent", validCaseStudyPayload, "user-super-admin")
      ).rejects.toThrow("Project 'proj-nonexistent' not found");
    });
  });

  describe("ProjectsService.unpublishProject lifecycle transitions", () => {
    it("successfully unpublishes a live project and records audit log", async () => {
      const mockProject = {
        id: "proj-live-1",
        name: "Live Mill Project",
        isPublished: true,
      };

      const mockUnpublished = {
        ...mockProject,
        isPublished: false,
      };

      vi.mocked(prisma.project.findUnique).mockResolvedValue(mockProject as any);
      vi.mocked(prisma.project.update).mockResolvedValue(mockUnpublished as any);
      vi.mocked(prisma.auditLog.create).mockResolvedValue({ id: "audit-2" } as any);

      const result = await ProjectsService.unpublishProject("proj-live-1", "user-super-admin", {
        reason: "Client NDA revision requested",
      });

      expect(result.isPublished).toBe(false);
      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: "proj-live-1" },
        data: { isPublished: false },
      });
      expect(prisma.auditLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          projectId: "proj-live-1",
          actorId: "user-super-admin",
          action: "PROJECT_UNPUBLISHED",
        }),
      });
    });

    it("throws 404 when unpublishing non-existent project", async () => {
      vi.mocked(prisma.project.findUnique).mockResolvedValue(null);

      await expect(
        ProjectsService.unpublishProject("proj-missing", "user-super-admin")
      ).rejects.toThrow("Project 'proj-missing' not found");
    });
  });

  describe("ProjectsService public endpoints", () => {
    it("listPublicProjects returns published projects with card thumbnail and kpis", async () => {
      const mockPublished = [
        {
          id: "proj-1",
          publicSlug: "bar-mill-l2",
          name: "Bar Mill L2",
          plantLocation: "Eastern India",
          millType: "Steel Rolling Mills",
          publishedAt: new Date("2026-01-01"),
          client: { name: "Client A" },
          caseStudy: validCaseStudyPayload.caseStudy,
        },
      ];

      vi.mocked(prisma.project.findMany).mockResolvedValue(mockPublished as any);

      const result = await ProjectsService.listPublicProjects();
      expect(result.length).toBe(1);
      expect(result[0].slug).toBe("bar-mill-l2");
      expect(result[0].thumbnailUrl).toBe("/images/hero-rolling-mill.jpg");
      expect(result[0].metrics.length).toBe(2);
    });

    it("getPublicProjectBySlug returns public case study details", async () => {
      const mockProject = {
        id: "proj-1",
        publicSlug: "bar-mill-l2",
        name: "Bar Mill L2",
        plantLocation: "Eastern India",
        millType: "Steel Rolling Mills",
        publishedAt: new Date("2026-01-01"),
        client: { name: "Client A" },
        caseStudy: validCaseStudyPayload.caseStudy,
      };

      vi.mocked(prisma.project.findFirst).mockResolvedValue(mockProject as any);

      const result = await ProjectsService.getPublicProjectBySlug("bar-mill-l2");
      expect(result).not.toBeNull();
      expect(result?.title).toBe(validCaseStudyPayload.caseStudy.projectName);
      expect(result?.thumbnailUrl).toBe("/images/hero-rolling-mill.jpg");
    });

    it("getPublicProjectBySlug returns null when slug does not exist", async () => {
      vi.mocked(prisma.project.findFirst).mockResolvedValue(null);

      const result = await ProjectsService.getPublicProjectBySlug("non-existent");
      expect(result).toBeNull();
    });
  });
});
