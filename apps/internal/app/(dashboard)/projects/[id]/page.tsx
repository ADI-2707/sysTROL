"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Plus,
  Trash2,
  Calendar,
  Phone,
  GitCommit,
  FileText,
} from "lucide-react";
import {
  getProjectById,
  updateProject,
  ProjectItem,
  ProjectLifecycleStep,
  ProjectEmployee,
  INITIAL_COMPANY_EMPLOYEES,
  syncStepStatusToApi,
} from "@/lib/projects-data";
import { TabGroup } from "@/components/ui/tab-group";
import { LifecycleStepsTab } from "@/components/project-log/LifecycleStepsTab";
import { ProjectLogTab } from "@/components/project-log/ProjectLogTab";
import { fetchStepEntryCounts } from "@/lib/project-log-api";
import { useAuth } from "@/lib/auth-context";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string;
  const { user } = useAuth();

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [activeTab, setActiveTab] = useState<"steps" | "log">("steps");
  const [stepLogFilter, setStepLogFilter] = useState<string | undefined>(undefined);
  const [stepEntryCounts, setStepEntryCounts] = useState<Record<string, number>>({});

  const [showDeployStaffModal, setShowDeployStaffModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(INITIAL_COMPANY_EMPLOYEES[0].id);
  const [staffOnSiteRole, setStaffOnSiteRole] = useState("Commissioning Specialist");

  useEffect(() => {
    if (projectId) {
      const found = getProjectById(projectId);
      if (found) {
        setProject(found);
      }
      fetchStepEntryCounts(projectId)
        .then((counts) => setStepEntryCounts(counts))
        .catch(() => {});
    }
  }, [projectId]);

  if (!project) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
  const totalLogEntries = Object.values(stepEntryCounts).reduce((acc, c) => acc + c, 0);

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
    syncStepStatusToApi(project.id, stepId, newStatus);
  };

  const handleAddSubStep = (order: number, title: string, notes?: string, assignedTo?: string) => {
    const newStep: ProjectLifecycleStep = {
      id: `substep-${Date.now()}`,
      title,
      description: notes || undefined,
      isPredefined: false,
      status: "PENDING",
      assignedTo,
      order: order + 5,
    };

    const updatedSteps = [...project.steps, newStep].sort((a, b) => a.order - b.order);

    const updatedProject: ProjectItem = {
      ...project,
      steps: updatedSteps,
    };

    setProject(updatedProject);
    updateProject(updatedProject);
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
    let nextStatus: "ONGOING" | "COMMISSIONED" | "PUBLISHED" = "ONGOING";
    if (project.status === "ONGOING") nextStatus = "COMMISSIONED";
    else if (project.status === "COMMISSIONED") nextStatus = "PUBLISHED";
    else nextStatus = "ONGOING";

    const updatedProject: ProjectItem = {
      ...project,
      status: nextStatus,
      isPublished: nextStatus === "PUBLISHED",
    };
    setProject(updatedProject);
    updateProject(updatedProject);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
                  backgroundColor:
                    project.status === "PUBLISHED"
                      ? "rgba(16, 185, 129, 0.12)"
                      : project.status === "ONGOING"
                      ? "var(--sys-blue-subtle)"
                      : "var(--sys-green-subtle)",
                  color:
                    project.status === "PUBLISHED"
                      ? "#10b981"
                      : project.status === "ONGOING"
                      ? "var(--sys-blue-primary)"
                      : "var(--sys-green-accent)",
                  border: `1px solid ${
                    project.status === "PUBLISHED"
                      ? "rgba(16, 185, 129, 0.3)"
                      : project.status === "ONGOING"
                      ? "var(--sys-blue-border)"
                      : "var(--sys-green-border)"
                  }`,
                  cursor: "pointer",
                }}
              >
                Status: {project.status.charAt(0) + project.status.slice(1).toLowerCase()} (Toggle)
              </button>
              {project.status === "PUBLISHED" && project.caseStudy?.slug && (
                <a
                  href={`https://systrol.vercel.app/projects/${project.caseStudy.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                    color: "var(--sys-blue-primary)",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  <span>View on Public Site</span>
                </a>
              )}
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
              <span>{project.onSiteEmployees.length} staff assigned</span>
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
                Assigned Personnel Roster
              </h2>
              <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                Engineers and project specialists deployed for {project.name}
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
            <span>Deploy Staff</span>
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
            No employees currently deployed for this project. Click &quot;Deploy Staff&quot; to assign team members.
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
                    title="Relieve from project"
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

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <TabGroup
          tabs={[
            {
              id: "steps",
              label: "Lifecycle Steps",
              icon: <GitCommit size={15} />,
              badge: totalSteps,
            },
            {
              id: "log",
              label: "Project Log",
              icon: <FileText size={15} />,
              badge: totalLogEntries > 0 ? totalLogEntries : undefined,
            },
          ]}
          activeTab={activeTab}
          onChange={(tabId) => {
            if (tabId === "steps") setStepLogFilter(undefined);
            setActiveTab(tabId as "steps" | "log");
          }}
        />

        {activeTab === "steps" && (
          <LifecycleStepsTab
            project={project}
            stepEntryCounts={stepEntryCounts}
            onStepFilterSelect={(stepId) => {
              setStepLogFilter(stepId);
              setActiveTab("log");
            }}
            onUpdateStep={handleUpdateStepStatus}
            onAddSubStep={handleAddSubStep}
            onDeleteStep={handleDeleteStep}
          />
        )}

        {activeTab === "log" && (
          <ProjectLogTab
            projectId={project.id}
            steps={project.steps.filter((s) => s.isPredefined).map((s) => ({ id: s.id, title: s.title }))}
            userRole={user?.role || "SUPER_ADMIN"}
            initialStepFilter={stepLogFilter}
          />
        )}
      </div>

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
              Deploy Engineer / Team Member
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
                  Assignment Role
                </label>
                <input
                  type="text"
                  value={staffOnSiteRole}
                  onChange={(e) => setStaffOnSiteRole(e.target.value)}
                  placeholder="e.g. Lead Control Systems Engineer"
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
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
