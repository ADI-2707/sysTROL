"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        height: "32px",
        padding: "0 10px",
        borderRadius: "6px",
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-card)",
        color: "var(--text-body)",
        fontSize: "12px",
        fontWeight: 600,
        transition: "all 0.15s ease",
      }}
    >
      {theme === "light" ? (
        <>
          <Moon size={14} color="var(--sys-blue-primary)" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun size={14} color="var(--sys-green-accent)" />
          <span>Light</span>
        </>
      )}
    </button>
  );
}
