import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { GalleryClient } from "./GalleryClient";
import { galleryItems, GalleryItem } from "@/content/gallery";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery & Visual Showcase | sysTROL Engineering & Consultancy",
  description:
    "Explore sysTROL's physical simulation labs, engineering team collaboration, and onsite continuous steel rolling mill deployments in live operation.",
};

export function resolveGalleryItems(
  dynamicAssets?: any[] | null,
  fallbackItems: GalleryItem[] = galleryItems
): GalleryItem[] {
  if (!dynamicAssets || dynamicAssets.length === 0) return fallbackItems;

  const categorySeen: Record<string, boolean> = {};
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

    let aspect: "featured" | "tall" | "wide" | "standard" = asset.aspect || "standard";
    if (!categorySeen[cat]) {
      categorySeen[cat] = true;
      if (aspect === "standard") {
        aspect = "featured";
      }
    }

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

async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";
    const res = await fetch(`${apiUrl}/api/v1/public/media`, { next: { revalidate: 60 } });
    if (!res.ok) return galleryItems;
    const data = await res.json();
    return resolveGalleryItems(data?.media, galleryItems);
  } catch {
    return galleryItems;
  }
}

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          image="/images/about/engineering-facility.jpg"
          imageAlt="sysTROL technical simulation laboratory and automation workstations"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Visual Proof & Operations"
              eyebrowVariant="dark"
              theme="dark"
              title="Workplace Labs, Team Culture & Live Mill Deployments"
              subtitle="Explore the engineering infrastructure, domain specialists, and harsh industrial environments where sysTROL Level-2 supervisory software and precision spares deliver peak manufacturing yield."
              align="left"
            />
          </Reveal>
        </PageHero>

        <GalleryClient initialItems={items} />

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
