"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertOctagon,
  Flag,
  FileText,
  X,
  Plus,
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
  const [category, setCategory] = useState<LogEntryCategory>(LogEntryCategory.PROGRESS);
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

    setSubmitting(true);
    setError(null);

    try {
      const created = await postLogEntry(projectId, {
        category,
        content: content.trim(),
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
          maxWidth: "520px",
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
              Log day-wise progress, milestones, or blockers.
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
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                color: "var(--text-heading)",
                fontSize: "13px",
              }}
            >
              <option value="">General Project Update (No Specific Step)</option>
              {steps.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
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
              What happened today? *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe work completed, milestones reached, or key technical updates..."
              rows={4}
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
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: "4px",
              }}
            >
              Blockers / Impediments (Optional)
            </label>
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="Any issues blocking progress, client dependencies, supplier delays..."
              rows={2}
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
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: "4px",
              }}
            >
              Planned Next Steps (Optional)
            </label>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g. Complete drive tuning stand 4, attend alignment review..."
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
            <label
              style={{
                display: "block",
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: "4px",
              }}
            >
              Evidence / Attachments (Optional)
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="url"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="https://... attachment or document URL"
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
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-hover)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-heading)",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
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
                    <span style={{ truncate: true, maxWidth: "380px" } as any}>{url}</span>
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
