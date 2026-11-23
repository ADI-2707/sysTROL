"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Filter,
  FileText,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import {
  LogEntryCategory,
  LogWeekStatus,
  ProjectLogEntryDto,
  ProjectLogWeekDto,
  UserRole,
} from "@systrol/types";
import {
  fetchLogEntries,
  fetchLogWeeks,
  lockWeek,
  unlockWeek,
  deleteLogEntry,
} from "@/lib/project-log-api";
import { WeekAccordion } from "./WeekAccordion.js";
import { PostUpdateModal } from "./PostUpdateModal.js";
import { useToast } from "@systrol/ui";

export interface ProjectLogTabProps {
  projectId: string;
  steps: Array<{ id: string; title: string }>;
  userRole?: string;
  initialStepFilter?: string;
}

export function ProjectLogTab({
  projectId,
  steps,
  userRole = "SUPER_ADMIN",
  initialStepFilter,
}: ProjectLogTabProps) {
  const { toast } = useToast();
  const [weeks, setWeeks] = useState<ProjectLogWeekDto[]>([]);
  const [entries, setEntries] = useState<ProjectLogEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stepFilter, setStepFilter] = useState<string>(initialStepFilter || "");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showPostModal, setShowPostModal] = useState(false);

  const canPost = [
    UserRole.SUPER_ADMIN,
    UserRole.COMMISSIONING_LEAD,
    UserRole.FIELD_ENGINEER,
  ].includes(userRole as UserRole);

  const canLock = [
    UserRole.SUPER_ADMIN,
    UserRole.COMMISSIONING_LEAD,
  ].includes(userRole as UserRole);

  const canUnlock = userRole === UserRole.SUPER_ADMIN;
  const canDelete = userRole === UserRole.SUPER_ADMIN;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedWeeks, fetchedEntriesRes] = await Promise.all([
        fetchLogWeeks(projectId),
        fetchLogEntries(projectId, {
          stepId: stepFilter || undefined,
          category: (categoryFilter as LogEntryCategory) || undefined,
          limit: 100,
        }),
      ]);

      setWeeks(fetchedWeeks);
      setEntries(fetchedEntriesRes.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load project log data");
    } finally {
      setLoading(false);
    }
  }, [projectId, stepFilter, categoryFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLockWeek = async (weekId: string) => {
    try {
      await lockWeek(projectId, weekId);
      setWeeks((prev) =>
        prev.map((w) =>
          w.id === weekId ? { ...w, status: LogWeekStatus.LOCKED, lockedAt: new Date().toISOString() } : w
        )
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to lock week");
    }
  };

  const handleUnlockWeek = async (weekId: string) => {
    try {
      await unlockWeek(projectId, weekId);
      setWeeks((prev) =>
        prev.map((w) =>
          w.id === weekId ? { ...w, status: LogWeekStatus.OPEN, lockedAt: null } : w
        )
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to unlock week");
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) return;
    try {
      await deleteLogEntry(projectId, entryId);
      setEntries((prev) => prev.filter((e) => e.id !== entryId));
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete entry");
    }
  };

  const handleEntryCreated = (newEntry: ProjectLogEntryDto) => {
    setEntries((prev) => [newEntry, ...prev]);
    setWeeks((prev) => {
      const exists = prev.find((w) => w.id === newEntry.weekId);
      if (exists) {
        return prev.map((w) =>
          w.id === newEntry.weekId ? { ...w, entryCount: w.entryCount + 1 } : w
        );
      }
      return prev;
    });
  };

  const entriesByWeekId = useMemo(() => {
    const map = new Map<string, ProjectLogEntryDto[]>();
    for (const entry of entries) {
      const list = map.get(entry.weekId);
      if (list) {
        list.push(entry);
      } else {
        map.set(entry.weekId, [entry]);
      }
    }
    return map;
  }, [entries]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          padding: "16px 20px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "var(--text-heading)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FileText size={18} color="var(--sys-blue-primary)" />
            <span>Project Log</span>
          </h2>
          <p
            style={{
              fontSize: "12.5px",
              color: "var(--text-muted)",
              marginTop: "3px",
              marginBottom: 0,
            }}
          >
            Chronological work updates, daily logs, milestone checkpoints, and blockers.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={loadData}
            title="Refresh log"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px 12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-canvas)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <RotateCw size={14} />
          </button>

          {canPost && (
            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-blue-primary)",
                color: "#ffffff",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Plus size={15} />
              <span>Post Update</span>
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "8px",
          border: "1px solid var(--border-subtle)",
          padding: "10px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--text-muted)" }}>
          <Filter size={14} />
          <span>Filters:</span>
        </div>

        <select
          value={stepFilter}
          onChange={(e) => setStepFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-canvas)",
            color: "var(--text-heading)",
            fontSize: "12.5px",
          }}
        >
          <option value="">All Lifecycle Steps</option>
          {steps.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-canvas)",
            color: "var(--text-heading)",
            fontSize: "12.5px",
          }}
        >
          <option value="">All Categories</option>
          <option value={LogEntryCategory.PROGRESS}>Progress</option>
          <option value={LogEntryCategory.BLOCKER}>Blockers</option>
          <option value={LogEntryCategory.MILESTONE}>Milestones</option>
          <option value={LogEntryCategory.NOTE}>Notes</option>
        </select>

        {(stepFilter || categoryFilter) && (
          <button
            type="button"
            onClick={() => {
              setStepFilter("");
              setCategoryFilter("");
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--sys-blue-primary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.25)",
            color: "#ef4444",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "13.5px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          Loading project log...
        </div>
      ) : weeks.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: "13.5px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          No project log weeks recorded yet. Post an update to start the weekly log.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {weeks.map((week, idx) => (
            <WeekAccordion
              key={week.id}
              week={week}
              defaultOpen={idx === 0 || !!stepFilter}
              canLock={canLock}
              canUnlock={canUnlock}
              canDelete={canDelete}
              onLock={handleLockWeek}
              onUnlock={handleUnlockWeek}
              onDeleteEntry={handleDeleteEntry}
              entries={entriesByWeekId.get(week.id) || []}
            />
          ))}
        </div>
      )}

      {showPostModal && (
        <PostUpdateModal
          projectId={projectId}
          steps={steps}
          onClose={() => setShowPostModal(false)}
          onSuccess={handleEntryCreated}
        />
      )}
    </div>
  );
}
