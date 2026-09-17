"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        minHeight: "450px",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          boxShadow: "var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1))",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            backgroundColor: "rgba(245, 158, 11, 0.15)",
            color: "#f59e0b",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <AlertCircle size={28} />
        </div>

        <h2
          style={{
            fontSize: "19px",
            fontWeight: 700,
            color: "var(--text-heading)",
            margin: "0 0 8px 0",
          }}
        >
          Dashboard Module Interrupted
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted)",
            margin: "0 0 20px 0",
            lineHeight: 1.5,
          }}
        >
          {error.message || "Failed to load data for this workspace section."}
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 18px",
              borderRadius: "8px",
              backgroundColor: "var(--sys-blue-primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={15} />
            <span>Reload Module</span>
          </button>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 16px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-secondary, rgba(0,0,0,0.05))",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              fontSize: "13.5px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <LayoutDashboard size={15} />
            <span>Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
