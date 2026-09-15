"use client";

import React, { useEffect } from "react";
import "@/styles/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#0A0F1D",
          color: "#F8FAFC",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
            backgroundColor: "#111827",
            border: "1px solid #1F2937",
            borderRadius: "16px",
            padding: "36px",
            textAlign: "center",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#F87171",
              borderRadius: "9999px",
              fontSize: "12px",
              fontFamily: "monospace",
              marginBottom: "16px",
            }}
          >
            CRITICAL FAULT: ROOT SYSTEM INTERRUPT
          </div>

          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: "0 0 12px",
            }}
          >
            System Recovery Mode
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#94A3B8",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            The root presentation pipeline encountered an unexpected state. You may restart the runtime session to re-establish nominal telemetry.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            style={{
              backgroundColor: "#1F7A4D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Restart Application
          </button>
        </div>
      </body>
    </html>
  );
}
