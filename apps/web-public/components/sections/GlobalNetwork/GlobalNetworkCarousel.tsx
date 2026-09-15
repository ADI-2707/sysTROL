"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./GlobalNetworkCarousel.module.css";

interface PipelineSlide {
  id: string;
  image: string;
  alt: string;
  badgeTag: string;
  badgeRoute: string;
}

const pipelineSlides: PipelineSlide[] = [
  {
    id: "pipe-1",
    image: "/images/global-logistics-freight.jpg",
    alt: "International industrial freight and bonded logistics corridors",
    badgeTag: "SECURED OEM PROCUREMENT CHANNELS & BONDED LOGISTICS",
    badgeRoute: "Frankfurt • Milan • Tokyo → India & GCC Direct Air Freight Corridors",
  },
  {
    id: "pipe-2",
    image: "/images/tungsten-carbide-rolls.jpg",
    alt: "Precision tungsten carbide roll tooling and certified wear parts",
    badgeTag: "DIRECT OEM ROLLS & WEAR PART SOURCING",
    badgeRoute: "Germany & Sweden → Precision Mill Finishing Stands (EN 10204 3.1)",
  },
  {
    id: "pipe-3",
    image: "/images/hydraulic-agc-system.jpg",
    alt: "High-response hydraulic AGC servo valve calibration and testing",
    badgeTag: "HYDRAULIC AGC & HIGH-RESPONSE SERVO VALVES",
    badgeRoute: "Moog & Bosch Rexroth Certified Supply Lines → 5ms Mill Response",
  },
  {
    id: "pipe-4",
    image: "/images/automation-control-room.jpg",
    alt: "Supervisory control room and digital simulation staging desk",
    badgeTag: "BENGALURU TECHNOLOGY CENTER • FAT SIMULATION",
    badgeRoute: "Domestic Software Staging & Testing Hub → Zero-Downtime Shadow Cutover",
  },
  {
    id: "pipe-5",
    image: "/images/hero-rolling-mill.jpg",
    alt: "Continuous steel bar and wire rod rolling mill operations",
    badgeTag: "ON-SITE COMMISSIONING ACROSS 3 CONTINENTS",
    badgeRoute: "India • Oman • Saudi Arabia • UAE Continuous Rolling Mills",
  },
];

export const GlobalNetworkCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setPreviousIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % pipelineSlides.length);
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
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, goToNext]);

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

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
      className={styles.carouselWrap}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="International Logistics Pipeline Carousel"
    >
      {pipelineSlides.map((slide, idx) => (
        <div key={slide.id} className={getSlideClass(idx)}>
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className={styles.image}
            priority={idx === 0}
          />
          <div className={styles.imageOverlay} />
          <div className={styles.badgeWrap}>
            <span className={styles.badgeTag}>{slide.badgeTag}</span>
            <span className={styles.badgeRoute}>{slide.badgeRoute}</span>
          </div>
        </div>
      ))}

      <div className={styles.dotsRow}>
        {pipelineSlides.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(idx)}
            className={`${styles.dotButton} ${
              idx === currentIndex ? styles.dotButtonActive : ""
            }`}
            aria-label={`Go to pipeline slide ${idx + 1}`}
            aria-current={idx === currentIndex ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
};
