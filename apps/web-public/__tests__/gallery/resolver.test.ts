import { describe, it, expect } from "vitest";
import { resolveGalleryItems } from "@/lib/gallery-resolver";
import { galleryItems } from "@/content/gallery";

describe("resolveGalleryItems", () => {
  it("returns fallback items when dynamic assets array is empty or null", () => {
    expect(resolveGalleryItems([])).toEqual(galleryItems);
    expect(resolveGalleryItems(null)).toEqual(galleryItems);
    expect(resolveGalleryItems(undefined)).toEqual(galleryItems);
  });

  it("maps explicit gallerySection WORKPLACE to workplace category", () => {
    const assets = [
      {
        id: "m-wp",
        title: "Generic Mill Equipment",
        category: "GALLERY",
        gallerySection: "WORKPLACE",
        fileUrl: "https://example.com/asset.webp",
        tags: ["rolling-mill"],
        aspect: "wide",
      },
    ];

    const result = resolveGalleryItems(assets, galleryItems);
    const item = result.find((i) => i.id === "m-wp");
    expect(item).toBeDefined();
    expect(item?.category).toBe("workplace");
    expect(item?.categoryLabel).toBe("Workplace & Labs");
  });

  it("maps explicit gallerySection TEAM to team category", () => {
    const assets = [
      {
        id: "m-team",
        title: "Industrial Facility View",
        category: "GALLERY",
        gallerySection: "TEAM",
        fileUrl: "https://example.com/asset.webp",
        tags: ["factory"],
        aspect: "standard",
      },
    ];

    const result = resolveGalleryItems(assets, galleryItems);
    const item = result.find((i) => i.id === "m-team");
    expect(item).toBeDefined();
    expect(item?.category).toBe("team");
    expect(item?.categoryLabel).toBe("Our Team");
  });

  it("maps explicit gallerySection DEPLOYMENTS to deployments category", () => {
    const assets = [
      {
        id: "m-deploy",
        title: "Commissioning Bay",
        category: "GALLERY",
        gallerySection: "DEPLOYMENTS",
        fileUrl: "https://example.com/asset.webp",
        tags: ["commissioning"],
        aspect: "featured",
      },
    ];

    const result = resolveGalleryItems(assets, galleryItems);
    const item = result.find((i) => i.id === "m-deploy");
    expect(item).toBeDefined();
    expect(item?.category).toBe("deployments");
    expect(item?.categoryLabel).toBe("Onsite Deployments");
  });

  it("maps PROJECTS category directly to deployments", () => {
    const assets = [
      {
        id: "m-proj",
        title: "Billet Reheating Furnace",
        category: "PROJECTS",
        fileUrl: "https://example.com/furnace.webp",
        tags: ["furnace", "thermal"],
      },
    ];

    const result = resolveGalleryItems(assets, galleryItems);
    const item = result.find((i) => i.id === "m-proj");
    expect(item).toBeDefined();
    expect(item?.category).toBe("deployments");
  });

  it("uses legacy heuristic for fileUrl prefixes when gallerySection is absent", () => {
    const assets = [
      {
        id: "legacy-team",
        title: "Review Session",
        category: "GALLERY",
        fileUrl: "https://example.com/team-meeting.webp",
        tags: ["general"],
      },
      {
        id: "legacy-wp",
        title: "Testing Rig",
        category: "GALLERY",
        fileUrl: "https://example.com/workplace-rig.webp",
        tags: ["general"],
      },
    ];

    const result = resolveGalleryItems(assets, galleryItems);
    expect(result.find((i) => i.id === "legacy-team")?.category).toBe("team");
    expect(result.find((i) => i.id === "legacy-wp")?.category).toBe("workplace");
  });

  it("uses legacy heuristic for title keywords when gallerySection is absent", () => {
    const assets = [
      {
        id: "kw-wp-1",
        title: "Hardware In The Loop Simulation Lab",
        category: "GALLERY",
        fileUrl: "https://example.com/asset-1.webp",
        tags: ["general"],
      },
      {
        id: "kw-team-1",
        title: "Engineering Inspection and Technical Handoff",
        category: "GALLERY",
        fileUrl: "https://example.com/asset-2.webp",
        tags: ["general"],
      },
    ];

    const result = resolveGalleryItems(assets, galleryItems);
    expect(result.find((i) => i.id === "kw-wp-1")?.category).toBe("workplace");
    expect(result.find((i) => i.id === "kw-team-1")?.category).toBe("team");
  });

  it("uses legacy heuristic for domain tags when gallerySection is absent", () => {
    const assets = [
      {
        id: "tag-wp",
        title: "Dynamic Model Server",
        category: "GALLERY",
        fileUrl: "https://example.com/generic.webp",
        tags: ["digital-twin", "pass-schedules"],
      },
      {
        id: "tag-team",
        title: "Mill Floor Audit",
        category: "GALLERY",
        fileUrl: "https://example.com/generic2.webp",
        tags: ["field-engineering", "quality-control"],
      },
    ];

    const result = resolveGalleryItems(assets, galleryItems);
    expect(result.find((i) => i.id === "tag-wp")?.category).toBe("workplace");
    expect(result.find((i) => i.id === "tag-team")?.category).toBe("team");
  });

  it("merges fallback items for any category that would otherwise have zero items", () => {
    const onlyDeploymentsAssets = [
      {
        id: "dep-only-1",
        title: "Wire Rod Mill Finishing Stand",
        category: "GALLERY",
        gallerySection: "DEPLOYMENTS",
        fileUrl: "https://example.com/wirerod.webp",
        tags: ["wire-rod"],
      },
    ];

    const result = resolveGalleryItems(onlyDeploymentsAssets, galleryItems);
    const workplaceCount = result.filter((i) => i.category === "workplace").length;
    const teamCount = result.filter((i) => i.category === "team").length;
    const deploymentsCount = result.filter((i) => i.category === "deployments").length;

    expect(workplaceCount).toBeGreaterThan(0);
    expect(teamCount).toBeGreaterThan(0);
    expect(deploymentsCount).toBeGreaterThan(0);
  });
});
