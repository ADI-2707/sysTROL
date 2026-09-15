import React, { forwardRef } from "react";
import styles from "./Forms.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: SelectOption[];
  placeholderOption?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      required,
      id,
      options,
      placeholderOption = "Select an option",
      className = "",
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name;

    return (
      <div className={styles.formGroup}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            <span>{label}</span>
            {required && <span className={styles.required}>*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${styles.select} ${error ? styles.hasError : ""} ${className}`.trim()}
          {...props}
        >
          {placeholderOption && (
            <option value="" disabled>
              {placeholderOption}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <span className={styles.hint}>{hint}</span>}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
