"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Activity,
  Zap,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SysTrolLogo } from "@/components/brand/SysTrolLogo";
import { ThemeToggle } from "../theme-toggle";

interface DemoRole {
  label: string;
  role: string;
  team: string;
  email: string;
  pass: string;
}

const DEMO_ROLES: DemoRole[] = [
  {
    label: "Super Admin",
    role: "Super Admin",
    team: "Leadership",
    email: "admin@systrol.com",
    pass: "admin123",
  },
  {
    label: "Director",
    role: "Director",
    team: "Leadership",
    email: "director@systrol.com",
    pass: "dir123",
  },
  {
    label: "Commissioning Lead",
    role: "Lead Engineer",
    team: "Field Operations",
    email: "commissioning@systrol.com",
    pass: "comm123",
  },
  {
    label: "Systems Automation",
    role: "PLC / Automation",
    team: "Engineering",
    email: "system.eng@systrol.com",
    pass: "sys123",
  },
  {
    label: "HR & People",
    role: "Talent Specialist",
    team: "Human Resources",
    email: "hr@systrol.com",
    pass: "hr123",
  },
  {
    label: "Commercial Sales",
    role: "Client Account Lead",
    team: "Sales Commercial",
    email: "sales@systrol.com",
    pass: "sales123",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("session_expired") === "1") {
        setSessionExpired(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error || "Authentication failed.");
    }
  };

  const handleQuickFill = (role: DemoRole) => {
    setEmail(role.email);
    setPassword(role.pass);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-canvas)",
        color: "var(--text-body)",
        position: "relative",
      }}
    >
      <header
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-header)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SysTrolLogo isCollapsed={false} height={34} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <ThemeToggle />
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--sys-green-accent)",
              fontWeight: 700,
              backgroundColor: "var(--sys-green-subtle)",
              padding: "4px 10px",
              borderRadius: "999px",
              border: "1px solid var(--sys-green-border)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            PORTAL v2.6.2 CORE
          </span>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1120px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "36px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "16px",
              border: "1px solid var(--border-subtle)",
              padding: "36px 32px",
              boxShadow: "var(--shadow-card)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  backgroundColor: "var(--sys-green-subtle)",
                  border: "1px solid var(--sys-green-border)",
                  color: "var(--sys-green-accent)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "var(--sys-green-accent)",
                  }}
                />
                Mission-Critical Operations Hub
              </div>

              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  color: "var(--text-heading)",
                  letterSpacing: "-0.5px",
                  lineHeight: "1.25",
                  marginBottom: "12px",
                }}
              >
                Level-2 Industrial Automation & Lifecycle Intelligence
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "var(--text-muted)",
                  marginBottom: "32px",
                }}
              >
                Centralized mission-control portal for real-time rolling mill supervisory control, commissioning DAG execution, procurement tracking, and tamper-evident audit governance.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-hover)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      backgroundColor: "var(--sys-blue-subtle)",
                      color: "var(--sys-blue-primary)",
                      display: "flex",
                    }}
                  >
                    <Activity size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-heading)" }}>
                      Commissioning DAG Engine
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Automated stage-gate validation and sub-step dependency graph tracking.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-hover)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      backgroundColor: "var(--sys-green-subtle)",
                      color: "var(--sys-green-accent)",
                      display: "flex",
                    }}
                  >
                    <Zap size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-heading)" }}>
                      Sub-Millisecond Telemetry
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Zero-overhead in-memory latency monitoring adhering to target &lt;100ms SLAs.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "14px",
                    borderRadius: "10px",
                    backgroundColor: "var(--bg-hover)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      backgroundColor: "var(--sys-blue-subtle)",
                      color: "var(--sys-blue-primary)",
                      display: "flex",
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-heading)" }}>
                      Industrial Standards Compliance
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Built for IEC 61508 SIL3 functional safety and tamper-evident dual-ledger audit logs.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                paddingTop: "20px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              <span>Encrypted Session Channel</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>TLS 1.3 / HTTPONLY</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "16px",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-lg)",
              padding: "36px 32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ textAlign: "center", marginBottom: "26px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: "var(--sys-blue-subtle)",
                    color: "var(--sys-blue-primary)",
                    marginBottom: "14px",
                  }}
                >
                  <ShieldCheck size={26} />
                </div>
                <h1
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "var(--text-heading)",
                    margin: 0,
                    letterSpacing: "-0.3px",
                  }}
                >
                  Enterprise Sign In
                </h1>
                <p
                  style={{
                    fontSize: "13.5px",
                    color: "var(--text-muted)",
                    marginTop: "6px",
                    marginBottom: 0,
                  }}
                >
                  Enter authorized credentials to access operations console
                </p>
              </div>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "11px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "#dc2626",
                    fontSize: "13px",
                    marginBottom: "18px",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {sessionExpired && !error && (
                <div
                  data-testid="session-expired-banner"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "11px 14px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#d97706",
                    fontSize: "13px",
                    marginBottom: "18px",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>Your session has expired. Please sign in again to continue.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                      marginBottom: "6px",
                    }}
                  >
                    Corporate Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                        display: "flex",
                        pointerEvents: "none",
                      }}
                    >
                      <Mail size={16} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@systrol.com"
                      autoComplete="username"
                      required
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px 12px 10px 38px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-canvas)",
                        color: "var(--text-heading)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--text-heading)",
                      marginBottom: "6px",
                    }}
                  >
                    Security Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-muted)",
                        display: "flex",
                        pointerEvents: "none",
                      }}
                    >
                      <Lock size={16} />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px 38px 10px 38px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-subtle)",
                        backgroundColor: "var(--bg-canvas)",
                        color: "var(--text-heading)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px",
                        color: "var(--text-muted)",
                        borderRadius: "4px",
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="submit-btn"
                  style={{
                    marginTop: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "11px 18px",
                    borderRadius: "8px",
                    backgroundColor: "var(--sys-blue-primary)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    opacity: isSubmitting ? 0.8 : 1,
                    boxShadow: "var(--shadow-sm)",
                    transition: "background-color 0.15s ease, transform 0.1s ease",
                  }}
                >
                  <span>{isSubmitting ? "Authenticating Session..." : "Sign In to Workspace"}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            <div
              style={{
                marginTop: "26px",
                paddingTop: "20px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  marginBottom: "12px",
                }}
              >
                <Terminal size={13} />
                <span>Quick Fill Role Credentials</span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "8px",
                }}
              >
                {DEMO_ROLES.map((role) => (
                  <button
                    key={role.email}
                    type="button"
                    onClick={() => handleQuickFill(role)}
                    style={{
                      textAlign: "left",
                      padding: "8px 10px",
                      borderRadius: "8px",
                      backgroundColor: "var(--bg-hover)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-body)",
                      cursor: "pointer",
                      transition: "border-color 0.15s ease, background-color 0.15s ease",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-heading)" }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                      {role.team}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer
        style={{
          padding: "16px 32px",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-header)",
        }}
      >
        sysTROL Engineering & Consultancy Pvt. Ltd. • All Rights Reserved
      </footer>
    </div>
  );
}
