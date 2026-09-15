import Link from "next/link";
import { Plus, FileText, Download, CheckCircle2, AlertCircle, RefreshCw, Eye } from "lucide-react";

interface DocItem {
  id: string;
  docType: string;
  title: string;
  revision: number;
  fileUrl: string;
  reviewStatus: "PENDING" | "CLIENT_APPROVED" | "REVISION_REQUESTED";
  project: { projectCode: string; name: string };
  reviewedBy?: { name: string } | null;
  createdAt: string;
}

async function getDocuments(): Promise<DocItem[]> {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/engineering/documents`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.documents || [];
    }
  } catch {
    // offline fallback
  }

  return [
    {
      id: "doc-1",
      docType: "GA_DRAWING",
      title: "General Arrangement — 10-Stand Continuous Mill Layout",
      revision: 2,
      fileUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/engineering/docs/ga-drawing-rev2.pdf",
      reviewStatus: "CLIENT_APPROVED",
      project: { projectCode: "PROJ-2026-0001", name: "JSW Wire Rod Mill" },
      reviewedBy: { name: "JSW Chief Metallurgist" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-2",
      docType: "SLD",
      title: "Single Line Diagram — Main Mill Drives & Substation 33kV",
      revision: 1,
      fileUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/engineering/docs/sld-rev1.pdf",
      reviewStatus: "PENDING",
      project: { projectCode: "PROJ-2026-0001", name: "JSW Wire Rod Mill" },
      createdAt: new Date().toISOString(),
    },
    {
      id: "doc-3",
      docType: "ALGORITHM_SPEC",
      title: "Pass Schedule Calculation & Roll Force Mathematical Model",
      revision: 1,
      fileUrl: "https://systrol-documents.s3.us-east-1.amazonaws.com/engineering/docs/pass-calc-rev1.pdf",
      reviewStatus: "REVISION_REQUESTED",
      project: { projectCode: "PROJ-2026-0001", name: "JSW Wire Rod Mill" },
      reviewedBy: { name: "Anand Verma (Lead)" },
      createdAt: new Date().toISOString(),
    },
  ];
}

export default async function DocumentsRegisterPage() {
  const docs = await getDocuments();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CLIENT_APPROVED":
        return { bg: "rgba(16, 185, 129, 0.15)", text: "#10b981", border: "rgba(16, 185, 129, 0.3)" };
      case "REVISION_REQUESTED":
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
            Engineering Document Register (Stage 4)
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            GA drawings, Single Line Diagrams (SLD), pass schedule algorithms, and formal client review approvals.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/engineering/drawings"
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Drawings Gallery
          </Link>
          <Link
            href="/engineering/design-reviews"
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              backgroundColor: "var(--accent-green)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Design Reviews
          </Link>
        </div>
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
                Document Title
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Type
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Rev
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Review Status
              </th>
              <th style={{ padding: "14px 20px", fontWeight: 600, color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>
                Project
              </th>
              <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => {
              const badge = getStatusBadge(doc.reviewStatus);
              return (
                <tr key={doc.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "16px 20px", fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileText size={16} color="var(--accent-blue)" />
                      <span>{doc.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-secondary)" }}>
                    {doc.docType}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      r{doc.revision}
                    </span>
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
                      {doc.reviewStatus}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "var(--text-muted)" }}>
                    {doc.project.projectCode}
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        fontSize: "12px",
                        color: "var(--accent-blue)",
                        fontWeight: 500,
                      }}
                    >
                      <Download size={13} />
                      <span>Download</span>
                    </a>
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
