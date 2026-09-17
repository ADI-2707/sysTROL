"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function RootError({
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
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-primary, #0f172a)",
        padding: "24px",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--bg-card, #1e293b)",
          border: "1px solid var(--border-subtle, rgba(255,255,255,0.1))",
          borderRadius: "12px",
          padding: "32px",
          textAlign: "center",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <AlertTriangle size={30} />
        </div>

        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text-heading, #f8fafc)",
            margin: "0 0 8px 0",
          }}
        >
          Console Exception Encountered
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted, #94a3b8)",
            margin: "0 0 20px 0",
            lineHeight: 1.5,
          }}
        >
          {error.message || "An unexpected error occurred in the internal operations portal."}
        </p>

        {error.digest && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "rgba(0,0,0,0.25)",
              borderRadius: "6px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#94a3b8",
              marginBottom: "24px",
            }}
          >
            Digest: {error.digest}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "var(--sys-blue-primary, #3b82f6)",
              color: "#ffffff",
              border: "none",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} />
            <span>Attempt Recovery</span>
          </button>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-subtle, rgba(255,255,255,0.1))",
              color: "var(--text-primary, #f8fafc)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <Home size={16} />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
