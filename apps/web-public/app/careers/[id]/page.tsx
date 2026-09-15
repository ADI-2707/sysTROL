import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { vacanciesData, getVacancyById } from "@/content/careers";
import { JobApplicationForm } from "./JobApplicationForm";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Mail,
  Send,
  ChevronRight,
  Sparkles,
  Layers,
} from "lucide-react";
import styles from "./JobDetails.module.css";

export async function generateStaticParams() {
  return vacanciesData.map((vacancy) => ({
    id: vacancy.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const vacancy = getVacancyById(id);
  if (!vacancy) return { title: "Position Not Found" };

  return {
    title: `${vacancy.title} | Careers | sysTROL Industrial Automation`,
    description: vacancy.description,
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vacancy = getVacancyById(id);

  if (!vacancy) {
    notFound();
  }

  const otherVacancies = vacanciesData
    .filter((v) => v.id !== vacancy.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <section className={styles.heroSection}>
          <Container size="wide">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "var(--space-4)" }}>
              <Link href="/careers" className={styles.backLink}>
                <ArrowLeft size={14} />
                <span>Back to All Openings</span>
              </Link>

              <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                <Link href="/" className={styles.breadcrumbLink}>
                  Home
                </Link>
                <ChevronRight size={12} />
                <Link href="/careers" className={styles.breadcrumbLink}>
                  Careers
                </Link>
                <ChevronRight size={12} />
                <span className={styles.breadcrumbCurrent}>{vacancy.title}</span>
              </nav>
            </div>

            <div className={styles.badgesRow}>
              <Badge variant="brand" size="md">
                {vacancy.department}
              </Badge>
              <Badge variant="default" size="md">
                {vacancy.type}
              </Badge>
              <Badge variant="dark" size="md">
                {vacancy.location}
              </Badge>
            </div>

            <h1 className={styles.jobTitle}>{vacancy.title}</h1>

            <p className={styles.heroDesc}>{vacancy.description}</p>

            <div className={styles.specsRibbon}>
              <div className={styles.specItem}>
                <div className={styles.specIconWrapper}>
                  <Briefcase size={18} />
                </div>
                <div>
                  <div className={styles.specLabel}>Department</div>
                  <div className={styles.specValue}>{vacancy.department}</div>
                </div>
              </div>

              <div className={styles.specItem}>
                <div className={styles.specIconWrapper}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div className={styles.specLabel}>Location</div>
                  <div className={styles.specValue}>{vacancy.location}</div>
                </div>
              </div>

              <div className={styles.specItem}>
                <div className={styles.specIconWrapper}>
                  <Clock size={18} />
                </div>
                <div>
                  <div className={styles.specLabel}>Employment Type</div>
                  <div className={styles.specValue}>{vacancy.type}</div>
                </div>
              </div>

              <div className={styles.specItem}>
                <div className={styles.specIconWrapper}>
                  <Award size={18} />
                </div>
                <div>
                  <div className={styles.specLabel}>Experience</div>
                  <div className={styles.specValue}>{vacancy.experience}</div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className={styles.mainSection}>
          <Container size="wide">
            <div className={styles.layoutGrid}>
              <div className={styles.contentCol}>
                <article className={styles.contentCard}>
                  <h2 className={styles.cardHeading}>
                    <Sparkles size={20} color="var(--color-brand-green-600)" />
                    <span>About This Position</span>
                  </h2>
                  <p style={{ fontSize: "var(--text-base)", color: "var(--color-ink-700)", lineHeight: 1.7 }}>
                    {vacancy.description}
                  </p>
                </article>

                <article className={styles.contentCard}>
                  <h2 className={styles.cardHeading}>
                    <CheckCircle2 size={20} color="var(--color-brand-green-600)" />
                    <span>Core Responsibilities</span>
                  </h2>
                  <ul className={styles.checkList}>
                    {vacancy.responsibilities.map((resp, idx) => (
                      <li key={idx} className={styles.checkItem}>
                        <CheckCircle2 size={16} className={styles.checkIcon} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className={styles.contentCard}>
                  <h2 className={styles.cardHeading}>
                    <Award size={20} color="var(--color-brand-green-600)" />
                    <span>Required Qualifications</span>
                  </h2>
                  <ul className={styles.checkList}>
                    {vacancy.requirements.map((req, idx) => (
                      <li key={idx} className={styles.checkItem}>
                        <CheckCircle2 size={16} className={styles.checkIcon} />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className={styles.contentCard}>
                  <h2 className={styles.cardHeading}>
                    <Layers size={20} color="var(--color-brand-green-600)" />
                    <span>Technical Skills & Protocols</span>
                  </h2>
                  <div className={styles.skillsCluster}>
                    {vacancy.skills.map((skill, idx) => (
                      <Badge key={idx} variant="mono" size="md">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </article>

                <div className={styles.cultureCard}>
                  <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, color: "var(--color-ink-900)", marginBottom: "8px" }}>
                    Engineering Reality at sysTROL
                  </h3>
                  <p className={styles.cultureText}>
                    sysTROL engineers build systems that operate at the physical boundary of heavy industrial rolling mills. You will write deterministic software that orchestrates mill speed cascades, hydraulic roll gaps, and continuous billet tracking. Expect direct collaboration with metallurgical plant heads and deployment on high-throughput continuous mills.
                  </p>
                </div>

                <div className={styles.applicationCard} id="apply-section">
                  <h2 className={styles.applicationHeading}>Apply for this Role</h2>
                  <p className={styles.applicationSub}>
                    Submit your application for <strong>{vacancy.title}</strong> directly to our engineering leadership team.
                  </p>
                  <JobApplicationForm vacancy={vacancy} />
                </div>
              </div>

              <aside className={styles.sidebarCol}>
                <div className={styles.sidebarCard}>
                  <h3 className={styles.sidebarTitle}>Position Overview</h3>
                  <div className={styles.sidebarSpecsList}>
                    <div className={styles.sidebarSpecItem}>
                      <span className={styles.sidebarSpecKey}>Role Title</span>
                      <span className={styles.sidebarSpecVal}>{vacancy.title}</span>
                    </div>
                    <div className={styles.sidebarSpecItem}>
                      <span className={styles.sidebarSpecKey}>Department</span>
                      <span className={styles.sidebarSpecVal}>{vacancy.department}</span>
                    </div>
                    <div className={styles.sidebarSpecItem}>
                      <span className={styles.sidebarSpecKey}>Location</span>
                      <span className={styles.sidebarSpecVal}>{vacancy.location}</span>
                    </div>
                    <div className={styles.sidebarSpecItem}>
                      <span className={styles.sidebarSpecKey}>Employment Type</span>
                      <span className={styles.sidebarSpecVal}>{vacancy.type}</span>
                    </div>
                    <div className={styles.sidebarSpecItem}>
                      <span className={styles.sidebarSpecKey}>Experience Level</span>
                      <span className={styles.sidebarSpecVal}>{vacancy.experience}</span>
                    </div>
                  </div>

                  <div className={styles.sidebarActions}>
                    <Button
                      variant="primary"
                      size="md"
                      href="#apply-section"
                      leftIcon={<Send size={15} />}
                    >
                      Apply Online
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      href={`mailto:careers@sys-trol.com?subject=Application%20for%20${encodeURIComponent(
                        vacancy.title
                      )}%20[${vacancy.id}]`}
                      leftIcon={<Mail size={15} />}
                    >
                      Apply via Email
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {otherVacancies.length > 0 && (
          <section className={styles.otherRolesSection}>
            <Container size="wide">
              <h2 className={styles.otherRolesHeading}>Explore Other Openings</h2>
              <div className={styles.otherRolesGrid}>
                {otherVacancies.map((other) => (
                  <Link
                    key={other.id}
                    href={`/careers/${other.id}`}
                    className={styles.otherRoleCard}
                  >
                    <div>
                      <div className={styles.otherRoleDept}>{other.department}</div>
                      <h3 className={styles.otherRoleTitle}>{other.title}</h3>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                        <Badge variant="default" size="sm">
                          {other.type}
                        </Badge>
                        <Badge variant="dark" size="sm">
                          {other.location}
                        </Badge>
                      </div>
                    </div>
                    <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
                      <span className={styles.otherRoleAction}>
                        <span>View Role Details</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
