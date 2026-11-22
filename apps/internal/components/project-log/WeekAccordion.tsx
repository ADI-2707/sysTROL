"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Lock, Unlock } from "lucide-react";
import { LogWeekStatus, ProjectLogEntryDto, ProjectLogWeekDto } from "@systrol/types";
import { DayGroup } from "./DayGroup.js";

export interface WeekAccordionProps {
  week: ProjectLogWeekDto;
  defaultOpen: boolean;
  canLock: boolean;
  canUnlock: boolean;
  canDelete: boolean;
  onLock: (weekId: string) => void;
  onUnlock: (weekId: string) => void;
  onDeleteEntry?: (entryId: string) => void;
  entries?: ProjectLogEntryDto[];
}

export function WeekAccordion({
  week,
  defaultOpen,
  canLock,
  canUnlock,
  canDelete,
  onLock,
  onUnlock,
  onDeleteEntry,
  entries = [],
}: WeekAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const formatRange = (startStr: string, endStr: string) => {
    try {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const sMonth = s.toLocaleDateString("en-US", { month: "short" });
      const eMonth = e.toLocaleDateString("en-US", { month: "short" });
      const sDay = s.getUTCDate();
      const eDay = e.getUTCDate();
      const year = s.getUTCFullYear();

      if (sMonth === eMonth) {
        return `${sMonth} ${sDay}–${eDay}, ${year}`;
      }
      return `${sMonth} ${sDay} – ${eMonth} ${eDay}, ${year}`;
    } catch {
      return `${startStr} - ${endStr}`;
    }
  };

  const isLocked = week.status === LogWeekStatus.LOCKED;

  const groupedByDate = entries.reduce<Record<string, ProjectLogEntryDto[]>>((acc, entry) => {
    const d = entry.entryDate ? entry.entryDate.split("T")[0] : "Other";
    if (!acc[d]) acc[d] = [];
    acc[d].push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div
      style={{
        borderRadius: "10px",
        border: "1px solid var(--border-subtle)",
        backgroundColor: "var(--bg-card)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "14px 18px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          cursor: "pointer",
          backgroundColor: isOpen ? "var(--bg-canvas)" : "transparent",
          transition: "background-color 0.15s ease",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isOpen ? (
            <ChevronDown size={18} color="var(--text-muted)" />
          ) : (
            <ChevronRight size={18} color="var(--text-muted)" />
          )}

          <div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "var(--text-heading)",
                fontFamily: "var(--font-mono)",
              }}
            >
              WEEK {week.weekNumber}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                marginLeft: "8px",
              }}
            >
              — {formatRange(week.startDate, week.endDate)}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "3px 8px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: isLocked ? "var(--bg-hover)" : "var(--sys-green-subtle)",
              color: isLocked ? "var(--text-muted)" : "var(--sys-green-accent)",
              border: `1px solid ${isLocked ? "var(--border-subtle)" : "var(--sys-green-border)"}`,
            }}
          >
            {isLocked ? <Lock size={11} /> : <Unlock size={11} />}
            <span>{isLocked ? "LOCKED" : "OPEN"}</span>
          </span>

          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--text-muted)",
              padding: "2px 8px",
              borderRadius: "999px",
              backgroundColor: "var(--bg-canvas)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {entries.length || week.entryCount}{" "}
            {(entries.length || week.entryCount) === 1 ? "entry" : "entries"}
          </span>

          {!isLocked && canLock && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLock(week.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Lock size={12} />
              <span>Lock Week</span>
            </button>
          )}

          {isLocked && canUnlock && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onUnlock(week.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                borderRadius: "6px",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                color: "#ef4444",
                fontSize: "11.5px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Unlock size={12} />
              <span>Unlock</span>
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            padding: "16px 18px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {entries.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "13px",
              }}
            >
              No updates logged for this week.
            </div>
          ) : (
            sortedDates.map((d) => (
              <DayGroup
                key={d}
                date={d}
                entries={groupedByDate[d]}
                canDelete={canDelete}
                onDelete={onDeleteEntry}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
