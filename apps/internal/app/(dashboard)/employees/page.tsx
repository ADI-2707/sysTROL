"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Building,
  Filter,
  UserCheck,
  Shield,
  Layers,
} from "lucide-react";
import { INITIAL_COMPANY_EMPLOYEES, getProjects } from "@/lib/projects-data";

interface ExtendedEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  status: "ON_SITE" | "IN_OFFICE" | "AVAILABLE";
  assignedProjectName?: string;
}

const INITIAL_EXTENDED: ExtendedEmployee[] = [
  {
    id: "emp-1",
    name: "Vikram Sengupta",
    designation: "Chief Commissioning Director",
    department: "Field Commissioning",
    phone: "+91 98310 11223",
    email: "vikram.s@systrol.com",
    status: "ON_SITE",
    assignedProjectName: "ArcelorMittal HSM Automation",
  },
  {
    id: "emp-2",
    name: "Ananya Deshmukh",
    designation: "Principal Drives & Automation Lead",
    department: "Electrical & Drives",
    phone: "+91 98450 33445",
    email: "ananya.d@systrol.com",
    status: "ON_SITE",
    assignedProjectName: "Tata Steel Wire Rod Modernization",
  },
  {
    id: "emp-3",
    name: "Rahul Mukherjee",
    designation: "Senior Automation Specialist",
    department: "Industrial Automation & PLC",
    phone: "+91 98200 55667",
    email: "rahul.m@systrol.com",
    status: "ON_SITE",
    assignedProjectName: "ArcelorMittal HSM Automation",
  },
  {
    id: "emp-4",
    name: "Rajeshwar Rao",
    designation: "Chief Metallurgy Consultant",
    department: "Metallurgy & Process",
    phone: "+91 94440 77889",
    email: "rajeshwar.r@systrol.com",
    status: "IN_OFFICE",
    assignedProjectName: "Consultancy & Design HQ",
  },
  {
    id: "emp-5",
    name: "Pooja Hegde",
    designation: "Field Instrumentation Engineer",
    department: "Field Commissioning",
    phone: "+91 98860 99001",
    email: "pooja.h@systrol.com",
    status: "ON_SITE",
    assignedProjectName: "JSW Steel Bar & Section Mill",
  },
  {
    id: "emp-6",
    name: "Karan Johar Sharma",
    designation: "Mechanical Erection Supervisor",
    department: "Erection & Civil",
    phone: "+91 97110 22334",
    email: "karan.s@systrol.com",
    status: "ON_SITE",
    assignedProjectName: "Tata Steel Wire Rod Modernization",
  },
  {
    id: "emp-7",
    name: "Sunil Pillai",
    designation: "Senior Hydraulic Systems Engineer",
    department: "Hydraulics & Mechanics",
    phone: "+91 94470 44556",
    email: "sunil.p@systrol.com",
    status: "ON_SITE",
    assignedProjectName: "ArcelorMittal HSM Automation",
  },
  {
    id: "emp-8",
    name: "Deepak Choudhury",
    designation: "Site Quality & Safety Auditor",
    department: "Quality & Safety",
    phone: "+91 98300 66778",
    email: "deepak.c@systrol.com",
    status: "AVAILABLE",
    assignedProjectName: "Standby / Audit Rotation",
  },
  {
    id: "emp-9",
    name: "Meera Krishnan",
    designation: "Lead SCADA & HMI Developer",
    department: "Industrial Automation & PLC",
    phone: "+91 98400 12345",
    email: "meera.k@systrol.com",
    status: "IN_OFFICE",
    assignedProjectName: "System Architecture & Level-2",
  },
  {
    id: "emp-10",
    name: "Abhishek Nambiar",
    designation: "Turnkey Project Procurement Manager",
    department: "Procurement & Contracts",
    phone: "+91 98190 67890",
    email: "abhishek.n@systrol.com",
    status: "IN_OFFICE",
    assignedProjectName: "Vendor Supply Operations",
  },
];

const EMP_STORAGE_KEY = "systrol_employees_v1";

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<ExtendedEmployee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newDepartment, setNewDepartment] = useState("Field Commissioning");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newStatus, setNewStatus] = useState<"ON_SITE" | "IN_OFFICE" | "AVAILABLE">("AVAILABLE");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(EMP_STORAGE_KEY);
      if (stored) {
        setEmployees(JSON.parse(stored));
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
    if (!newName.trim() || !newDesignation.trim()) return;

    const newEmp: ExtendedEmployee = {
      id: `emp-custom-${Date.now()}`,
      name: newName.trim(),
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
    setNewDesignation("");
    setNewPhone("");
    setNewEmail("");
  };

  const totalEmployees = employees.length;
  const onSiteCount = employees.filter((e) => e.status === "ON_SITE").length;
  const officeCount = employees.filter((e) => e.status === "IN_OFFICE").length;
  const availableCount = employees.filter((e) => e.status === "AVAILABLE").length;

  const departments = ["ALL", ...Array.from(new Set(employees.map((e) => e.department)))];

  const filtered = employees.filter((emp) => {
    const matchesDept = filterDept === "ALL" || emp.department === filterDept;
    if (!matchesDept) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
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
            Official corporate directory with staff names, designations, and site deployment tracking.
          </p>
        </div>

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
            Office / Engineering Center
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--sys-blue-primary)", marginTop: "4px" }}>
            {officeCount}
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
            Available / Standby
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-heading)", marginTop: "4px" }}>
            {availableCount}
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
        <div style={{ position: "relative", minWidth: "280px", flex: 1 }}>
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
            placeholder="Search by employee name, designation, department..."
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

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={15} color="var(--text-muted)" />
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
                <th style={{ padding: "14px 20px" }}>Designation</th>
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
                      <div style={{ fontWeight: 600, color: "var(--text-body)" }}>{emp.designation}</div>
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

      {showAddModal && (
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
          onClick={() => setShowAddModal(false)}
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
              Add Company Employee
            </h2>

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
                  Corporate Designation
                </label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="e.g. Senior Rolling Mill Commissioning Lead"
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
                  <option value="Quality & Safety">Quality & Safety</option>
                  <option value="Procurement & Contracts">Procurement & Contracts</option>
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
