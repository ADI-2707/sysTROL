"use client";

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "surface" | "table";
}

export function Card({
  children,
  variant = "card",
  style,
  className = "",
  ...props
}: CardProps) {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "surface":
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          boxShadow: "var(--shadow-card)",
        };
      case "table":
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
        };
      case "card":
      default:
        return {
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "8px",
          boxShadow: "var(--shadow-sm)",
        };
    }
  };

  return (
    <div
      className={className}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Surface(props: CardProps) {
  return <Card variant="surface" {...props} />;
}
