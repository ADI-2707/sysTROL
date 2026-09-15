"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useAnimate } from "motion/react";
import styles from "./LogoIntro.module.css";

const SESSION_KEY = "systrol-intro-played";

export const LogoIntro: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [scope, animate] = useAnimate();
  const stageRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        document.documentElement.classList.add("intro-done");
        setIsVisible(false);
        return;
      }
    } catch {}

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {}
      document.documentElement.classList.add("intro-done");
      setIsVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isVisible || hasStartedRef.current) return;
    hasStartedRef.current = true;

    let isMounted = true;

    const runSequence = async () => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (!isMounted || !scope.current || !stageRef.current) return;

      const stageEl = stageRef.current;
      const stageRect = stageEl.getBoundingClientRect();
      const stageWidth = stageRect.width || 320;
      const initialOffset = Math.max(window.innerWidth * 0.6, 350);

      const leftEl = stageEl.querySelector<HTMLElement>(`.${styles.leftIcon}`);
      const rightEl = stageEl.querySelector<HTMLElement>(`.${styles.rightIcon}`);
      const markWrapper = stageEl.querySelector<HTMLElement>(`.${styles.markWrapper}`);
      const wordmarkEl = stageEl.querySelector<HTMLElement>(`.${styles.wordmark}`);
      const fullLogoEl = stageEl.querySelector<HTMLElement>(`.${styles.fullLogo}`);
      const rippleContainer = stageEl.querySelector<HTMLElement>(`.${styles.rippleContainer}`);

      if (!leftEl || !rightEl || !markWrapper || !wordmarkEl || !fullLogoEl) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 150));
      if (!isMounted) return;

      leftEl.style.transform = `translateX(-${initialOffset}px)`;
      rightEl.style.transform = `translateX(${initialOffset}px)`;
      leftEl.style.opacity = "1";
      rightEl.style.opacity = "1";

      await Promise.all([
        animate(
          leftEl,
          { x: [-initialOffset, 0] },
          { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        ),
        animate(
          rightEl,
          { x: [initialOffset, 0] },
          { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        ),
      ]);

      if (!isMounted) return;

      await animate(
        markWrapper,
        { rotate: [0, 360] },
        { duration: 1.0, ease: [0.4, 0, 0.2, 1] }
      );

      if (!isMounted) return;

      const splitDistance = (84.5 / 400) * stageWidth;
      await Promise.all([
        animate(
          leftEl,
          { x: -splitDistance },
          { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        ),
        animate(
          rightEl,
          { x: splitDistance },
          { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        ),
        animate(
          wordmarkEl,
          { opacity: [0, 1], scale: [0.95, 1] },
          { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        ),
      ]);

      if (!isMounted) return;

      await new Promise((resolve) => setTimeout(resolve, 400));
      if (!isMounted) return;

      await Promise.all([
        animate(markWrapper, { scale: 0.9 }, { duration: 0.13, ease: [0.4, 0, 0.2, 1] }),
        animate(wordmarkEl, { scale: 0.9 }, { duration: 0.13, ease: [0.4, 0, 0.2, 1] }),
      ]);
      if (!isMounted) return;

      await Promise.all([
        animate(markWrapper, { opacity: 0 }, { duration: 0.01 }),
        animate(wordmarkEl, { opacity: 0 }, { duration: 0.01 }),
        animate(fullLogoEl, { opacity: 1, scale: 0.9 }, { duration: 0.01 }),
      ]);
      if (!isMounted) return;

      rippleContainer?.classList.add(styles.active);

      await animate(
        fullLogoEl,
        { scale: [0.9, 1.04, 1] },
        { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
      );
      if (!isMounted) return;

      await new Promise((resolve) => setTimeout(resolve, 200));
      if (!isMounted) return;

      const target = document.getElementById("site-logo-target");
      const targetEl = target?.querySelector("img") || target;

      let deltaX = 0;
      let deltaY = 0;
      let scale = 0.5;

      if (targetEl) {
        const targetRect = targetEl.getBoundingClientRect();
        const currentStageRect = stageEl.getBoundingClientRect();

        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
        const stageCenterX = currentStageRect.left + currentStageRect.width / 2;
        const stageCenterY = currentStageRect.top + currentStageRect.height / 2;

        deltaX = targetCenterX - stageCenterX;
        deltaY = targetCenterY - stageCenterY;
        scale = targetRect.height / currentStageRect.height;
      }

      await Promise.all([
        animate(
          fullLogoEl,
          { x: deltaX, y: deltaY, scale },
          { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        ),
        animate(
          scope.current,
          { opacity: 0 },
          { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
        ),
      ]);

      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {}
      document.documentElement.classList.add("intro-done");
      document.body.style.overflow = "";
      if (isMounted) {
        setIsVisible(false);
      }
    };

    runSequence();

    return () => {
      isMounted = false;
    };
  }, [isVisible, animate, scope]);

  if (!isVisible) {
    return null;
  }

  return (
    <div ref={scope} className={styles.overlay} aria-hidden="true">
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.markWrapper}>
          <div className={styles.leftIcon}>
            <Image
              src="/images/intro/systrol-icon-left.png"
              alt=""
              width={104}
              height={400}
              priority
              className={styles.partImage}
            />
          </div>
          <div className={styles.rightIcon}>
            <Image
              src="/images/intro/systrol-icon-right.png"
              alt=""
              width={127}
              height={400}
              priority
              className={styles.partImage}
            />
          </div>
        </div>

        <div className={styles.wordmark}>
          <Image
            src="/images/intro/systrol-wordmark-center.png"
            alt="sysTROL Engineering Redefined"
            width={169}
            height={210}
            priority
            className={styles.wordmarkImage}
          />
        </div>

        <div className={styles.fullLogo}>
          <Image
            src="/images/systrol-logo.jpeg"
            alt="sysTROL Engineering & Consultancy"
            width={400}
            height={400}
            priority
            className={styles.fullLogoImage}
          />
        </div>

        <div className={styles.rippleContainer}>
          <div className={`${styles.ripple} ${styles.ripple1}`} />
          <div className={`${styles.ripple} ${styles.ripple2}`} />
          <div className={`${styles.ripple} ${styles.ripple3}`} />
        </div>
      </div>
    </div>
  );
};
