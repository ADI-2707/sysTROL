"use client";

import React, { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";

export default function CaseStudyError({
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
    <div
      style={{
        minHeight: "65vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-16) 0",
        backgroundColor: "var(--color-surface-50)",
      }}
    >
      <Container size="narrow">
        <div
          style={{
            backgroundColor: "var(--color-surface-0)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-8)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-4)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-full)",
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "#D97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={24} />
          </div>

          <Badge variant="accent" size="sm">
            CASE STUDY TELEMETRY UNREACHABLE
          </Badge>

          <h1
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: "var(--font-bold)",
              color: "var(--color-ink-900)",
              margin: 0,
            }}
          >
            Unable to Retrieve Project Dossier
          </h1>

          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-ink-600)",
              maxWidth: "460px",
              lineHeight: "var(--leading-relaxed)",
              margin: 0,
            }}
          >
            A fault occurred while loading this specific mill case study. You may retry or return to the project index.
          </p>

          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "var(--space-2)",
            }}
          >
            <Button
              onClick={() => reset()}
              variant="primary"
              size="md"
              leftIcon={<RotateCcw size={16} />}
            >
              Retry
            </Button>
            <Button
              href="/projects"
              variant="secondary"
              size="md"
              leftIcon={<ArrowLeft size={16} />}
            >
              Back to Projects
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
