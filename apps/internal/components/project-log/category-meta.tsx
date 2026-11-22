import React from "react";
import { CheckCircle2, AlertOctagon, Flag, FileText } from "lucide-react";
import { LogEntryCategory } from "@systrol/types";

export interface CategoryMeta {
  value: LogEntryCategory;
  label: string;
  badgeLabel: string;
  icon: (size?: number) => React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const CATEGORY_CONFIG: Record<LogEntryCategory, CategoryMeta> = {
  [LogEntryCategory.PROGRESS]: {
    value: LogEntryCategory.PROGRESS,
    label: "Progress",
    badgeLabel: "PROGRESS",
    icon: (size = 13) => <CheckCircle2 size={size} />,
    color: "var(--sys-blue-primary)",
    bgColor: "var(--sys-blue-subtle)",
    borderColor: "var(--sys-blue-border)",
  },
  [LogEntryCategory.BLOCKER]: {
    value: LogEntryCategory.BLOCKER,
    label: "Blocker",
    badgeLabel: "BLOCKER",
    icon: (size = 13) => <AlertOctagon size={size} />,
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.25)",
  },
  [LogEntryCategory.MILESTONE]: {
    value: LogEntryCategory.MILESTONE,
    label: "Milestone",
    badgeLabel: "MILESTONE",
    icon: (size = 13) => <Flag size={size} />,
    color: "var(--sys-green-accent)",
    bgColor: "var(--sys-green-subtle)",
    borderColor: "var(--sys-green-border)",
  },
  [LogEntryCategory.NOTE]: {
    value: LogEntryCategory.NOTE,
    label: "Note",
    badgeLabel: "NOTE",
    icon: (size = 13) => <FileText size={size} />,
    color: "var(--text-muted)",
    bgColor: "var(--bg-canvas)",
    borderColor: "var(--border-subtle)",
  },
};

export const CATEGORY_OPTIONS = Object.values(CATEGORY_CONFIG);

export function getCategoryMeta(cat: LogEntryCategory): CategoryMeta {
  return CATEGORY_CONFIG[cat] || CATEGORY_CONFIG[LogEntryCategory.PROGRESS];
}
