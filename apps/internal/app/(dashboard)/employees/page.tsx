"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Phone,
  Filter,
  Shield,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  EmployeeTeam,
  TEAM_OPTIONS,
  TEAM_LABELS,
  canAccessPage,
  isSeededSuperAdmin,
} from "@/lib/permissions";

export interface ExtendedEmployee {
  id: string;
  name: string;
  team: EmployeeTeam;
  designation: string;
  department: string;
  phone: string;
  email: string;
  status: "ON_SITE" | "IN_OFFICE" | "AVAILABLE";
  assignedProjectName?: string;
}

const INITIAL_EXTENDED: ExtendedEmployee[] = [
  {
    id: "usr-admin-01",
    name: "Admin Controls",
    team: "LEADERSHIP",
    designation: "Operations Executive",
    department: "Executive Leadership",
    phone: "+91 98310 00001",
    email: "admin@systrol.com",
    status: "IN_OFFICE",
    assignedProjectName: "Executive Command",
  },
];

const EMP_STORAGE_KEY = "systrol_employees_v3";

export default function EmployeeManagementPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<ExtendedEmployee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTeam, setFilterTeam] = useState<string>("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newTeam, setNewTeam] = useState<EmployeeTeam>("COMMISSIONING");
  const [newDesignation, setNewDesignation] = useState("");
  const [newDepartment, setNewDepartment] = useState("Field Commissioning");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newStatus, setNewStatus] = useState<"ON_SITE" | "IN_OFFICE" | "AVAILABLE">("AVAILABLE");

  const isAuthorized = canAccessPage(user?.team, "/employees");
  const canCreate = isSeededSuperAdmin(user);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMP_STORAGE_KEY);
      if (stored) {
        const parsed: ExtendedEmployee[] = JSON.parse(stored);
        const validated = parsed.map((item) => ({
          ...item,
          team: item.team || "COMMISSIONING",
        }));
        setEmployees(validated);
      } else {
        setEmployees(INITIAL_EXTENDED);
        localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(INITIAL_EXTENDED));
      }
    } catch {
      setEmployees(INITIAL_EXTENDED);
    }
  }, []);

  const saveUpdatedEmployees = (list: ExtendedEmployee[]) => {
    setEmployees(list);
    if (typeof window !== "undefined") {
      localStorage.setItem(EMP_STORAGE_KEY, JSON.stringify(list));
    }
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreate) return;
    if (!newName.trim() || !newDesignation.trim()) return;

    const newEmp: ExtendedEmployee = {
      id: `emp-custom-${Date.now()}`,
      name: newName.trim(),
      team: newTeam,
      designation: newDesignation.trim(),
      department: newDepartment,
      phone: newPhone.trim() || "+91 98000 00000",
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, ".")}@systrol.com`,
      status: newStatus,
      assignedProjectName: newStatus === "ON_SITE" ? "Assigned Plant Site" : "Corporate Office",
    };

    const updated = [newEmp, ...employees];
    saveUpdatedEmployees(updated);

    setShowAddModal(false);
    setNewName("");
    setNewTeam("COMMISSIONING");
    setNewDesignation("");
    setNewPhone("");
    setNewEmail("");
  };

  if (!isAuthorized) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          padding: "32px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          maxWidth: "520px",
          margin: "40px auto 0 auto",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
          }}
        >
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: "19px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 8px 0" }}>
          Access Restricted
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", maxWidth: "400px", margin: "0 0 20px 0", lineHeight: 1.5 }}>
          Your assigned team ({user?.team ? TEAM_LABELS[user.team] : "Standard"}) is not authorized to access Employee Management.
        </p>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "7px",
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

  const totalEmployees = employees.length;
  const onSiteCount = employees.filter((e) => e.status === "ON_SITE").length;
  const commTeamCount = employees.filter((e) => e.team === "COMMISSIONING").length;
  const salesAndHrCount = employees.filter((e) => e.team === "SALES" || e.team === "HR_ACCOUNTS").length;

  const departments = ["ALL", ...Array.from(new Set(employees.map((e) => e.department)))];

  const filtered = employees.filter((emp) => {
    const matchesTeam = filterTeam === "ALL" || emp.team === filterTeam;
    if (!matchesTeam) return false;
    const matchesDept = filterDept === "ALL" || emp.department === filterDept;
    if (!matchesDept) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const teamLabel = TEAM_LABELS[emp.team] || "";
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      teamLabel.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q)
    );
  });

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
            <Users size={26} color="var(--sys-blue-primary)" />
            Employee Management
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>
            Official corporate directory with staff teams, typed designations, and site deployment tracking.
          </p>
        </div>

        {canCreate ? (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
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
            <span>Add Employee</span>
          </button>
        ) : (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-muted)",
              fontSize: "12.5px",
              fontWeight: 500,
            }}
            title="Only Seeded Super Admin can register new employees"
          >
            <Lock size={14} color="var(--sys-blue-primary)" />
            <span>Creation Locked to Seeded Super Admin</span>
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
            Total Personnel
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-heading)", marginTop: "4px" }}>
            {totalEmployees}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--sys-green-accent)", textTransform: "uppercase", fontWeight: 600 }}>
            Deployed On-Site
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--sys-green-accent)", marginTop: "4px" }}>
            {onSiteCount}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--sys-blue-primary)", textTransform: "uppercase", fontWeight: 600 }}>
            Commissioning Team
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--sys-blue-primary)", marginTop: "4px" }}>
            {commTeamCount}
          </div>
        </div>

        <div
          style={{
            backgroundColor: "var(--bg-card)",
            padding: "16px 20px",
            borderRadius: "10px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
            Sales & HR / Accounts
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-heading)", marginTop: "4px" }}>
            {salesAndHrCount}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          backgroundColor: "var(--bg-card)",
          padding: "14px 18px",
          borderRadius: "10px",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ position: "relative", minWidth: "260px", flex: 1 }}>
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
            placeholder="Search name, typed designation, team, department..."
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px 12px 8px 36px",
              borderRadius: "6px",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-canvas)",
              color: "var(--text-heading)",
              fontSize: "13.5px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Team:</span>
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                color: "var(--text-heading)",
                fontSize: "13px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Teams</option>
              {TEAM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--bg-canvas)",
                color: "var(--text-heading)",
                fontSize: "13px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "ALL" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: "12px",
          border: "1px solid var(--border-subtle)",
          boxShadow: "var(--shadow-card)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-canvas)",
                  color: "var(--text-muted)",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <th style={{ padding: "14px 20px" }}>Employee Name</th>
                <th style={{ padding: "14px 20px" }}>Assigned Team</th>
                <th style={{ padding: "14px 20px" }}>Typed Designation</th>
                <th style={{ padding: "14px 20px" }}>Department</th>
                <th style={{ padding: "14px 20px" }}>Current Assignment</th>
                <th style={{ padding: "14px 20px" }}>Status</th>
                <th style={{ padding: "14px 20px" }}>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => {
                const isOnSite = emp.status === "ON_SITE";
                const isOffice = emp.status === "IN_OFFICE";

                return (
                  <tr
                    key={emp.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            backgroundColor: isOnSite ? "var(--sys-green-subtle)" : "var(--sys-blue-subtle)",
                            color: isOnSite ? "var(--sys-green-accent)" : "var(--sys-blue-primary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            fontWeight: 700,
                            border: `1px solid ${isOnSite ? "var(--sys-green-border)" : "var(--sys-blue-border)"}`,
                            flexShrink: 0,
                          }}
                        >
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--text-heading)" }}>{emp.name}</div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          padding: "3px 9px",
                          borderRadius: "6px",
                          backgroundColor:
                            emp.team === "LEADERSHIP"
                              ? "rgba(168, 85, 247, 0.12)"
                              : emp.team === "COMMISSIONING"
                              ? "var(--sys-blue-subtle)"
                              : emp.team === "HR_ACCOUNTS"
                              ? "var(--sys-green-subtle)"
                              : "rgba(245, 158, 11, 0.12)",
                          color:
                            emp.team === "LEADERSHIP"
                              ? "#a855f7"
                              : emp.team === "COMMISSIONING"
                              ? "var(--sys-blue-primary)"
                              : emp.team === "HR_ACCOUNTS"
                              ? "var(--sys-green-accent)"
                              : "#f59e0b",
                          border: `1px solid ${
                            emp.team === "LEADERSHIP"
                              ? "rgba(168, 85, 247, 0.3)"
                              : emp.team === "COMMISSIONING"
                              ? "var(--sys-blue-border)"
                              : emp.team === "HR_ACCOUNTS"
                              ? "var(--sys-green-border)"
                              : "rgba(245, 158, 11, 0.3)"
                          }`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {TEAM_LABELS[emp.team] || emp.team}
                      </span>
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ fontWeight: 600, color: "var(--text-heading)" }}>{emp.designation}</div>
                    </td>

                    <td style={{ padding: "14px 20px", color: "var(--text-muted)" }}>
                      {emp.department}
                    </td>

                    <td style={{ padding: "14px 20px", color: "var(--text-body)" }}>
                      {emp.assignedProjectName || "—"}
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 600,
                          padding: "3px 8px",
                          borderRadius: "999px",
                          backgroundColor: isOnSite
                            ? "var(--sys-green-subtle)"
                            : isOffice
                            ? "var(--sys-blue-subtle)"
                            : "var(--bg-hover)",
                          color: isOnSite
                            ? "var(--sys-green-accent)"
                            : isOffice
                            ? "var(--sys-blue-primary)"
                            : "var(--text-muted)",
                          border: `1px solid ${
                            isOnSite
                              ? "var(--sys-green-border)"
                              : isOffice
                              ? "var(--sys-blue-border)"
                              : "var(--border-subtle)"
                          }`,
                        }}
                      >
                        {isOnSite ? "On-Site" : isOffice ? "In Office" : "Available"}
                      </span>
                    </td>

                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Phone size={13} />
                        <span>{emp.phone}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && canCreate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              backgroundColor: "var(--bg-card)",
              borderRadius: "14px",
              border: "1px solid var(--border-subtle)",
              padding: "24px",
              boxShadow: "var(--shadow-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <Shield size={20} color="var(--sys-blue-primary)" />
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
                Register Employee (Seeded Super Admin)
              </h2>
            </div>

            <form onSubmit={handleAddEmployee} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Employee Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
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
                  Assigned Team (Permission Level)
                </label>
                <select
                  value={newTeam}
                  onChange={(e) => setNewTeam(e.target.value as EmployeeTeam)}
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
                >
                  {TEAM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Corporate Designation (Typed Identification)
                </label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="e.g. Commissioning Engineer, System Engineer, Director, HR Assistant"
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
                  Department
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
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
                  <option value="Field Commissioning">Field Commissioning</option>
                  <option value="Electrical & Drives">Electrical & Drives</option>
                  <option value="Industrial Automation & PLC">Industrial Automation & PLC</option>
                  <option value="Metallurgy & Process">Metallurgy & Process</option>
                  <option value="Hydraulics & Mechanics">Hydraulics & Mechanics</option>
                  <option value="Erection & Civil">Erection & Civil</option>
                  <option value="HR & Compliance">HR & Compliance</option>
                  <option value="Sales & Contracts">Sales & Contracts</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98000 00000"
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
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@systrol.com"
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
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px", color: "var(--text-heading)" }}>
                  Deployment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "ON_SITE" | "IN_OFFICE" | "AVAILABLE")}
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
                  <option value="AVAILABLE">Available / Standby</option>
                  <option value="IN_OFFICE">In Office / Engineering Center</option>
                  <option value="ON_SITE">On-Site Deployed</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
