import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton, PageHeaderSkeleton } from "@/components/ui/Skeleton";

export default function ContactLoading() {
  return (
    <div style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <PageHeaderSkeleton />

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "var(--space-12)", alignItems: "start" }}>
          <div
            style={{
              backgroundColor: "var(--color-surface-0)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-8)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Skeleton height={50} borderRadius="var(--radius-md)" />
              <Skeleton height={50} borderRadius="var(--radius-md)" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <Skeleton height={50} borderRadius="var(--radius-md)" />
              <Skeleton height={50} borderRadius="var(--radius-md)" />
            </div>
            <Skeleton height={50} borderRadius="var(--radius-md)" />
            <Skeleton height={110} borderRadius="var(--radius-md)" />
            <Skeleton width={180} height={46} borderRadius="var(--radius-md)" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Skeleton height={130} borderRadius="var(--radius-lg)" />
            <Skeleton height={130} borderRadius="var(--radius-lg)" />
            <Skeleton height={130} borderRadius="var(--radius-lg)" />
          </div>
        </div>
      </Container>
    </div>
  );
}
