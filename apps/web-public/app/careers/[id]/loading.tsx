import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function JobDetailsLoading() {
  return (
    <div style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <Skeleton width={180} height={20} style={{ marginBottom: "24px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <Skeleton width={120} height={26} borderRadius="var(--radius-sm)" />
            <Skeleton width={90} height={26} borderRadius="var(--radius-sm)" />
          </div>
          <Skeleton width="75%" height={44} />
          <Skeleton width="60%" height={20} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          <Skeleton height={70} borderRadius="var(--radius-md)" />
          <Skeleton height={70} borderRadius="var(--radius-md)" />
          <Skeleton height={70} borderRadius="var(--radius-md)" />
          <Skeleton height={70} borderRadius="var(--radius-md)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "40px" }}>
          <Skeleton height={160} borderRadius="var(--radius-lg)" />
          <Skeleton height={200} borderRadius="var(--radius-lg)" />
          <Skeleton height={180} borderRadius="var(--radius-lg)" />
        </div>
      </Container>
    </div>
  );
}
