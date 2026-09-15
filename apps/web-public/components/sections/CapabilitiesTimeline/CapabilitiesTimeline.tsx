"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import styles from "./CapabilitiesTimeline.module.css";

export interface CapabilityItemData {
  title: string;
  description: string;
  highlights?: string[];
  flowSteps?: string[];
}

export interface CapabilitiesTimelineProps {
  title: string;
  theme?: "brand" | "accent";
  items: CapabilityItemData[];
}

export const CapabilitiesTimeline: React.FC<CapabilitiesTimelineProps> = ({
  title,
  theme = "brand",
  items,
}) => {
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    new Array(items.length).fill(false)
  );
  const [spineBounds, setSpineBounds] = useState<{ top: number; height: number } | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSpine = () => {
      const first = itemRefs.current[0];
      const last = itemRefs.current[items.length - 1];
      if (first && last) {
        const top = first.offsetTop + 11;
        const height = last.offsetTop - first.offsetTop;
        if (height > 0) {
          setSpineBounds({ top, height });
        }
      }
    };

    updateSpine();
    window.addEventListener("resize", updateSpine);

    if (!("IntersectionObserver" in window)) {
      setRevealed(new Array(items.length).fill(true));
      return () => window.removeEventListener("resize", updateSpine);
    }

    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => {
              if (prev[index]) return prev;
              const next = [...prev];
              next[index] = true;
              return next;
            });
            observer.unobserve(el);
          }
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -30px 0px",
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      window.removeEventListener("resize", updateSpine);
      observers.forEach((obs) => obs.disconnect());
    };
  }, [items.length]);

  const isAccent = theme === "accent";

  return (
    <div className={styles.container}>
      <h4 className={styles.headerTitle}>{title}</h4>

      <div className={styles.timeline}>
        <div
          className={`${styles.spine} ${isAccent ? styles.spineAccent : ""}`.trim()}
          style={
            spineBounds
              ? { top: `${spineBounds.top}px`, height: `${spineBounds.height}px`, bottom: "auto" }
              : undefined
          }
          aria-hidden="true"
        />

        {items.map((item, index) => {
          const isItemRevealed = revealed[index];

          return (
            <div
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`${styles.item} ${isItemRevealed ? styles.itemRevealed : ""}`.trim()}
              style={{
                transitionDelay: `${(index % 4) * 80}ms`,
              }}
            >
              <div className={styles.bulletWrapper}>
                <div
                  className={`${styles.bullet} ${isAccent ? styles.bulletAccent : ""}`.trim()}
                />
              </div>

              <div className={styles.content}>
                <div className={styles.titleRow}>
                  <span className={styles.title}>{item.title}</span>
                </div>

                <p className={styles.desc}>{item.description}</p>

                {item.flowSteps && item.flowSteps.length > 0 && (
                  <div className={styles.flowContainer}>
                    {item.flowSteps.map((step, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <span className={styles.flowStep}>{step}</span>
                        {sIdx < item.flowSteps!.length - 1 && (
                          <span className={styles.flowArrow} aria-hidden="true">
                            <ChevronRight size={12} />
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {item.highlights && item.highlights.length > 0 && (
                  <ul className={styles.highlightsList}>
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className={styles.highlightItem}>
                        <span className={styles.highlightDot} aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
