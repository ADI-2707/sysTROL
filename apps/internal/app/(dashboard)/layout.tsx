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
  ShieldAlert,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
import { SysTrolLogo } from "@/components/brand/SysTrolLogo";
import { useAuth } from "@/lib/auth-context";
import { canAccessPage, TEAM_LABELS } from "@/lib/permissions";
import { useBackendKeepAlive } from "@/lib/use-keep-alive";

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
          gap: "10px",
          padding: isCollapsed ? "7px 0" : "7px 10px",
          borderRadius: "7px",
          color: isActive ? "var(--text-heading)" : "var(--text-body)",
          backgroundColor: isActive ? "var(--bg-nav-active)" : hovered ? "var(--bg-hover)" : "transparent",
          borderLeft: isCollapsed ? "none" : isActive ? "3px solid var(--sys-green-accent)" : "3px solid transparent",
          fontSize: "13px",
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
            padding: "5px 12px",
            borderRadius: "6px",
            fontSize: "12px",
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
  const [logoutHovered, setLogoutHovered] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://systrol-api.onrender.com";
  useBackendKeepAlive(apiUrl, user?.token);

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
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={17} /> },
    { label: "Project Management", href: "/projects", icon: <Briefcase size={17} /> },
    { label: "Employee Management", href: "/employees", icon: <Users size={17} /> },
    { label: "Media CMS", href: "/media", icon: <ImageIcon size={17} /> },
    { label: "Careers & Jobs", href: "/careers-admin/postings", icon: <FileText size={17} /> },
    { label: "Analytics", href: "/analytics", icon: <BarChart3 size={17} /> },
    { label: "Settings", href: "/settings", icon: <Settings size={17} /> },
  ];

  const visibleNavItems = navItems.filter((item) => canAccessPage(user?.team, item.href));
  const isAuthorized = canAccessPage(user?.team, pathname);

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
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "var(--bg-canvas)" }}>
      <aside
        style={{
          width: isCollapsed ? "60px" : "228px",
          height: "100vh",
          borderRight: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-sidebar)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          position: "relative",
          zIndex: 40,
        }}
      >
        <div
          style={{
            height: "50px",
            boxSizing: "border-box",
            padding: isCollapsed ? "0 8px" : "0 12px",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            gap: "8px",
            flexShrink: 0,
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
              height={26}
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
                padding: "4px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "color 0.15s ease",
              }}
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        <nav
          style={{
            flex: 1,
            padding: isCollapsed ? "10px 6px" : "12px 10px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!isCollapsed && (
            <div
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                padding: "0 10px 8px 10px",
                letterSpacing: "0.6px",
                flexShrink: 0,
              }}
            >
              Core Operations
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {visibleNavItems.map((item) => (
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
            padding: isCollapsed ? "10px 6px" : "12px 12px",
            borderTop: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-card)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {isCollapsed ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div
                title={`${user?.name || "Team Member"} (${user?.role || "OPERATOR"})`}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--sys-blue-subtle)",
                  color: "var(--sys-blue-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
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
                onMouseEnter={() => setLogoutHovered(true)}
                onMouseLeave={() => setLogoutHovered(false)}
                title="Log Out of sysTROL"
                style={{
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  backgroundColor: logoutHovered ? "#ef4444" : "rgba(239, 68, 68, 0.08)",
                  border: logoutHovered ? "1px solid #dc2626" : "1px solid rgba(239, 68, 68, 0.25)",
                  color: logoutHovered ? "#ffffff" : "#ef4444",
                  boxShadow: logoutHovered ? "0 4px 12px rgba(239, 68, 68, 0.35)" : "none",
                  transform: logoutHovered ? "scale(1.06)" : "scale(1)",
                  cursor: "pointer",
                  transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <LogOut size={15} />
              </button>
              <div style={{ fontSize: "8.5px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", textAlign: "center" }}>
                {process.env.NEXT_PUBLIC_APP_VERSION || "v0.1.0"}
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    backgroundColor: "var(--sys-blue-subtle)",
                    color: "var(--sys-blue-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
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
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name || "System Operator"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        backgroundColor: "var(--sys-blue-subtle)",
                        color: "var(--sys-blue-primary)",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        letterSpacing: "0.2px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user?.team ? TEAM_LABELS[user.team] : "Leadership Team"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--sys-green-accent)",
                      fontFamily: "var(--font-mono)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginTop: "1px",
                    }}
                  >
                    {user?.designation || "Field Specialist"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                onMouseEnter={() => setLogoutHovered(true)}
                onMouseLeave={() => setLogoutHovered(false)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  backgroundColor: logoutHovered ? "#ef4444" : "rgba(239, 68, 68, 0.08)",
                  border: logoutHovered ? "1px solid #dc2626" : "1px solid rgba(239, 68, 68, 0.25)",
                  color: logoutHovered ? "#ffffff" : "#ef4444",
                  boxShadow: logoutHovered ? "0 4px 14px rgba(239, 68, 68, 0.35)" : "none",
                  transform: logoutHovered ? "translateY(-1px)" : "translateY(0)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <LogOut
                  size={14}
                  style={{
                    transform: logoutHovered ? "translateX(-1px)" : "none",
                    transition: "transform 0.18s ease",
                  }}
                />
                <span>Log Out</span>
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px 0 4px" }}>
                <span style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>
                  PORTAL {process.env.NEXT_PUBLIC_APP_VERSION || "v0.1.0"}
                </span>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />
              </div>
            </>
          )}
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>
        <header
          style={{
            height: "50px",
            boxSizing: "border-box",
            borderBottom: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-header)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "13px", color: "var(--text-body)", fontWeight: 600 }}>
              sysTROL Enterprise Lifecycle & Automation
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "1.5px 6px",
                borderRadius: "4px",
                backgroundColor: "var(--sys-blue-subtle)",
                color: "var(--sys-blue-primary)",
                fontSize: "10.5px",
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
              }}
            >
              v2.4 Core
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ThemeToggle />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3.5px 10px",
                borderRadius: "999px",
                backgroundColor: "var(--sys-green-subtle)",
                color: "var(--sys-green-accent)",
                fontSize: "11px",
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
                  boxShadow: "0 0 8px var(--sys-green-accent)",
                }}
              />
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: "24px", overflowY: "auto", backgroundColor: "var(--bg-canvas)" }}>
          {!isAuthorized ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "380px",
                textAlign: "center",
                padding: "32px",
                backgroundColor: "var(--bg-card)",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
                maxWidth: "520px",
                margin: "40px auto 0 auto",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <ShieldAlert size={28} />
              </div>
              <h2 style={{ fontSize: "19px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 8px 0" }}>
                Access Restricted
              </h2>
              <p style={{ fontSize: "13.5px", color: "var(--text-muted)", maxWidth: "400px", margin: "0 0 20px 0", lineHeight: 1.5 }}>
                Your assigned team ({user?.team ? TEAM_LABELS[user.team] : "Standard"}) does not have authorization to access this page.
              </p>
              <Link
                href="/dashboard"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 18px",
                  borderRadius: "7px",
                  backgroundColor: "var(--sys-blue-primary)",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Return to Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
