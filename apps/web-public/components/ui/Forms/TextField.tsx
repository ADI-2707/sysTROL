import React, { forwardRef } from "react";
import styles from "./Forms.module.css";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, required, id, className = "", ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={styles.formGroup}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            <span>{label}</span>
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${error ? styles.hasError : ""} ${className}`.trim()}
          {...props}
        />
        {hint && !error && <span className={styles.hint}>{hint}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

TextField.displayName = "TextField";
