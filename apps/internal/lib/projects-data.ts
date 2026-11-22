import { apiClient } from "./api-client.js";
import { ProjectCaseStudy, ProjectStatus } from "@systrol/types";

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
  status: ProjectStatus;
  contractValue: string;
  startDate: string;
  targetCutoverDate: string;
  onSiteEmployees: ProjectEmployee[];
  steps: ProjectLifecycleStep[];
  isPublished?: boolean;
  publishedAt?: string;
  caseStudy?: ProjectCaseStudy;
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
    status: "PUBLISHED",
    contractValue: "₹ 18,500,000",
    startDate: "2024-03-15",
    targetCutoverDate: "2024-08-30",
    isPublished: true,
    publishedAt: "2024-09-01T10:00:00.000Z",
    onSiteEmployees: [
      {
        id: "usr-admin-01",
        name: "Admin Controls",
        designation: "Operations Executive",
        onSiteRole: "Site Supervisory Lead",
        phone: "+91 98310 00001",
        deploymentDate: "2024-03-20",
      },
    ],
    steps: createDefaultSteps(12),
    caseStudy: {
      projectName: "Level-2 Automation Modernization for 650,000 TPA Bar Mill",
      slug: "rolling-mill-l2-automation-upgrade",
      challengeTitle: "Legacy VMS Automation Cobble Rates and Section Inaccuracies",
      challengeDescription: "The client operated an existing 18-stand continuous merchant bar mill hampered by an obsolete legacy VMS/Fortran Level-2 system. Operators faced frequent section discrepancies during grade changeovers, lack of real-time roll gap calculations, and high cobble rates during section changes of high-tensile rebar.",
      solutionTitle: "High-Speed C# Pass Scheduling Engine with Stand Stiffness Feedback",
      solutionDescription: "sysTROL architected a modern C# .NET Level-2 automation suite executing physics-based pass-schedule models. We integrated OPC UA gateways to interface with existing Siemens S7-400 PLCs, deployed automatic roll gap calculation with stand stiffness feedback, and implemented a real-time billet tracking visualizer across the roughing, intermediate, and finishing stands.",
      technologies: [
        "C# / .NET 8 Industrial Service",
        "Python Mathematical Models",
        "Grade Calculation Matrices",
        "OPC UA Client/Server",
        "Pass Schedule Mathematical Model",
        "Siemens S7-400 Integration",
        "PostgreSQL Time-Series Tracking",
        "React Operator Dashboard",
      ],
      kpiCards: [
        { label: "Changeover Time Reduction", value: "82%", description: "Reduced stabilization time from 45m to <8m" },
        { label: "Cobble Rate Reduction", value: "38%", description: "Fewer cobbles per 10,000 billets rolled" },
        { label: "Annual Billet Throughput", value: "650k TPA", description: "Full design capacity continuous run" },
        { label: "Tolerances Maintained", value: "±0.5%", description: "Precision rebar profile compliance" },
      ],
      images: [
        {
          url: "/images/hero-rolling-mill.jpg",
          caption: "18-stand continuous bar mill train rolling high-tensile structural rebar",
          altText: "18-stand continuous bar mill train rolling high-tensile structural rebar",
          isShowingCard: true,
        },
        {
          url: "/images/projects/gallery/bar-mill-pulpit.jpg",
          caption: "Level-2 Supervisory Pulpit with real-time pass schedule calculation and mill floor tracking",
          altText: "Level-2 Supervisory Pulpit with real-time pass schedule calculation and mill floor tracking",
          isShowingCard: false,
        },
        {
          url: "/images/projects/gallery/bar-mill-cooling-bed.jpg",
          caption: "Automatic flying shear transfer and rake cooling bed alignment",
          altText: "Automatic flying shear transfer and rake cooling bed alignment",
          isShowingCard: false,
        },
      ],
    },
  },
  {
    id: "proj-2",
    projectCode: "PROJ-2023-002",
    name: "Reheating Furnace Level-2 Thermal Tracking & Mill Pacing",
    clientName: "Client B — Primary Process Steel Manufacturer",
    lineName: "8-Zone Walking Beam Reheating Furnace",
    location: "Western India",
    status: "PUBLISHED",
    contractValue: "₹ 14,200,000",
    startDate: "2023-05-10",
    targetCutoverDate: "2024-02-28",
    isPublished: true,
    publishedAt: "2024-03-05T08:30:00.000Z",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
    caseStudy: {
      projectName: "Reheating Furnace Level-2 Thermal Tracking & Mill Pacing",
      slug: "reheating-furnace-level2-thermal-pacing",
      challengeTitle: "Non-Uniform Billet Heating and Gas Overconsumption",
      challengeDescription: "Uneven billet surface and core temperature profiles caused stand roll force surges and roll breakage in the breakdown mill. The furnace operators lacked visibility into real-time heat absorption across 8 firing zones, resulting in either underheated billets or excessive scale loss and high specific fuel gas consumption.",
      solutionTitle: "Online 2D Finite-Difference Thermal Tracking Model",
      solutionDescription: "Engineered an online 2D finite-difference heat conduction model in C# running on a dedicated industrial server. The L2 software tracks each billet's thermal trajectory from charging through preheat, heating, and soaking zones. It dynamically calculates furnace push commands synchronized with rolling mill pace to guarantee an exact target discharge temperature.",
      technologies: [
        "C# Mathematical Engine",
        "Python Calculation Matrices",
        "2D Heat Conduction Models",
        "Modbus TCP / ABB Freelance Integration",
        "WPF / Avalonia Engineering Terminal",
        "SQL Server Historian",
      ],
      kpiCards: [
        { label: "Fuel Gas Savings", value: "6.4%", description: "Direct specific energy consumption reduction" },
        { label: "Roll Force Surges", value: "-22%", description: "Eliminated cold billet impacts in breakdown stand" },
        { label: "Billet Temp Uniformity", value: "±12°C", description: "Cross-billet discharge consistency" },
        { label: "Pacing Sync Rate", value: "99.8%", description: "Automated mill extraction coordination" },
      ],
      images: [
        {
          url: "/images/projects/reheating-furnace.jpg",
          caption: "8-zone walking beam reheating furnace discharging uniformly heated steel billets at 1150°C",
          altText: "8-zone walking beam reheating furnace discharging uniformly heated steel billets at 1150°C",
          isShowingCard: true,
        },
        {
          url: "/images/projects/gallery/furnace-pyrometer.jpg",
          caption: "Optical pyrometer array and FLIR thermal imaging for cross-billet temperature uniformity",
          altText: "Optical pyrometer array and FLIR thermal imaging for cross-billet temperature uniformity",
          isShowingCard: false,
        },
        {
          url: "/images/projects/gallery/furnace-combustion-skid.jpg",
          caption: "Automated natural gas combustion regulation skid and zone burner valves",
          altText: "Automated natural gas combustion regulation skid and zone burner valves",
          isShowingCard: false,
        },
      ],
    },
  },
  {
    id: "proj-3",
    projectCode: "PROJ-2024-003",
    name: "Finishing Block Speed Cascade & Looper Control for 110 m/s Wire Rod Mill",
    clientName: "Client C — Leading Special Steel Manufacturer",
    lineName: "10-Stand Wire Rod Finishing Block",
    location: "Southern India",
    status: "PUBLISHED",
    contractValue: "₹ 22,000,000",
    startDate: "2024-06-01",
    targetCutoverDate: "2024-11-15",
    isPublished: true,
    publishedAt: "2024-11-20T14:15:00.000Z",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
    caseStudy: {
      projectName: "Finishing Block Speed Cascade & Looper Control for 110 m/s Wire Rod Mill",
      slug: "high-speed-wire-rod-mill-automation",
      challengeTitle: "Ultra-High-Speed Inter-Stand Tension and Tail Snap-Back",
      challengeDescription: "At delivery speeds exceeding 100 meters per second, minute errors in inter-stand tension calculation cause ring-pattern distortions, tail-end snap-backs, and erratic coil packaging in the cooling conveyor.",
      solutionTitle: "Sub-Millisecond Speed Cascade Supervisory Engine",
      solutionDescription: "Designed a real-time speed cascade supervisory engine in C# that receives roll diameter calibrations, computes exact gear ratio compensation, and outputs ultra-low-latency trim setpoints to high-response drive regulators. Integrated optical scanning pyrometers to compensate for thermal shrinkage in real-time.",
      technologies: [
        "C# High-Performance Services",
        "Real-time Speed Cascade Algorithm",
        "Optical Pyrometer Interfaces",
        "Rockwell ControlLogix Interfacing",
        "High-Speed Trend Capture (5ms intervals)",
      ],
      kpiCards: [
        { label: "Max Rolling Speed", value: "110 m/s", description: "Design threshold stabilized" },
        { label: "Ring Eccentricity", value: "-45%", description: "Uniform coil ring packaging on Stelmor line" },
        { label: "Tail Cobbles", value: "-30%", description: "Pinch roll transition synchronization" },
        { label: "Groove Life Tracking", value: "100%", description: "Automated tonnage-based regrind alarm" },
      ],
      images: [
        {
          url: "/images/projects/wire-rod-mill.jpg",
          caption: "High-speed 10-stand wire rod finishing block operating at 110 m/s delivery speed",
          altText: "High-speed 10-stand wire rod finishing block operating at 110 m/s delivery speed",
          isShowingCard: true,
        },
        {
          url: "/images/projects/gallery/wirerod-cooling-conveyor.jpg",
          caption: "Stelmor controlled cooling conveyor with precision ring lap distribution",
          altText: "Stelmor controlled cooling conveyor with precision ring lap distribution",
          isShowingCard: false,
        },
        {
          url: "/images/projects/gallery/wirerod-control-console.jpg",
          caption: "Speed cascade coordination console capturing 5ms mill motor current and tension trends",
          altText: "Speed cascade coordination console capturing 5ms mill motor current and tension trends",
          isShowingCard: false,
        },
      ],
    },
  },
  {
    id: "proj-4",
    projectCode: "PROJ-2023-004",
    name: "Hydraulic AGC Servo Valve & Cylinder Retrofit for Narrow Strip Mill",
    clientName: "Client D — Flat Products Rolling Facility",
    lineName: "4-Hi Cold Strip Reversing Mill",
    location: "Northern India",
    status: "PUBLISHED",
    contractValue: "₹ 11,800,000",
    startDate: "2023-08-01",
    targetCutoverDate: "2023-12-15",
    isPublished: true,
    publishedAt: "2024-01-10T11:00:00.000Z",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
    caseStudy: {
      projectName: "Hydraulic AGC Servo Valve & Cylinder Retrofit for Narrow Strip Mill",
      slug: "hydraulic-agc-system-modernization",
      challengeTitle: "Catastrophic Contamination Failure and 16-Week OEM Lead Time",
      challengeDescription: "A sudden catastrophic contamination failure in the mill hydraulic rack destroyed four matched high-response servo valves and cylinder position transducers, halting prime strip production with European OEM lead times quoted at 16 weeks.",
      solutionTitle: "Rapid Turnaround Precision Valve Sourcing and On-Site Null Balancing",
      solutionDescription: "sysTROL leveraged its direct European manufacturer supply lines to locate, verify, and air-freight four zero-overlap matched servo valves and high-precision magnetostrictive position sensors within 9 business days, accompanied by complete EN 10204 3.1 inspection certifications.",
      technologies: [
        "Moog/Rexroth High-Response Servos",
        "Magnetostrictive Position Transducers",
        "Bespoke High-Pressure Manifolds",
        "On-site Fluid Particle Counting & Calibration",
      ],
      kpiCards: [
        { label: "Lead Time Slashed", value: "9 days vs 16 wks", description: "Emergency air-freight and customs clearance" },
        { label: "Strip Gauge Deviation", value: "±0.008 mm", description: "Precision cold-strip gauge restoration" },
        { label: "Certification", value: "EN 10204 3.1", description: "European metallurgical standard compliance" },
      ],
      images: [
        {
          url: "/images/hydraulic-agc-system.jpg",
          caption: "German high-frequency Moog/Rexroth servo valve manifold and stainless hydraulic lines",
          altText: "German high-frequency Moog/Rexroth servo valve manifold and stainless hydraulic lines",
          isShowingCard: true,
        },
        {
          url: "/images/projects/gallery/agc-cylinder-stand.jpg",
          caption: "Heavy cold rolling mill stand equipped with retrofitted hydraulic AGC cylinders",
          altText: "Heavy cold rolling mill stand equipped with retrofitted hydraulic AGC cylinders",
          isShowingCard: false,
        },
        {
          url: "/images/projects/gallery/agc-laser-gauge.jpg",
          caption: "Non-contact laser thickness sensor confirming continuous strip gauge within ±0.008 mm",
          altText: "Non-contact laser thickness sensor confirming continuous strip gauge within ±0.008 mm",
          isShowingCard: false,
        },
      ],
    },
  },
  {
    id: "proj-5",
    projectCode: "PROJ-2024-005",
    name: "Tungsten Carbide Roll Ring Supply & Technical Pairing for Wire Rod Block",
    clientName: "Client E — International Steel Producer",
    lineName: "High-Speed Rod Finishing Block",
    location: "Middle East",
    status: "PUBLISHED",
    contractValue: "₹ 16,500,000",
    startDate: "2024-01-10",
    targetCutoverDate: "2024-05-20",
    isPublished: true,
    publishedAt: "2024-06-01T09:00:00.000Z",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
    caseStudy: {
      projectName: "Tungsten Carbide Roll Ring Supply & Technical Pairing for Wire Rod Block",
      slug: "critical-imported-spares-sourcing-turnaround",
      challengeTitle: "Premature Roll Ring Micro-Spalling on Alloy Wire Rods",
      challengeDescription: "Standard commercial roll rings suffered premature groove micro-spalling during rolling of hard stainless and boron-alloy steel grades, leading to unacceptable surface marking on the finished product and frequent roll changes.",
      solutionTitle: "Specialized 15% Co-Ni-Cr Binder Matrix Formulation",
      solutionDescription: "sysTROL sourced specialized TC roll rings with an optimized 15% Cobalt-Nickel-Chromium binder matrix from a specialized German manufacturer, engineered specifically to resist thermal fatigue cracking under high coolant spray pressure.",
      technologies: [
        "Composite Tungsten Carbide (TC)",
        "Co-Ni-Cr Binder Matrix",
        "Ultrasonic Flaw Inspection (NDT)",
        "Precision CNC Profile Pairing",
      ],
      kpiCards: [
        { label: "Groove Life Multiplier", value: "2.4x", description: "Increased tonnage rolled between regrinds" },
        { label: "Binder Matrix", value: "15% Co-Ni-Cr", description: "High fracture toughness alloy matrix" },
        { label: "Surface Rejection Rate", value: "< 0.05%", description: "Eliminated groove thermal micro-spalling marks" },
      ],
      images: [
        {
          url: "/images/tungsten-carbide-rolls.jpg",
          caption: "15% Co-Ni-Cr matrix Tungsten Carbide roll rings engineered for high fracture toughness",
          altText: "15% Co-Ni-Cr matrix Tungsten Carbide roll rings engineered for high fracture toughness",
          isShowingCard: true,
        },
        {
          url: "/images/global-logistics-freight.jpg",
          caption: "International air freight and protective moisture-barrier packaging for urgent plant delivery",
          altText: "International air freight and protective moisture-barrier packaging for urgent plant delivery",
          isShowingCard: false,
        },
        {
          url: "/images/about/engineering-facility.jpg",
          caption: "Quality assurance laboratory testing dimensional tolerances and EN 10204 3.1 compliance",
          altText: "Quality assurance laboratory testing dimensional tolerances and EN 10204 3.1 compliance",
          isShowingCard: false,
        },
      ],
    },
  },
  {
    id: "proj-6",
    projectCode: "PROJ-2023-006",
    name: "Structural ERW Tube Mill Forming & Sizing Level-2 Automation",
    clientName: "Client F — Structural Steel Tube Manufacturer",
    lineName: "High-Frequency Induction ERW Mill",
    location: "Central India",
    status: "PUBLISHED",
    contractValue: "₹ 13,400,000",
    startDate: "2023-04-01",
    targetCutoverDate: "2023-10-30",
    isPublished: true,
    publishedAt: "2023-11-15T12:00:00.000Z",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
    caseStudy: {
      projectName: "Structural ERW Tube Mill Forming & Sizing Level-2 Automation",
      slug: "tube-mill-pass-schedule-optimization",
      challengeTitle: "Setup Scrap Waste During Heavy Hollow Section Changes",
      challengeDescription: "Manual setup of breakdown and fin-pass stands during product changeover led to excessive coil strip wastage during weld seam stabilization and erratic tube ovality in large square and rectangular hollow sections.",
      solutionTitle: "Automated Forming Pass Schedule and Cut-to-Length Synchronization",
      solutionDescription: "Built a custom C# Level-2 pass scheduling tool that calculates roll positioning setpoints for circular, square, and rectangular hollow sections based on steel grade yield strength and strip thickness. Integrated an automated flying cut-to-length optimizer to minimize tube end scrap.",
      technologies: [
        "C# Sizing & Forming Algorithm",
        "Flying Saw Synchro Optimization",
        "ASTM A500 Geometric Validation",
        "EtherNet/IP Industrial Bus Interfacing",
      ],
      kpiCards: [
        { label: "Changeover Scrap Cut", value: "-78%", description: "Reduced strip waste from 42m to under 9m" },
        { label: "Dimensional Standard", value: "ASTM A500", description: "Strict square and rectangular profile conformity" },
        { label: "Flying Saw Sync Accuracy", value: "±1.5 mm", description: "High-speed servo synchronized cold cut accuracy" },
      ],
      images: [
        {
          url: "/images/projects/erw-tube-mill.jpg",
          caption: "ERW structural tube breakdown and fin-pass forming roll stands",
          altText: "ERW structural tube breakdown and fin-pass forming roll stands",
          isShowingCard: true,
        },
        {
          url: "/images/automation-control-room.jpg",
          caption: "Level-2 sizing and pass schedule calculation supervisory engineering console",
          altText: "Level-2 sizing and pass schedule calculation supervisory engineering console",
          isShowingCard: false,
        },
        {
          url: "/images/hero-rolling-mill.jpg",
          caption: "Synchronized flying cold saw cutoff section and automated tube bundle transfer",
          altText: "Synchronized flying cold saw cutoff section and automated tube bundle transfer",
          isShowingCard: false,
        },
      ],
    },
  },
  {
    id: "proj-active-1",
    projectCode: "PROJ-2026-007",
    name: "Bar & Wire Rod Dual-Line Automation Retrofit",
    clientName: "Client G — Specialty Alloys Corp",
    lineName: "24-Stand Dual Outlet High-Speed Line",
    location: "Western India",
    status: "ONGOING",
    contractValue: "₹ 24,000,000",
    startDate: "2026-01-10",
    targetCutoverDate: "2026-09-30",
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
    id: "proj-comm-1",
    projectCode: "PROJ-2025-008",
    name: "Bloom Caster Pinch Roll & Dummy Bar Extraction Upgrade",
    clientName: "Client H — Heavy Engineering Mill",
    lineName: "Continuous Bloom Casting Bay #1",
    location: "Southern India",
    status: "COMMISSIONED",
    contractValue: "₹ 17,200,000",
    startDate: "2025-04-01",
    targetCutoverDate: "2026-01-15",
    onSiteEmployees: [],
    steps: createDefaultSteps(12),
  },
];

