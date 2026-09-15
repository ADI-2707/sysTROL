import React from "react";
import { Factory, Code2, Globe2 } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Reveal } from "@/components/ui/Reveal/Reveal";
import styles from "./WhyUs.module.css";

const valueProps = [
  {
    icon: <Factory size={22} />,
    title: "Rolling Mill Specialists",
    description:
      "Deep domain knowledge in continuous bar, rod, structural, and flat rolling processes. We understand roll kinematics, tension loops, and inter-stand pacing intimately.",
    tag: "Process Domain Mastery",
  },
  {
    icon: <Code2 size={22} />,
    title: "C# & Python Math Models",
    description:
      "High-performance C# services and deterministic Python mathematical models. Rigorous calculation matrices and grade-based calculation rules (pure physics, non-AI/ML) replacing brittle legacy code.",
    tag: "Deterministic Math Matrices",
  },
  {
    icon: <Globe2 size={22} />,
    title: "Domestic & Global Delivery",
    description:
      "Proven on-site and remote execution for Tier-1 integrated steel manufacturers in India, alongside international commissioning across the Middle East.",
    tag: "India & Global Footprint",
  },
  {
    icon: (
      <svg
        className={styles.shieldLockSvg}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path className={styles.shieldCheckmark} d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Turnkey: Code to Sparing",
    description:
      "A unique combined capability: software engineers who calibrate mathematical models and trade OEM-grade mechanical spares with certified metallurgical integrity.",
    tag: "Hardware & Software Synergy",
  },
];

export const WhyUs: React.FC = () => {
  return (
    <section className={styles.section} aria-label="Why sysTROL">
      <Container size="wide">
        <Reveal>
          <SectionHeading
            eyebrow="Why Choose sysTROL"
            eyebrowVariant="accent"
            title={<>Engineering Credibility Built on <span>Field Results</span></>}
            subtitle="We bridge the gap between heavy mechanical process realities and modern high-speed software automation."
            align="left"
          />
        </Reveal>

        <div className={styles.grid}>
          {valueProps.map((prop, idx) => (
            <Reveal key={idx} delay={idx * 80}>
              <div className={styles.card}>
                {idx === 0 && (
                  <svg
                    className={styles.rollMillWatermark}
                    viewBox="0 0 80 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M 4 41 L 76 41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 14 26 L 10 41 M 24 26 L 28 41" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 56 26 L 52 41 M 66 26 L 70 41" stroke="currentColor" strokeWidth="1.5" />
                    <path
                      className={styles.rollingBelt}
                      d="M 19 8 L 61 8 A 8 8 0 0 1 61 24 L 19 24 A 8 8 0 0 1 19 8 Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <g className={styles.rollerLeft}>
                      <circle cx="19" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="19" cy="16" r="2" fill="currentColor" />
                      <path d="M 19 9 v 14 M 12 16 h 14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    </g>
                    <g className={styles.rollerRight}>
                      <circle cx="61" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="61" cy="16" r="2" fill="currentColor" />
                      <path d="M 61 9 v 14 M 54 16 h 14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    </g>
                  </svg>
                )}
                {idx === 1 && (
                  <div className={styles.codeScrollBox}>
                    <div className={styles.monitorScreen}>
                      <div className={styles.codeScrollTrack}>
                        <span>def roll_bite(h0, h1):</span>
                        <span>&nbsp;&nbsp;dh = h0 - h1</span>
                        <span>&nbsp;&nbsp;L = sqrt(R*dh)</span>
                        <span>&nbsp;&nbsp;P = σ*(1+μ*L/4h)</span>
                        <span>&nbsp;&nbsp;return P * width</span>
                        <span>def roll_bite(h0, h1):</span>
                        <span>&nbsp;&nbsp;dh = h0 - h1</span>
                        <span>&nbsp;&nbsp;L = sqrt(R*dh)</span>
                        <span>&nbsp;&nbsp;P = σ*(1+μ*L/4h)</span>
                        <span>&nbsp;&nbsp;return P * width</span>
                      </div>
                    </div>
                    <div className={styles.monitorStand} />
                    <div className={styles.monitorBase} />
                  </div>
                )}
                {idx === 2 && (
                  <svg
                    className={styles.plantLineWatermark}
                    viewBox="0 0 80 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      className={styles.plantLinePath}
                      d="M 4 41 L 18 41 L 18 26 L 26 19 L 26 26 L 34 19 L 34 26 L 42 19 L 42 41 L 49 41 L 49 12 L 62 12 L 62 41 L 67 41 L 69 5 L 75 5 L 77 41 L 79 41"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {idx === 3 && (
                  <svg
                    className={styles.blueprintWatermark}
                    viewBox="0 0 64 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <defs>
                      <pattern id="cadGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
                      </pattern>
                    </defs>
                    <rect x="0.5" y="0.5" width="63" height="43" rx="3" fill="url(#cadGrid)" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                    <path d="M 8 36 h 50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                    <path d="M 12 8 v 28" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
                    <path
                      className={styles.mathCurveLine}
                      d="M 12 34 C 22 34, 32 28, 42 18 C 50 10, 56 8, 60 8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="42" cy="18" r="2" fill="currentColor" />
                    <circle cx="60" cy="8" r="2" fill="currentColor" />
                  </svg>
                )}
                <div
                  className={`${styles.iconBox} ${
                    idx === 0
                      ? styles.iconBoxRollingMill
                      : idx === 1
                      ? styles.iconBoxMathModels
                      : idx === 2
                      ? styles.iconBoxGlobal
                      : idx === 3
                      ? styles.iconBoxTurnkey
                      : ""
                  }`.trim()}
                >
                  {idx === 2 && (
                    <div className={styles.orbitalContainer}>
                      <svg
                        className={styles.orbitalPathSvg}
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M 6 48 C 6 20 26 8 50 14 C 60 18 56 36 42 46 C 28 54 12 54 6 48"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      </svg>
                      <svg
                        className={styles.flightPlane}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                    </div>
                  )}
                  {prop.icon}
                </div>
                <h3 className={styles.title}>{prop.title}</h3>
                <p className={styles.description}>{prop.description}</p>
                <div className={styles.footerTag}>[ {prop.tag} ]</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
