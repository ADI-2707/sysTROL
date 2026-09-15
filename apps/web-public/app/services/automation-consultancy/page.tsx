import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { Section } from "@/components/layout/Section/Section";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { servicesData } from "@/content/services";
import { ArrowLeft, CheckCircle2, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Level-2 Automation Engineering & Consultancy | sysTROL",
  description:
    "C# and Python Level-2 supervisory automation systems for steel rolling mills, deterministic calculation matrices, pass scheduling, and Level-1 PLC integration.",
};

export default function AutomationConsultancyPage() {
  const service = servicesData.find((s) => s.slug === "automation-consultancy")!;

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          image="/images/automation-control-room.jpg"
          imageAlt="Level-2 automation engineering and process control pulpit"
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

            <Badge variant="brand" size="md" style={{ marginBottom: "var(--space-3)" }}>
              Specialist Engineering Division
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

        <Section variant="light">
          <Container size="wide">
            <Reveal>
              <SectionHeading
                eyebrow="Core Scope of Work"
                eyebrowVariant="brand"
                title={<>End-to-End Supervisory <span>Control Engineering</span></>}
                subtitle="Every mill layout is unique. We tailor mathematical coefficients, communications protocols, and operator ergonomics to your plant's specific kinematics."
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
              {service.capabilities.map((cap, idx) => (
                <Reveal key={idx} delay={idx * 80}>
                  <div
                    style={{
                      backgroundColor: "var(--color-surface-50)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--space-6)",
                      height: "100%",
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: "var(--color-brand-green-100)",
                        color: "var(--color-brand-green-700)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      <Zap size={18} />
                    </div>
                    <h3
                      style={{
                        fontSize: "var(--text-xl)",
                        fontWeight: 700,
                        color: "var(--color-brand-sys-navy)",
                        marginBottom: "var(--space-2)",
                      }}
                    >
                      {cap.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-ink-700)",
                        lineHeight: 1.6,
                        marginBottom: "var(--space-4)",
                        flex: 1,
                      }}
                    >
                      {cap.description}
                    </p>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
                      {cap.highlights.map((item, hIdx) => (
                        <li
                          key={hIdx}
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--color-ink-900)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <CheckCircle2 size={14} color="var(--color-brand-green-600)" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            {service.processSteps && (
              <Reveal>
                <div style={{ marginTop: "var(--space-8)" }}>
                  <SectionHeading
                    eyebrow="Engagement Methodology"
                    eyebrowVariant="accent"
                    title={<>5-Stage Engineering <span>Commissioning Lifecycle</span></>}
                    subtitle="How sysTROL guarantees a smooth, low-risk transition from audit through factory acceptance and live hot-metal cutover."
                    align="left"
                  />
                  <Stepper steps={service.processSteps} />
                </div>
              </Reveal>
            )}
          </Container>
        </Section>

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
