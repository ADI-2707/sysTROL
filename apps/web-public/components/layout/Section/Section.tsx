import React from "react";
import styles from "./Section.module.css";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "light" | "alt" | "dark" | "navyDeep";
  density?: "default" | "dense";
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = "light",
  density = "default",
  className = "",
  ...props
}) => {
  const classes = [
    styles.section,
    styles[variant],
    density === "dense" ? styles.dense : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
};
