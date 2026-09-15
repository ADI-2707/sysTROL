import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { StatCounter } from "@/components/ui/StatCounter/StatCounter";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { TeamSection } from "@/components/sections/TeamSection/TeamSection";
import { companyStats } from "@/content/clients";
import { Target, Compass, MapPin, ShieldCheck } from "lucide-react";
import styles from "./About.module.css";

export const metadata: Metadata = {
  title: "About Us | sysTROL Engineering & Consultancy",
  description:
    "Learn about sysTROL's founding intent, our leadership in Level-2 rolling mill automation software, and verified global spares trading.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          image="/images/hero-rolling-mill.jpg"
          imageAlt="Steel rolling mill supervisory floor"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Company Overview & Heritage"
              eyebrowVariant="dark"
              theme="dark"
              title="Engineering Redefined: Process Precision & Industrial Reliability"
              subtitle="sysTROL Engineering & Consultancy Pvt. Ltd. was founded on a singular premise: heavy industrial manufacturing requires software automation designed by engineers who respect physical process kinetics."
              align="left"
            />
          </Reveal>
        </PageHero>

        <section className={styles.statsSection}>
          <Container size="wide">
            <div className={styles.statsGrid}>
              {companyStats.map((stat, idx) => (
                <Reveal key={stat.id} delay={idx * 100}>
                  <StatCounter
                    value={stat.value}
                    label={stat.label}
                    suffix={stat.suffix}
                    description={stat.description}
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.facilitySection}>
          <Container size="wide">
            <div className={styles.facilityGrid}>
              <Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <Badge variant="brand" size="md" style={{ width: "fit-content" }}>
                    Engineering Excellence
                  </Badge>
                  <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: 700, color: "var(--color-brand-sys-navy)", lineHeight: "var(--leading-tight)" }}>
                    Purpose-Built Simulation & <span style={{ color: "var(--color-brand-green-600)" }}>Automation Testing Labs</span>
                  </h2>
                  <p style={{ fontSize: "var(--text-base)", color: "var(--color-ink-700)", lineHeight: "var(--leading-relaxed)" }}>
                    Before any Level-2 code touches live hot metal, our mathematical models undergo rigorous hardware-in-the-loop (HIL) simulation at our Bengaluru technical center. Stand-by-stand speed cascades, hydraulic AGC null adjustments, and OPC UA/DA telemetry gateways are tested against simulated high-tonnage rolling environments.
                  </p>
                  <p style={{ fontSize: "var(--text-base)", color: "var(--color-ink-700)", lineHeight: "var(--leading-relaxed)" }}>
                    Our engineers replicate plant-specific roll bite geometry, motor drive dynamics, and thermal rundown curves across multi-stand configurations, validating every pass schedule under extreme friction and tension anomalies.
                  </p>

                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className={styles.facilityImageContainer}>
                  <Image
                    src="/images/about/engineering-facility.jpg"
                    alt="sysTROL engineers testing rolling mill digital twin in automation lab"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={styles.facilityImage}
                  />
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <section className={styles.storySection}>
          <Container size="wide">
            <div className={styles.storyGrid}>
              <Reveal>
                <div className={styles.storyContent}>
                  <Badge variant="brand" size="md" style={{ width: "fit-content" }}>
                    Our Founding Story
                  </Badge>
                  <h3 style={{ fontSize: "var(--text-3xl)", color: "var(--color-brand-sys-navy)" }}>
                    Bridging Heavy Metallurgy with <span style={{ color: "var(--color-brand-green-600)" }}>Deterministic Modern Software</span>
                  </h3>
                  <p>
                    In continuous steel rolling mills and heavy process plants, seconds of
                    inter-stand tension mismatch or miscalculated pass schedules lead to
                    catastrophic cobbles, damaged roll chocks, and hours of costly downtime. For
                    decades, mills were held hostage by proprietary, opaque Level-2 software
                    systems that could not be modified or integrated with modern plant analytics.
                  </p>
                  <p>
                    Headquartered in <strong>Bengaluru, Karnataka</strong>, sysTROL was established
                    to shatter this black-box paradigm. We build modular, transparent, and
                    high-speed Level-2 supervisory systems natively in <strong>C# / .NET</strong>.
                    Our models calculate roll bite geometry, temperature rundown, and speed
                    cascades with microsecond determinism, interfacing cleanly with Level-1 PLCs
                    from Siemens, ABB, and Rockwell.
                  </p>
                  <p>
                    Recognizing that software cannot run without precision mechanics, sysTROL
                    developed a dedicated <strong>Machinery & Spares Trading</strong> division.
                    When mill operators require emergency replacement of matched high-frequency
                    hydraulic AGC servo valves, tungsten carbide composite rings, or fiber-optic
                    sensors, we source certified OEM components from Europe and Japan with
                    verified EN 10204 3.1 inspection documentation.
                  </p>

                  <div
                    style={{
                      marginTop: "var(--space-4)",
                      padding: "var(--space-4)",
                      backgroundColor: "var(--color-surface-100)",
                      borderRadius: "var(--radius-md)",
                      borderLeft: "4px solid var(--color-brand-green-600)",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "var(--color-brand-sys-navy)" }}>
                      Corporate Leadership Philosophy
                    </div>
                    <p style={{ fontSize: "var(--text-sm)", marginTop: "4px" }}>
                      "We do not consider a project complete when code is compiled. We sign off
                      only when hot metal has cleared the cooling bed, dimensional tolerances meet
                      ASTM standards, and the plant engineers hold full operational confidence."
                    </p>
                  </div>
                </div>
              </Reveal>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", height: "100%" }}>
                <Reveal delay={150}>
                  <div className={styles.missionCard}>
                    <div className={styles.missionItem}>
                      <div className={styles.missionIcon}>
                        <Target size={22} />
                      </div>
                      <div>
                        <div className={styles.missionTitle}>Our Mission</div>
                        <div className={styles.missionText}>
                          To elevate industrial process automation by delivering transparent,
                          math-modeled Level-2 supervisory software that slashes cobble rates and
                          maximizes continuous rolling mill yield.
                        </div>
                      </div>
                    </div>

                    <div className={styles.missionItem}>
                      <div className={styles.missionIcon} style={{ backgroundColor: "var(--color-accent-teal-100)", color: "var(--color-accent-teal-600)" }}>
                        <Compass size={22} />
                      </div>
                      <div>
                        <div className={styles.missionTitle}>Engineering Values</div>
                        <div className={styles.missionText}>
                          Zero black-box obscurity, deterministic real-time execution, verified
                          metallurgical compatibility, and direct engineering-to-engineer
                          collaboration.
                        </div>
                      </div>
                    </div>

                    <div className={styles.missionItem}>
                      <div className={styles.missionIcon} style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}>
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <div className={styles.missionTitle}>Quality Assurance</div>
                        <div className={styles.missionText}>
                          100% factory acceptance testing (FAT) using simulated mill inputs prior
                          to site deployment, backed by EN 10204 3.1 material test certificates on
                          all imported tooling.
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Reveal delay={250}>
                    <div className={styles.locationCard} style={{ height: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <MapPin size={18} color="var(--color-accent-teal-500)" />
                        <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          Strategic Hub: Bengaluru
                        </span>
                      </div>
                      <h4 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "8px" }}>
                        Technology Capital of India
                      </h4>
                      <p style={{ fontSize: "var(--text-sm)", color: "#CBD5E1", lineHeight: 1.6 }}>
                        Operating from Bengaluru provides sysTROL with unmatched software talent,
                        low-latency cloud infrastructure, and central logistics connectivity to
                        steel manufacturing corridors across eastern, western, and southern India.
                      </p>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <TeamSection />

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
