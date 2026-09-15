import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { CountUp } from "@/components/ui/CountUp/CountUp";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { ProjectGallery } from "@/components/sections/ProjectGallery/ProjectGallery";
import { projectsData } from "@/content/projects";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building,
  MapPin,
  Calendar,
  Layers,
} from "lucide-react";

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | sysTROL Case Study`,
    description: project.shortBlurb,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectsData.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = projectsData
    .filter((p) => p.slug !== slug && (p.industry === project.industry || p.serviceType === project.serviceType))
    .slice(0, 2);

  return (
    <>
      <Navbar />
      <main>
        <section
          style={{
            backgroundColor: "var(--color-brand-navy-900)",
            color: "var(--color-surface-0)",
            paddingTop: "var(--space-16)",
            paddingBottom: "var(--space-20)",
            borderBottom: "1px solid var(--color-border-dark)",
          }}
        >
          <Container size="wide">
            <div style={{ marginBottom: "var(--space-4)" }}>
              <Link
                href="/projects"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-ink-400)",
                  textDecoration: "none",
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to All Case Studies</span>
              </Link>
            </div>

            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Badge variant="accent" size="md">
                {project.industry}
              </Badge>
              <Badge variant="dark" size="md">
                {project.serviceType}
              </Badge>
            </div>

            <h1
              style={{
                fontSize: "var(--text-4xl)",
                fontWeight: 700,
                color: "var(--color-surface-0)",
                maxWidth: "920px",
                lineHeight: 1.15,
                marginBottom: "var(--space-4)",
              }}
            >
              {project.title}
            </h1>

            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "#CBD5E1",
                maxWidth: "800px",
                lineHeight: 1.6,
                marginBottom: "var(--space-8)",
              }}
            >
              {project.shortBlurb}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Building size={18} color="var(--color-accent-teal-500)" />
                <div>
                  <div style={{ fontSize: "11px", color: "var(--color-ink-400)" }}>CLIENT / PROFILE</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-surface-0)", fontWeight: 600 }}>
                    {project.clientRepresentative}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MapPin size={18} color="var(--color-accent-teal-500)" />
                <div>
                  <div style={{ fontSize: "11px", color: "var(--color-ink-400)" }}>LOCATION</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-surface-0)", fontWeight: 600 }}>
                    {project.location}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Calendar size={18} color="var(--color-accent-teal-500)" />
                <div>
                  <div style={{ fontSize: "11px", color: "var(--color-ink-400)" }}>YEAR DELIVERED</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-surface-0)", fontWeight: 600 }}>
                    {project.year}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section
          style={{
            paddingTop: "var(--space-16)",
            paddingBottom: "var(--space-16)",
            backgroundColor: "var(--color-surface-0)",
          }}
        >
          <Container size="wide">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "var(--space-12)",
              }}
            >
              <div
                style={{
                  padding: "var(--space-8)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-surface-50)",
                  borderLeft: "6px solid var(--color-warning-500)",
                  borderTop: "1px solid var(--color-border)",
                  borderRight: "1px solid var(--color-border)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <AlertTriangle size={24} color="var(--color-warning-500)" />
                  <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-ink-900)" }}>
                    The Operational & Metallurgical Challenge
                  </h2>
                </div>
                <p style={{ fontSize: "var(--text-base)", color: "var(--color-ink-700)", lineHeight: 1.7 }}>
                  {project.challenge}
                </p>
              </div>

              <div
                style={{
                  padding: "var(--space-8)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-surface-0)",
                  borderLeft: "6px solid var(--color-accent-teal-500)",
                  borderTop: "1px solid var(--color-border)",
                  borderRight: "1px solid var(--color-border)",
                  borderBottom: "1px solid var(--color-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <Lightbulb size={24} color="var(--color-accent-teal-500)" />
                  <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-ink-900)" }}>
                    sysTROL's Engineering Solution & Architecture
                  </h2>
                </div>
                <p style={{ fontSize: "var(--text-base)", color: "var(--color-ink-700)", lineHeight: 1.7, marginBottom: "20px" }}>
                  {project.solution}
                </p>

                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ fontSize: "var(--text-xs)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-ink-500)", marginBottom: "8px" }}>
                    Deployed Technologies & Protocols:
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {project.technologies.map((t, idx) => (
                      <Badge key={idx} variant="mono" size="md">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <ProjectGallery
                gallery={project.gallery}
                projectTitle={project.title}
              />

              <div
                style={{
                  padding: "var(--space-8)",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-brand-green-100)",
                  border: "1px solid rgba(31, 122, 77, 0.3)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <CheckCircle2 size={24} color="var(--color-brand-green-700)" />
                  <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-brand-green-800)" }}>
                    Key Verified Outcomes & Plant ROI
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  {project.outcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "12px 16px",
                        backgroundColor: "var(--color-surface-0)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(31, 122, 77, 0.2)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-ink-900)",
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: "var(--color-brand-green-600)", fontWeight: 700 }}>✓</span>
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>

                {project.metrics && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "12px",
                      paddingTop: "16px",
                      borderTop: "1px solid rgba(31, 122, 77, 0.2)",
                    }}
                  >
                    {project.metrics.map((m, idx) => (
                      <div key={idx} style={{ textAlign: "center", backgroundColor: "var(--color-surface-0)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
                        <div style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-brand-green-700)" }}>
                          <CountUp value={m.value} />
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--color-ink-500)", marginTop: "2px" }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {relatedProjects.length > 0 && (
              <div style={{ marginTop: "var(--space-20)", paddingTop: "var(--space-12)", borderTop: "1px solid var(--color-border)" }}>
                <h3 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, marginBottom: "var(--space-6)" }}>
                  Related Industrial Case Studies
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-6)", alignItems: "stretch" }}>
                  {relatedProjects.map((rel) => (
                    <div
                      key={rel.id}
                      style={{
                        padding: "var(--space-6)",
                        backgroundColor: "var(--color-surface-50)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        flex: 1,
                      }}
                    >
                      <Badge variant="accent" size="sm" style={{ marginBottom: "8px", width: "fit-content" }}>
                        {rel.industry}
                      </Badge>
                      <h4 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "8px" }}>
                        <Link href={`/projects/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-700)", marginBottom: "12px", flex: 1 }}>
                        {rel.shortBlurb}
                      </p>
                      <Link
                        href={`/projects/${rel.slug}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color: "var(--color-brand-green-600)",
                          marginTop: "auto",
                        }}
                      >
                        <span>Read Case Study</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
