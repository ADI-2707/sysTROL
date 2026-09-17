"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isTokenValid } from "./token-utils";

export type ConnectionStatus = "online" | "waking" | "offline";

export interface KeepAliveOptions {
  intervalMs?: number;
  onTokenInvalid?: () => void;
}

export function useBackendKeepAlive(
  apiUrl: string,
  token?: string,
  options?: KeepAliveOptions
) {
  const [status, setStatus] = useState<ConnectionStatus>("online");
  const [lastPingAt, setLastPingAt] = useState<Date | null>(null);
  const [isTokenActive, setIsTokenActive] = useState<boolean>(() => isTokenValid(token));
  const isPingingRef = useRef(false);
  const onTokenInvalidRef = useRef(options?.onTokenInvalid);
  onTokenInvalidRef.current = options?.onTokenInvalid;

  const intervalMs = options?.intervalMs ?? 13 * 60 * 1000;

  const ping = useCallback(async () => {
    if (isPingingRef.current) return;
    isPingingRef.current = true;

    const hasValidToken = isTokenValid(token);
    setIsTokenActive(hasValidToken);

    try {
      if (hasValidToken && token) {
        const res = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setStatus("online");
          setLastPingAt(new Date());
          setIsTokenActive(true);
        } else if (res.status === 401) {
          setIsTokenActive(false);
          onTokenInvalidRef.current?.();
          const fallbackRes = await fetch(`${apiUrl}/api/v1/health`);
          if (fallbackRes.ok) {
            setStatus("online");
            setLastPingAt(new Date());
          } else {
            setStatus("offline");
          }
        } else {
          setStatus("online");
          setLastPingAt(new Date());
        }
      } else {
        const res = await fetch(`${apiUrl}/api/v1/health`);
        if (res.ok) {
          setStatus("online");
          setLastPingAt(new Date());
        } else {
          setStatus("offline");
        }
      }
    } catch {
      setStatus("offline");
    } finally {
      isPingingRef.current = false;
    }
  }, [apiUrl, token]);

  useEffect(() => {
    ping();

    const intervalId = setInterval(ping, intervalMs);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        ping();
      }
    };

    const handleWindowFocus = () => {
      ping();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [ping, intervalMs]);

  return {
    status,
    lastPingAt,
    isTokenActive,
    ping,
  };
}
