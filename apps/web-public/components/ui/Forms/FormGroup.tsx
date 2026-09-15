import React from "react";
import styles from "./Forms.module.css";

export interface FormGroupProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  required,
  error,
  hint,
  htmlFor,
  children,
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          <span>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
