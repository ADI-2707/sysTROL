import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { CountUp } from "@/components/ui/CountUp/CountUp";
import { projectsData } from "@/content/projects";
import styles from "./FeaturedProjects.module.css";

const projectImages = [
  "/images/hero-rolling-mill.jpg",
  "/images/automation-control-room.jpg",
  "/images/tungsten-carbide-rolls.jpg",
];

export const FeaturedProjects: React.FC = () => {
  const featured = projectsData.filter((p) => p.featured).slice(0, 3);

  return (
    <section className={styles.section} aria-label="Featured Projects">
      <Container size="wide">
        <Reveal>
          <div className={styles.topBar}>
            <SectionHeading
              eyebrow="Case Studies & Track Record"
              eyebrowVariant="brand"
              title={<>Recent Industrial <span>Implementations</span></>}
              subtitle="Representative project summaries demonstrating Level-2 model accuracy, mill speed synchronization, and rapid spare parts turnaround."
              align="left"
              style={{ marginBottom: 0 }}
            />
            <Button href="/projects" variant="secondary" size="md" rightIcon={<ArrowRight size={16} />}>
              View All Projects
            </Button>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {featured.map((project, idx) => (
            <Reveal key={project.id} delay={idx * 100}>
              <div className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={projectImages[idx % projectImages.length]}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                    className={styles.image}
                  />
                  <div className={styles.imageOverlay} />
                  <div className={styles.floatingBadge}>
                    <Badge variant="accent" size="sm">
                      {project.industry}
                    </Badge>
                  </div>
                </div>

                <div className={styles.cardHeader}>
                  <span className={styles.clientRepresentative}>
                    {project.location} • {project.year}
                  </span>
                </div>

                <h3 className={styles.title}>
                  <Link href={`/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </h3>

                <p className={styles.blurb}>{project.shortBlurb}</p>

                {project.metrics && project.metrics.length > 0 && (
                  <div className={styles.metricsBox}>
                    {project.metrics.slice(0, 2).map((m, mIdx) => (
                      <div key={mIdx}>
                        <div className={styles.metricValue}><CountUp value={m.value} /></div>
                        <div className={styles.metricLabel}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.tagRow}>
                  {project.technologies.slice(0, 3).map((tech, tIdx) => (
                    <Badge key={tIdx} variant="mono" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <span style={{ fontSize: "11px", color: "var(--color-ink-500)", fontFamily: "var(--font-mono)" }}>
                    {project.serviceType}
                  </span>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={styles.viewDetailsLink}
                  >
                    <span>Read Case Study</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
