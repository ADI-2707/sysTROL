import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CaseStudyLoading() {
  return (
    <div style={{ paddingTop: "var(--space-12)", paddingBottom: "var(--space-20)" }}>
      <Container size="normal">
        <Skeleton width={150} height={20} style={{ marginBottom: "24px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
          <Skeleton width={130} height={26} borderRadius="var(--radius-sm)" />
          <Skeleton width="85%" height={44} />
          <div style={{ display: "flex", gap: "16px" }}>
            <Skeleton width={160} height={16} />
            <Skeleton width={120} height={16} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px", marginBottom: "40px" }}>
          <Skeleton height={80} borderRadius="var(--radius-md)" />
          <Skeleton height={80} borderRadius="var(--radius-md)" />
          <Skeleton height={80} borderRadius="var(--radius-md)" />
          <Skeleton height={80} borderRadius="var(--radius-md)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "40px" }}>
          <Skeleton height={180} borderRadius="var(--radius-lg)" />
          <Skeleton height={200} borderRadius="var(--radius-lg)" />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Skeleton width={90} height={28} borderRadius="var(--radius-sm)" />
          <Skeleton width={110} height={28} borderRadius="var(--radius-sm)" />
          <Skeleton width={130} height={28} borderRadius="var(--radius-sm)" />
        </div>
      </Container>
    </div>
  );
}
