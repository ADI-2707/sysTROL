"use client";

import React from "react";
import type { ToastItem } from "./toast-types.js";
import { ToastCard } from "./toast-card.js";

export interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "420px",
        width: "calc(100vw - 32px)",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
