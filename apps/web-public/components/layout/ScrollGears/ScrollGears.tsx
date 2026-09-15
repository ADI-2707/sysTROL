"use client";

import React, { useEffect, useRef } from "react";
import styles from "./ScrollGears.module.css";

function buildGearToothPath(
  teeth: number,
  rRoot: number,
  rTip: number,
  rPitch: number
): string {
  const parts: string[] = [];
  const angleStep = (Math.PI * 2) / teeth;
  const toothAngle = angleStep * 0.24;

  for (let i = 0; i < teeth; i++) {
    const centerAngle = i * angleStep;

    const aRoot1 = centerAngle - angleStep * 0.35;
    const aFlank1 = centerAngle - toothAngle * 1.3;
    const aTip1 = centerAngle - toothAngle * 0.55;
    const aTip2 = centerAngle + toothAngle * 0.55;
    const aFlank2 = centerAngle + toothAngle * 1.3;
    const aRoot2 = centerAngle + angleStep * 0.35;

    const xR1 = (Math.cos(aRoot1) * rRoot).toFixed(2);
    const yR1 = (Math.sin(aRoot1) * rRoot).toFixed(2);
    const xF1 = (Math.cos(aFlank1) * rPitch).toFixed(2);
    const yF1 = (Math.sin(aFlank1) * rPitch).toFixed(2);
    const xT1 = (Math.cos(aTip1) * rTip).toFixed(2);
    const yT1 = (Math.sin(aTip1) * rTip).toFixed(2);
    const xT2 = (Math.cos(aTip2) * rTip).toFixed(2);
    const yT2 = (Math.sin(aTip2) * rTip).toFixed(2);
    const xF2 = (Math.cos(aFlank2) * rPitch).toFixed(2);
    const yF2 = (Math.sin(aFlank2) * rPitch).toFixed(2);
    const xR2 = (Math.cos(aRoot2) * rRoot).toFixed(2);
    const yR2 = (Math.sin(aRoot2) * rRoot).toFixed(2);

    if (i === 0) {
      parts.push(`M ${xR1} ${yR1}`);
    } else {
      parts.push(`L ${xR1} ${yR1}`);
    }

    parts.push(`L ${xF1} ${yF1}`);
    parts.push(`L ${xT1} ${yT1}`);
    parts.push(`L ${xT2} ${yT2}`);
    parts.push(`L ${xF2} ${yF2}`);
    parts.push(`L ${xR2} ${yR2}`);
  }

  parts.push("Z");
  return parts.join(" ");
}

interface GearSvgProps {
  teeth: number;
  rRoot: number;
  rTip: number;
  rPitch: number;
  rInnerRim: number;
  rHubOuter: number;
  rHubInner: number;
  spokeCount: number;
  spokeHoleRadius: number;
  spokeCircleRadius: number;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const WireframeGear: React.FC<GearSvgProps> = ({
  teeth,
  rRoot,
  rTip,
  rPitch,
  rInnerRim,
  rHubOuter,
  rHubInner,
  spokeCount,
  spokeHoleRadius,
  spokeCircleRadius,
  svgRef,
}) => {
  const toothPath = buildGearToothPath(teeth, rRoot, rTip, rPitch);

  const spokeCutouts = Array.from({ length: spokeCount }, (_, idx) => {
    const angle = (idx * 2 * Math.PI) / spokeCount;
    const cx = (Math.cos(angle) * spokeCircleRadius).toFixed(2);
    const cy = (Math.sin(angle) * spokeCircleRadius).toFixed(2);
    const x2 = (Math.cos(angle) * (rInnerRim - 4)).toFixed(2);
    const y2 = (Math.sin(angle) * (rInnerRim - 4)).toFixed(2);
    const x1 = (Math.cos(angle) * (rHubOuter + 4)).toFixed(2);
    const y1 = (Math.sin(angle) * (rHubOuter + 4)).toFixed(2);

    return { cx, cy, x1, y1, x2, y2, id: idx };
  });

  return (
    <svg
      ref={svgRef}
      viewBox="-200 -200 400 400"
      className={styles.gearSvg}
      aria-hidden="true"
    >
      <circle cx="0" cy="0" r={rTip + 8} fill="none" stroke="none" />

      <circle cx="0" cy="0" r={rPitch} className={styles.pitchCircle} />
      <circle cx="0" cy="0" r={rRoot} className={styles.rootCircle} />

      <path d={toothPath} className={styles.outerTeeth} />

      <circle cx="0" cy="0" r={rInnerRim} className={styles.innerRim} />

      {spokeCutouts.map((spoke) => (
        <g key={spoke.id}>
          <line
            x1={spoke.x1}
            y1={spoke.y1}
            x2={spoke.x2}
            y2={spoke.y2}
            className={styles.spokeAxis}
          />
          <circle
            cx={spoke.cx}
            cy={spoke.cy}
            r={spokeHoleRadius}
            className={styles.spokeCutout}
          />
        </g>
      ))}

      <circle cx="0" cy="0" r={rHubOuter} className={styles.hubOuter} />
      <circle cx="0" cy="0" r={rHubInner} className={styles.hubInner} />

      <rect
        x="-3.5"
        y={(-rHubInner - 4).toFixed(2)}
        width="7"
        height="8"
        className={styles.keyway}
      />
    </svg>
  );
};

function isPointOverDark(x: number, y: number): boolean {
  if (typeof document === "undefined") return false;
  const clientWidth = document.documentElement.clientWidth || window.innerWidth;
  if (x < 0 || y < 0 || x >= clientWidth || y >= window.innerHeight) {
    return false;
  }
  const el = document.elementFromPoint(x, y);
  if (!el) return false;
  let curr: Element | null = el;
  while (curr && curr !== document.documentElement && curr !== document.body) {
    const cls = typeof curr.className === "string" ? curr.className.toLowerCase() : "";
    if (
      cls.includes("dark") ||
      cls.includes("navydeep") ||
      cls.includes("ctasection") ||
      cls.includes("impactband") ||
      cls.includes("footer") ||
      cls.includes("pagehero")
    ) {
      return true;
    }
    const style = window.getComputedStyle(curr);
    const color = style.color;
    if (color) {
      const matchText = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (matchText) {
        const tr = parseInt(matchText[1], 10);
        const tg = parseInt(matchText[2], 10);
        const tb = parseInt(matchText[3], 10);
        if (tr > 220 && tg > 220 && tb > 220) {
          return true;
        }
      }
    }
    const bg = style.backgroundColor;
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 128) {
          return true;
        }
      }
    }
    curr = curr.parentElement;
  }
  return false;
}

