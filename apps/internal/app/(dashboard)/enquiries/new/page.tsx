"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewEnquiryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [source, setSource] = useState("WEB_RFQ");
  const [prospectName, setProspectName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [requirement, setRequirement] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      source,
      prospectName: prospectName || undefined,
      contactEmail,
      contactPhone: contactPhone || undefined,
      requirement,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create enquiry");
      }

      router.push("/enquiries");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
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
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
          Capture New Project Enquiry
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
          gap: "18px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Lead Source *
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
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
              <option value="WEB_RFQ">Web RFQ Form</option>
              <option value="EMAIL">Direct Email</option>
              <option value="REFERRAL">Client Referral</option>
              <option value="TRADE_SHOW">Trade Show / Expo</option>
              <option value="REPEAT_CLIENT">Repeat Client</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Prospect / Mill Company Name
            </label>
            <input
              type="text"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              placeholder="e.g. Jindal Steel & Power Ltd"
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
              Contact Email *
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="engineer@steelplant.com"
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
              Contact Phone
            </label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
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
            Technical Scope & Mill Requirement *
          </label>
          <textarea
            required
            rows={4}
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            placeholder="Describe mill type, stand count, automation level (L1/L2), target revamping timeline..."
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

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>
            Estimated Package Value (INR)
          </label>
          <input
            type="number"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
            placeholder="e.g. 15000000"
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

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
          <Link
            href="/enquiries"
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
              color: "#0b0f19",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            <Save size={16} />
            <span>{loading ? "Registering..." : "Register Enquiry"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
