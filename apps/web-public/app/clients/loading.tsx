import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton, PageHeaderSkeleton } from "@/components/ui/Skeleton";

export default function ClientsLoading() {
  return (
    <div style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <PageHeaderSkeleton />

        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          <Skeleton width={130} height={36} borderRadius="9999px" />
          <Skeleton width={150} height={36} borderRadius="9999px" />
          <Skeleton width={140} height={36} borderRadius="9999px" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--color-surface-0)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Skeleton width={90} height={20} borderRadius="9999px" />
              <Skeleton width="80%" height={24} />
              <Skeleton width="60%" height={16} />
              <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--color-border)" }}>
                <Skeleton width="50%" height={14} />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
