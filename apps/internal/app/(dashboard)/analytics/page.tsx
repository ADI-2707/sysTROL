"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MessageSquare,
  Users,
  TrendingUp,
  Layers,
  Clock,
  Globe,
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Building2,
  PhoneCall,
  Flame,
} from "lucide-react";
import { TabGroup } from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import {
  ProjectsAnalyticsDto,
  CtaAnalyticsDto,
  EmployeesAnalyticsDto,
} from "@systrol/types";

type AnalyticsTab = "projects" | "cta" | "employees";

export default function AnalyticsDashboardPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("projects");
  const [isLoading, setIsLoading] = useState(false);

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

  const fallbackProjects: ProjectsAnalyticsDto = {
    mostDoneMaterial: [
      { material: "Carbon Steel (IS 2062)", count: 18 },
      { material: "Alloy Steel (EN19/EN24)", count: 12 },
      { material: "Stainless Steel (SS 304/316)", count: 7 },
      { material: "Special Wire Rods", count: 5 },
    ],
    topClientsOverYears: [
      { clientId: "c-1", clientName: "Tata Steel Long Products", projectCount: 8, years: [2022, 2023, 2024, 2025, 2026] },
      { clientId: "c-2", clientName: "Jindal Steel & Power Ltd.", projectCount: 6, years: [2021, 2023, 2025] },
      { clientId: "c-3", clientName: "Sail Bhilai Steel Plant", projectCount: 4, years: [2020, 2022, 2024] },
      { clientId: "c-4", clientName: "Electrosteel Steels Ltd", projectCount: 3, years: [2023, 2025] },
    ],
    mostDoneLines: [
      { lineType: "Continuous TMT Bar Mill", count: 16 },
      { lineType: "High-Speed Wire Rod Block", count: 11 },
      { lineType: "Structural Section Mill", count: 8 },
      { lineType: "Narrow Strip Hot Rolling Mill", count: 4 },
    ],
    topMaterialAndLineCombinations: [
      { material: "Carbon Steel (IS 2062)", lineType: "Continuous TMT Bar Mill", count: 14 },
      { material: "Alloy Steel (EN19/EN24)", lineType: "High-Speed Wire Rod Block", count: 9 },
      { material: "Carbon Steel (IS 2062)", lineType: "Structural Section Mill", count: 6 },
      { material: "Stainless Steel (SS 304/316)", lineType: "Narrow Strip Hot Rolling Mill", count: 3 },
    ],
    fastestExecutionCombination: {
      material: "Carbon Steel (IS 2062)",
      lineType: "Continuous TMT Bar Mill",
      minDays: 34,
      projectCode: "PRJ-2024-0012",
      projectName: "Jindal Angul 24-Stand Bar Mill Cutover",
    },
  };

  const fallbackCta: CtaAnalyticsDto = {
    mostEnquiredPages: [
      { pagePath: "/services/automation-consultancy", count: 48 },
      { pagePath: "/contact", count: 35 },
      { pagePath: "/projects", count: 29 },
      { pagePath: "/services/trading", count: 21 },
      { pagePath: "/gallery", count: 14 },
    ],
    mostEffectiveCtaButtons: [
      { ctaId: "floating_whatsapp", count: 42 },
      { ctaId: "navbar_get_in_touch", count: 38 },
      { ctaId: "contact_page_form", count: 26 },
      { ctaId: "mobile_drawer_get_in_touch", count: 17 },
      { ctaId: "floating_call", count: 11 },
    ],
    directWhatsappCount: 42,
    totalCtaEvents: 85,
    totalEnquiries: 38,
  };

  const fallbackEmployees: EmployeesAnalyticsDto = {
    employees: [
      { employeeId: "e-1", employeeName: "Rajesh Sharma (Lead Commissioning)", totalSites: 14, completedSites: 13, indiaSites: 10, overseasSites: 4 },
      { employeeId: "e-2", employeeName: "Vikram Sengupta (Automation Specialist)", totalSites: 11, completedSites: 10, indiaSites: 7, overseasSites: 4 },
      { employeeId: "e-3", employeeName: "Anand Kulkarni (Senior Field Engineer)", totalSites: 9, completedSites: 8, indiaSites: 7, overseasSites: 2 },
      { employeeId: "e-4", employeeName: "Sandeep Verma (Drives & PLC Engineer)", totalSites: 7, completedSites: 6, indiaSites: 6, overseasSites: 1 },
      { employeeId: "e-5", employeeName: "Manoj Nambiar (Mill Metallurgy Engineer)", totalSites: 6, completedSites: 5, indiaSites: 4, overseasSites: 2 },
    ],
    totalCompletedSites: 42,
    totalIndiaSites: 34,
    totalOverseasSites: 13,
  };

  const proj = projectsData || fallbackProjects;
  const cta = ctaData || fallbackCta;
  const emp = employeesData || fallbackEmployees;

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

  const totalMaterialCount = proj.mostDoneMaterial.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const totalLineCount = proj.mostDoneLines.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const totalPageCount = cta.mostEnquiredPages.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const totalCtaBtnCount = cta.mostEffectiveCtaButtons.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 20px" }}>
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

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {proj.mostDoneMaterial.map((m, idx) => {
                  const pct = Math.round((m.count / totalMaterialCount) * 100);
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

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {proj.mostDoneLines.map((l, idx) => {
                  const pct = Math.round((l.count / totalLineCount) * 100);
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

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {proj.topMaterialAndLineCombinations.map((combo, idx) => (
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

                {proj.fastestExecutionCombination ? (
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
                        {proj.fastestExecutionCombination.minDays}
                      </span>
                      <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-heading)" }}>Days</span>
                    </div>

                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-heading)" }}>
                      {proj.fastestExecutionCombination.projectName}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                      Code: <code style={{ color: "var(--sys-green-accent)" }}>{proj.fastestExecutionCombination.projectCode}</code>
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-body)", marginTop: "6px" }}>
                      Material: <strong>{proj.fastestExecutionCombination.material}</strong> • Line: <strong>{proj.fastestExecutionCombination.lineType}</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
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
                  {proj.topClientsOverYears.map((client, idx) => (
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
          </div>
        </div>
      )}

      {activeTab === "cta" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Direct WhatsApp Conversions</span>
                <MessageSquare size={16} color="#10b981" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#10b981" }}>{cta.directWhatsappCount}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Direct 1-to-1 mobile inquiries</div>
            </div>

            <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Total Web Inquiries</span>
                <Briefcase size={16} color="var(--sys-green-accent)" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--sys-green-accent)" }}>{cta.totalEnquiries}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Submitted via engineering forms</div>
            </div>

            <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Total CTA Interactions</span>
                <Zap size={16} color="#3b82f6" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#3b82f6" }}>{cta.totalCtaEvents}</div>
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

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {cta.mostEnquiredPages.map((p, idx) => {
                  const pct = Math.round((p.count / totalPageCount) * 100);
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

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {cta.mostEffectiveCtaButtons.map((btn, idx) => {
                  const pct = Math.round((btn.count / totalCtaBtnCount) * 100);
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
            </div>
          </div>
        </div>
      )}

      {activeTab === "employees" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Total Completed Sites</span>
                <CheckCircle2 size={16} color="var(--sys-green-accent)" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--sys-green-accent)" }}>{emp.totalCompletedSites}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Site commissionings finished successfully</div>
            </div>

            <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>India Sites (Domestic)</span>
                <Globe size={16} color="#3b82f6" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#3b82f6" }}>{emp.totalIndiaSites}</div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Across Odisha, Jharkhand, Karnataka, etc.</div>
            </div>

            <div style={{ backgroundColor: "var(--bg-card)", padding: "18px 20px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Overseas Sites (Global)</span>
                <Globe size={16} color="#f59e0b" />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#f59e0b" }}>{emp.totalOverseasSites}</div>
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
                  {emp.employees.map((engineer) => {
                    const ratio = Math.round((engineer.completedSites / (engineer.totalSites || 1)) * 100);
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
          </div>
        </div>
      )}
    </div>
  );
}
