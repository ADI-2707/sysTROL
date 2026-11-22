"use client";

import React from "react";
import {
  Trash2,
  Paperclip,
  Clock,
  User,
  ArrowRight,
} from "lucide-react";
import { ProjectLogEntryDto } from "@systrol/types";
import { getCategoryMeta } from "./category-meta.js";

export interface LogEntryCardProps {
  entry: ProjectLogEntryDto;
  canDelete: boolean;
  onDelete?: (id: string) => void;
}

export function LogEntryCard({ entry, canDelete, onDelete }: LogEntryCardProps) {
  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const meta = getCategoryMeta(entry.category);

  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "border-color 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: meta.bgColor,
              color: meta.color,
              border: `1px solid ${meta.borderColor}`,
              letterSpacing: "0.5px",
            }}
          >
            {meta.icon(13)}
            <span>{meta.badgeLabel}</span>
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12.5px",
              fontWeight: 600,
              color: "var(--text-heading)",
            }}
          >
            <User size={13} color="var(--text-muted)" />
            <span>{entry.authorName}</span>
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11.5px",
              color: "var(--text-muted)",
            }}
          >
            <Clock size={12} />
            <span>{formatTime(entry.createdAt)}</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "var(--bg-canvas)",
              color: "var(--text-muted)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {entry.stage}
          </span>

          {canDelete && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(entry.id)}
              title="Delete log entry"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "2px",
                display: "inline-flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ef4444";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {entry.stepTitle && (
        <div
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--sys-blue-primary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span>Step:</span>
          <span>{entry.stepTitle}</span>
        </div>
      )}

      <div
        style={{
          fontSize: "13.5px",
          lineHeight: 1.5,
          color: "var(--text-body)",
          whiteSpace: "pre-wrap",
        }}
      >
        {entry.content}
      </div>

      {entry.blockers && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "rgba(239, 68, 68, 0.06)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            fontSize: "12.5px",
            color: "#b91c1c",
            display: "flex",
            gap: "6px",
          }}
        >
          <strong style={{ flexShrink: 0 }}>Blocker:</strong>
          <span>{entry.blockers}</span>
        </div>
      )}

      {entry.nextAction && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            backgroundColor: "var(--sys-blue-subtle)",
            border: "1px solid var(--sys-blue-border)",
            fontSize: "12.5px",
            color: "var(--sys-blue-primary)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ArrowRight size={13} style={{ flexShrink: 0 }} />
          <span>
            <strong>Next:</strong> {entry.nextAction}
          </span>
        </div>
      )}

      {entry.attachments && entry.attachments.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            paddingTop: "4px",
          }}
        >
          {entry.attachments.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 8px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-canvas)",
                border: "1px solid var(--border-subtle)",
                fontSize: "11.5px",
                color: "var(--text-body)",
                textDecoration: "none",
              }}
            >
              <Paperclip size={12} color="var(--text-muted)" />
              <span>Attachment {idx + 1}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
