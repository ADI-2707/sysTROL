import React from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  createdAt: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextValue {
  toasts: ToastItem[];
  toast: {
    (title: string, options?: ToastOptions): string;
    success: (title: string, options?: ToastOptions) => string;
    error: (title: string, options?: ToastOptions) => string;
    warning: (title: string, options?: ToastOptions) => string;
    info: (title: string, options?: ToastOptions) => string;
    dismiss: (id: string) => void;
  };
}
