"use client";

import React, { useState, useCallback, useMemo } from "react";
import type { ToastItem, ToastOptions, ToastVariant, ToastContextValue } from "./toast-types.js";
import { ToastContext } from "./toast-context.js";
import { ToastContainer } from "./toast-container.js";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const createToast = useCallback(
    (title: string, variant: ToastVariant = "info", options?: ToastOptions): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const duration = options?.duration !== undefined ? options.duration : variant === "error" ? 6000 : 4500;

      const newToast: ToastItem = {
        id,
        title,
        description: options?.description,
        variant,
        duration,
        createdAt: Date.now(),
        action: options?.action,
      };

      setToasts((prev) => [...prev.slice(-4), newToast]);
      return id;
    },
    []
  );

  const toast = useMemo(() => {
    const fn = (title: string, options?: ToastOptions) => createToast(title, "info", options);
    fn.success = (title: string, options?: ToastOptions) => createToast(title, "success", options);
    fn.error = (title: string, options?: ToastOptions) => createToast(title, "error", options);
    fn.warning = (title: string, options?: ToastOptions) => createToast(title, "warning", options);
    fn.info = (title: string, options?: ToastOptions) => createToast(title, "info", options);
    fn.dismiss = dismiss;
    return fn;
  }, [createToast, dismiss]);

  const contextValue: ToastContextValue = useMemo(
    () => ({
      toasts,
      toast,
    }),
    [toasts, toast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
