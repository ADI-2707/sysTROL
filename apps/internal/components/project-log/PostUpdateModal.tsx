"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  Flag,
  FileText,
  X,
  Plus,
  Calendar,
} from "lucide-react";
import { LogEntryCategory, ProjectLogEntryDto } from "@systrol/types";
import { postLogEntry } from "@/lib/project-log-api";

export interface PostUpdateModalProps {
  projectId: string;
  steps: Array<{ id: string; title: string }>;
  onClose: () => void;
  onSuccess: (entry: ProjectLogEntryDto) => void;
}

export function PostUpdateModal({
  projectId,
  steps,
  onClose,
  onSuccess,
}: PostUpdateModalProps) {
  const getCurrentWeekDays = () => {
    const now = new Date();
    const dayNr = (now.getUTCDay() + 6) % 7;
    const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - dayNr));

    const days: Array<{ label: string; dateStr: string; isToday: boolean }> = [];
    for (let i = 0; i <= dayNr; i++) {
      const d = new Date(Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + i));
      const dateStr = d.toISOString();
      const weekday = d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
      const dayDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
      const isToday = i === dayNr;
      days.push({
        label: isToday ? `Today (${weekday}, ${dayDate})` : `${weekday}, ${dayDate}`,
        dateStr,
        isToday,
      });
    }
    return days;
  };

  const weekDays = getCurrentWeekDays();
  const defaultDay = weekDays[weekDays.length - 1]?.dateStr || new Date().toISOString();

  const [category, setCategory] = useState<LogEntryCategory>(LogEntryCategory.PROGRESS);
  const [selectedDate, setSelectedDate] = useState<string>(defaultDay);
  const [stepId, setStepId] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [blockers, setBlockers] = useState<string>("");
  const [nextAction, setNextAction] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddAttachment = () => {
    if (!attachmentUrl.trim()) return;
    if (attachments.length >= 5) {
      setError("Maximum 5 attachments allowed per entry");
      return;
    }
    try {
      new URL(attachmentUrl.trim());
      setAttachments([...attachments, attachmentUrl.trim()]);
      setAttachmentUrl("");
    } catch {
      setError("Please enter a valid URL for attachment");
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length < 10) {
      setError("Update content must be at least 10 characters long");
      return;
    }

    if (content.trim().length > 3000) {
      setError("Update content cannot exceed 3,000 characters");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await postLogEntry(projectId, {
        category,
        content: content.trim(),
        entryDate: selectedDate,
        stepId: stepId ? stepId : undefined,
        blockers: blockers.trim() || undefined,
        nextAction: nextAction.trim() || undefined,
        attachments,
      });

      onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to post log entry");
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: LogEntryCategory.PROGRESS, label: "Progress", icon: <CheckCircle2 size={14} /> },
    { value: LogEntryCategory.BLOCKER, label: "Blocker", icon: <AlertOctagon size={14} /> },
    { value: LogEntryCategory.MILESTONE, label: "Milestone", icon: <Flag size={14} /> },
    { value: LogEntryCategory.NOTE, label: "Note", icon: <FileText size={14} /> },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          padding: "24px",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text-heading)",
                margin: 0,
              }}
            >
              Post Project Update
            </h2>
            <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
              Log today or record day-wise entries for the active week. Strictly no backfilling.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#ef4444",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: "6px",
              }}
            >
              Update Category
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {categoryOptions.map((opt) => {
                const isSelected = category === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px 6px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--sys-blue-primary)" : "var(--border-subtle)",
                      backgroundColor: isSelected ? "var(--sys-blue-subtle)" : "var(--bg-canvas)",
                      color: isSelected ? "var(--sys-blue-primary)" : "var(--text-body)",
                      fontWeight: 600,
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {opt.icon}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  marginBottom: "4px",
                }}
              >
                <Calendar size={13} />
                <span>Day of Active Week</span>
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "12.5px",
                }}
              >
                {weekDays.map((d) => (
                  <option key={d.dateStr} value={d.dateStr}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                  marginBottom: "4px",
                }}
              >
                Related Step (Optional)
              </label>
              <select
                value={stepId}
                onChange={(e) => setStepId(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "8px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "12.5px",
                }}
              >
                <option value="">General Project Update</option>
                {steps.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                What happened? *
              </label>
              <span
                style={{
                  fontSize: "11px",
                  color: content.length > 2800 ? "#ef4444" : "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {content.length} / 3,000
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe work completed, milestones reached, or key technical updates..."
              rows={4}
              maxLength={3000}
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                color: "var(--text-heading)",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                Blockers / Impediments (Optional)
              </label>
              <span
                style={{
                  fontSize: "11px",
                  color: blockers.length > 700 ? "#ef4444" : "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {blockers.length} / 800
              </span>
            </div>
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="Any issues blocking progress, client dependencies, supplier delays..."
              rows={2}
              maxLength={800}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                color: "var(--text-heading)",
                fontSize: "13px",
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                Planned Next Steps (Optional)
              </label>
              <span
                style={{
                  fontSize: "11px",
                  color: nextAction.length > 400 ? "#ef4444" : "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {nextAction.length} / 500
              </span>
            </div>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g. Complete drive tuning stand 4, attend alignment review..."
              maxLength={500}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                color: "var(--text-heading)",
                fontSize: "13px",
              }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--text-heading)",
                }}
              >
                Evidence / Attachments (Optional)
              </label>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {attachments.length} / 5 max
              </span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://... attachment or document URL"
                disabled={attachments.length >= 5}
                style={{
                  flex: 1,
                  boxSizing: "border-box",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                }}
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                disabled={attachments.length >= 5}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-hover)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-heading)",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: attachments.length >= 5 ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  opacity: attachments.length >= 5 ? 0.6 : 1,
                }}
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                {attachments.map((url, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      backgroundColor: "var(--bg-canvas)",
                      border: "1px solid var(--border-subtle)",
                      fontSize: "12px",
                    }}
                  >
                    <span style={{ truncate: true, maxWidth: "400px" } as any}>{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(i)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "8px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "transparent",
                color: "var(--text-muted)",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "var(--sys-blue-primary)",
                color: "#ffffff",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Posting..." : "Post Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
