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

async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";
    const res = await fetch(`${apiUrl}/api/v1/public/media`, { next: { revalidate: 60 } });
    if (!res.ok) return galleryItems;
    const data = await res.json();
    if (!data.media || data.media.length === 0) return galleryItems;

    const dynamicItems: GalleryItem[] = data.media.map((asset: any) => {
      let cat: "workplace" | "team" | "deployments" = "deployments";
      const tags = (asset.tags || []).map((t: string) => t.toLowerCase());
      if (tags.some((t: string) => t.includes("team") || t.includes("collaboration") || t.includes("staff"))) {
        cat = "team";
      } else if (tags.some((t: string) => t.includes("lab") || t.includes("workplace") || t.includes("station") || t.includes("bench"))) {
        cat = "workplace";
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
        aspect: "standard" as const,
      };
    });

    return dynamicItems.length > 0 ? dynamicItems : galleryItems;
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
