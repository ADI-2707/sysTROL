import { describe, it, expect } from "vitest";
import { resolveProjects } from "@/lib/projects-resolver";
import { projectsData } from "@/content/projects";

describe("resolveProjects", () => {
  it("returns static fallback projects when dynamic list is empty or null", () => {
    expect(resolveProjects([])).toEqual(projectsData);
    expect(resolveProjects(null)).toEqual(projectsData);
    expect(resolveProjects(undefined)).toEqual(projectsData);
  });

  it("merges dynamic project updates with existing slug", () => {
    const dynamicProjects = [
      {
        id: "proj-1",
        slug: "rolling-mill-l2-automation-upgrade",
        title: "Updated L2 Automation Mill",
        challenge: "Modernized mill pacing bottleneck",
        solution: "Dual-redundant server clusters",
        metrics: [
          { label: "Throughput", value: "+30%" },
          { label: "Cycle Time", value: "-15%" },
        ],
        gallery: [
          { url: "https://systrol.org/img1.webp", caption: "Furnace", tag: "Gallery" },
          { url: "https://systrol.org/img2.webp", caption: "Card view", tag: "Card Thumbnail" },
        ],
        thumbnailUrl: "https://systrol.org/img2.webp",
      },
    ];

    const result = resolveProjects(dynamicProjects, projectsData);
    const updated = result.find((p) => p.slug === "rolling-mill-l2-automation-upgrade");

    expect(updated).toBeDefined();
    expect(updated?.title).toBe("Updated L2 Automation Mill");
    expect(updated?.challenge).toBe("Modernized mill pacing bottleneck");
    expect(updated?.solution).toBe("Dual-redundant server clusters");
    expect(updated?.thumbnailUrl).toBe("https://systrol.org/img2.webp");
    expect(updated?.metrics.length).toBe(2);
  });

  it("prepends new dynamic published project if slug does not exist in fallback", () => {
    const dynamicProjects = [
      {
        id: "proj-new-99",
        slug: "brand-new-steckel-mill-project",
        title: "Steckel Mill Automation",
        challenge: "New challenge description",
        solution: "New solution description",
        thumbnailUrl: "https://systrol.org/new-thumb.webp",
      },
    ];

    const result = resolveProjects(dynamicProjects, projectsData);

    expect(result[0].slug).toBe("brand-new-steckel-mill-project");
    expect(result[0].title).toBe("Steckel Mill Automation");
    expect(result[0].thumbnailUrl).toBe("https://systrol.org/new-thumb.webp");
    expect(result.length).toBe(projectsData.length + 1);
  });
});
