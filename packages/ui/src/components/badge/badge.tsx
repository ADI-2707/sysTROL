"use client";

import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "green" | "amber" | "red" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  style,
  className = "",
  ...props
}: BadgeProps) {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "blue":
        return {
          backgroundColor: "var(--sys-blue-subtle)",
          color: "var(--sys-blue-primary)",
          border: "1px solid var(--sys-blue-border)",
        };
      case "green":
        return {
          backgroundColor: "var(--sys-green-subtle)",
          color: "var(--sys-green-accent)",
          border: "1px solid var(--sys-green-border)",
        };
      case "amber":
        return {
          backgroundColor: "var(--status-warning-subtle)",
          color: "var(--status-warning)",
          border: "1px solid var(--status-warning-border)",
        };
      case "red":
        return {
          backgroundColor: "var(--status-danger-subtle)",
          color: "var(--status-danger)",
          border: "1px solid var(--status-danger-border)",
        };
      case "neutral":
      default:
        return {
          backgroundColor: "var(--bg-hover)",
          color: "var(--text-body)",
          border: "1px solid var(--border-subtle)",
        };
    }
  };

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        fontWeight: 600,
        lineHeight: 1,
        fontSize: size === "sm" ? "10.5px" : "11.5px",
        padding: size === "sm" ? "2px 7px" : "3px 10px",
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
