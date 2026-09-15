"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home, MessageSquare } from "lucide-react";
import { Container } from "@/components/layout/Container/Container";
import { Button } from "@/components/ui/Button/Button";
import { Badge } from "@/components/ui/Badge/Badge";
import styles from "./Error.module.css";

export default function Error({
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
    <main className={styles.errorContainer} role="alert" aria-live="assertive">
      <Container size="narrow">
        <div className={styles.errorCard}>
          <div className={styles.iconWrapper}>
            <AlertOctagon size={30} />
          </div>

          <Badge variant="accent" size="sm">
            DIAGNOSTIC STATUS: EXCEPTION_TRAPPED
          </Badge>

          <h1 className={styles.title}>
            Operational Telemetry Interruption
          </h1>

          <p className={styles.description}>
            An unexpected runtime condition occurred within the supervisory application layer.
            Our telemetry system has captured the fault trace for diagnostics.
          </p>

          <div className={styles.digestBox}>
            FAULT DIGEST: {error.digest || "0xSYS_ERR_500_UNHANDLED"}
          </div>

          <div className={styles.buttonRow}>
            <Button
              onClick={() => reset()}
              variant="primary"
              size="md"
              leftIcon={<RotateCcw size={16} />}
            >
              Reset Session
            </Button>
            <Button
              href="/"
              variant="outlineDark"
              size="md"
              leftIcon={<Home size={16} />}
            >
              Return Home
            </Button>
            <Button
              href="/contact"
              variant="ghost"
              size="md"
              leftIcon={<MessageSquare size={16} />}
              style={{ color: "var(--color-ink-300)" }}
            >
              Support Desk
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
