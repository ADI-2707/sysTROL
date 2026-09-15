"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus } from "lucide-react";

export default function NewSalesVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultEnquiryId = searchParams.get("enquiryId") || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [enquiryId, setEnquiryId] = useState(defaultEnquiryId);
  const [plantLocation, setPlantLocation] = useState("");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [scopeNotes, setScopeNotes] = useState("");
  const [nextActionAt, setNextActionAt] = useState("");
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const addPhoto = () => {
    if (photoUrlInput.trim()) {
      setPhotoUrls([...photoUrls, photoUrlInput.trim()]);
      setPhotoUrlInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      enquiryId: enquiryId || undefined,
      plantLocation,
      visitDate: new Date(visitDate).toISOString(),
      scopeNotes,
      photoUrls,
      nextActionAt: nextActionAt ? new Date(nextActionAt).toISOString() : undefined,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/v1/sales-visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to log sales visit");
      }

      router.push("/sales-visits");
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
          href="/sales-visits"
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
          <span>Back to Site Visits</span>
        </Link>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
          Log Site Visit & Scope Walkthrough
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
              Plant Location *
            </label>
            <input
              type="text"
              required
              value={plantLocation}
              onChange={(e) => setPlantLocation(e.target.value)}
              placeholder="e.g. JSW Toranagallu Mill 2"
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
              Visit Date *
            </label>
            <input
              type="date"
              required
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
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
            Technical Scope Walkthrough Notes *
          </label>
          <textarea
            required
            rows={5}
            value={scopeNotes}
            onChange={(e) => setScopeNotes(e.target.value)}
            placeholder="Record existing drive configurations, roll diameters, pyrometer mounts, cooling bed layout..."
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
            Next Action Follow-Up Date
          </label>
          <input
            type="date"
            value={nextActionAt}
            onChange={(e) => setNextActionAt(e.target.value)}
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
            Site Equipment Photo URLs
          </label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="url"
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              placeholder="https://s3.amazonaws.com/.../photo.jpg"
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
              onClick={addPhoto}
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
          {photoUrls.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {photoUrls.map((u, i) => (
                <div key={i} style={{ fontSize: "12px", color: "var(--accent-blue)", fontFamily: "var(--font-mono)" }}>
                  {u}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
          <Link
            href="/sales-visits"
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
            <span>{loading ? "Recording..." : "Save Visit"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
