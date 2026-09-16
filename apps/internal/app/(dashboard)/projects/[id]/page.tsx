"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Phone,
  UserCheck,
  Briefcase,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  GitCommit,
  Sparkles,
} from "lucide-react";
import {
  getProjectById,
  updateProject,
  ProjectItem,
  ProjectLifecycleStep,
  ProjectEmployee,
  INITIAL_COMPANY_EMPLOYEES,
} from "@/lib/projects-data";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [showAddSubStepModal, setShowAddSubStepModal] = useState(false);
  const [targetStepOrder, setTargetStepOrder] = useState<number | null>(null);
  const [subStepTitle, setSubStepTitle] = useState("");
  const [subStepNotes, setSubStepNotes] = useState("");
  const [subStepAssignee, setSubStepAssignee] = useState("");

  const [showDeployStaffModal, setShowDeployStaffModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(INITIAL_COMPANY_EMPLOYEES[0].id);
  const [staffOnSiteRole, setStaffOnSiteRole] = useState("Commissioning Specialist");

  useEffect(() => {
    if (projectId) {
      const found = getProjectById(projectId);
      if (found) {
        setProject(found);
      }
    }
  }, [projectId]);

  if (!project) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px" }}>
        <Link
          href="/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
          }}
        >
          Project not found or loading...
        </div>
      </div>
    );
  }

  const completedSteps = project.steps.filter((s) => s.status === "COMPLETED").length;
  const totalSteps = project.steps.length;
  const progressPct = Math.round((completedSteps / Math.max(totalSteps, 1)) * 100);

  const handleUpdateStepStatus = (stepId: string, newStatus: "PENDING" | "IN_PROGRESS" | "COMPLETED") => {
    const updatedSteps = project.steps.map((s) => {
      if (s.id === stepId) {
        return {
          ...s,
          status: newStatus,
          completedAt: newStatus === "COMPLETED" ? new Date().toISOString().split("T")[0] : undefined,
        };
      }
      return s;
    });

    const updatedProject: ProjectItem = {
      ...project,
      steps: updatedSteps,
    };

    setProject(updatedProject);
    updateProject(updatedProject);
  };

  const handleOpenAddSubStep = (order: number) => {
    setTargetStepOrder(order);
    setSubStepTitle("");
    setSubStepNotes("");
    setSubStepAssignee(INITIAL_COMPANY_EMPLOYEES[0].name);
    setShowAddSubStepModal(true);
  };

  const handleSaveSubStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subStepTitle.trim() || targetStepOrder === null) return;

    const newStep: ProjectLifecycleStep = {
      id: `substep-${Date.now()}`,
      title: subStepTitle.trim(),
      description: subStepNotes.trim() || undefined,
      isPredefined: false,
      status: "PENDING",
      assignedTo: subStepAssignee,
      order: targetStepOrder + 5,
    };

    const updatedSteps = [...project.steps, newStep].sort((a, b) => a.order - b.order);

    const updatedProject: ProjectItem = {
      ...project,
      steps: updatedSteps,
    };

    setProject(updatedProject);
    updateProject(updatedProject);
    setShowAddSubStepModal(false);
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = project.steps.filter((s) => s.id !== stepId);
    const updatedProject: ProjectItem = {
      ...project,
      steps: updatedSteps,
    };

    setProject(updatedProject);
    updateProject(updatedProject);
  };

  const handleDeployStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = INITIAL_COMPANY_EMPLOYEES.find((c) => c.id === selectedStaffId);
    if (!candidate) return;

    const alreadyDeployed = project.onSiteEmployees.some((emp) => emp.id === candidate.id);
    if (alreadyDeployed) {
      setShowDeployStaffModal(false);
      return;
    }

    const newStaff: ProjectEmployee = {
      id: candidate.id,
      name: candidate.name,
      designation: candidate.designation,
      onSiteRole: staffOnSiteRole.trim() || candidate.designation,
      phone: candidate.phone,
      deploymentDate: new Date().toISOString().split("T")[0],
    };

    const updatedProject: ProjectItem = {
      ...project,
      onSiteEmployees: [...project.onSiteEmployees, newStaff],
    };

    setProject(updatedProject);
    updateProject(updatedProject);
    setShowDeployStaffModal(false);
  };

  const handleRelieveStaff = (staffId: string) => {
    const updatedProject: ProjectItem = {
      ...project,
      onSiteEmployees: project.onSiteEmployees.filter((emp) => emp.id !== staffId),
    };

    setProject(updatedProject);
    updateProject(updatedProject);
  };

  const toggleProjectStatus = () => {
    const nextStatus = project.status === "ONGOING" ? "COMMISSIONED" : "ONGOING";
    const updatedProject: ProjectItem = {
      ...project,
      status: nextStatus,
    };
    setProject(updatedProject);
    updateProject(updatedProject);
  };

  const sortedSteps = [...project.steps].sort((a, b) => a.order - b.order);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <Link
          href="/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-muted)",
            textDecoration: "none",
            fontSize: "13.5px",
            fontWeight: 500,
            marginBottom: "14px",
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Project Management</span>
        </Link>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            backgroundColor: "var(--bg-card)",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                }}
              >
                {project.projectCode}
              </span>
              <button
                type="button"
                onClick={toggleProjectStatus}
                title="Click to toggle project status"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "999px",
                  backgroundColor: project.status === "ONGOING" ? "var(--sys-blue-subtle)" : "var(--sys-green-subtle)",
                  color: project.status === "ONGOING" ? "var(--sys-blue-primary)" : "var(--sys-green-accent)",
                  border: `1px solid ${project.status === "ONGOING" ? "var(--sys-blue-border)" : "var(--sys-green-border)"}`,
                  cursor: "pointer",
                }}
              >
                {project.status === "ONGOING" ? "Status: Ongoing" : "Status: Commissioned"} (Toggle)
              </button>
            </div>

            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--text-heading)",
                margin: "0 0 6px 0",
              }}
            >
              {project.clientName}
            </h1>

            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-body)", marginBottom: "8px" }}>
              {project.lineName}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px", color: "var(--text-muted)" }}>
              <MapPin size={15} color="var(--text-muted)" />
              <span>{project.location}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minWidth: "220px",
              backgroundColor: "var(--bg-canvas)",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "var(--text-muted)" }}>Lifecycle Progress:</span>
              <strong style={{ color: "var(--text-heading)", fontFamily: "var(--font-mono)" }}>{progressPct}%</strong>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "var(--border-subtle)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  backgroundColor: project.status === "ONGOING" ? "var(--sys-blue-primary)" : "var(--sys-green-accent)",
                  borderRadius: "999px",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
              <span>{completedSteps} of {totalSteps} steps completed</span>
              <span>{project.onSiteEmployees.length} staff on-site</span>
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "20px",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Users size={20} color="var(--sys-blue-primary)" />
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                On-Site Personnel Roster
              </h2>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                Engineering specialists currently deployed at {project.location}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDeployStaffModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "6px",
              backgroundColor: "var(--sys-blue-primary)",
              color: "#ffffff",
              border: "none",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={15} />
            <span>Deploy Staff On-Site</span>
          </button>
        </div>

        {project.onSiteEmployees.length === 0 ? (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "13.5px",
            }}
          >
            No employees currently deployed on-site for this project. Click &quot;Deploy Staff On-Site&quot; to assign engineers.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "14px",
            }}
          >
            {project.onSiteEmployees.map((emp) => (
              <div
                key={emp.id}
                style={{
                  backgroundColor: "var(--bg-canvas)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: "var(--sys-green-subtle)",
                        color: "var(--sys-green-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: "1px solid var(--sys-green-border)",
                      }}
                    >
                      {emp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
                        {emp.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {emp.designation}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRelieveStaff(emp.id)}
                    title="Relieve / Return from site"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div
                  style={{
                    fontSize: "12.5px",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <strong style={{ color: "var(--text-heading)" }}>Role: </strong>
                  <span style={{ color: "var(--text-body)" }}>{emp.onSiteRole}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Phone size={13} />
                    <span>{emp.phone}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={13} />
                    <span>Since {emp.deploymentDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <GitCommit size={20} color="var(--sys-green-accent)" />
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                12-Step Lifecycle Workflow & Sub-Steps
              </h2>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                Predefined milestone checkpoints with ability to mark and add small steps in between.
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sortedSteps.map((step, idx) => {
            const isCompleted = step.status === "COMPLETED";
            const isInProgress = step.status === "IN_PROGRESS";

            return (
              <div
                key={step.id}
                style={{
                  padding: step.isPredefined ? "14px 18px" : "12px 16px 12px 32px",
                  borderRadius: "8px",
                  backgroundColor: step.isPredefined ? "var(--bg-canvas)" : "var(--bg-card)",
                  border: step.isPredefined
                    ? `1px solid ${isCompleted ? "var(--sys-green-border)" : isInProgress ? "var(--sys-blue-border)" : "var(--border-subtle)"}`
                    : "1px dashed var(--border-subtle)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "14px",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "260px", flex: 1 }}>
                  <button
                    type="button"
                    onClick={() => {
                      const next = isCompleted ? "PENDING" : isInProgress ? "COMPLETED" : "IN_PROGRESS";
                      handleUpdateStepStatus(step.id, next);
                    }}
                    title="Click to toggle step completion status"
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCompleted ? "var(--sys-green-accent)" : isInProgress ? "var(--sys-blue-primary)" : "var(--text-muted)",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : isInProgress ? (
                      <Clock size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: step.isPredefined ? "var(--text-muted)" : "var(--sys-blue-primary)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {step.isPredefined ? `Step ${idx + 1}` : "Sub-Step"}
                      </span>
                      <h3
                        style={{
                          fontSize: step.isPredefined ? "15px" : "14px",
                          fontWeight: step.isPredefined ? 600 : 500,
                          color: isCompleted ? "var(--text-heading)" : "var(--text-body)",
                          margin: 0,
                          textDecoration: isCompleted ? "none" : "none",
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>

                    {step.description && (
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {step.description}
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11.5px", color: "var(--text-muted)", marginTop: "3px" }}>
                      {step.assignedTo && <span>Assigned: {step.assignedTo}</span>}
                      {step.completedAt && <span>Completed on: {step.completedAt}</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <select
                    value={step.status}
                    onChange={(e) => handleUpdateStepStatus(step.id, e.target.value as "PENDING" | "IN_PROGRESS" | "COMPLETED")}
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-subtle)",
                      backgroundColor:
                        step.status === "COMPLETED"
                          ? "var(--sys-green-subtle)"
                          : step.status === "IN_PROGRESS"
                          ? "var(--sys-blue-subtle)"
                          : "var(--bg-canvas)",
                      color:
                        step.status === "COMPLETED"
                          ? "var(--sys-green-accent)"
                          : step.status === "IN_PROGRESS"
                          ? "var(--sys-blue-primary)"
                          : "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleOpenAddSubStep(step.order)}
                    title="Add small step after this predefined step"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      backgroundColor: "var(--bg-hover)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-body)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Plus size={13} />
                    <span>Add Step In Between</span>
                  </button>

                  {!step.isPredefined && (
                    <button
                      type="button"
                      onClick={() => handleDeleteStep(step.id)}
                      title="Delete sub-step"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showAddSubStepModal && (
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
          onClick={() => setShowAddSubStepModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
              padding: "24px",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 14px 0" }}>
              Insert Intermediate Step
            </h3>

            <form onSubmit={handleSaveSubStep} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Step Title / Requirement
                </label>
                <input
                  type="text"
                  value={subStepTitle}
                  onChange={(e) => setSubStepTitle(e.target.value)}
                  placeholder="e.g. Civil Foundation Curing Signoff"
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
                  Details / Notes
                </label>
                <textarea
                  value={subStepNotes}
                  onChange={(e) => setSubStepNotes(e.target.value)}
                  placeholder="Specific requirements or prerequisites..."
                  rows={3}
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
                  Assigned Lead
                </label>
                <select
                  value={subStepAssignee}
                  onChange={(e) => setSubStepAssignee(e.target.value)}
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
                  {INITIAL_COMPANY_EMPLOYEES.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddSubStepModal(false)}
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
                  Insert Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeployStaffModal && (
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
          onClick={() => setShowDeployStaffModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
              padding: "24px",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 14px 0" }}>
              Deploy Engineer On-Site
            </h3>

            <form onSubmit={handleDeployStaff} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Select Employee
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => {
                    setSelectedStaffId(e.target.value);
                    const emp = INITIAL_COMPANY_EMPLOYEES.find((c) => c.id === e.target.value);
                    if (emp) setStaffOnSiteRole(emp.designation);
                  }}
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
                  {INITIAL_COMPANY_EMPLOYEES.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} — {emp.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  On-Site Assignment Role
                </label>
                <input
                  type="text"
                  value={staffOnSiteRole}
                  onChange={(e) => setStaffOnSiteRole(e.target.value)}
                  placeholder="e.g. Erection & Finishing Lead"
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

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={() => setShowDeployStaffModal(false)}
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
                  Deploy to Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
