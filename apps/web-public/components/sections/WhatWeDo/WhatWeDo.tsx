import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Cpu, Truck, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./WhatWeDo.module.css";

export const WhatWeDo: React.FC = () => {
  return (
    <section className={styles.section} aria-label="Business Lines">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="Two Synergistic Divisions"
            eyebrowVariant="brand"
            title={<>Engineered Solutions for <span>Steel & Process Plants</span></>}
            subtitle="Combining high-level software engineering with verified international hardware sourcing to eliminate plant downtime and maximize rolling mill yield."
            align="center"
          />
        </Reveal>

        <div className={styles.grid}>
          <Reveal delay={100}>
            <div className={`${styles.card} ${styles.cardGreen}`}>
              <div className={styles.cardImageContainer}>
                <Image
                  src="/images/automation-control-room.jpg"
                  alt="Supervisory control room and mill pulpit automation"
                  fill
                  sizes="(max-width: 900px) 100vw, 600px"
                  className={styles.cardImage}
                />
                <div className={styles.cardImageOverlay} />
                <span className={styles.cardImageTag}>PULPIT TELEMETRY & L2 CONTROL</span>
              </div>

              <div className={styles.cardHeaderRow}>
                <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
                  <Cpu size={26} />
                </div>
                <Badge variant="brand" size="sm">
                  Division 01 • Engineering & Consultancy
                </Badge>
              </div>

              <h3 className={styles.cardTitle}>Level-2 Automation & Python Math Models</h3>

              <p className={styles.cardDescription}>
                High-performance supervisory Level-2 software in C# coupled with deterministic Python
                mathematical models (calculation matrices and grade-based calculation rules, not AI/ML).
                We implement real-time pass schedule algorithms, billet tracking, thermal pacing, and
                Level-1 PLC to enterprise MES integration.
              </p>

              <div className={styles.tagList}>
                <Badge variant="mono" size="sm">C# / .NET Core</Badge>
                <Badge variant="mono" size="sm">Python Math Models</Badge>
                <Badge variant="mono" size="sm">Grade Calculation Matrix</Badge>
                <Badge variant="mono" size="sm">Roll Force Modeling</Badge>
                <Badge variant="mono" size="sm">OPC UA / Siemens / ABB</Badge>
                <Badge variant="mono" size="sm">Billet Pacing</Badge>
              </div>

              <div className={styles.cardFooter}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-500)" }}>
                  End-to-End: Audit → Model → Commission
                </span>
                <Link
                  href="/services/automation-consultancy"
                  className={styles.learnMoreLink}
                >
                  <span>Explore Automation</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className={`${styles.card} ${styles.cardTeal}`}>
              <div className={styles.cardImageContainer}>
                <Image
                  src="/images/tungsten-carbide-rolls.jpg"
                  alt="Precision tungsten carbide roll tooling and mill spares"
                  fill
                  sizes="(max-width: 900px) 100vw, 600px"
                  className={styles.cardImage}
                />
                <div className={styles.cardImageOverlay} />
                <span className={styles.cardImageTag}>TC ROLLS & CRITICAL OEM SPARING</span>
              </div>

              <div className={styles.cardHeaderRow}>
                <div className={`${styles.iconWrapper} ${styles.iconTeal}`}>
                  <Truck size={26} />
                </div>
                <Badge variant="accent" size="sm">
                  Division 02 • Global Procurement & Supply
                </Badge>
              </div>

              <h3 className={styles.cardTitle}>Imported Machinery, Spares & Consumables</h3>

              <p className={styles.cardDescription}>
                Strategic global sourcing and supply of OEM-certified rolling mill components,
                Tungsten Carbide roll rings, high-response hydraulic AGC servo valves, optical
                hot metal detectors, and specialized consumables directly from leading manufacturers
                in Europe, North America, and Japan.
              </p>

              <div className={styles.tagList}>
                <Badge variant="mono" size="sm">TC Roll Rings</Badge>
                <Badge variant="mono" size="sm">Hydraulic Servo Valves</Badge>
                <Badge variant="mono" size="sm">Optical HMD Sensors</Badge>
                <Badge variant="mono" size="sm">EN 10204 3.1 Certified</Badge>
                <Badge variant="mono" size="sm">Consignment Inventory</Badge>
              </div>

              <div className={styles.cardFooter}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-ink-500)" }}>
                  Verified OEM Direct Supply Lines
                </span>
                <Link
                  href="/services/trading"
                  className={styles.learnMoreLink}
                  style={{ color: "var(--color-accent-teal-600)" }}
                >
                  <span>Explore Trading</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
};
