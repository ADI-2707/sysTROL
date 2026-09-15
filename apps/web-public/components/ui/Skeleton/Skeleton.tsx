import React from "react";
import styles from "./Skeleton.module.css";

export interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  borderRadius,
  className = "",
  style = {},
}) => {
  const customStyles: React.CSSProperties = {
    ...style,
    width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
    height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
    borderRadius,
  };

  const combinedClasses = `${styles.skeleton} ${styles[variant]} ${className}`.trim();

  return <span className={combinedClasses} style={customStyles} aria-hidden="true" />;
};

export const PageHeaderSkeleton: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
      <Skeleton width={120} height={24} borderRadius="9999px" />
      <Skeleton width="65%" height={44} />
      <Skeleton width="85%" height={20} />
    </div>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className={styles.projectCardSkeleton} aria-hidden="true">
      <Skeleton width="100%" height={160} borderRadius="var(--radius-sm)" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
        <Skeleton width={90} height={20} borderRadius="9999px" />
        <Skeleton width={110} height={14} />
      </div>
      <Skeleton width="90%" height={26} style={{ marginTop: "4px" }} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="75%" height={14} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
        <Skeleton width="100%" height={46} borderRadius="var(--radius-sm)" />
        <Skeleton width="100%" height={46} borderRadius="var(--radius-sm)" />
      </div>
      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
        <Skeleton width={60} height={20} borderRadius="9999px" />
        <Skeleton width={75} height={20} borderRadius="9999px" />
        <Skeleton width={65} height={20} borderRadius="9999px" />
      </div>
      <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={100} height={14} />
        <Skeleton width={90} height={14} />
      </div>
    </div>
  );
};

export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className={styles.serviceCardSkeleton} aria-hidden="true">
      <Skeleton width="100%" height={180} borderRadius="var(--radius-md)" />
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Skeleton width={44} height={44} borderRadius="var(--radius-md)" />
        <Skeleton width={180} height={22} borderRadius="9999px" />
      </div>
      <Skeleton width="80%" height={32} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="60%" height={16} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
        <Skeleton width={80} height={24} borderRadius="9999px" />
        <Skeleton width={110} height={24} borderRadius="9999px" />
        <Skeleton width={95} height={24} borderRadius="9999px" />
      </div>
      <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between" }}>
        <Skeleton width={140} height={14} />
        <Skeleton width={110} height={18} />
      </div>
    </div>
  );
};
