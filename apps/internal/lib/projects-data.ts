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
  { id: "emp-1", name: "Vikram Sengupta", designation: "Chief Commissioning Director", phone: "+91 98310 11223", department: "Field Commissioning" },
  { id: "emp-2", name: "Ananya Deshmukh", designation: "Principal Drives & Automation Lead", phone: "+91 98450 33445", department: "Electrical & PLC" },
  { id: "emp-3", name: "Rahul Mukherjee", designation: "Senior Automation Specialist", phone: "+91 98200 55667", department: "Industrial Automation" },
  { id: "emp-4", name: "Rajeshwar Rao", designation: "Chief Metallurgy Consultant", phone: "+91 94440 77889", department: "Metallurgy & Process" },
  { id: "emp-5", name: "Pooja Hegde", designation: "Field Instrumentation Engineer", phone: "+91 98860 99001", department: "Field Commissioning" },
  { id: "emp-6", name: "Karan Johar Sharma", designation: "Mechanical Erection Supervisor", phone: "+91 97110 22334", department: "Erection & Civil" },
  { id: "emp-7", name: "Sunil Pillai", designation: "Senior Hydraulic Systems Engineer", phone: "+91 94470 44556", department: "Hydraulics & Mechanics" },
  { id: "emp-8", name: "Deepak Choudhury", designation: "Site Quality & Safety Auditor", phone: "+91 98300 66778", department: "Quality & Safety" },
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
      assignedTo: idx % 2 === 0 ? "Vikram Sengupta" : "Ananya Deshmukh",
      order: (idx + 1) * 100,
    };
  });
}

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-amns-hsm-01",
    projectCode: "PROJ-2026-0001",
    name: "ArcelorMittal HSM Automation Overhaul",
    clientName: "ArcelorMittal Nippon Steel India",
    lineName: "Hot Strip Mill (HSM) - Line 2",
    location: "Hazira, Gujarat",
    status: "ONGOING",
    contractValue: "₹ 18,500,000",
    startDate: "2026-01-10",
    targetCutoverDate: "2026-08-30",
    onSiteEmployees: [
      {
        id: "emp-1",
        name: "Vikram Sengupta",
        designation: "Chief Commissioning Director",
        onSiteRole: "Site Director & Erection Lead",
        phone: "+91 98310 11223",
        deploymentDate: "2026-02-15",
      },
      {
        id: "emp-3",
        name: "Rahul Mukherjee",
        designation: "Senior Automation Specialist",
        onSiteRole: "Level-2 Automation Engineer",
        phone: "+91 98200 55667",
        deploymentDate: "2026-03-01",
      },
      {
        id: "emp-7",
        name: "Sunil Pillai",
        designation: "Senior Hydraulic Systems Engineer",
        onSiteRole: "Hydraulic AGC Commissioning",
        phone: "+91 94470 44556",
        deploymentDate: "2026-03-10",
      },
    ],
    steps: createDefaultSteps(6),
  },
  {
    id: "proj-tata-wrm-02",
    projectCode: "PROJ-2026-0002",
    name: "Tata Steel High-Speed Wire Rod Modernization",
    clientName: "Tata Steel Limited",
    lineName: "Wire Rod Mill (WRM) 5.5-16mm",
    location: "Jamshedpur, Jharkhand",
    status: "ONGOING",
    contractValue: "₹ 22,000,000",
    startDate: "2026-02-01",
    targetCutoverDate: "2026-09-15",
    onSiteEmployees: [
      {
        id: "emp-2",
        name: "Ananya Deshmukh",
        designation: "Principal Drives & Automation Lead",
        onSiteRole: "Drives Synchronization Lead",
        phone: "+91 98450 33445",
        deploymentDate: "2026-02-20",
      },
      {
        id: "emp-6",
        name: "Karan Johar Sharma",
        designation: "Mechanical Erection Supervisor",
        onSiteRole: "Laying Head & Finishing Stand Alignment",
        phone: "+91 97110 22334",
        deploymentDate: "2026-03-05",
      },
    ],
    steps: createDefaultSteps(4),
  },
  {
    id: "proj-jsw-bar-03",
    projectCode: "PROJ-2026-0003",
    name: "JSW Steel Bar & Section Mill Turnkey Drives",
    clientName: "JSW Steel Limited",
    lineName: "Bar & Section Mill #3",
    location: "Toranagallu, Vijayanagar, Karnataka",
    status: "ONGOING",
    contractValue: "₹ 15,800,000",
    startDate: "2026-03-01",
    targetCutoverDate: "2026-10-30",
    onSiteEmployees: [
      {
        id: "emp-5",
        name: "Pooja Hegde",
        designation: "Field Instrumentation Engineer",
        onSiteRole: "Loop Scanner & Pyrometer Calibration",
        phone: "+91 98860 99001",
        deploymentDate: "2026-03-12",
      },
    ],
    steps: createDefaultSteps(2),
  },
  {
    id: "proj-sail-crm-04",
    projectCode: "PROJ-2025-0019",
    name: "SAIL Bokaro Cold Rolling Mill Gauge Control",
    clientName: "Steel Authority of India Limited (SAIL)",
    lineName: "Cold Rolling Mill (CRM) 4-Stand Tandem",
    location: "Bokaro Steel City, Jharkhand",
    status: "COMMISSIONED",
    contractValue: "₹ 31,500,000",
    startDate: "2025-04-10",
    targetCutoverDate: "2025-11-20",
    onSiteEmployees: [
      {
        id: "emp-1",
        name: "Vikram Sengupta",
        designation: "Chief Commissioning Director",
        onSiteRole: "Executive Signoff Lead",
        phone: "+91 98310 11223",
        deploymentDate: "2025-09-01",
      },
    ],
    steps: createDefaultSteps(12),
  },
  {
    id: "proj-jindal-pipe-05",
    projectCode: "PROJ-2025-0024",
    name: "Jindal SAW Spiral Pipe Mill Automation",
    clientName: "Jindal SAW Limited",
    lineName: "HSAW Large Diameter Pipe Line",
    location: "Mundra, Gujarat",
    status: "COMMISSIONED",
    contractValue: "₹ 27,200,000",
    startDate: "2025-05-15",
    targetCutoverDate: "2025-12-18",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
  },
  {
    id: "proj-vedanta-esm-06",
    projectCode: "PROJ-2025-0028",
    name: "Vedanta ESL Electrosteel Billet Reheating Mill",
    clientName: "Vedanta Electrosteel Steels Ltd",
    lineName: "Continuous Billet Mill - Stand 1-8",
    location: "Bokaro, Jharkhand",
    status: "COMMISSIONED",
    contractValue: "₹ 19,400,000",
    startDate: "2025-06-01",
    targetCutoverDate: "2026-01-15",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
  },
];

const STORAGE_KEY = "systrol_projects_store_v1";

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
