import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton, PageHeaderSkeleton } from "@/components/ui/Skeleton";

export default function AboutLoading() {
  return (
    <div style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <PageHeaderSkeleton />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-16)" }}>
          <Skeleton height={100} borderRadius="var(--radius-lg)" />
          <Skeleton height={100} borderRadius="var(--radius-lg)" />
          <Skeleton height={100} borderRadius="var(--radius-lg)" />
          <Skeleton height={100} borderRadius="var(--radius-lg)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "var(--space-12)", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Skeleton width="100%" height={24} />
            <Skeleton width="95%" height={16} />
            <Skeleton width="90%" height={16} />
            <Skeleton width="98%" height={16} />
            <Skeleton width="85%" height={16} />
          </div>
          <Skeleton height={320} borderRadius="var(--radius-xl)" />
        </div>
      </Container>
    </div>
  );
}
