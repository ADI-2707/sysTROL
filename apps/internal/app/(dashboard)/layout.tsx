"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { SysTrolLogo } from "@/components/brand/SysTrolLogo";
import { useAuth } from "@/lib/auth-context";

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
        title={isCollapsed ? item.label : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: "14px",
          padding: isCollapsed ? "11px 0" : "10px 14px",
          borderRadius: "8px",
          color: isActive ? "var(--text-heading)" : "var(--text-body)",
          backgroundColor: isActive ? "var(--bg-nav-active)" : hovered ? "var(--bg-hover)" : "transparent",
          borderLeft: isCollapsed ? "none" : isActive ? "3px solid var(--sys-green-accent)" : "3px solid transparent",
          fontSize: "14px",
          fontWeight: isActive ? 600 : 500,
          transition: "all 0.18s ease",
        }}
      >
        <span
          style={{
            color: isActive ? "var(--sys-green-accent)" : "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isActive ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.18s ease",
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
            left: "calc(100% + 14px)",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "var(--tooltip-bg)",
            color: "var(--tooltip-text)",
            border: "1px solid var(--tooltip-border)",
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "12.5px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "var(--shadow-lg)",
            zIndex: 999999,
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
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("systrol_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("systrol_sidebar_collapsed", String(next));
      return next;
    });
  };

  const isItemActive = (href: string) => {
    if (pathname === href) return true;
    if (href !== "/" && pathname.startsWith(href + "/")) return true;
    return false;
  };

  const navItems: NavItemConfig[] = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={19} /> },
    { label: "Project Management", href: "/projects", icon: <Briefcase size={19} /> },
    { label: "Employee Management", href: "/employees", icon: <Users size={19} /> },
    { label: "Analytics", href: "/analytics", icon: <BarChart3 size={19} /> },
    { label: "Settings", href: "/settings", icon: <Settings size={19} /> },
  ];

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-canvas)",
          color: "var(--text-muted)",
          fontSize: "14px",
          fontWeight: 500,
        }}
      >
        Initializing sysTROL Workspace...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg-canvas)" }}>
      <aside
        style={{
          width: isCollapsed ? "72px" : "268px",
          borderRight: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-sidebar)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "visible",
          position: "relative",
          zIndex: 40,
        }}
      >
        <div
          style={{
            height: "64px",
            boxSizing: "border-box",
            padding: isCollapsed ? "0 8px" : "0 14px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <SysTrolLogo
              isCollapsed={isCollapsed}
              onClick={toggleSidebar}
              height={32}
            />
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              title="Collapse sidebar"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                padding: "6px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "color 0.15s ease",
              }}
            >
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>

        <nav
          style={{
            flex: 1,
            padding: isCollapsed ? "16px 8px" : "18px 12px",
            overflowX: "visible",
            overflowY: isCollapsed ? "visible" : "auto",
          }}
        >
          {!isCollapsed && (
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                padding: "0 12px 10px 12px",
                letterSpacing: "0.6px",
              }}
            >
              Core Operations
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={isItemActive(item.href)}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </nav>

        <div
          style={{
            padding: isCollapsed ? "14px 8px" : "14px 16px",
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-card)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {isCollapsed ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div
                title={`${user?.name || "Team Member"} (${user?.role || "OPERATOR"})`}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "var(--sys-blue-subtle)",
                  color: "var(--sys-blue-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid var(--sys-blue-border)",
                }}
                onClick={toggleSidebar}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
              </div>
              <button
                type="button"
                onClick={logout}
                title="Log Out of sysTROL"
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#ef4444",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    backgroundColor: "var(--sys-blue-subtle)",
                    color: "var(--sys-blue-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: "1px solid var(--sys-blue-border)",
                    flexShrink: 0,
                  }}
                >
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name || "System Operator"}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--sys-green-accent)",
                      fontFamily: "var(--font-mono)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.designation || user?.role || "Field Specialist"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#ef4444",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </>
          )}
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header
          style={{
            height: "64px",
            boxSizing: "border-box",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-header)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "14px", color: "var(--text-body)", fontWeight: 600 }}>
              sysTROL Enterprise Lifecycle & Automation
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: "var(--sys-blue-subtle)",
                color: "var(--sys-blue-primary)",
                fontSize: "11px",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            >
              v2.4 Core
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <ThemeToggle />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "999px",
                backgroundColor: "var(--sys-green-subtle)",
                color: "var(--sys-green-accent)",
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                border: "1px solid var(--sys-green-border)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "var(--sys-green-accent)",
                  boxShadow: "0 0 8px var(--sys-green-accent)",
                }}
              />
              SYSTEM ONLINE
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
