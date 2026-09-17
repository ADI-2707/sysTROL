"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Clock, Building, Calendar, Layers, Loader2 } from "lucide-react";

interface EnquiryDetailProps {
  enquiry: {
    id: string;
    enquiryCode: string;
    source: string;
    status: string;
    requirement: string;
    estimatedValue: number | null;
    contactEmail: string;
    contactPhone: string | null;
    prospectName: string | null;
    client?: { name: string; country: string } | null;
    convertedProjectId?: string | null;
    convertedProject?: { projectCode: string; name: string } | null;
    salesVisits?: Array<{
      id: string;
      visitDate: string;
      plantLocation: string;
      scopeNotes: string;
      visitedBy: { name: string };
    }>;
    createdAt: string;
  };
}

export function EnquiryDetailClient({ enquiry }: EnquiryDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(enquiry.status);
  const [loading, setLoading] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [projectName, setProjectName] = useState(enquiry.prospectName ? `${enquiry.prospectName} Revamp` : "Rolling Mill Package");
  const [plantLocation, setPlantLocation] = useState("Bengaluru Mill Site");
  const [millType, setMillType] = useState("Bar Mill");
  const [standCount, setStandCount] = useState("10");

  const handleQualify = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/enquiries/${enquiry.id}/qualify`, { method: "POST" });
      if (res.ok) {
        setStatus("QUALIFIED");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisqualify = async () => {
    if (!confirm("Are you sure you want to mark this enquiry as disqualified?")) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/enquiries/${enquiry.id}/disqualify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Commercial/technical mismatch" }),
      });
      if (res.ok) {
        setStatus("DISQUALIFIED");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/enquiries/${enquiry.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          plantLocation,
          country: "India",
          millType,
          standCount: parseInt(standCount, 10) || 10,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Successfully converted! Active Project Created: ${data.project?.projectCode}`);
        setStatus("CONVERTED");
        setShowConvertModal(false);
        router.push("/projects");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Link
          href="/enquiries"
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
          <span>Back to Enquiries</span>
        </Link>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
                {enquiry.enquiryCode}
              </h1>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor:
                    status === "QUALIFIED"
                      ? "rgba(16, 185, 129, 0.15)"
                      : status === "CONVERTED"
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgba(245, 158, 11, 0.15)",
                  color:
                    status === "QUALIFIED"
                      ? "#10b981"
                      : status === "CONVERTED"
                      ? "#3b82f6"
                      : "#f59e0b",
                }}
              >
                {status}
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Client: {enquiry.client?.name || enquiry.prospectName || "Direct Prospect"} • Lead Source: {enquiry.source}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {status !== "CONVERTED" && status !== "DISQUALIFIED" && (
              <>
                {status !== "QUALIFIED" && (
                  <button
                    onClick={handleQualify}
                    disabled={loading}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      color: "#10b981",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                      opacity: loading ? 0.65 : 1,
                    }}
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                    <span>{loading ? "Processing..." : "Qualify Enquiry"}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowConvertModal(true)}
                  disabled={loading}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    backgroundColor: "var(--accent-green)",
                    border: "none",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.65 : 1,
                  }}
                >
                  <Layers size={15} />
                  <span>Convert to Active Project</span>
                </button>

                <button
                  onClick={handleDisqualify}
                  disabled={loading}
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
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.65 : 1,
                  }}
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                  <span>{loading ? "Processing..." : "Disqualify"}</span>
                </button>
              </>
            )}

            {status === "CONVERTED" && enquiry.convertedProject && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  color: "var(--accent-blue)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                <span>Project Active: {enquiry.convertedProject.projectCode}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--text-primary)" }}>
              Technical Requirement & Scope
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {enquiry.requirement}
            </p>
          </div>

          {/* Connected Sales Visits */}
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                Sales & Scope Walkthrough Visits (Stage 2)
              </h3>
              <Link
                href={`/sales-visits/new?enquiryId=${enquiry.id}`}
                style={{
                  fontSize: "12px",
                  color: "var(--accent-blue)",
                  fontWeight: 600,
                }}
              >
                + Log Visit
              </Link>
            </div>

            {enquiry.salesVisits && enquiry.salesVisits.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {enquiry.salesVisits.map((v) => (
                  <div
                    key={v.id}
                    style={{
                      padding: "12px",
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600 }}>
                      <span>{v.plantLocation}</span>
                      <span style={{ color: "var(--text-muted)" }}>{new Date(v.visitDate).toLocaleDateString()}</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                      {v.scopeNotes}
                    </p>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                      Visited by: {v.visitedBy?.name || "Field Rep"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                No site visits recorded yet for this enquiry.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 600, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>
              Lead Credentials
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Email</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{enquiry.contactEmail}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Phone</span>
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{enquiry.contactPhone || "—"}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Est. Package Value</span>
                <span style={{ color: "var(--accent-green)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                  {enquiry.estimatedValue ? `₹${(Number(enquiry.estimatedValue) / 100000).toFixed(1)} Lakhs` : "Pending Quote"}
                </span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Registered On</span>
                <span style={{ color: "var(--text-primary)" }}>{new Date(enquiry.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Convert to Project Modal */}
      {showConvertModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "28px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
              Convert Enquiry to Active Project
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              This moves the enquiry into Stage 1 (ENQUIRY) of the 12-stage project spine, generating a project code and audit trail.
            </p>

            <form onSubmit={handleConvertToProject} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                  Plant Location *
                </label>
                <input
                  type="text"
                  required
                  value={plantLocation}
                  onChange={(e) => setPlantLocation(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    Mill Type
                  </label>
                  <select
                    value={millType}
                    onChange={(e) => setMillType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="Bar Mill">Bar Mill</option>
                    <option value="Wire Rod Mill">Wire Rod Mill</option>
                    <option value="Section Mill">Section Mill</option>
                    <option value="Hot Strip Mill">Hot Strip Mill</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "4px" }}>
                    Stand Count
                  </label>
                  <input
                    type="number"
                    value={standCount}
                    onChange={(e) => setStandCount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "4px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "4px",
                    backgroundColor: "var(--accent-green)",
                    border: "none",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.65 : 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>{loading ? "Converting..." : "Confirm Conversion"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
