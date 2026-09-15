import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton, PageHeaderSkeleton } from "@/components/ui/Skeleton";

export default function GalleryLoading() {
  return (
    <div style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <PageHeaderSkeleton />

        <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", marginBottom: "var(--space-12)" }}>
          <Skeleton width={120} height={40} borderRadius="var(--radius-full)" />
          <Skeleton width={150} height={40} borderRadius="var(--radius-full)" />
          <Skeleton width={110} height={40} borderRadius="var(--radius-full)" />
          <Skeleton width={160} height={40} borderRadius="var(--radius-full)" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "var(--space-5)" }}>
          <Skeleton height={380} borderRadius="var(--radius-lg)" />
          <Skeleton height={180} borderRadius="var(--radius-lg)" />
          <Skeleton height={180} borderRadius="var(--radius-lg)" />
        </div>
      </Container>
    </div>
  );
}
