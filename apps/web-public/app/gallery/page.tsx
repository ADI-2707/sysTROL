import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery & Visual Showcase | sysTROL Engineering & Consultancy",
  description:
    "Explore sysTROL's physical simulation labs, engineering team collaboration, and onsite continuous steel rolling mill deployments in live operation.",
};

export default function GalleryPage() {
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

        <GalleryClient />

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
