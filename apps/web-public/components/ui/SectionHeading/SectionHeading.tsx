import React from "react";
import { Badge } from "../Badge/Badge";
import styles from "./SectionHeading.module.css";

export interface SectionHeadingProps {
  eyebrow?: string;
  eyebrowVariant?: "default" | "accent" | "brand" | "dark";
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
  style?: React.CSSProperties;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowVariant = "brand",
  title,
  subtitle,
  align = "left",
  theme = "light",
  className = "",
  style,
}) => {
  return (
    <div
      className={`${styles.wrapper} ${styles[align]} ${styles[theme]} ${className}`.trim()}
      style={style}
    >
      {eyebrow && (
        <div className={styles.eyebrow}>
          <Badge variant={theme === "dark" ? "dark" : eyebrowVariant} size="md">
            {eyebrow}
          </Badge>
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};
