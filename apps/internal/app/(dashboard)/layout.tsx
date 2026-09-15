"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const navItems = [
    { label: "Job Postings", href: "/careers-admin/postings", icon: <Briefcase size={18} /> },
    { label: "New Posting", href: "/careers-admin/postings/new", icon: <FileText size={18} /> },
    { label: "Enquiries (CRM)", href: "/enquiries", icon: <Activity size={18} /> },
    { label: "Sales Visits", href: "/sales-visits", icon: <Shield size={18} /> },
    { label: "Project Lifecycle", href: "/lifecycle", icon: <Layers size={18} /> },
    { label: "Commissioning DAG", href: "/commissioning", icon: <Cpu size={18} /> },
    { label: "Procurement / PO", href: "/procurement/purchase-orders", icon: <ShoppingBag size={18} /> },
    { label: "Engineering Docs", href: "/engineering/documents", icon: <FileText size={18} /> },
    { label: "Manufacturing & QC", href: "/manufacturing/batches", icon: <CheckCircle2 size={18} /> },
    { label: "Dispatch & Logistics", href: "/dispatch/shipments", icon: <Truck size={18} /> },
    { label: "Trials & Handover", href: "/post-commissioning", icon: <CheckCircle2 size={18} /> },
    { label: "Finance & Retention", href: "/finance", icon: <DollarSign size={18} /> },
    { label: "Executive Analytics", href: "/analytics", icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-canvas)" }}>
      <aside
        style={{
          width: "260px",
          borderRight: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-sidebar)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-blue-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.5px",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              sT
            </div>
            <div>
              <div style={{ fontSize: "16px", letterSpacing: "0.2px" }}>
                <span style={{ fontWeight: 800, color: "var(--sys-blue-primary)" }}>sys</span>
                <span style={{ fontWeight: 800, color: "var(--sys-green-accent)" }}>TROL</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Enterprise L2 Console
              </div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              padding: "0 12px 8px 12px",
              letterSpacing: "0.5px",
            }}
          >
            Operations & Modules
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "9px 12px",
                    borderRadius: "6px",
                    color: isActive ? "var(--text-heading)" : "var(--text-body)",
                    backgroundColor: isActive ? "var(--bg-nav-active)" : "transparent",
                    borderLeft: isActive ? "3px solid var(--sys-green-accent)" : "3px solid transparent",
                    fontSize: "13.5px",
                    fontWeight: isActive ? 600 : 500,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ color: isActive ? "var(--sys-green-accent)" : "var(--text-muted)", display: "flex" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-heading)" }}>System Admin</div>
              <div style={{ fontSize: "11px", color: "var(--sys-green-accent)", fontFamily: "var(--font-mono)" }}>
                SUPER_ADMIN
              </div>
            </div>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              title="Open Public Web"
              style={{
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                padding: "6px",
                borderRadius: "6px",
              }}
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            height: "58px",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-header)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <div style={{ fontSize: "13.5px", color: "var(--text-body)", fontWeight: 500 }}>
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
                backgroundColor: "var(--sys-green-subtle)",
                color: "var(--sys-green-accent)",
                fontSize: "11.5px",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                border: "1px solid var(--sys-green-border)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--sys-green-accent)",
                }}
              />
              API: ONLINE (:4000)
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: "28px", overflowY: "auto", backgroundColor: "var(--bg-canvas)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
