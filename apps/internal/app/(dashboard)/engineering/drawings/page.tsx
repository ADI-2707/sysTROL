import Link from "next/link";
import { Layers, Download, ExternalLink, ArrowLeft } from "lucide-react";

interface DrawingItem {
  id: string;
  title: string;
  docType: string;
  revision: number;
  previewUrl: string;
  projectCode: string;
}

export default function DrawingsGalleryPage() {
  const drawings: DrawingItem[] = [
    {
      id: "draw-1",
      title: "General Arrangement Layout — Stand 1 to 10 Rolling Line",
      docType: "GA_DRAWING",
      revision: 2,
      previewUrl: "/images/factory-floor.jpg",
      projectCode: "PROJ-2026-0001",
    },
    {
      id: "draw-2",
      title: "Single Line Diagram — Main Mill Drives & Substation 33kV",
      docType: "SLD",
      revision: 1,
      previewUrl: "/images/control-cabinets.jpg",
      projectCode: "PROJ-2026-0001",
    },
    {
      id: "draw-3",
      title: "Laying Head & Pinch Roll Mechanical GA",
      docType: "GA_DRAWING",
      revision: 1,
      previewUrl: "/images/automation-control-room.jpg",
      projectCode: "PROJ-2026-0002",
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
          Engineering Drawings Gallery (GA & SLD Schematics)
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
          Visual inspection of mechanical mill general arrangements, electrical single-line diagrams, and layout prints.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {drawings.map((drawing) => (
          <div
            key={drawing.id}
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "190px",
                backgroundColor: "#1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                borderBottom: "1px solid var(--border-color)",
                backgroundImage: `url(${drawing.previewUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
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
                    {drawing.docType}
                  </span>
                  <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    r{drawing.revision}
                  </span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                  {drawing.title}
                </h3>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {drawing.projectCode}
                </div>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end" }}>
                <a
                  href={drawing.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--accent-green)",
                    fontWeight: 600,
                  }}
                >
                  <ExternalLink size={14} />
                  <span>Expand Schematic</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
