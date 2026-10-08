"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Activity, Database, Server, RefreshCw, X, ShieldCheck, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { canAccessAuditLogs } from "@/lib/permissions";
import { useVisibilityPolling } from "@/lib/use-visibility-polling";

interface HealthCheckData {
  status: "healthy" | "degraded" | "offline";
  environment?: string;
  uptimeSeconds?: number;
  checks?: {
    database?: { status: string; latencyMs: number };
    redis?: { status: string; latencyMs: number };
    memory?: { rssMb: number; heapUsedMb: number };
  };
}

export function SystemHealthBeacon() {
  const { user } = useAuth();
  const isAdmin = canAccessAuditLogs(user);

  const [data, setData] = useState<HealthCheckData | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsRefreshing(true);
    const start = Date.now();
    try {
      const res = await apiClient("/api/v1/health/deep");
      const rtt = Date.now() - start;
      setLatency(rtt);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        const json = await res.json().catch(() => null);
        setData(json || { status: "degraded" });
      }
    } catch {
      setLatency(Date.now() - start);
      setData({ status: "offline" });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useVisibilityPolling(checkHealth, { intervalMs: 30000 });

  const isHealthy = data?.status === "healthy";
  const isDegraded = data?.status === "degraded";
  const beaconColor = isHealthy ? "#10b981" : isDegraded ? "#f59e0b" : "#ef4444";
  const beaconLabel = isHealthy ? "SYSTEM HEALTHY" : isDegraded ? "DEGRADED" : "OFFLINE";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isAdmin) {
            setIsOpen(true);
          }
        }}
        title={isAdmin ? "Click to view infrastructure diagnostics" : "System Health Status"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "3px 8px",
          borderRadius: "6px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-body)",
          fontSize: "11px",
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          cursor: isAdmin ? "pointer" : "default",
          transition: "all 0.18s ease",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: beaconColor,
            boxShadow: `0 0 6px ${beaconColor}`,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span>{beaconLabel}</span>
        {latency !== null && (
          <span style={{ color: "var(--text-muted)", fontSize: "10px" }}>
            {latency}ms
          </span>
        )}
      </button>

      {isOpen && isAdmin && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-card)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Activity size={20} color="var(--sys-blue-primary)" />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-heading)" }}>
                  Infrastructure Diagnostics
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  padding: "4px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div
                style={{
                  backgroundColor: "var(--bg-canvas)",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Database size={16} color="var(--sys-blue-primary)" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-heading)" }}>
                    Neon PostgreSQL
                  </span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: data?.checks?.database?.status === "up" ? "#10b981" : "#ef4444" }}>
                  {data?.checks?.database?.status === "up" ? "CONNECTED" : "UNREACHABLE"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                  Latency: {data?.checks?.database?.latencyMs ?? "--"}ms
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--bg-canvas)",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Server size={16} color="var(--sys-blue-primary)" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-heading)" }}>
                    Upstash Redis
                  </span>
                </div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: data?.checks?.redis?.status === "up" ? "#10b981" : "#ef4444" }}>
                  {data?.checks?.redis?.status === "up" ? "CONNECTED" : "UNREACHABLE"}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                  Latency: {data?.checks?.redis?.latencyMs ?? "--"}ms
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-canvas)",
                padding: "12px 14px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "12px",
                color: "var(--text-body)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Backend Uptime:</span>
                <span style={{ fontWeight: 600 }}>{data?.uptimeSeconds ? `${Math.floor(data.uptimeSeconds / 60)} mins` : "--"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Process RSS Memory:</span>
                <span style={{ fontWeight: 600 }}>{data?.checks?.memory?.rssMb ? `${data.checks.memory.rssMb} MB` : "--"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Round-trip Probe Latency:</span>
                <span style={{ fontWeight: 600 }}>{latency !== null ? `${latency} ms` : "--"}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Admin Diagnostics Active</span>
              </div>
              <button
                type="button"
                disabled={isRefreshing}
                onClick={checkHealth}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "6px",
                  backgroundColor: "var(--sys-blue-primary)",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  cursor: isRefreshing ? "not-allowed" : "pointer",
                }}
              >
                <RefreshCw size={13} className={isRefreshing ? "spin" : ""} />
                <span>{isRefreshing ? "Testing..." : "Test Subsystems"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