function checkWrapperDark(wrapper: HTMLDivElement | null, x: number): boolean {
  if (!wrapper) return false;
  const rect = wrapper.getBoundingClientRect();
  const y1 = rect.top + rect.height * 0.25;
  const y2 = rect.top + rect.height * 0.5;
  const y3 = rect.top + rect.height * 0.75;
  return isPointOverDark(x, y1) || isPointOverDark(x, y2) || isPointOverDark(x, y3);
}

export const ScrollGears: React.FC = () => {
  const leftGearRef = useRef<SVGSVGElement | null>(null);
  const rightGearRef = useRef<SVGSVGElement | null>(null);
  const leftWrapperRef = useRef<HTMLDivElement | null>(null);
  const rightWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animFrameId: number | null = null;

    const updateRotationAndTheme = () => {
      const scrollY = window.scrollY || 0;

      if (leftGearRef.current) {
        const leftDeg = (scrollY * 0.14) % 360;
        leftGearRef.current.style.transform = `rotate(${leftDeg}deg)`;
      }

      if (rightGearRef.current) {
        const rightDeg = (-scrollY * 0.22) % 360;
        rightGearRef.current.style.transform = `rotate(${rightDeg}deg)`;
      }

      const clientWidth = document.documentElement.clientWidth || window.innerWidth;
      const leftX = Math.min(50, clientWidth / 4);
      const rightX = Math.max(clientWidth - 50, clientWidth * 0.75);

      const isLeftDark = checkWrapperDark(leftWrapperRef.current, leftX);
      const isRightDark = checkWrapperDark(rightWrapperRef.current, rightX);
      const isDark = isLeftDark || isRightDark;

      if (leftWrapperRef.current) {
        leftWrapperRef.current.classList.toggle(styles.darkBg, isDark);
      }

      if (rightWrapperRef.current) {
        rightWrapperRef.current.classList.toggle(styles.darkBg, isDark);
      }

      animFrameId = null;
    };

    const handleScroll = () => {
      if (animFrameId === null) {
        animFrameId = window.requestAnimationFrame(updateRotationAndTheme);
      }
    };

    updateRotationAndTheme();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animFrameId !== null) {
        window.cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      <div ref={leftWrapperRef} className={styles.leftGearWrapper}>
        <WireframeGear
          teeth={20}
          rRoot={150}
          rTip={182}
          rPitch={166}
          rInnerRim={134}
          rHubOuter={56}
          rHubInner={24}
          spokeCount={6}
          spokeHoleRadius={22}
          spokeCircleRadius={95}
          svgRef={leftGearRef}
        />
      </div>

      <div ref={rightWrapperRef} className={styles.rightGearWrapper}>
        <WireframeGear
          teeth={14}
          rRoot={138}
          rTip={176}
          rPitch={157}
          rInnerRim={120}
          rHubOuter={50}
          rHubInner={22}
          spokeCount={5}
          spokeHoleRadius={19}
          spokeCircleRadius={85}
          svgRef={rightGearRef}
        />
      </div>
    </div>
  );
};
