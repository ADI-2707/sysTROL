import Link from "next/link";
import {
  Briefcase,
  Layers,
  FileText,
  Activity,
  ShoppingBag,
  Cpu,
  Truck,
  CheckCircle2,
  DollarSign,
  BarChart3,
  Shield,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "../theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Job Postings", href: "/careers-admin/postings", icon: <Briefcase size={18} /> },
    { label: "New Posting", href: "/careers-admin/postings/new", icon: <FileText size={18} /> },
    { label: "Enquiries (CRM)", href: "/enquiries", icon: <Activity size={18} /> },
    { label: "Sales Visits", href: "/sales-visits", icon: <Shield size={18} /> },
    { label: "Project Lifecycle", href: "/projects", icon: <Layers size={18} /> },
    { label: "Commissioning DAG", href: "/commissioning", icon: <Cpu size={18} /> },
    { label: "Procurement / PO", href: "/procurement", icon: <ShoppingBag size={18} /> },
    { label: "Engineering Docs", href: "/engineering", icon: <FileText size={18} /> },
    { label: "Manufacturing & QC", href: "/manufacturing", icon: <CheckCircle2 size={18} /> },
    { label: "Dispatch & Logistics", href: "/dispatch", icon: <Truck size={18} /> },
    { label: "Trials & Handover", href: "/trials", icon: <CheckCircle2 size={18} /> },
    { label: "Finance & Retention", href: "/finance", icon: <DollarSign size={18} /> },
    { label: "Executive Analytics", href: "/analytics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          borderRight: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-secondary)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                backgroundColor: "var(--accent-green)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#0b0f19",
              }}
            >
              sT
            </div>
            <div>
              <div style={{ fontWeight: 800, letterSpacing: "0.5px", fontSize: "16px" }}>sysTROL</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Enterprise L2 Console</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", padding: "0 12px 8px 12px" }}>
            Operations & Modules
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 0.15s ease",
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600 }}>System Admin</div>
              <div style={{ fontSize: "11px", color: "var(--accent-green)", fontFamily: "var(--font-mono)" }}>SUPER_ADMIN</div>
            </div>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              title="Open Public Web"
              style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            height: "60px",
            borderBottom: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
          }}
        >
          <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Rolling Mill Lifecycle & Automation System • v2.0
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "var(--accent-green)",
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent-green)" }} />
              API: ONLINE (:4000)
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
