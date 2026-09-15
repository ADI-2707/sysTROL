import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Hero } from "@/components/sections/Hero/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip/TrustStrip";
import { WhatWeDo } from "@/components/sections/WhatWeDo/WhatWeDo";
import { GlobalNetwork } from "@/components/sections/GlobalNetwork/GlobalNetwork";
import { WhyUs } from "@/components/sections/WhyUs/WhyUs";
import { ImpactBand } from "@/components/sections/ImpactBand/ImpactBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects/FeaturedProjects";
import { IndustriesServed } from "@/components/sections/IndustriesServed/IndustriesServed";
import { CTASection } from "@/components/sections/CTASection/CTASection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <WhatWeDo />
        <GlobalNetwork />
        <WhyUs />
        <ImpactBand />
        <FeaturedProjects />
        <IndustriesServed />
        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
