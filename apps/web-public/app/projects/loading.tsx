import React from "react";
import { Container } from "@/components/layout/Container/Container";
import { Skeleton, PageHeaderSkeleton, ProjectCardSkeleton } from "@/components/ui/Skeleton";

export default function ProjectsLoading() {
  return (
    <div style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-20)" }}>
      <Container size="wide">
        <PageHeaderSkeleton />

        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          <Skeleton width={110} height={36} borderRadius="9999px" />
          <Skeleton width={140} height={36} borderRadius="9999px" />
          <Skeleton width={150} height={36} borderRadius="9999px" />
          <Skeleton width={130} height={36} borderRadius="9999px" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-6)" }}>
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </Container>
    </div>
  );
}