const STORAGE_KEY = "systrol_projects_store_v3";

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
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length < 6) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return parsed;
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

export function publishProject(id: string, caseStudy: ProjectCaseStudy): ProjectItem | undefined {
  const all = getProjects();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  const current = all[index];
  const updated: ProjectItem = {
    ...current,
    status: "PUBLISHED",
    isPublished: true,
    publishedAt: new Date().toISOString(),
    caseStudy,
  };
  all[index] = updated;
  saveProjects(all);
  return updated;
}

export function unpublishProject(id: string): ProjectItem | undefined {
  const all = getProjects();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  const current = all[index];
  const updated: ProjectItem = {
    ...current,
    status: "COMMISSIONED",
    isPublished: false,
  };
  all[index] = updated;
  saveProjects(all);
  return updated;
}

export async function syncProjectToApi(project: ProjectItem): Promise<ProjectItem | null> {
  try {
    const res = await apiClient("/api/v1/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: project.name,
        clientName: project.clientName,
        lineName: project.lineName,
        location: project.location,
        status: project.status,
        contractValue: project.contractValue,
        startDate: project.startDate,
        targetCutoverDate: project.targetCutoverDate,
      }),
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (data && data.id) {
      return {
        ...project,
        id: data.id,
        projectCode: data.projectCode || project.projectCode,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function syncStepStatusToApi(
  projectId: string,
  stepId: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED",
  notes?: string
): Promise<void> {
  try {
    await apiClient(`/api/v1/projects/${projectId}/steps/${stepId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
  } catch {}
}
