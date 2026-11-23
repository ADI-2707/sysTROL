"use client";

import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({
  variant = "rectangular",
  width,
  height,
  borderRadius,
  style,
  className = "",
  ...props
}: SkeletonProps) {
  const getDefaultDimensions = () => {
    switch (variant) {
      case "text":
        return {
          width: width ?? "100%",
          height: height ?? "14px",
          borderRadius: borderRadius ?? "4px",
        };
      case "circular":
        return {
          width: width ?? "40px",
          height: height ?? "40px",
          borderRadius: borderRadius ?? "50%",
        };
      case "card":
        return {
          width: width ?? "100%",
          height: height ?? "160px",
          borderRadius: borderRadius ?? "12px",
        };
      case "rectangular":
      default:
        return {
          width: width ?? "100%",
          height: height ?? "20px",
          borderRadius: borderRadius ?? "6px",
        };
    }
  };

  const dims = getDefaultDimensions();

  const shimmerStyle: React.CSSProperties = {
    width: dims.width,
    height: dims.height,
    borderRadius: dims.borderRadius,
    backgroundImage:
      "linear-gradient(90deg, var(--bg-card, #1a2234) 0%, var(--border-subtle, #2e3d5b) 50%, var(--bg-card, #1a2234) 100%)",
    backgroundSize: "200% 100%",
    animation: "skeletonShimmer 1.5s infinite linear",
    display: "block",
    ...style,
  };

  return (
    <div
      data-testid="skeleton"
      className={`skeleton-shimmer ${className}`.trim()}
      style={shimmerStyle}
      {...props}
    />
  );
}

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
}

export function SkeletonCard({
  height = "160px",
  style,
  className = "",
  ...props
}: SkeletonCardProps) {
  return (
    <div
      data-testid="skeleton-card"
      style={{
        backgroundColor: "var(--bg-card)",
        padding: "20px 24px",
        borderRadius: "12px",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        ...style,
      }}
      className={className}
      {...props}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="text" width="45%" height="18px" />
        <Skeleton variant="circular" width="22px" height="22px" />
      </div>
      <Skeleton variant="text" width="70%" height="12px" />
      <Skeleton variant="rectangular" width="100%" height={height} />
    </div>
  );
}

export interface SkeletonKpiCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SkeletonKpiCard({ style, className = "", ...props }: SkeletonKpiCardProps) {
  return (
    <div
      data-testid="skeleton-kpi-card"
      style={{
        backgroundColor: "var(--bg-card)",
        padding: "18px 20px",
        borderRadius: "12px",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...style,
      }}
      className={className}
      {...props}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="text" width="55%" height="12px" />
        <Skeleton variant="circular" width="16px" height="16px" />
      </div>
      <Skeleton variant="text" width="40%" height="32px" borderRadius="6px" />
      <Skeleton variant="text" width="75%" height="12px" />
    </div>
  );
}

export interface SkeletonTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  columns?: number;
}

export function SkeletonTableRow({
  columns = 4,
  style,
  className = "",
  ...props
}: SkeletonTableRowProps) {
  return (
    <tr
      data-testid="skeleton-table-row"
      style={{ borderBottom: "1px solid var(--border-subtle)", ...style }}
      className={className}
      {...props}
    >
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} style={{ padding: "12px" }}>
          <Skeleton
            variant="text"
            width={idx === 0 ? "35%" : idx === 1 ? "80%" : "55%"}
            height="14px"
          />
        </td>
      ))}
    </tr>
  );
}
