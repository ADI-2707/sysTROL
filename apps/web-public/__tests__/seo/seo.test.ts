import { describe, it, expect, beforeEach, afterEach } from "vitest";
import sitemap from "../../app/sitemap.js";
import robots from "../../app/robots.js";
import { metadata as aboutMetadata } from "../../app/about/page.js";
import { metadata as servicesMetadata } from "../../app/services/page.js";
import { metadata as automationMetadata } from "../../app/services/automation-consultancy/page.js";
import { metadata as tradingMetadata } from "../../app/services/trading/page.js";
import { metadata as clientsMetadata } from "../../app/clients/page.js";
import { metadata as careersMetadata } from "../../app/careers/page.js";
import { metadata as galleryMetadata } from "../../app/gallery/page.js";
import { metadata as contactMetadata } from "../../app/contact/layout.js";
import { metadata as projectsMetadata } from "../../app/projects/layout.js";
import { generateMetadata as generateProjectMetadata } from "../../app/projects/[slug]/page.js";
import { generateMetadata as generateCareerMetadata } from "../../app/careers/[id]/page.js";
import { projectsData } from "../../content/projects.js";

describe("SEO and Metadata Scenarios", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    }
  });

  it("generates default sitemap with expected routes, priorities, and default domain", () => {
    const map = sitemap();
    expect(Array.isArray(map)).toBe(true);

    const homeEntry = map.find((item) => item.url === "https://sys-trol.com");
    expect(homeEntry).toBeDefined();
    expect(homeEntry?.priority).toBe(1.0);

    const aboutEntry = map.find((item) => item.url === "https://sys-trol.com/about");
    expect(aboutEntry).toBeDefined();

    projectsData.forEach((project) => {
      const entry = map.find((item) => item.url === `https://sys-trol.com/projects/${project.slug}`);
      expect(entry).toBeDefined();
      expect(entry?.priority).toBe(0.7);
    });
  });

  it("dynamically adapts sitemap URLs when NEXT_PUBLIC_SITE_URL is customized", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://custom-domain.com";
    const map = sitemap();
    const homeEntry = map.find((item) => item.url === "https://custom-domain.com");
    expect(homeEntry).toBeDefined();
    expect(map.every((item) => item.url.startsWith("https://custom-domain.com"))).toBe(true);
  });

  it("generates robots configuration with valid sitemap URL and crawler rules", () => {
    const rob = robots();
    expect(rob.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    });
    expect(rob.sitemap).toBe("https://sys-trol.com/sitemap.xml");
  });

  it("dynamically adapts robots sitemap URL when NEXT_PUBLIC_SITE_URL is customized", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://official.example.org";
    const rob = robots();
    expect(rob.sitemap).toBe("https://official.example.org/sitemap.xml");
  });

  it("verifies static page metadata contains canonical alternates and descriptive titles", () => {
    const pages = [
      { meta: aboutMetadata, canonical: "/about" },
      { meta: servicesMetadata, canonical: "/services" },
      { meta: automationMetadata, canonical: "/services/automation-consultancy" },
      { meta: tradingMetadata, canonical: "/services/trading" },
      { meta: clientsMetadata, canonical: "/clients" },
      { meta: careersMetadata, canonical: "/careers" },
      { meta: galleryMetadata, canonical: "/gallery" },
      { meta: contactMetadata, canonical: "/contact" },
      { meta: projectsMetadata, canonical: "/projects" },
    ];

    pages.forEach(({ meta, canonical }) => {
      expect(meta).toBeDefined();
      expect(meta.title).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.alternates?.canonical).toBe(canonical);
    });
  });

  it("generates dynamic metadata with canonical paths for projects/[slug]", async () => {
    const targetProject = projectsData[0];
    const meta = await generateProjectMetadata({
      params: Promise.resolve({ slug: targetProject.slug }),
    });

    expect(meta.title).toContain(targetProject.title);
    expect(meta.description).toBe(targetProject.shortBlurb);
    expect(meta.alternates?.canonical).toBe(`/projects/${targetProject.slug}`);
  });

  it("handles non-existent slug gracefully in projects/[slug]", async () => {
    const meta = await generateProjectMetadata({
      params: Promise.resolve({ slug: "non-existent-slug" }),
    });
    expect(meta.title).toBe("Project Not Found");
  });

  it("generates dynamic metadata with canonical paths for careers/[id]", async () => {
    const mockJob = {
      id: "lead-l2-automation-engineer",
      title: "Lead Level-2 Automation Engineer",
      department: "L2 Software Engineering",
      location: "Bengaluru, IN",
      employmentType: "FULL_TIME",
      experienceMin: 5,
      experienceMax: 8,
      description: "Supervisory mill automation software development.",
    };

    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ job: mockJob }),
    } as Response);

    const meta = await generateCareerMetadata({
      params: Promise.resolve({ id: "lead-l2-automation-engineer" }),
    });

    expect(meta.title).toContain("Lead Level-2 Automation Engineer");
    expect(meta.description).toBe(mockJob.description);
    expect(meta.alternates?.canonical).toBe("/careers/lead-l2-automation-engineer");

    globalThis.fetch = originalFetch;
  });

  it("handles non-existent job gracefully in careers/[id]", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
    } as Response);

    const meta = await generateCareerMetadata({
      params: Promise.resolve({ id: "non-existent-id" }),
    });

    expect(meta.title).toBe("Position Not Found");

    globalThis.fetch = originalFetch;
  });
});
