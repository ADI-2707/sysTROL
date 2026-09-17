import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
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
          maxWidth: "460px",
          backgroundColor: "var(--bg-card, #1e293b)",
          border: "1px solid var(--border-subtle, rgba(255,255,255,0.1))",
          borderRadius: "12px",
          padding: "36px 32px",
          textAlign: "center",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            color: "var(--sys-blue-primary, #3b82f6)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <FileQuestion size={30} />
        </div>

        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--text-heading, #f8fafc)",
            margin: "0 0 8px 0",
          }}
        >
          Resource Not Found
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "var(--text-muted, #94a3b8)",
            margin: "0 0 24px 0",
            lineHeight: 1.5,
          }}
        >
          The internal console route you requested does not exist or has been relocated.
        </p>

        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "var(--sys-blue-primary, #3b82f6)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
