import Link from "next/link";
import { Plus, Activity, ExternalLink, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";

interface EnquiryItem {
  id: string;
  enquiryCode: string;
  source: string;
  requirement: string;
  status: string;
  estimatedValue: number | null;
  client?: { name: string } | null;
  prospectName?: string | null;
  assignedTo?: { name: string } | null;
  convertedProject?: { projectCode: string } | null;
  createdAt: string;
}

async function getEnquiries(): Promise<EnquiryItem[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/enquiries`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.enquiries || [];
    }
  } catch {
    // offline fallback
  }

  return [
    {
      id: "enq-1",
      enquiryCode: "ENQ-2026-0001",
      source: "WEB_RFQ",
      requirement: "Bar Mill L2 automation upgrade, 12 Stands, AGC integration",
      status: "OPEN",
      estimatedValue: 18500000,
      client: { name: "JSW Steel Ltd" },
      assignedTo: { name: "Sales Exec 1" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "enq-2",
      enquiryCode: "ENQ-2026-0002",
      source: "REFERRAL",
      requirement: "Wire Rod Mill finishing block high-speed shear synchronization",
      status: "QUALIFIED",
      estimatedValue: 12000000,
      client: { name: "Tata Steel Ltd" },
      assignedTo: { name: "Lead Engineer" },
      createdAt: new Date().toISOString(),
    },
  ];
}

export default async function EnquiriesListPage() {
  const enquiries = await getEnquiries();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "QUALIFIED":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "CONVERTED":
        return { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.3)" };
      case "DISQUALIFIED":
        return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", border: "rgba(239, 68, 68, 0.3)" };
      default:
        return { bg: "rgba(245, 158, 11, 0.15)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)" };
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
            Enquiries Register (Stage 1 Backbone)
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Capture industrial leads, qualify metallurgical scope, and convert verified RFQs to active projects.
          </p>
        </div>

        <Link href="/enquiries/new">
          <Button variant="accent" icon={<Plus size={16} />}>
            New Enquiry
          </Button>
        </Link>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "8px",
          border: "1px solid var(--border-color)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Enquiry Code
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Client / Prospect
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Source
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Status
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Est. Value
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Assigned
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enq) => {
              const badge = getStatusBadge(enq.status);
              return (
                <tr key={enq.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "16px 20px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                    <Link href={`/enquiries/${enq.id}`} style={{ color: "var(--accent-blue)" }}>
                      {enq.enquiryCode}
                    </Link>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontWeight: 600 }}>{enq.client?.name || enq.prospectName || "Direct Prospect"}</div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {enq.requirement}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
                    {enq.source}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {enq.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
                    {enq.estimatedValue ? `₹${(Number(enq.estimatedValue) / 100000).toFixed(1)} Lakhs` : "—"}
                  </td>
                  <td style={{ padding: "16px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                    {enq.assignedTo?.name || "Unassigned"}
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <Link href={`/enquiries/${enq.id}`}>
                      <Button variant="outline" size="sm" icon={<ArrowRight size={13} />}>
                        Manage
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
