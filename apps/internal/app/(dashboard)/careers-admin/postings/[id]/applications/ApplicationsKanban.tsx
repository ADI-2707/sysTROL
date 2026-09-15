"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export interface CandidateApplication {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverNote: string | null;
  status: "RECEIVED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "OFFERED" | "REJECTED";
  createdAt: string;
}

interface ApplicationsKanbanProps {
  jobId: string;
  initialApplications: CandidateApplication[];
}

const COLUMNS = [
  { key: "RECEIVED", label: "Received", color: "#9ca3af", bg: "rgba(156, 163, 175, 0.1)" },
  { key: "SHORTLISTED", label: "Shortlisted", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  { key: "INTERVIEW_SCHEDULED", label: "Interview Scheduled", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  { key: "OFFERED", label: "Offered", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  { key: "REJECTED", label: "Rejected", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
] as const;

export function ApplicationsKanban({ jobId, initialApplications }: ApplicationsKanbanProps) {
  const [applications, setApplications] = useState<CandidateApplication[]>(initialApplications);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (appId: string, newStatus: CandidateApplication["status"]) => {
    setUpdatingId(appId);
    // Optimistic update
    const previous = [...applications];
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/admin/jobs/${jobId}/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // rollback if failed
        setApplications(previous);
      }
    } catch {
      // offline fallback - keep state
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/careers-admin/postings"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--text-muted)",
            fontSize: "14px",
            marginBottom: "12px",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Postings</span>
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
              Candidate Applications Pipeline
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Track candidate stages, review credentials, and advance applicants through the recruitment funnel.
            </p>
          </div>
          <div style={{ fontSize: "14px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Total: {applications.length} Candidates
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          alignItems: "start",
          minHeight: "550px",
        }}
      >
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.key);

          return (
            <div
              key={col.key}
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                padding: "16px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "8px",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: col.color,
                    }}
                  />
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {col.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: col.bg,
                    color: col.color,
                  }}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "100px" }}>
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                      {app.applicantName}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px", color: "var(--text-muted)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Mail size={13} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{app.email}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Phone size={13} />
                        <span>{app.phone}</span>
                      </div>
                    </div>

                    {app.coverNote && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          backgroundColor: "rgba(0,0,0,0.2)",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          fontStyle: "italic",
                          lineHeight: 1.4,
                        }}
                      >
                        "{app.coverNote}"
                      </p>
                    )}

                    <div style={{ paddingTop: "8px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          color: "var(--accent-blue)",
                          fontWeight: 500,
                        }}
                      >
                        <Download size={13} />
                        <span>Resume</span>
                      </a>

                      <select
                        value={app.status}
                        disabled={updatingId === app.id}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as CandidateApplication["status"])
                        }
                        style={{
                          fontSize: "11px",
                          padding: "3px 6px",
                          borderRadius: "4px",
                          backgroundColor: "var(--bg-secondary)",
                          border: "1px solid var(--border-color)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <option value="RECEIVED">Received</option>
                        <option value="SHORTLISTED">Shortlisted</option>
                        <option value="INTERVIEW_SCHEDULED">Interview</option>
                        <option value="OFFERED">Offered</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div
                    style={{
                      padding: "24px 12px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "12px",
                      border: "1px dashed var(--border-color)",
                      borderRadius: "6px",
                    }}
                  >
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
