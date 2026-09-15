import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { Section } from "@/components/layout/Section/Section";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { servicesData } from "@/content/services";
import { ArrowLeft, ShieldCheck, Globe, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Imported Mill Machinery & Spares Trading | sysTROL",
  description:
    "OEM-certified imported heavy machinery, Tungsten Carbide roll rings, hydraulic AGC servo valves, and critical consumables for steel plants.",
};

export default function TradingPage() {
  const service = servicesData.find((s) => s.slug === "trading")!;

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          image="/images/hydraulic-agc-system.jpg"
          imageAlt="Imported machinery and critical steel plant spares trading"
        >
          <Reveal>
            <div style={{ marginBottom: "var(--space-4)" }}>
              <Link
                href="/services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-ink-300)",
                  textDecoration: "none",
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Services Overview</span>
              </Link>
            </div>

            <Badge variant="accent" size="md" style={{ marginBottom: "var(--space-3)" }}>
              Global Industrial Procurement
            </Badge>

            <h1
              style={{
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                fontWeight: 700,
                color: "var(--color-surface-0)",
                maxWidth: "840px",
                lineHeight: 1.15,
                marginBottom: "var(--space-4)",
              }}
            >
              {service.heroTagline}
            </h1>

            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "#CBD5E1",
                maxWidth: "760px",
                lineHeight: 1.6,
                marginBottom: "var(--space-6)",
              }}
            >
              {service.fullOverview}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {service.domainTags.map((tag, idx) => (
                <Badge key={idx} variant="dark" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </Reveal>
        </PageHero>

        <Section variant="alt">
          <Container size="wide">
            <Reveal>
              <SectionHeading
                eyebrow="Product Portfolios"
                eyebrowVariant="accent"
                title={<>Specialized Import <span>Sourcing Categories</span></>}
                subtitle="Direct partnerships with premier manufacturers in Germany, Italy, Sweden, and Japan to guarantee authentic OEM metallurgy and rapid turnaround."
                align="left"
              />
            </Reveal>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "var(--space-6)",
                alignItems: "stretch",
                marginBottom: "var(--space-16)",
              }}
            >
              {service.tradingCategories?.map((cat, idx) => (
                <Reveal key={idx} delay={idx * 80}>
                  <div
                    style={{
                      backgroundColor: "var(--color-surface-0)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-6)",
                      boxShadow: "var(--shadow-sm)",
                      height: "100%",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "var(--space-4)",
                        paddingBottom: "var(--space-3)",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      <h3 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-brand-sys-navy)" }}>
                        {cat.category}
                      </h3>
                    </div>

                    <div style={{ marginBottom: "var(--space-4)" }}>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Sourcing Origins:
                      </span>
                      <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-accent-teal-600)", marginTop: "2px" }}>
                        {cat.sourcingOrigin}
                      </div>
                    </div>

                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
                      {cat.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--color-ink-700)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <PackageCheck size={16} color="var(--color-accent-teal-500)" style={{ flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={150}>
              <div
                style={{
                  backgroundColor: "var(--color-surface-0)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "var(--space-8)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "var(--space-8)",
                  alignItems: "stretch",
                }}
              >
                <div>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--color-brand-green-100)",
                      color: "var(--color-brand-green-700)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    <ShieldCheck size={24} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-brand-sys-navy)", marginBottom: "8px" }}>
                    EN 10204 3.1 Certification
                  </h4>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-700)", lineHeight: 1.6 }}>
                    Every critical wear part, hydraulic cartridge, and tungsten carbide ring is
                    accompanied by comprehensive metallurgical test certificates verifying hardness,
                    grain structure, and chemical composition.
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--color-accent-teal-100)",
                      color: "var(--color-accent-teal-600)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "var(--space-3)",
                    }}
                  >
                    <Globe size={24} />
                  </div>
                  <h4 style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-brand-sys-navy)", marginBottom: "8px" }}>
                    Emergency Air-Freight Logistics
                  </h4>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-ink-700)", lineHeight: 1.6 }}>
                    When mill breakdowns threaten plant production schedules, sysTROL utilizes
                    bonded international freight corridors to clear customs and deliver critical
                    spares to your site in days rather than months.
                  </p>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
