import React from "react";
import styles from "./Card.module.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "dark" | "highlight" | "highlightTeal";
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  hoverable = true,
  className = "",
  onClick,
  ...props
}) => {
  const classes = [
    styles.card,
    styles[variant],
    hoverable ? styles.hoverable : "",
    onClick ? styles.clickable : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};
