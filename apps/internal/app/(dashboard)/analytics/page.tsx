"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MessageSquare,
  Users,
  Layers,
  Globe,
  Award,
  Zap,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Building2,
  Flame,
} from "lucide-react";
import {
  TabGroup,
  Skeleton,
  SkeletonCard,
  SkeletonKpiCard,
  SkeletonTableRow,
} from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import {
  ProjectsAnalyticsDto,
  CtaAnalyticsDto,
  EmployeesAnalyticsDto,
} from "@systrol/types";

type AnalyticsTab = "projects" | "cta" | "employees";

export default function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("projects");
  const [isLoading, setIsLoading] = useState(true);

  const [projectsData, setProjectsData] = useState<ProjectsAnalyticsDto | null>(null);
  const [ctaData, setCtaData] = useState<CtaAnalyticsDto | null>(null);
  const [employeesData, setEmployeesData] = useState<EmployeesAnalyticsDto | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [projRes, ctaRes, empRes] = await Promise.all([
        apiClient("/api/v1/analytics/projects"),
        apiClient("/api/v1/analytics/cta"),
        apiClient("/api/v1/analytics/employees"),
      ]);

      if (projRes.ok) {
        setProjectsData(await projRes.json());
      }
      if (ctaRes.ok) {
        setCtaData(await ctaRes.json());
      }
      if (empRes.ok) {
        setEmployeesData(await empRes.json());
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const tabs = [
    {
      id: "projects" as const,
      label: "Projects Intelligence",
      icon: <Briefcase size={15} />,
    },
    {
      id: "cta" as const,
      label: "CTA & Conversion Attributions",
      icon: <MessageSquare size={15} />,
    },
    {
      id: "employees" as const,
      label: "Employee Site Deployments",
      icon: <Users size={15} />,
    },
  ];

  const totalMaterialCount =
    projectsData?.mostDoneMaterial.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const totalLineCount =
    projectsData?.mostDoneLines.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const totalPageCount =
    ctaData?.mostEnquiredPages.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const totalCtaBtnCount =
    ctaData?.mostEffectiveCtaButtons.reduce((acc, curr) => acc + curr.count, 0) || 0;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              Industrial Analytics & Performance Center
            </h1>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>
            Comprehensive operational intelligence: metallurgical projects, digital CTA conversions, and field deployments.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
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
          Refresh Metrics
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <TabGroup tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {activeTab === "projects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {isLoading && !projectsData ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <SkeletonCard height="170px" />
                <SkeletonCard height="170px" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <SkeletonCard height="190px" />
                <SkeletonCard height="190px" />
              </div>
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Skeleton variant="text" width="220px" height="18px" />
                  <Skeleton variant="circular" width="20px" height="20px" />
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <SkeletonTableRow columns={4} />
                    <SkeletonTableRow columns={4} />
                    <SkeletonTableRow columns={4} />
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                        Top Processed Materials
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Most frequent metallurgy across all commissioned projects
                      </div>
                    </div>
                    <Flame size={20} color="var(--sys-green-accent)" />
                  </div>

                  {projectsData && projectsData.mostDoneMaterial.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {projectsData.mostDoneMaterial.map((m, idx) => {
                        const pct = totalMaterialCount > 0 ? Math.round((m.count / totalMaterialCount) * 100) : 0;
                        return (
                          <div key={m.material}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                              <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                                {idx + 1}. {m.material}
                              </span>
                              <span style={{ fontWeight: 700, color: "var(--sys-green-accent)" }}>
                                {m.count} projects ({pct}%)
                              </span>
                            </div>
                            <div style={{ width: "100%", height: "7px", backgroundColor: "var(--border-subtle)", borderRadius: "9999px", overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: "100%",
                                  backgroundColor: idx === 0 ? "var(--sys-green-accent)" : idx === 1 ? "#10b981" : "#3b82f6",
                                  borderRadius: "9999px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                      No commissioned project materials recorded yet.
                    </div>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                        Top Mill Lines
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Most executed rolling mill line types
                      </div>
                    </div>
                    <Layers size={20} color="#3b82f6" />
                  </div>

                  {projectsData && projectsData.mostDoneLines.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {projectsData.mostDoneLines.map((l, idx) => {
                        const pct = totalLineCount > 0 ? Math.round((l.count / totalLineCount) * 100) : 0;
                        return (
                          <div key={l.lineType}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                              <span style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                                {idx + 1}. {l.lineType}
                              </span>
                              <span style={{ fontWeight: 700, color: "#3b82f6" }}>
                                {l.count} lines ({pct}%)
                              </span>
                            </div>
                            <div style={{ width: "100%", height: "7px", backgroundColor: "var(--border-subtle)", borderRadius: "9999px", overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: "100%",
                                  backgroundColor: idx === 0 ? "#3b82f6" : "#60a5fa",
                                  borderRadius: "9999px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                      No mill lines recorded yet.
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                        Top Material & Line Combination
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Synergies with highest execution frequency
                      </div>
                    </div>
                    <Award size={20} color="#f59e0b" />
                  </div>

                  {projectsData && projectsData.topMaterialAndLineCombinations.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {projectsData.topMaterialAndLineCombinations.map((combo, idx) => (
                        <div
                          key={`${combo.material}-${combo.lineType}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            backgroundColor: idx === 0 ? "rgba(245, 158, 11, 0.08)" : "var(--bg-canvas)",
                            border: idx === 0 ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid var(--border-subtle)",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)" }}>
                              {combo.material}
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                              Line: {combo.lineType}
                            </div>
                          </div>
                          <div style={{ fontSize: "15px", fontWeight: 800, color: idx === 0 ? "#f59e0b" : "var(--text-heading)" }}>
                            {combo.count}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                      No material and line combinations recorded yet.
                    </div>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                          Fastest Cutover Execution Record
                        </h3>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                          Minimum duration achieved from start date to commissioning handover
                        </div>
                      </div>
                      <Zap size={20} color="var(--sys-green-accent)" />
                    </div>

                    {projectsData?.fastestExecutionCombination ? (
                      <div
                        style={{
                          padding: "16px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(34, 197, 94, 0.08)",
                          border: "1px solid rgba(34, 197, 94, 0.25)",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "36px", fontWeight: 800, color: "var(--sys-green-accent)" }}>
                            {projectsData.fastestExecutionCombination.minDays}
                          </span>
                          <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-heading)" }}>Days</span>
                        </div>

                        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)" }}>
                          {projectsData.fastestExecutionCombination.projectName}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                          Code: <code style={{ color: "var(--sys-green-accent)" }}>{projectsData.fastestExecutionCombination.projectCode}</code>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-body)", marginTop: "6px" }}>
                          Material: <strong>{projectsData.fastestExecutionCombination.material}</strong> • Line: <strong>{projectsData.fastestExecutionCombination.lineType}</strong>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                        No recorded cutovers yet.
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: "12px", color: "var(--text-muted)", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
                    Benchmark standard across Indian steel mills: <strong>45-60 Days</strong>.
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                      Top Clients Over the Years
                    </h3>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Clients commissioning repeated modernization & automation projects
                    </div>
                  </div>
                  <Building2 size={20} color="var(--sys-green-accent)" />
                </div>

                {projectsData && projectsData.topClientsOverYears.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Rank</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Client Organization</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Total Projects Commissioned</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Active Engagement Years</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectsData.topClientsOverYears.map((client, idx) => (
                          <tr key={client.clientId} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                            <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-muted)" }}>#{idx + 1}</td>
                            <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-heading)" }}>{client.clientName}</td>
                            <td style={{ padding: "12px", fontWeight: 700, color: "var(--sys-green-accent)" }}>{client.projectCount} Projects</td>
                            <td style={{ padding: "12px" }}>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {client.years.map((y) => (
                                  <span
                                    key={y}
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: 600,
                                      padding: "2px 7px",
                                      borderRadius: "4px",
                                      backgroundColor: "var(--bg-canvas)",
                                      border: "1px solid var(--border-subtle)",
                                      color: "var(--text-body)",
                                    }}
                                  >
                                    {y}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                    No client project commissioning records found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "cta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {isLoading && !ctaData ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <SkeletonKpiCard />
                <SkeletonKpiCard />
                <SkeletonKpiCard />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
                <SkeletonCard height="160px" />
                <SkeletonCard height="160px" />
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Direct WhatsApp Conversions</span>
                    <MessageSquare size={16} color="#10b981" />
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#10b981" }}>{ctaData?.directWhatsappCount ?? 0}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Direct 1-to-1 mobile inquiries</div>
                </div>

                <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Total Web Inquiries</span>
                    <Briefcase size={16} color="var(--sys-green-accent)" />
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--sys-green-accent)" }}>{ctaData?.totalEnquiries ?? 0}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Submitted via engineering forms</div>
                </div>

                <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Total CTA Interactions</span>
                    <Zap size={16} color="#3b82f6" />
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#3b82f6" }}>{ctaData?.totalCtaEvents ?? 0}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Clicks across buttons, links, calls</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" }}>
                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                        Most Inquired Landing Pages
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Public website pages originating the most inquiries & actions
                      </div>
                    </div>
                    <Globe size={20} color="var(--sys-blue-primary)" />
                  </div>

                  {ctaData && ctaData.mostEnquiredPages.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {ctaData.mostEnquiredPages.map((p, idx) => {
                        const pct = totalPageCount > 0 ? Math.round((p.count / totalPageCount) * 100) : 0;
                        return (
                          <div key={p.pagePath}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                              <code style={{ fontWeight: 600, color: "var(--sys-green-accent)" }}>
                                {p.pagePath}
                              </code>
                              <span style={{ fontWeight: 700, color: "var(--text-heading)" }}>
                                {p.count} actions ({pct}%)
                              </span>
                            </div>
                            <div style={{ width: "100%", height: "7px", backgroundColor: "var(--border-subtle)", borderRadius: "9999px", overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: "100%",
                                  backgroundColor: idx === 0 ? "var(--sys-green-accent)" : "#3b82f6",
                                  borderRadius: "9999px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                      No page inquiries recorded yet.
                    </div>
                  )}
                </div>

                <div
                  style={{
                    backgroundColor: "var(--bg-card)",
                    padding: "20px 24px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                        Most Effective CTA Buttons
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        Specific interactive CTA elements driving prospect conversion
                      </div>
                    </div>
                    <Zap size={20} color="#f59e0b" />
                  </div>

                  {ctaData && ctaData.mostEffectiveCtaButtons.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {ctaData.mostEffectiveCtaButtons.map((btn, idx) => {
                        const pct = totalCtaBtnCount > 0 ? Math.round((btn.count / totalCtaBtnCount) * 100) : 0;
                        return (
                          <div key={btn.ctaId}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                              <code style={{ fontWeight: 600, color: "var(--text-heading)" }}>
                                {btn.ctaId}
                              </code>
                              <span style={{ fontWeight: 700, color: "#f59e0b" }}>
                                {btn.count} clicks ({pct}%)
                              </span>
                            </div>
                            <div style={{ width: "100%", height: "7px", backgroundColor: "var(--border-subtle)", borderRadius: "9999px", overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${pct}%`,
                                  height: "100%",
                                  backgroundColor: idx === 0 ? "#f59e0b" : "#fbbf24",
                                  borderRadius: "9999px",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                      No CTA button clicks recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "employees" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {isLoading && !employeesData ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <SkeletonKpiCard />
                <SkeletonKpiCard />
                <SkeletonKpiCard />
              </div>
              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Skeleton variant="text" width="280px" height="18px" />
                  <Skeleton variant="circular" width="20px" height="20px" />
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                    <SkeletonTableRow columns={6} />
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Total Completed Sites</span>
                    <CheckCircle2 size={16} color="var(--sys-green-accent)" />
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--sys-green-accent)" }}>{employeesData?.totalCompletedSites ?? 0}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Site commissionings finished successfully</div>
                </div>

                <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>India Sites (Domestic)</span>
                    <Globe size={16} color="#3b82f6" />
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#3b82f6" }}>{employeesData?.totalIndiaSites ?? 0}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Across Odisha, Jharkhand, Karnataka, etc.</div>
                </div>

                <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Overseas Sites (Global)</span>
                    <Globe size={16} color="#f59e0b" />
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "#f59e0b" }}>{employeesData?.totalOverseasSites ?? 0}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Middle East, Africa, SE Asia</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--bg-card)",
                  padding: "20px 24px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                      Engineer Site Deployments & Field Records
                    </h3>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      Field engineers with completed vs active sites, and domestic vs international split
                    </div>
                  </div>
                  <ShieldCheck size={20} color="var(--sys-green-accent)" />
                </div>

                {employeesData && employeesData.employees.length > 0 ? (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Engineer</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Total Sites</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Completed Sites</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>India Sites</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Overseas Sites</th>
                          <th style={{ padding: "10px 12px", fontWeight: 600 }}>Completion Ratio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employeesData.employees.map((engineer) => {
                          const ratio =
                            engineer.totalSites > 0
                              ? Math.round((engineer.completedSites / engineer.totalSites) * 100)
                              : 0;
                          return (
                            <tr key={engineer.employeeId} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                              <td style={{ padding: "12px", fontWeight: 700, color: "var(--text-heading)" }}>
                                {engineer.employeeName}
                              </td>
                              <td style={{ padding: "12px", fontWeight: 600 }}>{engineer.totalSites}</td>
                              <td style={{ padding: "12px" }}>
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "2px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    backgroundColor: "rgba(34, 197, 94, 0.12)",
                                    color: "var(--sys-green-accent)",
                                  }}
                                >
                                  <CheckCircle2 size={12} /> {engineer.completedSites}
                                </span>
                              </td>
                              <td style={{ padding: "12px", color: "#3b82f6", fontWeight: 600 }}>
                                {engineer.indiaSites} Sites
                              </td>
                              <td style={{ padding: "12px", color: "#f59e0b", fontWeight: 600 }}>
                                {engineer.overseasSites} Sites
                              </td>
                              <td style={{ padding: "12px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <div style={{ width: "80px", height: "6px", backgroundColor: "var(--border-subtle)", borderRadius: "9999px", overflow: "hidden" }}>
                                    <div
                                      style={{
                                        width: `${ratio}%`,
                                        height: "100%",
                                        backgroundColor: ratio >= 90 ? "var(--sys-green-accent)" : "#f59e0b",
                                        borderRadius: "9999px",
                                      }}
                                    />
                                  </div>
                                  <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-heading)" }}>{ratio}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", color: "var(--text-muted)", padding: "16px 0" }}>
                    No engineer site deployment records found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
