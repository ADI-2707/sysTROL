import { projectsData } from "@/content/projects";
import { Project } from "@/types";

export function resolveProjects(
  dynamicProjects?: any[] | null,
  fallbackProjects: Project[] = projectsData
): Project[] {
  if (!dynamicProjects || dynamicProjects.length === 0) {
    return fallbackProjects;
  }

  const merged = [...fallbackProjects];

  for (const dyn of dynamicProjects) {
    if (dyn.isPublished === false) {
      const idx = merged.findIndex((p) => p.slug === dyn.slug || p.id === dyn.id);
      if (idx !== -1) {
        merged.splice(idx, 1);
      }
      continue;
    }

    const cardThumbnail = dyn.thumbnailUrl || dyn.gallery?.find((g: any) => g.tag === "Card Thumbnail")?.url;

    const mapped: Project = {
      id: dyn.id,
      slug: dyn.slug,
      title: dyn.title,
      clientRepresentative: dyn.clientRepresentative || "Client Representative",
      industry: dyn.industry || "Steel Rolling Mills",
      serviceType: dyn.serviceType || "Automation & Consultancy",
      shortBlurb: dyn.shortBlurb || "",
      featured: dyn.featured !== undefined ? dyn.featured : true,
      year: dyn.year || "2026",
      location: dyn.location || "India",
      challenge: dyn.challenge || "",
      solution: dyn.solution || "",
      outcomes: dyn.outcomes || [],
      technologies: dyn.technologies || [],
      metrics: dyn.metrics || [],
      gallery: dyn.gallery || [],
      thumbnailUrl: cardThumbnail || undefined,
    };

    const existingIdx = merged.findIndex((p) => p.slug === mapped.slug || p.id === mapped.id);
    if (existingIdx !== -1) {
      merged[existingIdx] = {
        ...merged[existingIdx],
        ...mapped,
      };
    } else {
      merged.unshift(mapped);
    }
  }

  return merged;
}
