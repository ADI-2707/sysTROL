"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Reveal.module.css";

export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  width?: "100%" | "auto";
  as?: React.ElementType;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  className = "",
  width = "100%",
  as: Component = "div",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Component
      ref={ref}
      className={`${styles.reveal} ${isVisible ? styles.visible : ""} ${className}`.trim()}
      style={{
        width,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
};
