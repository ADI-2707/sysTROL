"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { ProjectLogEntryDto } from "@systrol/types";
import { LogEntryCard } from "./LogEntryCard.js";

export interface DayGroupProps {
  date: string;
  entries: ProjectLogEntryDto[];
  canDelete: boolean;
  onDelete?: (id: string) => void;
}

export function DayGroup({ date, entries, canDelete, onDelete }: DayGroupProps) {
  const formatHeading = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "4px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <Calendar size={14} color="var(--text-muted)" />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: "var(--text-heading)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {formatHeading(date)}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          ({entries.length} {entries.length === 1 ? "entry" : "entries"})
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {entries.map((entry) => (
          <LogEntryCard
            key={entry.id}
            entry={entry}
            canDelete={canDelete}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
