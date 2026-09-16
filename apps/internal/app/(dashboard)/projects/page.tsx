"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Plus,
  Building,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  getProjects,
  saveProjects,
  ProjectItem,
  PREDEFINED_STEP_NAMES,
} from "@/lib/projects-data";

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeTab, setActiveTab] = useState<"ONGOING" | "COMMISSIONED">("ONGOING");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [newClient, setNewClient] = useState("");
  const [newLine, setNewLine] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newStatus, setNewStatus] = useState<"ONGOING" | "COMMISSIONED">("ONGOING");

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const ongoingCount = projects.filter((p) => p.status === "ONGOING").length;
  const commissionedCount = projects.filter((p) => p.status === "COMMISSIONED").length;

  const filteredProjects = projects
    .filter((p) => p.status === activeTab)
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.clientName.toLowerCase().includes(q) ||
        p.lineName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.projectCode.toLowerCase().includes(q)
      );
    });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newLine.trim() || !newLocation.trim()) return;

    const newProject: ProjectItem = {
      id: `proj-custom-${Date.now()}`,
      projectCode: `PROJ-2026-00${projects.length + 1}`,
      name: `${newClient} ${newLine}`,
      clientName: newClient.trim(),
      lineName: newLine.trim(),
      location: newLocation.trim(),
      status: newStatus,
      contractValue: "₹ 15,000,000",
      startDate: new Date().toISOString().split("T")[0],
      targetCutoverDate: new Date(Date.now() + 86400000 * 180).toISOString().split("T")[0],
      onSiteEmployees: [],
      steps: PREDEFINED_STEP_NAMES.map((name, idx) => ({
        id: `step-${idx + 1}`,
        title: name,
        isPredefined: true,
        status: newStatus === "COMMISSIONED" ? "COMPLETED" : idx === 0 ? "IN_PROGRESS" : "PENDING",
        completedAt: newStatus === "COMMISSIONED" ? new Date().toISOString().split("T")[0] : undefined,
        order: (idx + 1) * 100,
      })),
    };

    const updated = [newProject, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setShowModal(false);
    setNewClient("");
    setNewLine("");
    setNewLocation("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
            <Briefcase size={26} color="var(--sys-blue-primary)" />
            Project Management
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>
            Track client rolling mill lines, stage progression, and on-site engineering personnel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "9px 16px",
            borderRadius: "8px",
            backgroundColor: "var(--sys-blue-primary)",
            color: "#ffffff",
            border: "none",
            fontSize: "13.5px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setActiveTab("ONGOING")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: activeTab === "ONGOING" ? "var(--sys-blue-primary)" : "var(--border-subtle)",
              backgroundColor: activeTab === "ONGOING" ? "var(--sys-blue-subtle)" : "transparent",
              color: activeTab === "ONGOING" ? "var(--sys-blue-primary)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Activity size={16} />
            <span>Ongoing Projects</span>
            <span
              style={{
                fontSize: "12px",
                padding: "2px 7px",
                borderRadius: "999px",
                backgroundColor: activeTab === "ONGOING" ? "var(--sys-blue-primary)" : "var(--bg-hover)",
                color: activeTab === "ONGOING" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              {ongoingCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("COMMISSIONED")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: activeTab === "COMMISSIONED" ? "var(--sys-green-accent)" : "var(--border-subtle)",
              backgroundColor: activeTab === "COMMISSIONED" ? "var(--sys-green-subtle)" : "transparent",
              color: activeTab === "COMMISSIONED" ? "var(--sys-green-accent)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <CheckCircle2 size={16} />
            <span>Commissioned Projects</span>
            <span
              style={{
                fontSize: "12px",
                padding: "2px 7px",
                borderRadius: "999px",
                backgroundColor: activeTab === "COMMISSIONED" ? "var(--sys-green-accent)" : "var(--bg-hover)",
                color: activeTab === "COMMISSIONED" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              {commissionedCount}
            </span>
          </button>
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
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
            <Search size={16} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, line, or location..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px 12px 8px 36px",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-heading)",
              fontSize: "13.5px",
              outline: "none",
            }}
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          <Layers size={36} style={{ marginBottom: "12px", opacity: 0.5 }} />
          <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 6px 0", color: "var(--text-heading)" }}>
            No {activeTab.toLowerCase()} projects found
          </h3>
          <p style={{ fontSize: "13.5px", margin: 0 }}>Try adjusting your search query or add a new project.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredProjects.map((project) => {
            const completedSteps = project.steps.filter((s) => s.status === "COMPLETED").length;
            const totalSteps = project.steps.length;
            const progressPct = Math.round((completedSteps / Math.max(totalSteps, 1)) * 100);
            const activeStep = project.steps.find((s) => s.status === "IN_PROGRESS") || project.steps[project.steps.length - 1];

            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "var(--bg-card)",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-card)",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                    e.currentTarget.style.borderColor = activeTab === "ONGOING" ? "var(--sys-blue-border)" : "var(--sys-green-border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color: "var(--text-muted)",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {project.projectCode}
                      </span>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "999px",
                          backgroundColor: project.status === "ONGOING" ? "var(--sys-blue-subtle)" : "var(--sys-green-subtle)",
                          color: project.status === "ONGOING" ? "var(--sys-blue-primary)" : "var(--sys-green-accent)",
                          border: `1px solid ${project.status === "ONGOING" ? "var(--sys-blue-border)" : "var(--sys-green-border)"}`,
                        }}
                      >
                        {project.status === "ONGOING" ? "Ongoing" : "Commissioned"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                      <Building size={16} color="var(--sys-blue-primary)" style={{ marginTop: "3px", flexShrink: 0 }} />
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "var(--text-heading)",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {project.clientName}
                      </h3>
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--text-body)",
                        marginBottom: "10px",
                        paddingLeft: "24px",
                      }}
                    >
                      {project.lineName}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        paddingLeft: "24px",
                      }}
                    >
                      <MapPin size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Current: <strong style={{ color: "var(--text-heading)" }}>{activeStep?.title || "Enquiry"}</strong>
                      </div>
                      <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-heading)" }}>
                        {progressPct}%
                      </div>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "6px",
                        backgroundColor: "var(--bg-hover)",
                        borderRadius: "999px",
                        overflow: "hidden",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: `${progressPct}%`,
                          height: "100%",
                          backgroundColor: project.status === "ONGOING" ? "var(--sys-blue-primary)" : "var(--sys-green-accent)",
                          borderRadius: "999px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--text-muted)" }}>
                        <Users size={15} />
                        <span>
                          <strong style={{ color: "var(--text-heading)" }}>{project.onSiteEmployees.length}</strong> on-site
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "var(--sys-blue-primary)",
                        }}
                      >
                        <span>View Project</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
              padding: "24px",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px 0" }}>
              Add New Industrial Project
            </h2>

            <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Client Name
                </label>
                <input
                  type="text"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="e.g. Tata Steel Limited"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-heading)",
                    fontSize: "13.5px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Line Name
                </label>
                <input
                  type="text"
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  placeholder="e.g. Bar & Rod Mill #2"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-heading)",
                    fontSize: "13.5px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Plant Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Jamshedpur, Jharkhand"
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-heading)",
                    fontSize: "13.5px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Initial Project Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "ONGOING" | "COMMISSIONED")}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-canvas)",
                    color: "var(--text-heading)",
                    fontSize: "13.5px",
                  }}
                >
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMMISSIONED">Commissioned</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "transparent",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    backgroundColor: "var(--sys-blue-primary)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
