import React from "react";
import { Globe2, ShieldCheck, CheckCircle2, Plane } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { GlobalNetworkCarousel } from "./GlobalNetworkCarousel";
import styles from "./GlobalNetwork.module.css";

export const GlobalNetwork: React.FC = () => {
  return (
    <section className={styles.section} aria-label="Global Industrial Network">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="International Operations & Sourcing"
            eyebrowVariant="brand"
            title={<>Global Sourcing Corridors & <span>Quality Assurance</span></>}
            subtitle="Direct OEM procurement partnerships across Europe and Japan delivering certified mill spares, backed by full-lifecycle domestic engineering commissioning."
            align="center"
          />
        </Reveal>

        <div className={styles.cardsGrid}>
          <Reveal delay={100}>
            <div className={styles.networkCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>
                  <Globe2 size={22} />
                </div>
                <Badge variant="accent" size="sm">
                  DE • IT • SE • JP → IN • GCC
                </Badge>
              </div>
              <h3 className={styles.cardTitle}>Direct OEM Sourcing Corridors</h3>
              <p className={styles.cardDesc}>
                Direct manufacturer procurement of Tungsten Carbide composite roll rings, high-response hydraulic AGC servo valves, and optical hot metal sensors directly from Germany, Italy, Sweden, and Japan.
              </p>
              <div className={styles.cardFooter}>
                <span>Established OEM Channels</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className={styles.networkCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${styles.iconBoxTeal}`}>
                  <ShieldCheck size={22} />
                </div>
                <Badge variant="brand" size="sm">
                  EN 10204 3.1 Certified
                </Badge>
              </div>
              <h3 className={styles.cardTitle}>Material & Model Verification</h3>
              <p className={styles.cardDesc}>
                100% metallurgical inspection test certificates guaranteeing chemical composition, hardness, and ultrasonic integrity, backed by factory acceptance testing (FAT) on all supervisory models.
              </p>
              <div className={styles.cardFooter}>
                <span>EN 10204 3.1 • Zero Defect Standard</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className={styles.networkCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconBox} ${styles.iconBoxBlue}`}>
                  <CheckCircle2 size={22} />
                </div>
                <Badge variant="mono" size="sm">
                  50+ Mill Installations
                </Badge>
              </div>
              <h3 className={styles.cardTitle}>Plant Engineering Track Record</h3>
              <p className={styles.cardDesc}>
                Demonstrated delivery of high-speed Level-2 supervisory algorithms, pass scheduling models, and critical spares to Tier-1 integrated steel manufacturers and rebar/wire rod plants across 3 continents.
              </p>
              <div className={styles.cardFooter}>
                <span>Proven Process Kinematics</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={350}>
          <div className={styles.corridorBanner}>
            <GlobalNetworkCarousel />

            <div className={styles.corridorTitle}>
              <Plane size={18} color="var(--color-brand-green-600)" />
              <span>International Bonded Supply Chain & Engineering Pipeline</span>
            </div>
            <div className={styles.corridorFlow}>
              <div className={styles.flowBox}>
                <span className={styles.flowLabel}>Sourcing Origins</span>
                <span className={styles.flowValue}>Germany • Italy • Sweden • Japan</span>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowBox}>
                <span className={styles.flowLabel}>Logistics Route</span>
                <span className={styles.flowValue}>Bonded Air & Sea Corridors</span>
              </div>
              <div className={styles.flowArrow}>→</div>
              <div className={styles.flowBox}>
                <span className={styles.flowLabel}>Engineering & Commissioning Hub</span>
                <span className={styles.flowValue}>Bengaluru HQ → India & GCC Mill Corridors</span>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
