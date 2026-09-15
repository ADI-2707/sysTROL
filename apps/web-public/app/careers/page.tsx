import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact/FloatingContact";
import { Container } from "@/components/layout/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Button } from "@/components/ui/Button/Button";
import { PageHero } from "@/components/sections/PageHero/PageHero";
import { CTASection } from "@/components/sections/CTASection/CTASection";
import { CareerPortal } from "@/components/sections/Careers/CareerPortal";
import {
  Cpu,
  Globe2,
  Layers,
  Award,
  ChevronRight,
  Mail,
  Send,
} from "lucide-react";
import { CountUp } from "@/components/ui/CountUp/CountUp";
import styles from "./Careers.module.css";

export const metadata: Metadata = {
  title: "Engineering Careers | sysTROL Industrial Automation & Machinery",
  description:
    "Explore engineering opportunities in Level-2 automation software (C# / .NET), rolling mill commissioning, and international machinery procurement at sysTROL Bengaluru.",
};

const PERKS = [
  {
    icon: <Cpu size={24} />,
    title: "High-Impact Engineering",
    desc: "Write deterministic software that directly drives megawatts of rolling mill motors, hydraulic AGC, and real physical steel plants.",
  },
  {
    icon: <Globe2 size={24} />,
    title: "Global Site Commissioning",
    desc: "Deploy solutions directly at high-tonnage steel mills across India, UAE, Oman, and international metallurgical hubs.",
  },
  {
    icon: <Layers size={24} />,
    title: "Advanced Industrial Stack",
    desc: "Deep exposure to modern C# .NET 8 microservices, high-speed OPC UA telemetry, Siemens/ABB Level-1 PLCs, and mathematical mill modeling.",
  },
  {
    icon: <Award size={24} />,
    title: "Comprehensive Benefits",
    desc: "Competitive industrial compensation, project delivery bonuses, international travel per diems, and full medical coverage.",
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          image="/images/automation-control-room.jpg"
          imageAlt="Engineers at the automation control room"
        >
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>
              Home
            </Link>
            <ChevronRight size={12} />
            <span className={styles.breadcrumbCurrent}>Careers</span>
          </nav>

          <SectionHeading
            eyebrow="Join Our Core Engineering Team"
            eyebrowVariant="dark"
            theme="dark"
            title="Build the Brains Behind Modern Industrial Steel Mills"
            subtitle="At sysTROL, our engineers solve complex physical problems in high-speed bar, section, and wire rod rolling mills. We write deterministic C# software that orchestrates mill speed cascades, hydraulic roll gaps, and continuous billet tracking."
            align="left"
          />
        </PageHero>

        <section className={styles.statsStrip}>
          <Container size="wide">
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  <CountUp value="5+" />
                </span>
                <span className={styles.statLabel}>Global Deployment Hubs</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  <CountUp value="100%" />
                </span>
                <span className={styles.statLabel}>Physical Plant Impact</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  <CountUp value=".NET 8" />
                </span>
                <span className={styles.statLabel}>Modern Industrial Stack</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  <CountUp value="6" />
                </span>
                <span className={styles.statLabel}>Active Vacancies</span>
              </div>
            </div>
          </Container>
        </section>

        <section className={styles.perksSection}>
          <Container size="wide">
            <SectionHeading
              eyebrow="Why sysTROL"
              title={<>Where Code Meets <span>Heavy Industrial Reality</span></>}
              subtitle="We blend real-time software elegance with heavy metallurgical engineering. You will collaborate directly with plant chief engineers and automation architects."
              align="center"
            />

            <div className={styles.perksGrid}>
              {PERKS.map((perk, idx) => (
                <div key={idx} className={styles.perkCard}>
                  <div className={styles.perkIconWrapper}>{perk.icon}</div>
                  <h3 className={styles.perkTitle}>{perk.title}</h3>
                  <p className={styles.perkDesc}>{perk.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className={styles.vacanciesSection} id="openings">
          <Container size="wide">
            <div className={styles.sectionHeadingWrapper}>
              <SectionHeading
                eyebrow="Open Vacancies"
                title={<>Current Career <span>Opportunities</span></>}
                subtitle="Explore current full-time openings at our Bengaluru headquarters and on-site commissioning engineering teams."
                align="left"
              />
            </div>

            <CareerPortal />

            <div className={styles.talentPoolCard}>
              <div className={styles.talentPoolText}>
                <h3 className={styles.talentPoolTitle}>
                  Don't see your specific specialization?
                </h3>
                <p className={styles.talentPoolSubtitle}>
                  We are always on the lookout for exceptional engineers in rolling mill design, PLC drive automation, C# development, and international technical trading.
                </p>
              </div>
              <div className={styles.talentPoolActions}>
                <Button
                  variant="teal"
                  size="md"
                  href="mailto:careers@sys-trol.com?subject=Spontaneous%20Application%20-%20sysTROL%20Talent%20Pool"
                  leftIcon={<Mail size={16} />}
                >
                  Send Open Application
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <CTASection />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
