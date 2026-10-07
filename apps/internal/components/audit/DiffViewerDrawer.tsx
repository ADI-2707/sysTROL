"use client";

import React from "react";
import { X, Shield, ArrowRight } from "lucide-react";

export interface AuditLogItem {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  projectId?: string | null;
  diff?: { before: any; after: any } | null;
  createdAt: string;
  project?: { id: string; projectCode?: string; code?: string; name: string } | null;
}

interface DiffViewerDrawerProps {
  log: AuditLogItem | null;
  onClose: () => void;
}

export function DiffViewerDrawer({ log, onClose }: DiffViewerDrawerProps) {
  if (!log) return null;

  const beforeJson = log.diff?.before ? JSON.stringify(log.diff.before, null, 2) : null;
  const afterJson = log.diff?.after ? JSON.stringify(log.diff.after, null, 2) : null;

  return (
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
        justifyContent: "flex-end",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "680px",
          height: "100%",
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Shield size={20} color="var(--sys-blue-primary)" />
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--text-heading)" }}>
                Mutation Audit Record
              </h3>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                ID: {log.id}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              backgroundColor: "var(--bg-canvas)",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              fontSize: "12px",
            }}
          >
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "3px" }}>Action Method & Route</div>
              <div style={{ fontWeight: 600, color: "var(--text-heading)", fontFamily: "var(--font-mono)" }}>{log.action}</div>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "3px" }}>Timestamp</div>
              <div style={{ fontWeight: 600, color: "var(--text-heading)", fontFamily: "var(--font-mono)" }}>
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "3px" }}>Actor Identity</div>
              <div style={{ fontWeight: 600, color: "var(--text-heading)", fontFamily: "var(--font-mono)" }}>{log.actorId}</div>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "3px" }}>Entity Reference</div>
              <div style={{ fontWeight: 600, color: "var(--text-heading)", fontFamily: "var(--font-mono)" }}>
                {log.entityType} ({log.entityId})
              </div>
            </div>
            {log.project && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "3px" }}>Associated Project</div>
                <div style={{ fontWeight: 600, color: "var(--sys-blue-primary)" }}>
                  {log.project.projectCode || log.project.code} - {log.project.name}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--text-heading)" }}>
              <span>State Delta (Before / After Snapshot)</span>
              <ArrowRight size={14} color="var(--text-muted)" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  State Before Mutation
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: "12px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-canvas)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "11.5px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-body)",
                    maxHeight: "360px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {beforeJson || "null (New entity created)"}
                </pre>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--sys-green-accent)", textTransform: "uppercase" }}>
                  State After Mutation
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: "12px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-canvas)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "11.5px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-body)",
                    maxHeight: "360px",
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {afterJson || "null (Entity removed or empty payload)"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
