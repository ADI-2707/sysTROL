"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, Download } from "lucide-react";

interface PendingReview {
  id: string;
  title: string;
  docType: string;
  revision: number;
  projectCode: string;
  requestingEngineer: string;
  submittedAt: string;
}

export default function DesignReviewsPage() {
  const [reviews, setReviews] = useState<PendingReview[]>([
    {
      id: "rev-1",
      title: "Single Line Diagram — Main Mill Drives & Substation 33kV",
      docType: "SLD",
      revision: 1,
      projectCode: "PROJ-2026-0001",
      requestingEngineer: "Electrical Design Lead",
      submittedAt: new Date().toISOString(),
    },
    {
      id: "rev-2",
      title: "Finishing Block Dynamic Speed Cascade Algorithm Specification",
      docType: "ALGORITHM_SPEC",
      revision: 2,
      projectCode: "PROJ-2026-0001",
      requestingEngineer: "L2 Automation Architect",
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      await fetch(`${apiUrl}/api/v1/engineering/design-reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: id,
          outcome: "CLIENT_APPROVED",
          comments: "Approved without exceptions following technical scope walkthrough.",
        }),
      });

      setReviews(reviews.filter((r) => r.id !== id));
      alert("Document approved successfully!");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRequestRevision = async (id: string) => {
    const comments = prompt("Enter required modifications or metallurgical parameter changes:");
    if (!comments) return;

    setLoadingId(id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      await fetch(`${apiUrl}/api/v1/engineering/design-reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: id,
          outcome: "REVISION_REQUESTED",
          comments,
        }),
      });

      setReviews(reviews.filter((r) => r.id !== id));
      alert("Revision request sent back to engineering team.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/engineering/documents"
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
          <span>Back to Document Register</span>
        </Link>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
          Design Reviews & Client Approval Queue
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Formal approval signoffs required before releasing packages to manufacturing and procurement.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {reviews.map((rev) => (
          <div
            key={rev.id}
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(59, 130, 246, 0.15)",
                    color: "var(--accent-blue)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {rev.docType}
                </span>
                <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                  r{rev.revision}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>• {rev.projectCode}</span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                {rev.title}
              </h3>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                Submitted by {rev.requestingEngineer} • {new Date(rev.submittedAt).toLocaleDateString()}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => handleRequestRevision(rev.id)}
                disabled={loadingId === rev.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: loadingId === rev.id ? "not-allowed" : "pointer",
                }}
              >
                <AlertTriangle size={15} />
                <span>Request Revision</span>
              </button>

              <button
                onClick={() => handleApprove(rev.id)}
                disabled={loadingId === rev.id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  backgroundColor: "var(--accent-green)",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: loadingId === rev.id ? "not-allowed" : "pointer",
                }}
              >
                <CheckCircle2 size={15} />
                <span>Approve Document</span>
              </button>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "8px",
              border: "1px dashed var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            No documents currently awaiting review approval.
          </div>
        )}
      </div>
    </div>
  );
}
