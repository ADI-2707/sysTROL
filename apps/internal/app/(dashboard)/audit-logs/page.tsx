"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Activity,
  Globe,
  Radio,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { canAccessAuditLogs } from "@/lib/permissions";
import { apiClient } from "@/lib/api-client";
import { DiffViewerDrawer, AuditLogItem } from "@/components/audit/DiffViewerDrawer";
import { LatencyMonitoringBanner } from "@/components/audit/LatencyMonitoringBanner";
import { TabGroup, TabItem } from "@/components/ui/tab-group";

interface CtaEventItem {
  id: string;
  eventType: string;
  pagePath: string;
  ctaId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  createdAt: string;
}

export default function AuditLogsPage() {
  const { user } = useAuth();
  const isAdmin = canAccessAuditLogs(user);

  const [activeTab, setActiveTab] = useState<"internal" | "public">("internal");

  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [entityType, setEntityType] = useState("");
  const [actionQuery, setActionQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const [ctaEvents, setCtaEvents] = useState<CtaEventItem[]>([]);
  const [ctaTotal, setCtaTotal] = useState(0);
  const [ctaTotalPages, setCtaTotalPages] = useState(1);
  const [ctaPage, setCtaPage] = useState(1);
  const [ctaSearch, setCtaSearch] = useState("");
  const [ctaPageFilter, setCtaPageFilter] = useState("");
  const [ctaIdFilter, setCtaIdFilter] = useState("");
  const [isCtaLoading, setIsCtaLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (entityType) params.set("entityType", entityType);
      if (actionQuery) params.set("action", actionQuery);

      const res = await apiClient(`/api/v1/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.items || []);
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, page, limit, entityType, actionQuery]);

  const fetchCtaFeed = useCallback(async () => {
    if (!isAdmin) return;
    setIsCtaLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(ctaPage));
      params.set("limit", "15");
      if (ctaSearch) params.set("search", ctaSearch);
      if (ctaPageFilter) params.set("pagePath", ctaPageFilter);
      if (ctaIdFilter) params.set("ctaId", ctaIdFilter);

      const res = await apiClient(`/api/v1/cta/feed?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCtaEvents(data.ctaEvents || []);
        setCtaTotal(data.totalCtaEvents || 0);
        setCtaTotalPages(Math.ceil((data.totalCtaEvents || 0) / 15) || 1);
      }
    } finally {
      setIsCtaLoading(false);
    }
  }, [isAdmin, ctaPage, ctaSearch, ctaPageFilter, ctaIdFilter]);

  useEffect(() => {
    if (activeTab === "internal") {
      fetchLogs();
    } else {
      fetchCtaFeed();
    }
  }, [activeTab, fetchLogs, fetchCtaFeed]);

  if (!isAdmin) {
    return (
      <div
        style={{
          maxWidth: "560px",
          margin: "80px auto",
          padding: "36px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          textAlign: "center",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
          }}
        >
          <Lock size={26} />
        </div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 8px 0" }}>
          Super Administrator Authorization Required
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, margin: "0 0 20px 0" }}>
          The enterprise audit ledger contains confidential compliance records, mutation diffs, and cryptographic trails. Access is strictly limited to authorized Super Administrators.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            padding: "8px 18px",
            borderRadius: "6px",
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
    );
  }

  const tabs: TabItem<"internal" | "public">[] = [
    {
      id: "internal",
      label: "Internal Ops Governance",
      icon: <ShieldCheck size={15} />,
    },
    {
      id: "public",
      label: "Public Web Telemetry",
      icon: <Activity size={15} />,
    },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldAlert size={26} color="var(--sys-blue-primary)" />
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              Audit Trail & Compliance Ledger
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px", marginBottom: 0 }}>
            Unified dual-channel observability for internal operations governance and public visitor telemetry.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => (activeTab === "internal" ? fetchLogs() : fetchCtaFeed())}
            disabled={activeTab === "internal" ? isLoading : isCtaLoading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 12px",
              borderRadius: "6px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-body)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: (activeTab === "internal" ? isLoading : isCtaLoading) ? "not-allowed" : "pointer",
            }}
          >
            <RefreshCw size={13} className={activeTab === "internal" ? (isLoading ? "spin" : "") : (isCtaLoading ? "spin" : "")} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {activeTab === "internal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ position: "relative", flex: "1 1 240px" }}>
              <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search action or URL..."
                value={actionQuery}
                onChange={(e) => {
                  setActionQuery(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "7px 12px 7px 32px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                value={entityType}
                onChange={(e) => {
                  setEntityType(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">All Entity Types</option>
                <option value="projects">Projects</option>
                <option value="enquiries">Enquiries</option>
                <option value="trials">Trials & Handover</option>
                <option value="procurement">Procurement</option>
                <option value="engineering">Engineering</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="dispatch">Dispatch</option>
                <option value="media">Media CMS</option>
                <option value="careers">Careers & Jobs</option>
              </select>
            </div>

            <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Total Events: {total}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12.5px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-canvas)", borderBottom: "1px solid var(--border-subtle)" }}>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Timestamp</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Actor</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Action</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Entity</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Target ID</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Project</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600, textAlign: "right" }}>Inspect</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                        {isLoading ? "Loading audit records..." : "No matching audit log records found."}
                      </td>
                    </tr>
                  ) : (
                    logs.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: "1px solid var(--border-subtle)",
                          transition: "background-color 0.15s ease",
                        }}
                      >
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-body)", whiteSpace: "nowrap" }}>
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-heading)", fontWeight: 600 }}>
                          {item.actorId.slice(0, 12)}
                        </td>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--sys-blue-primary)" }}>
                          {item.action}
                        </td>
                        <td style={{ padding: "10px 14px", textTransform: "capitalize", color: "var(--text-heading)", fontWeight: 500 }}>
                          {item.entityType}
                        </td>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                          {item.entityId.slice(0, 10)}
                        </td>
                        <td style={{ padding: "10px 14px", color: "var(--text-body)" }}>
                          {item.project ? `${item.project.projectCode || (item.project as any).code}` : "--"}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => setSelectedLog(item)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: "var(--sys-blue-subtle)",
                              color: "var(--sys-blue-primary)",
                              border: "1px solid var(--sys-blue-border)",
                              fontSize: "11px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <Eye size={12} />
                            <span>Diff</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderTop: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              <div>
                Page {page} of {totalPages}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-card)",
                    color: page <= 1 ? "var(--text-muted)" : "var(--text-heading)",
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-card)",
                    color: page >= totalPages ? "var(--text-muted)" : "var(--text-heading)",
                    cursor: page >= totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "public" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <LatencyMonitoringBanner />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ position: "relative", flex: "1 1 240px" }}>
              <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search visitor IP, page, CTA button, UTM..."
                value={ctaSearch}
                onChange={(e) => {
                  setCtaSearch(e.target.value);
                  setCtaPage(1);
                }}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "7px 12px 7px 32px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                value={ctaIdFilter}
                onChange={(e) => {
                  setCtaIdFilter(e.target.value);
                  setCtaPage(1);
                }}
                style={{
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">All CTA Actions</option>
                <option value="quote-cta">quote-cta</option>
                <option value="contact-cta">contact-cta</option>
                <option value="careers-cta">careers-cta</option>
                <option value="whatsapp-cta">whatsapp-cta</option>
                <option value="spec-sheet-download">spec-sheet-download</option>
              </select>

              <select
                value={ctaPageFilter}
                onChange={(e) => {
                  setCtaPageFilter(e.target.value);
                  setCtaPage(1);
                }}
                style={{
                  padding: "7px 10px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-heading)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">All Page Paths</option>
                <option value="/">Home (/)</option>
                <option value="/solutions">Solutions (/solutions)</option>
                <option value="/products">Products (/products)</option>
                <option value="/careers">Careers (/careers)</option>
                <option value="/contact">Contact (/contact)</option>
              </select>
            </div>

            <div style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              Total Telemetry Events: {ctaTotal}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--bg-card)",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12.5px" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--bg-canvas)", borderBottom: "1px solid var(--border-subtle)" }}>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Timestamp</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Visitor IP</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Page Path</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>CTA Target</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>Referrer / Channel</th>
                    <th style={{ padding: "10px 14px", color: "var(--text-muted)", fontWeight: 600 }}>UTM Campaign / Source</th>
                  </tr>
                </thead>
                <tbody>
                  {ctaEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                        {isCtaLoading ? "Loading visitor telemetry feed..." : "No public visitor telemetry events recorded."}
                      </td>
                    </tr>
                  ) : (
                    ctaEvents.map((event) => (
                      <tr
                        key={event.id}
                        style={{
                          borderBottom: "1px solid var(--border-subtle)",
                          transition: "background-color 0.15s ease",
                        }}
                      >
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-body)", whiteSpace: "nowrap" }}>
                          {new Date(event.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)" }}>
                          <span
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              backgroundColor: "var(--bg-canvas)",
                              border: "1px solid var(--border-subtle)",
                              color: "var(--text-heading)",
                              fontSize: "11.5px",
                            }}
                          >
                            {event.ipAddress || "127.0.0.1"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-heading)" }}>
                          {event.pagePath || "/"}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              fontSize: "11px",
                              fontWeight: 600,
                              backgroundColor: "rgba(16, 185, 129, 0.12)",
                              color: "var(--sys-green-accent)",
                            }}
                          >
                            {event.ctaId}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px", color: "var(--text-body)" }}>
                          {event.referrer || "Direct / Internal"}
                        </td>
                        <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "11.5px" }}>
                          {event.utmSource ? `${event.utmSource} (${event.utmMedium || "web"})` : "--"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderTop: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              <div>
                Page {ctaPage} of {ctaTotalPages}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <button
                  type="button"
                  disabled={ctaPage <= 1}
                  onClick={() => setCtaPage((p) => Math.max(1, p - 1))}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-card)",
                    color: ctaPage <= 1 ? "var(--text-muted)" : "var(--text-heading)",
                    cursor: ctaPage <= 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  disabled={ctaPage >= ctaTotalPages}
                  onClick={() => setCtaPage((p) => Math.min(ctaTotalPages, p + 1))}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-card)",
                    color: ctaPage >= ctaTotalPages ? "var(--text-muted)" : "var(--text-heading)",
                    cursor: ctaPage >= ctaTotalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DiffViewerDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
}
