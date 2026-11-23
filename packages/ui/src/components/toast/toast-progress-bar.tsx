"use client";

import React from "react";
import type { ToastVariant } from "./toast-types.js";

export interface ToastProgressBarProps {
  duration: number;
  variant: ToastVariant;
  isPaused: boolean;
}

export function ToastProgressBar({ duration, variant, isPaused }: ToastProgressBarProps) {
  if (duration <= 0) return null;

  const getColor = (): string => {
    switch (variant) {
      case "success":
        return "var(--status-success)";
      case "error":
        return "var(--status-danger)";
      case "warning":
        return "var(--status-warning)";
      case "info":
      default:
        return "var(--status-info)";
    }
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "3px",
        backgroundColor: getColor(),
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        animation: `toastProgress ${duration}ms linear forwards`,
        animationPlayState: isPaused ? "paused" : "running",
        willChange: "width",
      }}
    />
  );
}
