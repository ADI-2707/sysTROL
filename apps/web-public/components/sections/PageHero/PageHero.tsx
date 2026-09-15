"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/Container/Container";
import styles from "./PageHero.module.css";

export interface PageHeroProps {
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  image,
  imageAlt,
  children,
  className = "",
}) => {
  return (
    <section className={`${styles.hero} ${className}`.trim()}>
      <div className={styles.imageLayer}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.overlay} />

      <svg
        className={styles.circuitTexture}
        viewBox="0 0 1440 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <path
          d="M-50 120 H 340 L 420 200 H 760 L 840 120 H 1500"
          className={styles.circuitLine}
        />
        <circle cx="340" cy="120" r="4" className={styles.circuitNode} />
        <circle cx="420" cy="200" r="4" className={styles.circuitNode} />
        <circle cx="760" cy="200" r="4" className={styles.circuitNode} />
        <circle cx="840" cy="120" r="4" className={styles.circuitNode} />

        <path
          d="M-50 320 H 220 L 300 240 H 640 L 720 320 H 1120 L 1200 240 H 1500"
          className={styles.circuitLine}
        />
        <circle cx="220" cy="320" r="4" className={styles.circuitNode} />
        <circle cx="300" cy="240" r="4" className={styles.circuitNode} />
        <circle cx="640" cy="240" r="4" className={styles.circuitNode} />
        <circle cx="720" cy="320" r="4" className={styles.circuitNode} />
        <circle cx="1120" cy="320" r="4" className={styles.circuitNode} />
        <circle cx="1200" cy="240" r="4" className={styles.circuitNode} />

        <path
          d="M 120 40 L 180 100 V 280 L 220 320"
          className={`${styles.circuitLine} ${styles.outerLine}`}
        />
        <circle cx="180" cy="100" r="3" className={`${styles.circuitNode} ${styles.outerLine}`} />
        <circle cx="180" cy="280" r="3" className={`${styles.circuitNode} ${styles.outerLine}`} />

        <path
          d="M 1320 420 L 1260 360 V 160 L 1200 100"
          className={`${styles.circuitLine} ${styles.outerLine}`}
        />
        <circle cx="1260" cy="360" r="3" className={`${styles.circuitNode} ${styles.outerLine}`} />
        <circle cx="1260" cy="160" r="3" className={`${styles.circuitNode} ${styles.outerLine}`} />
      </svg>

      <div className={styles.content}>
        <Container size="wide">{children}</Container>
      </div>
    </section>
  );
};
