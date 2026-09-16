"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
import Link from "next/link";

interface PostingEditorProps {
  initialData?: {
    id?: string;
    title: string;
    slug?: string;
    department: string;
    location: string;
    employmentType: string;
    experienceMin: number;
    experienceMax?: number | null;
    description: string;
    responsibilities: string[];
    requirements: string[];
    status?: string;
  };
  isEdit?: boolean;
}

export function PostingEditor({ initialData, isEdit = false }: PostingEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [department, setDepartment] = useState(initialData?.department || "L2 Software Engineering");
  const [location, setLocation] = useState(initialData?.location || "Bengaluru HQ (Hybrid)");
  const [employmentType, setEmploymentType] = useState(initialData?.employmentType || "FULL_TIME");
  const [experienceMin, setExperienceMin] = useState(initialData?.experienceMin?.toString() || "3");
  const [experienceMax, setExperienceMax] = useState(initialData?.experienceMax?.toString() || "7");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "PUBLISHED");

  const [responsibilities, setResponsibilities] = useState<string[]>(
    initialData?.responsibilities || [
      "Develop Level-2 mill automation services",
      "Calibrate pass schedule calculations",
    ]
  );
  const [newResp, setNewResp] = useState("");

  const [requirements, setRequirements] = useState<string[]>(
    initialData?.requirements || [
      "Degree in Electrical, Mechanical or Computer Engineering",
      "3+ years experience with industrial rolling mills or C# .NET",
    ]
  );
  const [newReq, setNewReq] = useState("");

  const addResp = () => {
    if (newResp.trim()) {
      setResponsibilities([...responsibilities, newResp.trim()]);
      setNewResp("");
    }
  };

  const removeResp = (index: number) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== index));
  };

  const addReq = () => {
    if (newReq.trim()) {
      setRequirements([...requirements, newReq.trim()]);
      setNewReq("");
    }
  };

  const removeReq = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      slug: slug || undefined,
      department,
      location,
      employmentType,
      experienceMin: parseInt(experienceMin, 10) || 0,
      experienceMax: experienceMax ? parseInt(experienceMax, 10) : undefined,
      description,
      responsibilities,
      requirements,
      status,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const url = isEdit
        ? `${apiUrl}/api/v1/admin/jobs/${initialData?.id}`
        : `${apiUrl}/api/v1/admin/jobs`;

      const session = typeof window !== "undefined" ? localStorage.getItem("systrol_user_session") : null;
      let token: string | undefined;
      try {
        if (session) {
          token = JSON.parse(session).token;
        }
      } catch {}

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save job posting");
      }

      router.push("/careers-admin/postings");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
          {isEdit ? `Edit Posting: ${title}` : "Create New Job Posting"}
        </h1>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "6px",
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Role Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Level-2 Automation Engineer"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="PAUSED">Paused</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Department *
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. L2 Software Engineering"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Bengaluru, India (Hybrid)"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Employment Type
            </label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Experience Min (Years)
            </label>
            <input
              type="number"
              min="0"
              value={experienceMin}
              onChange={(e) => setExperienceMin(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Experience Max (Years)
            </label>
            <input
              type="number"
              min="0"
              value={experienceMax}
              onChange={(e) => setExperienceMax(e.target.value)}
              placeholder="Optional"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
            Role Description *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the responsibilities and physical scope..."
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "6px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
        </div>

        {/* Responsibilities */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
            Core Responsibilities
          </label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              type="text"
              value={newResp}
              onChange={(e) => setNewResp(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addResp(); } }}
              placeholder="Add key responsibility..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
            <button
              type="button"
              onClick={addResp}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {responsibilities.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: "var(--bg-card)",
                  fontSize: "13px",
                }}
              >
                <span>{r}</span>
                <button
                  type="button"
                  onClick={() => removeResp(i)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
            Required Qualifications
          </label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              type="text"
              value={newReq}
              onChange={(e) => setNewReq(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addReq(); } }}
              placeholder="Add qualification or required protocol..."
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
              }}
            />
            <button
              type="button"
              onClick={addReq}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                cursor: "pointer",
              }}
            >
              <Plus size={16} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {requirements.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  backgroundColor: "var(--bg-card)",
                  fontSize: "13px",
                }}
              >
                <span>{r}</span>
                <button
                  type="button"
                  onClick={() => removeReq(i)}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
          <Link
            href="/careers-admin/postings"
            style={{
              padding: "10px 18px",
              borderRadius: "6px",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "6px",
              backgroundColor: "var(--accent-green)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            <Save size={16} />
            <span>{loading ? "Saving..." : isEdit ? "Update Posting" : "Publish Posting"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
