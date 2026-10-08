"use client";

import { useEffect, useRef, useCallback } from "react";

export interface VisibilityPollingOptions {
  intervalMs: number;
  enabled?: boolean;
  onError?: (error: any) => void;
}

export function useVisibilityPolling(
  callback: () => Promise<void> | void,
  options: VisibilityPollingOptions
) {
  const { intervalMs, enabled = true, onError } = options;
  const savedCallback = useRef(callback);
  savedCallback.current = callback;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const isExecutingRef = useRef(false);
  const isHaltedRef = useRef(false);

  const execute = useCallback(async () => {
    if (!enabled || isHaltedRef.current || isExecutingRef.current) return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
    isExecutingRef.current = true;
    try {
      await savedCallback.current();
    } catch (err: any) {
      if (err?.status === 401 || err?.message?.includes("Session expired") || err?.message?.includes("Unauthorized")) {
        isHaltedRef.current = true;
      }
      onErrorRef.current?.(err);
    } finally {
      isExecutingRef.current = false;
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    isHaltedRef.current = false;
    execute();

    const intervalId = setInterval(execute, intervalMs);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isHaltedRef.current) {
        execute();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [execute, intervalMs, enabled]);

  return {
    halt: () => {
      isHaltedRef.current = true;
    },
    resume: () => {
      isHaltedRef.current = false;
      execute();
    },
  };
}
