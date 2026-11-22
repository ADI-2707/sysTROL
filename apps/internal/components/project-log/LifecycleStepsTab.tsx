"use client";

import React, { useState } from "react";
import {
  GitCommit,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import {
  ProjectItem,
  ProjectLifecycleStep,
  INITIAL_COMPANY_EMPLOYEES,
} from "@/lib/projects-data";

export interface LifecycleStepsTabProps {
  project: ProjectItem;
  stepEntryCounts: Record<string, number>;
  onStepFilterSelect: (stepId: string) => void;
  onUpdateStep: (stepId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") => void;
  onAddSubStep: (order: number, title: string, notes?: string, assignedTo?: string) => void;
  onDeleteStep: (stepId: string) => void;
}

export function LifecycleStepsTab({
  project,
  stepEntryCounts,
  onStepFilterSelect,
  onUpdateStep,
  onAddSubStep,
  onDeleteStep,
}: LifecycleStepsTabProps) {
  const [showAddSubStepModal, setShowAddSubStepModal] = useState(false);
  const [targetStepOrder, setTargetStepOrder] = useState<number | null>(null);
  const [subStepTitle, setSubStepTitle] = useState("");
  const [subStepNotes, setSubStepNotes] = useState("");
  const [subStepAssignee, setSubStepAssignee] = useState(INITIAL_COMPANY_EMPLOYEES[0].name);

  const handleOpenAddSubStep = (order: number) => {
    setTargetStepOrder(order);
    setSubStepTitle("");
    setSubStepNotes("");
    setSubStepAssignee(INITIAL_COMPANY_EMPLOYEES[0].name);
    setShowAddSubStepModal(true);
  };

  const handleSaveSubStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subStepTitle.trim() || targetStepOrder === null) return;
    onAddSubStep(targetStepOrder, subStepTitle.trim(), subStepNotes.trim(), subStepAssignee);
    setShowAddSubStepModal(false);
  };

  const sortedSteps = [...project.steps].sort((a, b) => a.order - b.order);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        borderRadius: "12px",
        border: "1px solid var(--border-subtle)",
        padding: "24px",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <GitCommit size={20} color="var(--sys-green-accent)" />
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              12-Step Lifecycle Workflow & Sub-Steps
            </h2>
            <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
              Predefined milestone checkpoints with ability to mark completion, track personnel, and view associated log updates.
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sortedSteps.map((step, idx) => {
          const isCompleted = step.status === "COMPLETED";
          const isInProgress = step.status === "IN_PROGRESS";
          const logCount = stepEntryCounts[step.id] || 0;

          return (
            <div
              key={step.id}
              style={{
                padding: step.isPredefined ? "14px 18px" : "12px 16px 12px 32px",
                borderRadius: "8px",
                backgroundColor: step.isPredefined ? "var(--bg-canvas)" : "var(--bg-card)",
                border: step.isPredefined
                  ? `1px solid ${isCompleted ? "var(--sys-green-border)" : isInProgress ? "var(--sys-blue-border)" : "var(--border-subtle)"}`
                  : "1px dashed var(--border-subtle)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "260px", flex: 1 }}>
                <button
                  type="button"
                  onClick={() => {
                    const next = isCompleted ? "PENDING" : isInProgress ? "COMPLETED" : "IN_PROGRESS";
                    onUpdateStep(step.id, next);
                  }}
                  title="Click to toggle step completion status"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isCompleted ? "var(--sys-green-accent)" : isInProgress ? "var(--sys-blue-primary)" : "var(--text-muted)",
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} />
                  ) : isInProgress ? (
                    <Clock size={20} />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: step.isPredefined ? "var(--text-muted)" : "var(--sys-blue-primary)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {step.isPredefined ? `Step ${idx + 1}` : "Sub-Step"}
                    </span>

                    <h3
                      style={{
                        fontSize: step.isPredefined ? "15px" : "14px",
                        fontWeight: step.isPredefined ? 600 : 500,
                        color: isCompleted ? "var(--text-heading)" : "var(--text-body)",
                        margin: 0,
                      }}
                    >
                      {step.title}
                    </h3>

                    {logCount > 0 && (
                      <button
                        type="button"
                        onClick={() => onStepFilterSelect(step.id)}
                        title="View log updates for this step"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "2px 7px",
                          borderRadius: "999px",
                          backgroundColor: "var(--sys-blue-subtle)",
                          color: "var(--sys-blue-primary)",
                          border: "1px solid var(--sys-blue-border)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <FileText size={11} />
                        <span>{logCount} {logCount === 1 ? "log entry" : "log entries"}</span>
                      </button>
                    )}
                  </div>

                  {step.description && (
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {step.description}
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11.5px", color: "var(--text-muted)", marginTop: "4px", flexWrap: "wrap" }}>
                    {isCompleted ? (
                      <span>
                        Completed by <strong style={{ color: "var(--text-heading)" }}>{step.assignedTo || "Operations Lead"}</strong>
                        {step.completedAt && ` on ${step.completedAt}`}
                      </span>
                    ) : (
                      step.assignedTo && <span>Assigned to: <strong style={{ color: "var(--text-heading)" }}>{step.assignedTo}</strong></span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <select
                  value={step.status}
                  onChange={(e) => onUpdateStep(step.id, e.target.value as "PENDING" | "IN_PROGRESS" | "COMPLETED")}
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor:
                      step.status === "COMPLETED"
                        ? "var(--sys-green-subtle)"
                        : step.status === "IN_PROGRESS"
                        ? "var(--sys-blue-subtle)"
                        : "var(--bg-canvas)",
                    color:
                      step.status === "COMPLETED"
                        ? "var(--sys-green-accent)"
                        : step.status === "IN_PROGRESS"
                        ? "var(--sys-blue-primary)"
                        : "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleOpenAddSubStep(step.order)}
                  title="Add small step after this predefined step"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "5px 10px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-hover)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-body)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={13} />
                  <span>Add Step In Between</span>
                </button>

                {!step.isPredefined && (
                  <button
                    type="button"
                    onClick={() => onDeleteStep(step.id)}
                    title="Delete sub-step"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAddSubStepModal && (
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
          onClick={() => setShowAddSubStepModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
              padding: "24px",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 14px 0" }}>
              Insert Intermediate Step
            </h3>

            <form onSubmit={handleSaveSubStep} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Step Title / Requirement
                </label>
                <input
                  type="text"
                  value={subStepTitle}
                  onChange={(e) => setSubStepTitle(e.target.value)}
                  placeholder="e.g. Civil Foundation Curing Signoff"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-heading)",
                    fontSize: "13.5px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Details / Notes
                </label>
                <textarea
                  value={subStepNotes}
                  onChange={(e) => setSubStepNotes(e.target.value)}
                  placeholder="Specific requirements or prerequisites..."
                  rows={3}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-heading)",
                    fontSize: "13.5px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Assigned Lead
                </label>
                <select
                  value={subStepAssignee}
                  onChange={(e) => setSubStepAssignee(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-heading)",
                    fontSize: "13.5px",
                  }}
                >
                  {INITIAL_COMPANY_EMPLOYEES.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddSubStepModal(false)}
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
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    backgroundColor: "var(--sys-blue-primary)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Insert Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
