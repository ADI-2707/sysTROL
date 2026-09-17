import React from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        padding: "8px 0",
        minHeight: "400px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        <Loader2 size={18} className="animate-spin" style={{ color: "var(--sys-blue-primary)" }} />
        <span>Synchronizing workspace data...</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: "110px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <div
        style={{
          height: "320px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "10px",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
