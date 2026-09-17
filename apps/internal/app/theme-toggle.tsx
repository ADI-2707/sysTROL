"use client";

import React, { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle light and dark theme mechanical switch"
      title={isDark ? "Mechanical Switch: Switch to Light Theme" : "Mechanical Switch: Switch to Dark Theme"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "72px",
        height: "30px",
        padding: "2px 3px",
        borderRadius: "6px",
        border: isDark ? "1px solid #3b4252" : "1px solid #cbd5e1",
        backgroundColor: isDark ? "#0f141c" : "#e2e8f0",
        boxShadow: isDark
          ? "inset 0 2px 4px rgba(0, 0, 0, 0.8), inset 0 -1px 1px rgba(255, 255, 255, 0.05), 0 1px 2px rgba(0, 0, 0, 0.4)"
          : "inset 0 2px 4px rgba(0, 0, 0, 0.15), inset 0 -1px 1px rgba(255, 255, 255, 0.8), 0 1px 2px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
        outline: "none",
        transition: "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        userSelect: "none",
      }}
    >
      <div
        data-testid="mechanical-rocker-lever"
        style={{
          position: "absolute",
          top: "3px",
          left: isDark ? "38px" : "3px",
          width: "30px",
          height: "22px",
          borderRadius: "4px",
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          backgroundImage: isDark
            ? "linear-gradient(180deg, #334155 0%, #1e293b 100%)"
            : "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
          boxShadow: isDark
            ? "0 2px 5px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 2px rgba(0, 0, 0, 0.4)"
            : "0 2px 5px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 1px rgba(0, 0, 0, 0.1)",
          border: isDark ? "1px solid #475569" : "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "left 0.22s cubic-bezier(0.34, 1.4, 0.64, 1), background-color 0.2s ease",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              width: "2px",
              height: "10px",
              borderRadius: "1px",
              backgroundColor: isDark ? "#64748b" : "#94a3b8",
            }}
          />
          <span
            style={{
              width: "2px",
              height: "10px",
              borderRadius: "1px",
              backgroundColor: isDark ? "#64748b" : "#94a3b8",
            }}
          />
          <span
            style={{
              width: "2px",
              height: "10px",
              borderRadius: "1px",
              backgroundColor: isDark ? "#64748b" : "#94a3b8",
            }}
          />
        </div>
      </div>

      <div
        style={{
          width: "30px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          opacity: !isDark ? 0.9 : 0.35,
          transition: "opacity 0.2s ease",
        }}
      >
        <Sun size={13} color={!isDark ? "#f59e0b" : "var(--text-muted)"} />
      </div>

      <div
        style={{
          width: "30px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          opacity: isDark ? 1 : 0.35,
          transition: "opacity 0.2s ease",
        }}
      >
        <Moon size={12} color={isDark ? "#38bdf8" : "var(--text-muted)"} />
      </div>

      <span
        data-testid="mechanical-micro-led"
        style={{
          position: "absolute",
          top: "1px",
          right: isDark ? "6px" : "auto",
          left: !isDark ? "6px" : "auto",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          backgroundColor: isDark ? "#38bdf8" : "#f59e0b",
          boxShadow: isDark ? "0 0 6px #38bdf8" : "0 0 6px #f59e0b",
          transition: "all 0.2s ease",
        }}
      />
    </button>
  );
}
