"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  Factory,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { CountUp } from "@/components/ui/CountUp/CountUp";
import styles from "./HeroCarousel.module.css";

interface SlideData {
  id: string;
  tag: string;
  title: string;
  badgeText: string;
  badgeVariant: "accent" | "brand" | "mono" | "default";
  image: string;
  imageAlt: string;
  imageTag: string;
  statValue: string;
  statTitle: string;
  statSubtitle: string;
  proofPoints: string[];
  footerLocation: string;
  footerStandard: string;
}

const slides: SlideData[] = [
  {
    id: "slide-1",
    tag: "SUPERVISORY AUTOMATION & SOURCING",
    title: "Continuous Mill Performance",
    badgeText: "ONLINE / OPERATIONAL",
    badgeVariant: "accent",
    image: "/images/hero-rolling-mill.jpg",
    imageAlt: "Continuous steel rolling mill supervisory operation",
    imageTag: "SUPERVISORY MILL PACING & AUTOMATION",
    statValue: "50+",
    statTitle: "Rolling Mill Installations",
    statSubtitle: "Commissioned Level-2 automation suites & critical revamps across 3 continents.",
    proofPoints: [
      "Deterministic C# & Python calculation matrices, pass scheduling & thermal pacing",
      "EN 10204 3.1 material test certified imported mill tooling & spares",
      "Full-lifecycle commissioning from FAT simulation to live hot metal roll",
    ],
    footerLocation: "Engineering Center: Bengaluru, India",
    footerStandard: "ISO Standards Compliant",
  },
  {
    id: "slide-2",
    tag: "SUPERVISORY AUTOMATION & SOURCING",
    title: "Real-Time Mill Visualization",
    badgeText: "HIGH AVAILABILITY",
    badgeVariant: "brand",
    image: "/images/automation-control-room.jpg",
    imageAlt: "Supervisory pulpit telemetry and control room operations",
    imageTag: "OPERATOR PULPIT & L2 TELEMETRY",
    statValue: "38%",
    statTitle: "Cobble Rate Reduction",
    statSubtitle: "Microsecond PLC synchronization with C# and Python grade calculation rules (physics-based, non-AI).",
    proofPoints: [
      "OPC UA gateway interface for Siemens S7-400 / S7-1500 & ABB systems",
      "Automated roll wear tracking & dynamic inter-stand tension control",
      "Zero-downtime shadow commissioning executed during maintenance windows",
    ],
    footerLocation: "OPC UA & Ethernet Architecture",
    footerStandard: "Deterministic Mill Timing",
  },
  {
    id: "slide-3",
    tag: "SUPERVISORY AUTOMATION & SOURCING",
    title: "Direct Sourcing Corridors",
    badgeText: "EN 10204 3.1 CERTIFIED",
    badgeVariant: "accent",
    image: "/images/tungsten-carbide-rolls.jpg",
    imageAlt: "Precision tungsten carbide roll tooling and mill spares",
    imageTag: "OEM HARDWARE & ROLL RING SPARING",
    statValue: "100%",
    statTitle: "Quality & Material Certified",
    statSubtitle: "Direct manufacturer procurement from Germany, Italy, Sweden, and Japan.",
    proofPoints: [
      "Tungsten Carbide composite roll rings & high-speed finishing tooling",
      "Ultrasonic defect inspection and chemical composition guarantee with grade maintainance",
      "Consignment inventory & emergency buffer stocking in India backed by trusting logistics",
    ],
    footerLocation: "DE • IT • SE • JP Sourcing Pipeline",
    footerStandard: "Batch Verified Metallurgy",
  },
  {
    id: "slide-4",
    tag: "SUPERVISORY AUTOMATION & SOURCING",
    title: "Secured Procurement Channels",
    badgeText: "BONDED CORRIDOR",
    badgeVariant: "mono",
    image: "/images/global-logistics-freight.jpg",
    imageAlt: "International industrial freight and bonded logistics corridors",
    imageTag: "BONDED GLOBAL LOGISTICS",
    statValue: "4",
    statTitle: "Global Sourcing Corridors",
    statSubtitle: "Consignment inventory & rapid-dispatch air freight pipelines.",
    proofPoints: [
      "Express customs clearance through bonded logistics partnerships",
      "Batch metallurgical verification before plant dispatch",
      "Direct delivery into Indian & Middle Eastern steel rolling plants",
    ],
    footerLocation: "Multimodal Air & Sea Supply Chain",
    footerStandard: "Secured Chain of Custody",
  },
  {
    id: "slide-5",
    tag: "SUPERVISORY AUTOMATION & SOURCING",
    title: "Mill Gap & Gauge Precision",
    badgeText: "HIGH-RESPONSE SERVO",
    badgeVariant: "accent",
    image: "/images/hydraulic-agc-system.jpg",
    imageAlt: "Hydraulic automatic gauge control and servo valve testing",
    imageTag: "HYDRAULIC AGC & SERVO VALVES",
    statValue: "±0.5%",
    statTitle: "Cross-Sectional Tolerance",
    statSubtitle: "High-frequency servo-hydraulic gauge control and digital roll gap positioning.",
    proofPoints: [
      "High-response servo valve sourcing (Moog, Bosch Rexroth) with bench testing",
      "Mill stand stiffness matrix compensation for automatic roll eccentricity control",
      "5ms high-speed closed-loop feedback integration with Level-1 PLC drives",
    ],
    footerLocation: "Calibrated Test Rig Compliance",
    footerStandard: "5ms Closed-Loop Control",
  },
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setPreviousIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAnimating(true);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setPreviousIndex(null);
    }, 550);
  }, [currentIndex, isAnimating]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    setPreviousIndex(currentIndex);
    setCurrentIndex(index);
    setIsAnimating(true);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setPreviousIndex(null);
    }, 550);
  }, [currentIndex, isAnimating]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      goToNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  const activeSlide = slides[currentIndex];

  const getSlideClass = (index: number) => {
    if (index === currentIndex) {
      return `${styles.slide} ${styles.slideActive}`;
    }
    if (index === previousIndex && isAnimating) {
      return `${styles.slide} ${styles.slideExitLeft}`;
    }
    return `${styles.slide} ${styles.slideHiddenRight}`;
  };

  return (
    <div
      className={styles.carouselCard}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Supervisory Automation and Sourcing Carousel"
    >
      <div className={styles.carouselHeader}>
        <div>
          <span className={styles.headerCategory}>
            {activeSlide.tag}
          </span>
          <h3 className={styles.headerTitle}>
            {activeSlide.title}
          </h3>
        </div>

        <div className={styles.headerControls}>
          <Badge variant={activeSlide.badgeVariant} size="sm">
            {activeSlide.badgeText}
          </Badge>

          <div className={styles.dotsRow}>
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`${styles.dotButton} ${idx === currentIndex ? styles.dotButtonActive : ""
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.viewportTrack}>
        {slides.map((slide, idx) => (
          <div key={slide.id} className={getSlideClass(idx)}>
            <div className={styles.imageWrap}>
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className={styles.image}
                priority={idx === 0}
              />
              <div className={styles.imageOverlay} />
              <div className={styles.imageTag}>
                <span>{slide.imageTag}</span>
              </div>
            </div>

            <div className={styles.statHighlightBox}>
              <span className={styles.statBigNumber}>
                <CountUp key={`${slide.id}-${slide.statValue}`} value={slide.statValue} />
              </span>
              <div className={styles.statBigDetails}>
                <span className={styles.statBigTitle}>{slide.statTitle}</span>
                <span className={styles.statBigSubtitle}>
                  {slide.statSubtitle}
                </span>
              </div>
            </div>

            <ul className={styles.proofList}>
              <li className={styles.proofItem}>
                <div className={styles.proofIcon}>
                  <CheckCircle2 size={14} />
                </div>
                <span>{slide.proofPoints[0]}</span>
              </li>
              <li className={styles.proofItem}>
                <div className={styles.proofIcon}>
                  <ShieldCheck size={14} />
                </div>
                <span>{slide.proofPoints[1]}</span>
              </li>
              <li className={styles.proofItem}>
                <div className={styles.proofIcon}>
                  <Factory size={14} />
                </div>
                <span>{slide.proofPoints[2]}</span>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.carouselFooter}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MapPin size={13} color="var(--color-accent-teal-500)" />
          <span>{activeSlide.footerLocation}</span>
        </div>
        <span>{activeSlide.footerStandard}</span>
      </div>
    </div>
  );
};
