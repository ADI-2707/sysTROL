"use client";

import { createContext, useContext } from "react";
import type { ToastContextValue, ToastOptions } from "./toast-types.js";

const noopToast = (title: string, options?: ToastOptions): string => "";
noopToast.success = (title: string, options?: ToastOptions): string => "";
noopToast.error = (title: string, options?: ToastOptions): string => "";
noopToast.warning = (title: string, options?: ToastOptions): string => "";
noopToast.info = (title: string, options?: ToastOptions): string => "";
noopToast.dismiss = (id: string): void => {};

export const defaultToastContextValue: ToastContextValue = {
  toasts: [],
  toast: noopToast,
};

export const ToastContext = createContext<ToastContextValue>(defaultToastContextValue);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  return context || defaultToastContextValue;
}
