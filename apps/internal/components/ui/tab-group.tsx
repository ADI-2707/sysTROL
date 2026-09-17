"use client";

import React from "react";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
}

export interface TabGroupProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  style?: React.CSSProperties;
}

export function TabGroup<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  style,
}: TabGroupProps<T>) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "6px",
        padding: "6px 8px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "10px",
        ...style,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: isActive ? 600 : 500,
              backgroundColor: isActive ? "var(--sys-green-accent)" : "transparent",
              color: isActive ? "#ffffff" : "var(--text-body)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: "9999px",
                  fontSize: "10px",
                  fontWeight: 700,
                  backgroundColor: isActive ? "rgba(255, 255, 255, 0.25)" : "var(--border-subtle)",
                  color: isActive ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
