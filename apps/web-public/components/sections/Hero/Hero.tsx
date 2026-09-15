"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Cpu, Building2, Factory, Truck } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import { HeroCarousel } from "./HeroCarousel";
import { useTypewriter } from "./useTypewriter";
import styles from "./Hero.module.css";

const TYPEWRITER_WORDS = [
  "Process Automation",
  "Industrial Spares",
  "Level-2 Automation",
];

export const Hero: React.FC = () => {
  const [isInView, setIsInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { displayText } = useTypewriter(TYPEWRITER_WORDS, { isActive: isInView });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.hero} aria-label="Hero Section">
      <Container size="wide">
        <div className={styles.heroTop}>
          <Reveal>
            <div className={styles.textContent}>
              <div className={styles.badgeRow}>
                <Badge variant="default" size="sm" icon={<Building2 size={12} />}>
                  Bengaluru, India
                </Badge>
                <Badge variant="accent" size="sm" icon={<Cpu size={12} />}>
                  Level-2 Automation Specialists
                </Badge>
              </div>

              <h1 className={styles.headline}>
                <span className={styles.titleLead}>Engineering Redefined.</span>
                <span className={styles.highlightText}>
                  {displayText}
                  <span className={styles.cursor} aria-hidden="true" />
                </span>
              </h1>

              <div className={styles.subheadlineGroup}>
                <p className={styles.subheadline}>
                  High-performance Level-2 (L2) process automation software engineered in
                  C# for steel rolling mills, coupled with verified international trading
                  of critical mill machinery, sensors, and wear parts.
                  Backed by Python mathematical models for physics-based pass schedule
                  computation, thermal tracking, and real-time tracking and grade calculation.
                </p>
                <p className={styles.subheadline}>
                  Delivering microsecond mill synchronization using message queue protocols, reduced cobble rates, and
                  turnkey commissioning alongside verified global procurement from certified
                  European, Middle-Eastern and Asian manufacturers.
                </p>
              </div>

              <div className={styles.ctaGroup}>
                <Button
                  href="/contact"
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                >
                  Get in Touch
                </Button>
                <Button href="/projects" variant="outline" size="lg">
                  View Case Studies
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <HeroCarousel />
          </Reveal>
        </div>
      </Container>

      <div className={styles.colorSection}>
        <Container size="wide">
          <div className={styles.cardsGrid}>
            <Reveal delay={100}>
              <div className={styles.metricCard}>
                <div className={styles.metricCardHeader}>
                  <div className={styles.metricCardIcon}>
                    <Cpu size={20} />
                  </div>
                  <span className={styles.metricCardTag}>Supervisory</span>
                </div>
                <div className={styles.metricCardValue}>Level-2</div>
                <div className={styles.metricCardLabel}>C# / .NET Automation Core</div>
                <p className={styles.metricCardDesc}>
                  High-performance supervisory services executing real-time pass schedules, roll force calculations, and mill pacing.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className={styles.metricCard}>
                <div className={styles.metricCardHeader}>
                  <div className={styles.metricCardIcon} style={{ backgroundColor: "rgba(31, 122, 77, 0.2)", color: "#34D399" }}>
                    <Factory size={20} />
                  </div>
                  <span className={styles.metricCardTag}>Process Domain</span>
                </div>
                <div className={styles.metricCardValue}>Steel Mills</div>
                <div className={styles.metricCardLabel}>Long, Flat &amp; Pipe Products</div>
                <p className={styles.metricCardDesc}>
                  Specialized engineering for continuous bar mills, high-speed wire rod finishing blocks, and structural tube mills.
                </p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className={styles.metricCard}>
                <div className={styles.metricCardHeader}>
                  <div className={styles.metricCardIcon} style={{ backgroundColor: "rgba(14, 165, 165, 0.2)", color: "#0EA5A5" }}>
                    <Truck size={20} />
                  </div>
                  <span className={styles.metricCardTag}>Global Sourcing</span>
                </div>
                <div className={styles.metricCardValue}>OEM Sourcing</div>
                <div className={styles.metricCardLabel}>Europe &amp; Japan Sparing</div>
                <p className={styles.metricCardDesc}>
                  Direct certified procurement of Tungsten Carbide rolls, high-response hydraulic AGC servos, and optical HMD sensors.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  );
};
