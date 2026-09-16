export interface ProjectLifecycleStep {
  id: string;
  title: string;
  description?: string;
  isPredefined: boolean;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
  assignedTo?: string;
  notes?: string;
  order: number;
}

export interface ProjectEmployee {
  id: string;
  name: string;
  designation: string;
  onSiteRole: string;
  phone: string;
  deploymentDate: string;
}

export interface ProjectItem {
  id: string;
  projectCode: string;
  name: string;
  clientName: string;
  lineName: string;
  location: string;
  status: "ONGOING" | "COMMISSIONED";
  contractValue: string;
  startDate: string;
  targetCutoverDate: string;
  onSiteEmployees: ProjectEmployee[];
  steps: ProjectLifecycleStep[];
}

export const PREDEFINED_STEP_NAMES = [
  "Enquiry",
  "Sales visit",
  "Procurement",
  "Engineering phase",
  "Material / Manufacturing",
  "Dispatch",
  "Erection and commissioning",
  "Cold trial / Hot trial",
  "Performance and guarantee testing",
  "MOM",
  "Payment",
  "AMC (Annual Maintenance)",
];

export const INITIAL_COMPANY_EMPLOYEES = [
  {
    id: "usr-admin-01",
    name: "Admin Controls",
    designation: "Operations Executive",
    phone: "+91 98310 00001",
    department: "Executive Leadership",
  },
];

function createDefaultSteps(completedCount: number): ProjectLifecycleStep[] {
  return PREDEFINED_STEP_NAMES.map((name, idx) => {
    let status: "PENDING" | "IN_PROGRESS" | "COMPLETED" = "PENDING";
    let completedAt: string | undefined = undefined;

    if (idx < completedCount) {
      status = "COMPLETED";
      completedAt = new Date(Date.now() - (completedCount - idx) * 86400000 * 14).toISOString().split("T")[0];
    } else if (idx === completedCount) {
      status = "IN_PROGRESS";
    }

    return {
      id: `step-${idx + 1}`,
      title: name,
      isPredefined: true,
      status,
      completedAt,
      assignedTo: "Admin Controls",
      order: (idx + 1) * 100,
    };
  });
}

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    projectCode: "PROJ-2024-001",
    name: "Level-2 Automation Modernization for 650,000 TPA Bar Mill",
    clientName: "Client A — Major Integrated Steel Plant",
    lineName: "18-Stand Continuous Merchant Bar Mill",
    location: "Eastern India",
    status: "ONGOING",
    contractValue: "₹ 18,500,000",
    startDate: "2024-03-15",
    targetCutoverDate: "2026-08-30",
    onSiteEmployees: [
      {
        id: "usr-admin-01",
        name: "Admin Controls",
        designation: "Operations Executive",
        onSiteRole: "Site Supervisory Lead",
        phone: "+91 98310 00001",
        deploymentDate: "2026-01-15",
      },
    ],
    steps: createDefaultSteps(6),
  },
  {
    id: "proj-2",
    projectCode: "PROJ-2023-002",
    name: "Reheating Furnace Level-2 Thermal Tracking & Mill Pacing",
    clientName: "Client B — Primary Process Steel Manufacturer",
    lineName: "8-Zone Walking Beam Reheating Furnace",
    location: "Western India",
    status: "COMMISSIONED",
    contractValue: "₹ 14,200,000",
    startDate: "2023-05-10",
    targetCutoverDate: "2024-02-28",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
  },
  {
    id: "proj-3",
    projectCode: "PROJ-2024-003",
    name: "Finishing Block Speed Cascade & Looper Control for 110 m/s Wire Rod Mill",
    clientName: "Client C — Leading Special Steel Manufacturer",
    lineName: "10-Stand Wire Rod Finishing Block",
    location: "Southern India",
    status: "ONGOING",
    contractValue: "₹ 22,000,000",
    startDate: "2024-06-01",
    targetCutoverDate: "2026-10-15",
    onSiteEmployees: [
      {
        id: "usr-admin-01",
        name: "Admin Controls",
        designation: "Operations Executive",
        onSiteRole: "Operations Lead",
        phone: "+91 98310 00001",
        deploymentDate: "2026-02-10",
      },
    ],
    steps: createDefaultSteps(4),
  },
];

const STORAGE_KEY = "systrol_projects_store_v2";

export function getProjects(): ProjectItem[] {
  if (typeof window === "undefined") {
    return INITIAL_PROJECTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: ProjectItem[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }
}

export function getProjectById(id: string): ProjectItem | undefined {
  const all = getProjects();
  return all.find((p) => p.id === id);
}

export function updateProject(updated: ProjectItem): void {
  const all = getProjects();
  const index = all.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    all[index] = updated;
    saveProjects(all);
  }
}
