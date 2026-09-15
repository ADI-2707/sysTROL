import Link from "next/link";
import { Plus, Shield, Calendar, MapPin, User, ArrowRight, Camera } from "lucide-react";

interface SalesVisitItem {
  id: string;
  visitDate: string;
  plantLocation: string;
  scopeNotes: string;
  photoUrls: string[];
  nextActionAt: string | null;
  visitedBy: { name: string };
  enquiry?: { enquiryCode: string; requirement: string } | null;
  project?: { projectCode: string; name: string } | null;
}

async function getSalesVisits(): Promise<SalesVisitItem[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/sales-visits`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.visits || [];
    }
  } catch {
    // offline fallback
  }

  return [
    {
      id: "visit-1",
      visitDate: new Date().toISOString(),
      plantLocation: "JSW Vijayanagar Mill 3",
      scopeNotes: "Inspected existing Stand 1-6 DC drive cascades and optical pyrometer locations.",
      photoUrls: ["https://picsum.photos/400/300"],
      nextActionAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      visitedBy: { name: "Anand Verma (Commissioning Lead)" },
      enquiry: { enquiryCode: "ENQ-2026-0001", requirement: "Bar Mill L2 automation revamp" },
    },
    {
      id: "visit-2",
      visitDate: new Date(Date.now() - 3 * 86400000).toISOString(),
      plantLocation: "Tata Steel Jamshedpur Wire Rod Mill",
      scopeNotes: "Walkthrough of flying shear and laying head control cabinet space.",
      photoUrls: [],
      nextActionAt: null,
      visitedBy: { name: "Vikram Patil (Field Engineer)" },
      enquiry: { enquiryCode: "ENQ-2026-0002", requirement: "Wire Rod Mill flying shear" },
    },
  ];
}

export default async function SalesVisitsListPage() {
  const visits = await getSalesVisits();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            Site Visits & Scope Walkthroughs (Stage 2)
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Field technical walkthrough logs, site equipment photos, and scheduled engineering next-actions.
          </p>
        </div>

        <Link
          href="/sales-visits/new"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--accent-green)",
            color: "#0b0f19",
            fontWeight: 600,
            fontSize: "14px",
            padding: "10px 18px",
            borderRadius: "6px",
          }}
        >
          <Plus size={16} />
          <span>Log Site Visit</span>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "20px" }}>
        {visits.map((visit) => (
          <div
            key={visit.id}
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-green)", fontSize: "12px", fontWeight: 600 }}>
                  <MapPin size={14} />
                  <span>{visit.plantLocation}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {new Date(visit.visitDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>

              {visit.enquiry && (
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
                  {visit.enquiry.enquiryCode}
                </span>
              )}
            </div>

            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {visit.scopeNotes}
            </p>

            {visit.photoUrls && visit.photoUrls.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
                <Camera size={14} />
                <span>{visit.photoUrls.length} site photos attached</span>
              </div>
            )}

            <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
              <div style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                <User size={13} />
                <span>{visit.visitedBy.name}</span>
              </div>

              {visit.nextActionAt && (
                <div style={{ color: "var(--accent-amber)", fontWeight: 500 }}>
                  Next Action: {new Date(visit.nextActionAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
