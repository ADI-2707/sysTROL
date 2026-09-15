"use client";

import React, { useState, useEffect } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ThemeToggle } from "../theme-toggle";

interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ReactNode;
}

function NavLink({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItemConfig;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={item.href}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "12px",
          padding: isCollapsed ? "10px 0" : "9px 12px",
          borderRadius: "6px",
          color: isActive ? "var(--text-heading)" : "var(--text-body)",
          backgroundColor: isActive ? "var(--bg-nav-active)" : hovered ? "var(--bg-hover)" : "transparent",
          borderLeft: isCollapsed ? "none" : isActive ? "3px solid var(--sys-green-accent)" : "3px solid transparent",
          fontSize: "13.5px",
          fontWeight: isActive ? 600 : 500,
          transition: "all 0.15s ease",
        }}
      >
        <span
          style={{
            color: isActive ? "var(--sys-green-accent)" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.icon}
        </span>
        {!isCollapsed && <span>{item.label}</span>}
      </Link>

      {isCollapsed && hovered && (
        <div
          style={{
            position: "absolute",
            left: "calc(100% + 10px)",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "var(--tooltip-bg)",
            color: "var(--tooltip-text)",
            border: "1px solid var(--tooltip-border)",
            padding: "5px 10px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow-lg)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {item.label}
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("systrol_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("systrol_sidebar_collapsed", String(next));
      return next;
    });
  };

  const navItems: NavItemConfig[] = [
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
          width: isCollapsed ? "68px" : "260px",
          borderRight: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-sidebar)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            height: "58px",
            boxSizing: "border-box",
            padding: isCollapsed ? "0 14px" : "0 16px 0 20px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-blue-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#ffffff",
                fontSize: "13px",
                letterSpacing: "-0.5px",
                boxShadow: "var(--shadow-sm)",
                flexShrink: 0,
              }}
            >
              sT
            </div>
            {!isCollapsed && (
              <div>
                <div style={{ fontSize: "15px", letterSpacing: "0.2px" }}>
                  <span style={{ fontWeight: 800, color: "var(--sys-blue-primary)" }}>sys</span>
                  <span style={{ fontWeight: 800, color: "var(--sys-green-accent)" }}>TROL</span>
                </div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Enterprise L2
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              padding: "6px",
              borderRadius: "6px",
            }}
          >
            {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: isCollapsed ? "16px 8px" : "16px 12px", overflowY: "auto" }}>
          {!isCollapsed && (
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
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  isCollapsed={isCollapsed}
                />
              );
            })}
          </div>
        </nav>

        <div style={{ padding: isCollapsed ? "14px 8px" : "16px", borderTop: "1px solid var(--border-subtle)" }}>
          {isCollapsed ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                title="System Admin (SUPER_ADMIN)"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--sys-green-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                }}
              >
                SA
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            height: "58px",
            boxSizing: "border-box",
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
