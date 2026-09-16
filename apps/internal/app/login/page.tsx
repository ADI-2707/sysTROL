"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SysTrolLogo } from "@/components/brand/SysTrolLogo";
import { ThemeToggle } from "../theme-toggle";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
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
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border-subtle)",
          backgroundColor: "var(--bg-header)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SysTrolLogo isCollapsed={false} height={34} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <ThemeToggle />
          <span
            style={{
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              color: "var(--sys-green-accent)",
              fontWeight: 600,
              backgroundColor: "var(--sys-green-subtle)",
              padding: "4px 10px",
              borderRadius: "999px",
              border: "1px solid var(--sys-green-border)",
            }}
          >
            PORTAL v2.4
          </span>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "14px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-lg)",
            padding: "36px 32px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
                marginBottom: "16px",
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
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
              Rolling mill lifecycle, commissioning DAG & field management
            </p>
          </div>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#dc2626",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
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
                  }}
                >
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@systrol.com"
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
                    transition: "border-color 0.15s ease",
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
                  }}
                >
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
                    transition: "border-color 0.15s ease",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
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
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.8 : 1,
                boxShadow: "var(--shadow-sm)",
                transition: "background-color 0.15s ease",
              }}
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In to Workspace"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                fontSize: "11.5px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              Demo Credentials
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => handleQuickFill("admin@systrol.com", "admin123")}
                style={{
                  fontSize: "12px",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-hover)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-body)",
                  cursor: "pointer",
                }}
              >
                CTO (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("lead@systrol.com", "lead123")}
                style={{
                  fontSize: "12px",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-hover)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-body)",
                  cursor: "pointer",
                }}
              >
                Lead Engineer
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("engineer@systrol.com", "eng123")}
                style={{
                  fontSize: "12px",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  backgroundColor: "var(--bg-hover)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-body)",
                  cursor: "pointer",
                }}
              >
                Field Engineer
              </button>
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
        }}
      >
        sysTROL Engineering & Consultancy Pvt. Ltd. • All Rights Reserved
      </footer>
    </div>
  );
}
