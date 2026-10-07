"use client";

import React, { useState } from "react";
import {
  Settings,
  KeyRound,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Mail,
  Briefcase,
  Lock,
  Activity,
  Database,
  Server,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { canAccessAuditLogs } from "@/lib/permissions";
import { apiClient } from "@/lib/api-client";
import { ThemeToggle } from "../../theme-toggle";

export default function SettingsPage() {
  const { user, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = canAccessAuditLogs(user);
  const [diagData, setDiagData] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  const runDiagnostics = async () => {
    setDiagLoading(true);
    try {
      const res = await apiClient("/api/v1/health/deep");
      const data = await res.json();
      setDiagData(data);
    } catch {
      setDiagData({ status: "degraded", checks: { database: { status: "down" }, redis: { status: "down" } } });
    } finally {
      setDiagLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword) {
      setStatusMessage({ type: "error", text: "Please enter your current password." });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({ type: "success", text: "Password changed successfully! Keep your new credentials secure." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to change password." });
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--text-heading)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Settings size={26} color="var(--sys-blue-primary)" />
          Account & Security Settings
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px", marginBottom: 0 }}>
          Manage your enterprise credentials, identity designation, and security preferences.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          padding: "24px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "var(--sys-blue-subtle)",
              color: "var(--sys-blue-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 700,
              border: "2px solid var(--sys-blue-border)",
            }}
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "ST"}
          </div>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              {user?.name || "System Operator"}
            </h2>
            <div style={{ fontSize: "13px", color: "var(--sys-green-accent)", fontWeight: 600, marginTop: "2px" }}>
              {user?.designation || "Enterprise Automation Engineer"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            paddingTop: "16px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Mail size={16} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Email</div>
              <div style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--text-heading)" }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Shield size={16} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Access Role</div>
              <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--sys-green-accent)", fontFamily: "var(--font-mono)" }}>
                {user?.role || "SUPER_ADMIN"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <MapPin size={16} color="var(--text-muted)" />
            <div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Base Facility</div>
              <div style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--text-heading)" }}>
                {user?.baseLocation || "HQ - Jamshedpur Engineering Center"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          padding: "24px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <KeyRound size={20} color="var(--sys-green-accent)" />
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
            Change Password
          </h2>
        </div>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "20px", marginTop: "2px" }}>
          Update your access credentials. Choose a secure phrase with at least 6 characters.
        </p>

        {statusMessage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: statusMessage.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: statusMessage.type === "success" ? "1px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
              color: statusMessage.type === "success" ? "#16a34a" : "#dc2626",
              fontSize: "13.5px",
              marginBottom: "20px",
            }}
          >
            {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
          <div>
            <label
              htmlFor="currentPassword"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: "6px",
              }}
            >
              Current Password
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
                <Lock size={15} />
              </span>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: "6px",
              }}
            >
              New Password
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
                <KeyRound size={15} />
              </span>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-heading)",
                marginBottom: "6px",
              }}
            >
              Confirm New Password
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
                <KeyRound size={15} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: "8px" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-blue-primary)",
                color: "#ffffff",
                border: "none",
                fontSize: "13.5px",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {isSubmitting ? "Updating Password..." : "Save New Password"}
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          padding: "24px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px 0" }}>
          Workspace Appearance & Environment
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-heading)" }}>Visual Theme</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Toggle between high-contrast light mode and industrial dark mode.
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {isAdmin && (
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "24px",
            boxShadow: "var(--shadow-card)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Activity size={20} color="var(--sys-blue-primary)" />
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                  Infrastructure Health & Diagnostics
                </h2>
                <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Live connectivity probes and subsystem latency metrics (Super Admin Restricted).
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={runDiagnostics}
              disabled={diagLoading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "6px",
                backgroundColor: "var(--sys-blue-primary)",
                color: "#ffffff",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: diagLoading ? "not-allowed" : "pointer",
              }}
            >
              <RefreshCw size={14} className={diagLoading ? "spin" : ""} />
              <span>{diagLoading ? "Probing Subsystems..." : "Run Health Diagnostics"}</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div
              style={{
                backgroundColor: "var(--bg-canvas)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Database size={17} color="var(--sys-blue-primary)" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-heading)" }}>
                  Neon Serverless PostgreSQL
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: diagData?.checks?.database?.status === "up" ? "#10b981" : diagData ? "#ef4444" : "var(--text-muted)",
                }}
              >
                {diagData?.checks?.database?.status === "up" ? "HEALTHY (ONLINE)" : diagData ? "DEGRADED / DOWN" : "PENDING PROBE"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                Region: AWS ap-southeast-1 | Latency: {diagData?.checks?.database?.latencyMs ?? "--"} ms
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--bg-canvas)",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Server size={17} color="var(--sys-blue-primary)" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-heading)" }}>
                  Upstash Distributed Redis
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: diagData?.checks?.redis?.status === "up" ? "#10b981" : diagData ? "#ef4444" : "var(--text-muted)",
                }}
              >
                {diagData?.checks?.redis?.status === "up" ? "HEALTHY (ONLINE)" : diagData ? "DEGRADED / DOWN" : "PENDING PROBE"}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>
                Protocol: TLS Enabled | Latency: {diagData?.checks?.redis?.latencyMs ?? "--"} ms
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
