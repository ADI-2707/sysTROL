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
          backgroundColor: "rgba(245, 158, 11, 0.12)",
          color: "#f59e0b",
          border: "1px solid rgba(245, 158, 11, 0.3)",
        };
      case "red":
        return {
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          color: "#ef4444",
          border: "1px solid rgba(239, 68, 68, 0.3)",
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
        padding: size === "sm" ? "2px 7px" : "3px 9px",
        letterSpacing: "0.02em",
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
