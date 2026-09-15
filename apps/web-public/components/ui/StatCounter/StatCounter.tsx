"use client";

import React from "react";
import { CountUp } from "@/components/ui/CountUp/CountUp";
import styles from "./StatCounter.module.css";

export interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  description?: string;
  duration?: number;
  theme?: "light" | "dark";
  className?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  label,
  suffix = "",
  prefix = "",
  description,
  duration = 1400,
  theme = "light",
  className = "",
}) => {
  return (
    <div className={`${styles.container} ${styles[theme]} ${className}`.trim()}>
      <div className={styles.numberRow}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.number}>
          <CountUp value={value} duration={duration} />
        </span>
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>
      <div className={styles.label}>{label}</div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};
