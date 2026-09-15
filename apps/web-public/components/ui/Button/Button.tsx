import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import styles from "./Button.module.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "outlineDark" | "ghost" | "teal";
  size?: "sm" | "md" | "lg";
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  external?: boolean;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  leftIcon,
  rightIcon,
  className = "",
  external = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  const combinedClassName = `${styles.button} ${styles[variant]} ${styles[size]} ${
    isLoading ? styles.loading : ""
  } ${className}`.trim();

  const renderIcon = (icon: React.ReactNode, isRight = false) => (
    <span className={`${styles.icon} ${isRight ? styles.rightIcon : ""}`}>{icon}</span>
  );

  const activeLeftIcon = isLoading ? (
    <span className={styles.icon}>
      <Loader2 size={size === "sm" ? 14 : size === "lg" ? 18 : 16} className={styles.spinner} />
    </span>
  ) : (
    leftIcon && renderIcon(leftIcon)
  );

  if (href && !isLoading) {
    if (external) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target="_blank"
          rel="noopener noreferrer"
        >
          {activeLeftIcon}
          <span>{children}</span>
          {rightIcon && renderIcon(rightIcon, true)}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName}>
        {activeLeftIcon}
        <span>{children}</span>
        {rightIcon && renderIcon(rightIcon, true)}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading ? "true" : undefined}
      {...props}
    >
      {activeLeftIcon}
      <span>{children}</span>
      {rightIcon && !isLoading && renderIcon(rightIcon, true)}
    </button>
  );
};
