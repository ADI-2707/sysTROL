"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
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
  Globe,
  ExternalLink,
  Edit3,
  RotateCcw,
  Star,
  Check,
} from "lucide-react";
import {
  getProjects,
  saveProjects,
  ProjectItem,
  PREDEFINED_STEP_NAMES,
  syncProjectToApi,
  unpublishProject,
} from "@/lib/projects-data";
import { TabGroup } from "@/components/ui/tab-group";
import { useDebounce } from "@/lib/use-debounce";
import { PublishCaseStudyModal } from "./PublishCaseStudyModal";
import { resolveMediaUrl, FALLBACK_PROJECT_IMAGE } from "@/lib/media-utils";
import { useToast } from "@systrol/ui";
import { apiClient } from "@/lib/api-client";

export default function ProjectManagementPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activeTab, setActiveTab] = useState<"ONGOING" | "COMMISSIONED" | "PUBLISHED">("ONGOING");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 350);
  const [showModal, setShowModal] = useState(false);

  const [publishModalProject, setPublishModalProject] = useState<ProjectItem | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [newClient, setNewClient] = useState("");
  const [newLine, setNewLine] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newStatus, setNewStatus] = useState<"ONGOING" | "COMMISSIONED">("ONGOING");

  useEffect(() => {
    setProjects(getProjects());

    async function fetchLiveProjects() {
      try {
        const res = await apiClient("/api/v1/projects?limit=100");
        if (res.ok) {
          const json = await res.json();
          if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
            const local = getProjects();
            const merged = [...local];
            for (const serverItem of json.data) {
              const idx = merged.findIndex(
                (p) => p.id === serverItem.id || p.projectCode === serverItem.projectCode
              );
              if (idx !== -1) {
                merged[idx] = {
                  ...merged[idx],
                  name: serverItem.name || merged[idx].name,
                  status: serverItem.isPublished
                    ? "PUBLISHED"
                    : serverItem.currentStage === "COMMISSIONING" || serverItem.currentStage === "AMC"
                    ? "COMMISSIONED"
                    : "ONGOING",
                  isPublished: serverItem.isPublished,
                  caseStudy: (serverItem.caseStudy as any) || merged[idx].caseStudy,
                };
              }
            }
            saveProjects(merged);
            setProjects(merged);
          }
        }
      } catch {}
    }

    fetchLiveProjects();
  }, []);

  const ongoingCount = projects.filter((p) => p.status === "ONGOING").length;
  const commissionedCount = projects.filter((p) => p.status === "COMMISSIONED").length;
  const publishedCount = projects.filter((p) => p.status === "PUBLISHED").length;

  const effectiveSearch = (debouncedSearch || searchQuery).trim().toLowerCase();

  const filteredProjects = projects
    .filter((p) => p.status === activeTab)
    .filter((p) => {
      if (!effectiveSearch) return true;
      return (
        p.name.toLowerCase().includes(effectiveSearch) ||
        p.clientName.toLowerCase().includes(effectiveSearch) ||
        p.lineName.toLowerCase().includes(effectiveSearch) ||
        p.location.toLowerCase().includes(effectiveSearch) ||
        p.projectCode.toLowerCase().includes(effectiveSearch) ||
        (p.caseStudy?.projectName && p.caseStudy.projectName.toLowerCase().includes(effectiveSearch))
      );
    });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim() || !newLine.trim() || !newLocation.trim()) return;

    let newProject: ProjectItem = {
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

    const synced = await syncProjectToApi(newProject);
    if (synced) {
      newProject = synced;
    }

    const updated = [newProject, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setShowModal(false);
    setNewClient("");
    setNewLine("");
    setNewLocation("");
  };

  const handleOpenPublishModal = (proj: ProjectItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPublishModalProject(proj);
    setIsPublishModalOpen(true);
  };

  const handleUnpublish = async (projId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to unpublish this case study? It will be removed from the public website and reverted to Commissioned status.")) {
      return;
    }
    try {
      await apiClient(`/api/v1/projects/${projId}/unpublish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Unpublished from internal ops" }),
      });
    } catch {}
    const updated = unpublishProject(projId);
    if (updated) {
      toast.info("Case study unpublished and returned to Commissioned status.");
      const refreshed = getProjects();
      setProjects(refreshed);
    }
  };

  const handlePublishSuccess = (updatedProj: ProjectItem) => {
    const refreshed = getProjects();
    setProjects(refreshed);
    setActiveTab("PUBLISHED");
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
            }}
          >
            Project Management
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>
            Track client rolling mill lines, stage progression, on-site personnel, and public website case studies.
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
        <TabGroup
          tabs={[
            {
              id: "ONGOING",
              label: "Ongoing Projects",
              icon: <Activity size={15} />,
              badge: ongoingCount,
            },
            {
              id: "COMMISSIONED",
              label: "Commissioned Projects",
              icon: <CheckCircle2 size={15} />,
              badge: commissionedCount,
            },
            {
              id: "PUBLISHED",
              label: "Published on Website",
              icon: <Globe size={15} />,
              badge: publishedCount,
            },
          ]}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as "ONGOING" | "COMMISSIONED" | "PUBLISHED")}
        />

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
            const showingImg = project.caseStudy?.images.find((i) => i.isShowingCard) || project.caseStudy?.images[0];

            return (
              <div
                key={project.id}
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                  overflow: "hidden",
                }}
              >
                {project.status === "PUBLISHED" && showingImg && (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "140px",
                      backgroundColor: "var(--bg-surface)",
                      borderBottom: "1px solid var(--border-subtle)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={resolveMediaUrl(showingImg.url)}
                      alt={showingImg.altText || project.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_PROJECT_IMAGE;
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(5, 8, 17, 0.8)",
                        backdropFilter: "blur(4px)",
                        color: "#ffffff",
                        fontSize: "10px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Star size={11} color="#eab308" />
                      <span>Card Display Photo</span>
                    </div>

                    <a
                      href={`https://systrol.vercel.app/projects/${project.caseStudy?.slug || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Live Case Study"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(5, 8, 17, 0.85)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                      }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                )}

                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, gap: "14px" }}>
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

                      {project.status === "PUBLISHED" ? (
                        <span
                          style={{
                            fontSize: "11.5px",
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(16, 185, 129, 0.12)",
                            color: "#10b981",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Globe size={12} />
                          <span>Published Live</span>
                        </span>
                      ) : (
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
                      )}
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
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
                          {project.caseStudy?.projectName || project.name}
                        </h3>
                      </div>

                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "var(--text-body)",
                          marginBottom: "4px",
                          paddingLeft: "24px",
                        }}
                      >
                        {project.clientName} — {project.lineName}
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
                    </Link>
                  </div>

                  {project.status === "PUBLISHED" && project.caseStudy && (
                    <div
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        backgroundColor: "var(--bg-canvas)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                        Verified KPIs on Public Card:
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                        {project.caseStudy.kpiCards.slice(0, 2).map((kpi, kIdx) => (
                          <div key={kIdx} style={{ fontSize: "11px" }}>
                            <span style={{ fontWeight: 700, color: "var(--sys-green-accent)" }}>{kpi.value}</span>{" "}
                            <span style={{ color: "var(--text-muted)" }}>{kpi.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-subtle)", marginTop: "auto" }}>
                    {project.status !== "PUBLISHED" && (
                      <>
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
                      </>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                      <Link
                        href={`/projects/${project.id}`}
                        style={{
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "var(--sys-blue-primary)",
                        }}
                      >
                        <span>Project Detail</span>
                        <ArrowRight size={14} />
                      </Link>

                      {project.status === "COMMISSIONED" && (
                        <button
                          type="button"
                          onClick={(e) => handleOpenPublishModal(project, e)}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            backgroundColor: "var(--sys-green-accent)",
                            color: "#ffffff",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: "var(--shadow-sm)",
                          }}
                        >
                          <Globe size={13} />
                          <span>Publish to Website</span>
                        </button>
                      )}

                      {project.status === "PUBLISHED" && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={(e) => handleOpenPublishModal(project, e)}
                            title="Edit Published Case Study"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "5px 10px",
                              borderRadius: "6px",
                              border: "1px solid var(--border-subtle)",
                              backgroundColor: "var(--bg-canvas)",
                              color: "var(--text-heading)",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <Edit3 size={12} />
                            <span>Edit Case Study</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleUnpublish(project.id, e)}
                            title="Unpublish from website"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "5px 8px",
                              borderRadius: "6px",
                              border: "1px solid rgba(239, 68, 68, 0.25)",
                              backgroundColor: "rgba(239, 68, 68, 0.06)",
                              color: "#ef4444",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <RotateCcw size={12} />
                            <span>Unpublish</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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

      <PublishCaseStudyModal
        isOpen={isPublishModalOpen}
        project={publishModalProject}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishModalProject(null);
        }}
        onSuccess={handlePublishSuccess}
      />
    </div>
  );
}
