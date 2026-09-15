"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", icon, style, className = "", disabled, ...props }, ref) => {
    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case "accent":
          return {
            backgroundColor: "var(--btn-accent-bg)",
            color: "#ffffff",
            border: "1px solid transparent",
          };
        case "outline":
          return {
            backgroundColor: "transparent",
            color: "var(--text-heading)",
            border: "1px solid var(--border-subtle)",
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: "var(--text-body)",
            border: "1px solid transparent",
          };
        case "danger":
          return {
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            color: "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.25)",
          };
        case "primary":
        default:
          return {
            backgroundColor: "var(--btn-primary-bg)",
            color: "var(--btn-primary-text)",
            border: "1px solid transparent",
          };
      }
    };

    const getSizeStyles = (): React.CSSProperties => {
      switch (size) {
        case "sm":
          return {
            height: "30px",
            padding: "0 10px",
            fontSize: "12px",
            gap: "6px",
          };
        case "lg":
          return {
            height: "42px",
            padding: "0 20px",
            fontSize: "14.5px",
            gap: "10px",
          };
        case "md":
        default:
          return {
            height: "36px",
            padding: "0 14px",
            fontSize: "13px",
            gap: "8px",
          };
      }
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          fontWeight: 600,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          transition: "all 0.15s ease",
          boxShadow: variant === "ghost" ? "none" : "var(--shadow-sm)",
          whiteSpace: "nowrap",
          ...getSizeStyles(),
          ...getVariantStyles(),
          ...style,
        }}
        {...props}
      >
        {icon && <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
