import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { PageHeaderSkeleton, ServiceCardSkeleton } from "@/components/ui/Skeleton";

export default function ServicesLoading() {
  return (
    <div style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <PageHeaderSkeleton />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "var(--space-8)" }}>
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
        </div>
      </Container>
    </div>
  );
}
