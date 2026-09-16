"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Building,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Flame,
  Layers,
} from "lucide-react";
import { getProjects, ProjectItem } from "@/lib/projects-data";

export default function DashboardPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const ongoingProjects = projects.filter((p) => p.status === "ONGOING");
  const commissionedProjects = projects.filter((p) => p.status === "COMMISSIONED");
  const totalOnSite = projects.reduce((acc, p) => acc + p.onSiteEmployees.length, 0);

  const monthlyDeliveries = [
    { month: "Jan", count: 1, val: "₹18M" },
    { month: "Feb", count: 2, val: "₹24M" },
    { month: "Mar", count: 3, val: "₹36M" },
    { month: "Apr", count: 2, val: "₹22M" },
    { month: "May", count: 4, val: "₹45M" },
    { month: "Jun", count: 3, val: "₹38M" },
  ];

  const recentActivities = [
    {
      id: "act-1",
      title: "Cold Trial Run Cleared",
      project: "ArcelorMittal Hot Strip Mill - Line 2",
      actor: "Vikram Sengupta (Site Director)",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: "act-2",
      title: "Intermediate Step Added: Secondary Cable Routing",
      project: "Tata Steel Wire Rod Mill",
      actor: "Ananya Deshmukh (Principal Drives Lead)",
      time: "4 hours ago",
      type: "info",
    },
    {
      id: "act-3",
      title: "Field Instrumentation Specialist Deployed",
      project: "JSW Steel Bar & Section Mill #3",
      actor: "Pooja Hegde (Field Engineer)",
      time: "Yesterday",
      type: "neutral",
    },
    {
      id: "act-4",
      title: "PG Test Protocol Verified",
      project: "SAIL Bokaro Cold Rolling Mill",
      actor: "Rajeshwar Rao (Chief Metallurgy)",
      time: "2 days ago",
      type: "success",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
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
            <LayoutDashboard size={26} color="var(--sys-blue-primary)" />
            Enterprise Operations Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>
            Unified telemetric overview of rolling mill lines, on-site personnel, and lifecycle execution.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              padding: "5px 12px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-body)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Clock size={14} color="var(--sys-green-accent)" />
            Real-time Telemetry
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "20px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Ongoing Mill Lines
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-blue-subtle)",
                color: "var(--sys-blue-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-heading)" }}>
            {ongoingProjects.length}
          </div>
          <div style={{ fontSize: "12px", color: "var(--sys-blue-primary)", marginTop: "4px", fontWeight: 600 }}>
            Active site installations
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "20px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Commissioned Lines
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-green-subtle)",
                color: "var(--sys-green-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--sys-green-accent)" }}>
            {commissionedProjects.length}
          </div>
          <div style={{ fontSize: "12px", color: "var(--sys-green-accent)", marginTop: "4px", fontWeight: 600 }}>
            In commercial production & AMC
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "20px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Staff On-Site
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-blue-subtle)",
                color: "var(--sys-blue-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-heading)" }}>
            {totalOnSite}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Field specialists deployed at plants
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "20px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Active Contract Value
            </span>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--sys-green-subtle)",
                color: "var(--sys-green-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-heading)" }}>
            ₹ 128.4M
          </div>
          <div style={{ fontSize: "12px", color: "var(--sys-green-accent)", marginTop: "4px", fontWeight: 600 }}>
            +14% YoY automation expansion
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "24px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                Active Mill Line Lifecycle Progress
              </h2>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                Sequential stage progress across ongoing plant lines
              </div>
            </div>
            <Link
              href="/projects"
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--sys-blue-primary)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>All Projects</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {ongoingProjects.map((p) => {
              const completedSteps = p.steps.filter((s) => s.status === "COMPLETED").length;
              const totalSteps = p.steps.length;
              const pct = Math.round((completedSteps / Math.max(totalSteps, 1)) * 100);
              const activeStep = p.steps.find((s) => s.status === "IN_PROGRESS") || p.steps[0];

              return (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: "13.5px", color: "var(--text-heading)" }}>{p.clientName}</strong>
                      <span style={{ fontSize: "12.5px", color: "var(--text-muted)", marginLeft: "8px" }}>
                        ({p.lineName})
                      </span>
                    </div>
                    <span style={{ fontSize: "12.5px", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--sys-blue-primary)" }}>
                      {pct}%
                    </span>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "var(--bg-canvas)",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        backgroundColor: "var(--sys-blue-primary)",
                        borderRadius: "999px",
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px", color: "var(--text-muted)" }}>
                    <span>Active Stage: <strong style={{ color: "var(--text-body)" }}>{activeStep?.title}</strong></span>
                    <span>{p.onSiteEmployees.length} personnel on-site</span>
                  </div>
                </div>
              );
            })}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                Monthly Project Delivery Pace
              </h2>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                Completed milestones & technical cutovers
              </div>
            </div>
            <TrendingUp size={18} color="var(--sys-green-accent)" />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: "170px",
              paddingTop: "20px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            {monthlyDeliveries.map((m) => {
              const barHeight = `${m.count * 36}px`;

              return (
                <div
                  key={m.month}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>{m.val}</span>
                  <div
                    style={{
                      width: "32px",
                      height: barHeight,
                      backgroundColor: "var(--sys-green-accent)",
                      borderRadius: "6px 6px 0 0",
                      opacity: 0.85,
                      transition: "all 0.2s ease",
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--text-body)", fontWeight: 600 }}>{m.month}</span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            <span>Target Q2 Velocity: 95%</span>
            <span style={{ color: "var(--sys-green-accent)", fontWeight: 600 }}>On Track</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "24px",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              Recent Site Telemetry & Activity
            </h2>
            <ShieldCheck size={18} color="var(--sys-blue-primary)" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {recentActivities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: act.type === "success" ? "var(--sys-green-accent)" : "var(--sys-blue-primary)",
                    marginTop: "6px",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-heading)" }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-body)" }}>{act.project}</div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: "2px" }}>
                    By {act.actor} • {act.time}
                  </div>
                </div>
              </div>
            ))}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              On-Site Engineers by Plant
            </h2>
            <Link
              href="/employees"
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: "var(--sys-blue-primary)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Employee Directory</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-canvas)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-heading)" }}>
                  ArcelorMittal Hazira HSM
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Hazira, Gujarat • Hot Strip Mill Line 2
                </div>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "var(--sys-blue-subtle)",
                  color: "var(--sys-blue-primary)",
                }}
              >
                3 Specialists
              </span>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-canvas)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-heading)" }}>
                  Tata Steel Wire Rod Mill
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Jamshedpur, Jharkhand • WRM 5.5-16mm
                </div>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "var(--sys-blue-subtle)",
                  color: "var(--sys-blue-primary)",
                }}
              >
                2 Specialists
              </span>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-canvas)",
                border: "1px solid var(--border-subtle)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--text-heading)" }}>
                  JSW Steel Bar & Section Mill
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Toranagallu, Karnataka • Stand 1-14
                </div>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "var(--sys-blue-subtle)",
                  color: "var(--sys-blue-primary)",
                }}
              >
                1 Specialist
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
