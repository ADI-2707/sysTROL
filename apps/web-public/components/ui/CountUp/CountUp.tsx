"use client";

import React, { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string | number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 1400,
  className,
  style,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const strVal = String(value);
  const match = strVal.match(/^([^\d.-]*)(-?\d+(?:\.\d+)?)(.*)$/);

  const prefix = match ? match[1] : "";
  const targetNum = match ? parseFloat(match[2]) : NaN;
  const suffix = match ? match[3] : "";
  const decimalPlaces = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;
  const isNumeric = !isNaN(targetNum);

  const formatValue = (num: number) => {
    const formatted = decimalPlaces > 0 ? num.toFixed(decimalPlaces) : Math.round(num).toString();
    return `${prefix}${formatted}${suffix}`;
  };

  const [displayValue, setDisplayValue] = useState(() => (isNumeric ? formatValue(0) : strVal));
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(strVal);
      return;
    }

    const startAnimation = () => {
      if (hasStarted.current) return;
      hasStarted.current = true;
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = ease * targetNum;
        setDisplayValue(formatValue(current));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(formatValue(targetNum));
        }
      };

      requestAnimationFrame(animate);
    };

    const elem = containerRef.current;
    if (!elem) return;

    const rect = elem.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || document.documentElement.clientHeight)) {
      startAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(elem);

    return () => {
      observer.disconnect();
    };
  }, [strVal, targetNum, isNumeric, duration]);

  return (
    <span ref={containerRef} className={className} style={style}>
      {displayValue}
    </span>
  );
};
