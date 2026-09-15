import React from "react";
import styles from "./Container.module.css";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "normal" | "wide" | "narrow";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = "normal",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`${styles.container} ${styles[size]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};
