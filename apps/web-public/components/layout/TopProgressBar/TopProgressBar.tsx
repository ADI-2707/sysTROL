"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./TopProgressBar.module.css";

const ProgressBarContent: React.FC = () => {
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
        if (prev < 50) return prev + 10;
        if (prev < 75) return prev + 3;
        if (prev < 90) return prev + 0.8;
        return prev;
      });
    }, 150);

    safetyTimeoutRef.current = setTimeout(() => {
      finishProgress();
    }, 10000);
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
      }, 250);
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

    const handleCustomStart = () => {
      startProgress();
    };

    const handleCustomStop = () => {
      finishProgress();
    };

    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("app:start-progress", handleCustomStart);
    window.addEventListener("app:stop-progress", handleCustomStop);

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("app:start-progress", handleCustomStart);
      window.removeEventListener("app:stop-progress", handleCustomStop);
      clearAllTimers();
    };
  }, []);

  if (!visible && progress === 0) {
    return null;
  }

  return (
    <div
      className={styles.container}
      style={{
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      <div
        className={styles.bar}
        style={{
          transform: `translateX(-${100 - progress}%)`,
        }}
      >
        <div className={styles.glow} />
      </div>
    </div>
  );
};

export const TopProgressBar: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ProgressBarContent />
    </Suspense>
  );
};
