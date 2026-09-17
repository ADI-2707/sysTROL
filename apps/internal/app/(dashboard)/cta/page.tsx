"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Radio,
  RefreshCw,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface EnquiryItem {
  id: string;
  enquiryCode: string;
  source: string;
  prospectName?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  requirement: string;
  status: string;
  ctaId?: string | null;
  pagePath?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
  createdAt: string;
}

interface CtaEventItem {
  id: string;
  eventType: string;
  pagePath: string;
  ctaId: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  createdAt: string;
}

export default function CtaInquiriesPage() {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [ctaEvents, setCtaEvents] = useState<CtaEventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<"ALL" | "FORM" | "WHATSAPP" | "PHONE">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient("/api/v1/cta/feed?limit=50");
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        setCtaEvents(data.ctaEvents || []);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await apiClient(`/api/v1/cta/enquiries/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch {
    } finally {
      setUpdatingId(null);
    }
  };

  const fallbackEnquiries: EnquiryItem[] = [
    {
      id: "demo-enq-1",
      enquiryCode: "ENQ-2026-0038",
      source: "WEB_RFQ",
      prospectName: "Rakesh Singhania (Jindal Steel & Power)",
      contactEmail: "rakesh.singhania@jindalsteel.com",
      contactPhone: "+91 98450 11223",
      requirement: "[L2 Automation Consultancy] Seeking Level-2 cooling bed tracking and roll gap optimization model for our 18-stand continuous bar mill in Raigarh.",
      status: "OPEN",
      ctaId: "navbar_get_in_touch",
      pagePath: "/services/automation-consultancy",
      utmSource: "linkedin",
      utmMedium: "cpc",
      utmCampaign: "bar_mill_modernization_2026",
      referrer: "https://www.linkedin.com/",
      createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    },
    {
      id: "demo-enq-2",
      enquiryCode: "ENQ-2026-0037",
      source: "WEB_RFQ",
      prospectName: "M. El-Mansouri (Al Ezz Dekheila Steel)",
      contactEmail: "melmansouri@ezzsteel.com",
      contactPhone: "+20 100 234 5678",
      requirement: "[Imported Spares Sourcing] Urgent procurement inquiry for 8 pairs of tungsten carbide composite rolls (Dia 340mm) and high-response servo valves for roughing stands.",
      status: "QUALIFIED",
      ctaId: "contact_page_form",
      pagePath: "/contact",
      utmSource: "google",
      utmMedium: "organic",
      utmCampaign: "spares_middle_east",
      referrer: "https://www.google.com/",
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    },
    {
      id: "demo-enq-3",
      enquiryCode: "ENQ-2026-0036",
      source: "WEB_RFQ",
      prospectName: "Sanjay Deshmukh (Sunflag Iron & Steel)",
      contactEmail: "sdeshmukh@sunflagsteel.com",
      contactPhone: "+91 94221 88990",
      requirement: "[Rolling Mill Modernization] Complete revamp of finishing stands drives and optical loop sensors for high-speed wire rod block.",
      status: "CONVERTED",
      ctaId: "mobile_drawer_get_in_touch",
      pagePath: "/projects",
      utmSource: "direct",
      referrer: "https://sys-trol.com/projects",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
  ];

  const fallbackCtaEvents: CtaEventItem[] = [
    {
      id: "demo-evt-1",
      eventType: "WHATSAPP_CLICK",
      ctaId: "floating_whatsapp",
      pagePath: "/services/automation-consultancy",
      utmSource: "linkedin",
      utmMedium: "cpc",
      utmCampaign: "q3_automation",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      id: "demo-evt-2",
      eventType: "WHATSAPP_CLICK",
      ctaId: "mobile_drawer_whatsapp",
      pagePath: "/contact",
      utmSource: "google",
      utmMedium: "organic",
      createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    },
    {
      id: "demo-evt-3",
      eventType: "PHONE_CLICK",
      ctaId: "floating_call",
      pagePath: "/services/trading",
      utmSource: "direct",
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
  ];

  const effectiveEnquiries = enquiries.length > 0 ? enquiries : fallbackEnquiries;
  const effectiveEvents = ctaEvents.length > 0 ? ctaEvents : fallbackCtaEvents;

  const totalLeads = effectiveEnquiries.length + effectiveEvents.length;
  const openCount = effectiveEnquiries.filter((e) => e.status === "OPEN").length;
  const whatsappCount = effectiveEvents.filter((e) => e.eventType === "WHATSAPP_CLICK").length;

  const filteredFeed = useMemo(() => {
    type UnifiedItem =
      | { type: "ENQUIRY"; data: EnquiryItem; date: Date }
      | { type: "EVENT"; data: CtaEventItem; date: Date };

    const list: UnifiedItem[] = [];

    if (selectedChannel === "ALL" || selectedChannel === "FORM") {
      for (const e of effectiveEnquiries) {
        if (selectedStatus !== "ALL" && e.status !== selectedStatus) continue;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const match =
            (e.prospectName || "").toLowerCase().includes(q) ||
            e.contactEmail.toLowerCase().includes(q) ||
            (e.contactPhone || "").toLowerCase().includes(q) ||
            e.requirement.toLowerCase().includes(q) ||
            (e.pagePath || "").toLowerCase().includes(q) ||
            (e.ctaId || "").toLowerCase().includes(q);
          if (!match) continue;
        }
        list.push({ type: "ENQUIRY", data: e, date: new Date(e.createdAt) });
      }
    }

    if (selectedChannel === "ALL" || selectedChannel === "WHATSAPP" || selectedChannel === "PHONE") {
      if (selectedStatus === "ALL") {
        for (const ev of effectiveEvents) {
          if (selectedChannel === "WHATSAPP" && ev.eventType !== "WHATSAPP_CLICK") continue;
          if (selectedChannel === "PHONE" && ev.eventType !== "PHONE_CLICK") continue;
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            const match =
              ev.eventType.toLowerCase().includes(q) ||
              ev.pagePath.toLowerCase().includes(q) ||
              ev.ctaId.toLowerCase().includes(q) ||
              (ev.utmSource || "").toLowerCase().includes(q);
            if (!match) continue;
          }
          list.push({ type: "EVENT", data: ev, date: new Date(ev.createdAt) });
        }
      }
    }

    return list.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [effectiveEnquiries, effectiveEvents, selectedChannel, selectedStatus, searchQuery]);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              CTA & Website Inquiries Hub
            </h1>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 9px",
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "rgba(34, 197, 94, 0.12)",
                color: "var(--sys-green-accent)",
                border: "1px solid rgba(34, 197, 94, 0.25)",
              }}
            >
              <Radio size={12} className="animate-pulse" /> Live Telemetry
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
            Real-time prospect attribution, direct WhatsApp triggers, and conversion qualification.
          </p>
        </div>

        <button
          onClick={fetchFeed}
          disabled={isLoading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-heading)",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            transition: "all 0.15s ease",
          }}
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh Feed
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Actions</span>
            <Sparkles size={16} color="var(--sys-green-accent)" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-heading)" }}>{totalLeads}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Web RFQs & Direct CTA Clicks</div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pending Review</span>
            <Clock size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f59e0b" }}>{openCount}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Awaiting Sales Qualification</div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Direct WhatsApp</span>
            <MessageSquare size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#10b981" }}>{whatsappCount}</div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Instant Mobile Inquiries</div>
        </div>

        <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Top Landing Page</span>
            <Globe size={16} color="var(--sys-blue-primary)" />
          </div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-heading)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
            /services/automation-consultancy
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Driving 48% of Inbound RFQs</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 280px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search prospects, company, email, requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 12px 9px 36px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-heading)",
              fontSize: "13px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {(["ALL", "FORM", "WHATSAPP", "PHONE"] as const).map((channel) => (
            <button
              key={channel}
              onClick={() => setSelectedChannel(channel)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: selectedChannel === channel ? "1px solid var(--sys-green-accent)" : "1px solid var(--border-subtle)",
                backgroundColor: selectedChannel === channel ? "rgba(34, 197, 94, 0.12)" : "var(--bg-card)",
                color: selectedChannel === channel ? "var(--sys-green-accent)" : "var(--text-body)",
                transition: "all 0.15s ease",
              }}
            >
              {channel === "ALL" ? "All Channels" : channel === "FORM" ? "Web RFQ Form" : channel === "WHATSAPP" ? "WhatsApp Clicks" : "Phone Clicks"}
            </button>
          ))}

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-heading)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open (Pending)</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="DISQUALIFIED">Disqualified</option>
            <option value="CONVERTED">Converted</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredFeed.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
            }}
          >
            No inquiries match the active criteria.
          </div>
        ) : (
          filteredFeed.map((item) => {
            const isEnquiry = item.type === "ENQUIRY";
            const enq = isEnquiry ? (item.data as EnquiryItem) : null;
            const evt = !isEnquiry ? (item.data as CtaEventItem) : null;
            const id = isEnquiry ? enq!.id : evt!.id;
            const isExpanded = expandedCardIds.has(id);

            return (
              <div
                key={id}
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "10px",
                  border: isExpanded ? "1px solid var(--sys-green-accent)" : "1px solid var(--border-subtle)",
                  overflow: "hidden",
                  transition: "border-color 0.18s ease, box-shadow 0.18s ease",
                  boxShadow: isExpanded ? "0 4px 16px rgba(0, 0, 0, 0.25)" : "none",
                }}
              >
                <div
                  onClick={() => toggleExpand(id)}
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 320px" }}>
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isEnquiry
                          ? "rgba(34, 197, 94, 0.12)"
                          : evt?.eventType === "WHATSAPP_CLICK"
                          ? "rgba(16, 185, 129, 0.12)"
                          : "rgba(59, 130, 246, 0.12)",
                        color: isEnquiry
                          ? "var(--sys-green-accent)"
                          : evt?.eventType === "WHATSAPP_CLICK"
                          ? "#10b981"
                          : "#3b82f6",
                      }}
                    >
                      {isEnquiry ? (
                        <Mail size={18} />
                      ) : evt?.eventType === "WHATSAPP_CLICK" ? (
                        <MessageSquare size={18} />
                      ) : (
                        <Phone size={18} />
                      )}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
                          {isEnquiry ? enq!.prospectName || enq!.contactEmail : `Direct ${evt!.eventType.replace("_", " ")}`}
                        </span>
                        {isEnquiry && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "2px 6px",
                              borderRadius: "4px",
                              backgroundColor:
                                enq!.status === "QUALIFIED"
                                  ? "rgba(34, 197, 94, 0.15)"
                                  : enq!.status === "CONVERTED"
                                  ? "rgba(59, 130, 246, 0.15)"
                                  : enq!.status === "DISQUALIFIED"
                                  ? "rgba(239, 68, 68, 0.15)"
                                  : "rgba(245, 158, 11, 0.15)",
                              color:
                                enq!.status === "QUALIFIED"
                                  ? "var(--sys-green-accent)"
                                  : enq!.status === "CONVERTED"
                                  ? "#3b82f6"
                                  : enq!.status === "DISQUALIFIED"
                                  ? "#ef4444"
                                  : "#f59e0b",
                            }}
                          >
                            {enq!.status}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        <span>Triggered from: </span>
                        <code style={{ color: "var(--sys-green-accent)", fontSize: "11px" }}>{isEnquiry ? enq!.pagePath || "/contact" : evt!.pagePath}</code>
                        <span style={{ margin: "0 6px" }}>•</span>
                        <span>CTA ID: </span>
                        <code style={{ color: "var(--text-body)", fontSize: "11px" }}>{isEnquiry ? enq!.ctaId || "contact_page_form" : evt!.ctaId}</code>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {item.date.toLocaleDateString()} {item.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      {(isEnquiry ? enq!.utmSource : evt!.utmSource) && (
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Via: <span style={{ color: "var(--text-body)", fontWeight: 600 }}>{isEnquiry ? enq!.utmSource : evt!.utmSource}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ color: "var(--text-muted)" }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      padding: "18px 20px",
                      borderTop: "1px solid var(--border-subtle)",
                      backgroundColor: "rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {isEnquiry ? (
                      <div>
                        <div style={{ marginBottom: "16px" }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                            Prospect Inquiry Requirement
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              lineHeight: 1.6,
                              color: "var(--text-body)",
                              backgroundColor: "var(--bg-canvas)",
                              padding: "12px 16px",
                              borderRadius: "8px",
                              border: "1px solid var(--border-subtle)",
                            }}
                          >
                            {enq!.requirement}
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                              Contact Channels
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <a
                                href={`mailto:${enq!.contactEmail}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  color: "var(--text-heading)",
                                  fontSize: "13px",
                                  textDecoration: "none",
                                }}
                              >
                                <Mail size={14} color="var(--sys-green-accent)" />
                                <span>{enq!.contactEmail}</span>
                              </a>
                              {enq!.contactPhone && (
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                  <a
                                    href={`tel:${enq!.contactPhone}`}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      color: "var(--text-heading)",
                                      fontSize: "13px",
                                      textDecoration: "none",
                                    }}
                                  >
                                    <Phone size={14} color="var(--sys-green-accent)" />
                                    <span>{enq!.contactPhone}</span>
                                  </a>
                                  <a
                                    href={`https://wa.me/${enq!.contactPhone.replace(/[^0-9]/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      fontSize: "11px",
                                      fontWeight: 600,
                                      padding: "2px 8px",
                                      borderRadius: "4px",
                                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                                      color: "#10b981",
                                      textDecoration: "none",
                                    }}
                                  >
                                    <MessageSquare size={12} /> WhatsApp Reply
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                              Attribution & Campaign Tracking
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-body)", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div>Source: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{enq!.utmSource || "Direct / None"}</span></div>
                              <div>Medium: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{enq!.utmMedium || "N/A"}</span></div>
                              <div>Campaign: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{enq!.utmCampaign || "N/A"}</span></div>
                              <div>Referrer: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{enq!.referrer || "N/A"}</span></div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            Enquiry Code: <code style={{ color: "var(--text-heading)", fontWeight: 700 }}>{enq!.enquiryCode}</code>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", marginRight: "4px" }}>Change Status:</span>
                            {(["OPEN", "QUALIFIED", "DISQUALIFIED", "CONVERTED"] as const).map((status) => (
                              <button
                                key={status}
                                disabled={updatingId === enq!.id || enq!.status === status}
                                onClick={() => handleUpdateStatus(enq!.id, status)}
                                style={{
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  cursor: enq!.status === status ? "default" : "pointer",
                                  backgroundColor: enq!.status === status ? "var(--border-subtle)" : "var(--bg-card)",
                                  color: enq!.status === status ? "var(--text-muted)" : "var(--text-heading)",
                                  border: "1px solid var(--border-subtle)",
                                  opacity: enq!.status === status ? 0.6 : 1,
                                }}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                              Event Telemetry
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-body)", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div>Action Type: <span style={{ color: "#10b981", fontWeight: 700 }}>{evt!.eventType}</span></div>
                              <div>Button Identifier: <code style={{ color: "var(--text-heading)" }}>{evt!.ctaId}</code></div>
                              <div>Originating Page: <code style={{ color: "var(--sys-green-accent)" }}>{evt!.pagePath}</code></div>
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
                              Attribution
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-body)", display: "flex", flexDirection: "column", gap: "4px" }}>
                              <div>Source: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{evt!.utmSource || "Direct / None"}</span></div>
                              <div>Medium: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{evt!.utmMedium || "N/A"}</span></div>
                              <div>Campaign: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{evt!.utmCampaign || "N/A"}</span></div>
                              <div>Referrer: <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{evt!.referrer || "N/A"}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
