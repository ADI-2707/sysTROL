"use client";

import React from "react";

export interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  badge?: string;
  highlight?: "blue" | "green" | "amber" | "neutral" | string;
  variant?: "default" | "highlight" | "danger" | "success";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function KpiCard({
  title,
  value,
  unit,
  subtitle,
  icon,
  trend,
  badge,
  highlight = "neutral",
  variant = "default",
  className = "",
  style,
  onClick,
}: KpiCardProps) {
  const getCardStyle = (): React.CSSProperties => {
    switch (variant) {
      case "highlight":
        return {
          borderLeft: "4px solid var(--sys-green-accent)",
        };
      case "danger":
        return {
          borderLeft: "4px solid var(--status-danger)",
        };
      case "success":
        return {
          borderLeft: "4px solid var(--sys-blue-primary)",
        };
      case "default":
      default:
        return {};
    }
  };

  const getIconContainerStyle = (): React.CSSProperties => {
    const key = highlight || variant;
    switch (key) {
      case "blue":
      case "success":
        return {
          backgroundColor: "var(--sys-blue-subtle)",
          color: "var(--sys-blue-primary)",
          border: "1px solid var(--sys-blue-border)",
        };
      case "green":
      case "highlight":
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
      case "danger":
        return {
          backgroundColor: "var(--status-danger-subtle)",
          color: "var(--status-danger)",
          border: "1px solid var(--status-danger-border)",
        };
      case "neutral":
      default:
        return {
          backgroundColor: "var(--bg-hover)",
          color: "var(--text-muted)",
          border: "1px solid var(--border-subtle)",
        };
    }
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={className}
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "8px",
        padding: "18px 20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.15s ease",
        cursor: onClick ? "pointer" : "default",
        ...getCardStyle(),
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div>
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--text-muted)",
              display: "block",
            }}
          >
            {title}
          </span>
          {subtitle && (
            <span style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px", display: "block" }}>
              {subtitle}
            </span>
          )}
        </div>
        {icon && (
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ...getIconContainerStyle(),
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ marginTop: "14px", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-heading)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {value}
          </span>
          {unit && (
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
              {unit}
            </span>
          )}
        </div>

        {trend && (
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              color: trend.isPositive ? "var(--sys-green-accent)" : "var(--status-danger)",
              backgroundColor: trend.isPositive ? "var(--sys-green-subtle)" : "var(--status-danger-subtle)",
              padding: "2px 8px",
              borderRadius: "999px",
            }}
          >
            {trend.isPositive ? "\u2191" : "\u2193"} {trend.value}
          </span>
        )}

        {badge && (
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--sys-green-accent)",
              backgroundColor: "var(--sys-green-subtle)",
              border: "1px solid var(--sys-green-border)",
              padding: "2px 8px",
              borderRadius: "999px",
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
