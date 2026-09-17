import { galleryItems, GalleryItem } from "@/content/gallery";

export function resolveGalleryItems(
  dynamicAssets?: any[] | null,
  fallbackItems: GalleryItem[] = galleryItems
): GalleryItem[] {
  if (!dynamicAssets || dynamicAssets.length === 0) return fallbackItems;

  const dynamicItems: GalleryItem[] = dynamicAssets.map((asset: any) => {
    let cat: "workplace" | "team" | "deployments" = "deployments";
    const fileLower = (asset.fileUrl || "").toLowerCase();
    const titleLower = (asset.title || "").toLowerCase();
    const tags = (asset.tags || []).map((t: string) => t.toLowerCase());

    if (asset.gallerySection === "WORKPLACE") {
      cat = "workplace";
    } else if (asset.gallerySection === "TEAM") {
      cat = "team";
    } else if (asset.gallerySection === "DEPLOYMENTS") {
      cat = "deployments";
    } else if (asset.category === "PROJECTS") {
      cat = "deployments";
    } else if (
      fileLower.includes("team-") ||
      titleLower.includes("team") ||
      titleLower.includes("handoff") ||
      titleLower.includes("inspection") ||
      titleLower.includes("trial") ||
      tags.some((t: string) =>
        t.includes("team") ||
        t.includes("collaboration") ||
        t.includes("staff") ||
        t.includes("engineering-review") ||
        t.includes("quality-control") ||
        t.includes("field-engineering") ||
        t.includes("hot-trial")
      )
    ) {
      cat = "team";
    } else if (
      fileLower.includes("workplace-") ||
      titleLower.includes("lab") ||
      titleLower.includes("workplace") ||
      titleLower.includes("station") ||
      titleLower.includes("bench") ||
      titleLower.includes("digital twin") ||
      titleLower.includes("modeling") ||
      titleLower.includes("hil") ||
      tags.some((t: string) =>
        t.includes("lab") ||
        t.includes("workplace") ||
        t.includes("station") ||
        t.includes("bench") ||
        t.includes("digital-twin") ||
        t.includes("hil") ||
        t.includes("simulation") ||
        t.includes("modeling") ||
        t.includes("pass-schedules") ||
        t.includes("thermal-tracking") ||
        t.includes("gap-control") ||
        t.includes("servo-valve") ||
        t.includes("profinet") ||
        t.includes("opc-ua") ||
        t.includes("c-sharp-core")
      )
    ) {
      cat = "workplace";
    }

    const aspect: "featured" | "tall" | "wide" | "standard" = asset.aspect || "standard";

    return {
      id: asset.id,
      title: asset.title,
      category: cat,
      categoryLabel: cat === "workplace" ? "Workplace & Labs" : cat === "team" ? "Our Team" : "Onsite Deployments",
      location: "Bengaluru HQ & Global Mill Sites",
      description: asset.caption || asset.altText || asset.title,
      image: asset.fileUrl,
      tags: asset.tags && asset.tags.length > 0 ? asset.tags : ["rolling-mill", "automation"],
      aspect,
    };
  });

  const hasWorkplace = dynamicItems.some((i) => i.category === "workplace");
  const hasTeam = dynamicItems.some((i) => i.category === "team");
  const hasDeployments = dynamicItems.some((i) => i.category === "deployments");

  let finalItems = [...dynamicItems];
  if (!hasWorkplace) {
    finalItems = [...finalItems, ...fallbackItems.filter((i) => i.category === "workplace")];
  }
  if (!hasTeam) {
    finalItems = [...finalItems, ...fallbackItems.filter((i) => i.category === "team")];
  }
  if (!hasDeployments) {
    finalItems = [...finalItems, ...fallbackItems.filter((i) => i.category === "deployments")];
  }

  return finalItems.length > 0 ? finalItems : fallbackItems;
}
