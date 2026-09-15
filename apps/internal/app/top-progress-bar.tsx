"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (finishTimeoutRef.current) {
      clearTimeout(finishTimeoutRef.current);
      finishTimeoutRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  const startProgress = () => {
    clearAllTimers();
    setVisible(true);
    setProgress((prev) => (prev > 0 && prev < 85 ? prev : 25));

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + 12;
        if (prev < 75) return prev + 4;
        if (prev < 90) return prev + 1;
        return prev;
      });
    }, 150);

    safetyTimeoutRef.current = setTimeout(() => {
      finishProgress();
    }, 8000);
  };

  const finishProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    setProgress(100);

    finishTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      finishTimeoutRef.current = setTimeout(() => {
        setProgress(0);
      }, 200);
    }, 200);
  };

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    finishProgress();
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("rel") === "external") return;

      try {
        const currentUrl = new URL(window.location.href);
        const targetUrl = new URL(anchor.href, window.location.href);

        if (targetUrl.origin !== currentUrl.origin) return;
        if (
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search
        ) {
          return;
        }

        setTimeout(() => {
          startProgress();
        }, 0);
      } catch {}
    };

    const handlePopState = () => {
      setTimeout(() => {
        startProgress();
      }, 0);
    };

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      clearAllTimers();
    };
  }, []);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        zIndex: 9999999,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "var(--sys-green-accent)",
          transform: `translateX(-${100 - progress}%)`,
          transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 0 10px var(--sys-green-accent), 0 0 5px var(--sys-green-accent)",
        }}
      />
    </div>
  );
}

export function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
