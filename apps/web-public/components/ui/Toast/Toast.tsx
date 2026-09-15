"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

export interface ToastProps {
  id?: string;
  type?: "success" | "error" | "info";
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = "success",
  title,
  message,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const renderIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} color="var(--color-success-500)" />;
      case "error":
        return <AlertCircle size={20} color="var(--color-danger-500)" />;
      default:
        return <Info size={20} color="var(--color-accent-teal-500)" />;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <div style={{ flexShrink: 0, marginTop: "1px" }}>{renderIcon()}</div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.message}>{message}</div>
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
