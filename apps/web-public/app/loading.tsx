import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div style={{ minHeight: "80vh", paddingTop: "var(--space-16)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-8)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "680px" }}>
            <Skeleton width={160} height={28} borderRadius="9999px" />
            <Skeleton width="100%" height={56} />
            <Skeleton width="90%" height={24} />
            <Skeleton width="75%" height={24} />
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <Skeleton width={150} height={48} borderRadius="var(--radius-md)" />
              <Skeleton width={170} height={48} borderRadius="var(--radius-md)" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)", marginTop: "var(--space-12)" }}>
            <Skeleton height={200} borderRadius="var(--radius-lg)" />
            <Skeleton height={200} borderRadius="var(--radius-lg)" />
            <Skeleton height={200} borderRadius="var(--radius-lg)" />
          </div>
        </div>
      </Container>
    </div>
  );
}
