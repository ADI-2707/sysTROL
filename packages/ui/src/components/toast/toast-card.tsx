"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import type { ToastItem, ToastVariant } from "./toast-types.js";
import { ToastProgressBar } from "./toast-progress-bar.js";

export interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function ToastCard({ toast, onDismiss }: ToastCardProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const remainingTimeRef = useRef(toast.duration);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startDismissal = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 280);
  };

  useEffect(() => {
    if (toast.duration <= 0) return;

    if (!isHovered) {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        startDismissal();
      }, remainingTimeRef.current);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovered, toast.duration]);

  const renderIcon = (variant: ToastVariant) => {
    switch (variant) {
      case "success":
        return <CheckCircle2 size={18} style={{ color: "var(--status-success)", flexShrink: 0 }} />;
      case "error":
        return <AlertCircle size={18} style={{ color: "var(--status-danger)", flexShrink: 0 }} />;
      case "warning":
        return <AlertTriangle size={18} style={{ color: "var(--status-warning)", flexShrink: 0 }} />;
      case "info":
      default:
        return <Info size={18} style={{ color: "var(--status-info)", flexShrink: 0 }} />;
    }
  };

  const getBorderColor = (variant: ToastVariant): string => {
    switch (variant) {
      case "success":
        return "var(--status-success-border)";
      case "error":
        return "var(--status-danger-border)";
      case "warning":
        return "var(--status-warning-border)";
      case "info":
      default:
        return "var(--status-info-border)";
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px 16px 16px",
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${getBorderColor(toast.variant)}`,
        borderRadius: "8px",
        boxShadow: "var(--shadow-lg)",
        color: "var(--text-heading)",
        minWidth: "300px",
        maxWidth: "420px",
        pointerEvents: "auto",
        animation: isExiting
          ? "toastSlideDown 0.28s cubic-bezier(0.4, 0, 1, 1) forwards"
          : "toastPopIn 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      <div style={{ marginTop: "1px", display: "flex", alignItems: "center" }}>
        {renderIcon(toast.variant)}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 600,
            lineHeight: 1.4,
            color: "var(--text-heading)",
          }}
        >
          {toast.title}
        </div>
        {toast.description && (
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              marginTop: "4px",
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {toast.description}
          </div>
        )}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            style={{
              marginTop: "8px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--sys-blue-primary)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label="Close notification"
        onClick={startDismissal}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          flexShrink: 0,
          marginTop: "1px",
        }}
      >
        <X size={15} />
      </button>

      <ToastProgressBar duration={toast.duration} variant={toast.variant} isPaused={isHovered} />
    </div>
  );
}
