export type GalleryCategory = "all" | "workplace" | "team" | "deployments";

export interface GalleryItem {
  id: string;
  title: string;
  category: "workplace" | "team" | "deployments";
  categoryLabel: string;
  location: string;
  description: string;
  image: string;
  tags: string[];
  aspect: "featured" | "tall" | "standard" | "wide";
  gridArea?: string;
}

export const galleryCategories: { id: GalleryCategory; label: string; count?: number }[] = [
  { id: "all", label: "All Showcase" },
  { id: "workplace", label: "Our Workplace & Labs" },
  { id: "team", label: "Our Team" },
  { id: "deployments", label: "Onsite Deployments" },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "workplace-digital-twin",
    title: "Rolling Mill Digital Twin & HIL Test Bay",
    category: "workplace",
    categoryLabel: "Workplace & Labs",
    location: "Bengaluru Technical Center",
    description:
      "Hardware-in-the-loop simulation environment testing stand-by-stand speed cascades and hydraulic AGC reaction timing before live hot metal roll.",
    image: "/images/gallery/workplace-digital-twin.jpg",
    tags: ["Digital Twin", "HIL Simulation", "C# Model Core", "OPC UA"],
    aspect: "featured",
    gridArea: "feat-workplace",
  },
  {
    id: "workplace-workstations",
    title: "Mathematical Modeling Engineering Bays",
    category: "workplace",
    categoryLabel: "Workplace & Labs",
    location: "Bengaluru Technical Center",
    description:
      "Multi-monitor supervisory stations where pass schedules, roll force matrices, and thermal rundown curves are computed with microsecond determinism.",
    image: "/images/gallery/workplace-workstations.jpg",
    tags: ["Pass Schedules", "Python Modeling", "Thermal Tracking"],
    aspect: "standard",
    gridArea: "sub-workstation",
  },
  {
    id: "workplace-hydraulic-bench",
    title: "Hydraulic AGC & Servo Valve Test Bench",
    category: "workplace",
    categoryLabel: "Workplace & Labs",
    location: "Bengaluru Quality Lab",
    description:
      "Precision calibration rig for Moog and Bosch Rexroth high-response servo valves, verifying null bias and dynamic response curves.",
    image: "/images/gallery/workplace-hydraulic-bench.jpg",
    tags: ["Hydraulic AGC", "Servo Calibration", "Mill Gap Control"],
    aspect: "wide",
    gridArea: "wide-hydraulic",
  },
  {
    id: "workplace-electronics",
    title: "Level-1 to Level-2 Gateway Diagnostic Lab",
    category: "workplace",
    categoryLabel: "Workplace & Labs",
    location: "Bengaluru Technical Center",
    description:
      "Integration racks simulating Siemens S7-400 / S7-1500 and ABB 800xA PLCs across deterministically clocked industrial Ethernet switches.",
    image: "/images/gallery/workplace-electronics.jpg",
    tags: ["PLC Gateway", "Deterministic Clocking", "Industrial Ethernet"],
    aspect: "standard",
    gridArea: "sub-electronics",
  },
  {
    id: "team-collaboration",
    title: "Level-2 Software Modeling Architecture Sprint",
    category: "team",
    categoryLabel: "Our Team",
    location: "Engineering Center, Bengaluru",
    description:
      "Senior software architects and algorithm modelers conducting stand-by-stand speed cascade code reviews and tension compensation logic testing.",
    image: "/images/gallery/team-collaboration.jpg",
    tags: ["Software Architecture", "C# .NET", "Algorithm Review"],
    aspect: "featured",
    gridArea: "feat-team",
  },
  {
    id: "team-inspection",
    title: "Mechanical Tooling & Spares Quality Audit",
    category: "team",
    categoryLabel: "Our Team",
    location: "Material Inspection Bay, Bengaluru",
    description:
      "Metallurgical engineers conducting ultrasonic defect inspections, dimensional tolerance verification, and EN 10204 3.1 material certificate checks.",
    image: "/images/gallery/team-inspection.jpg",
    tags: ["Metallurgical QC", "EN 10204 3.1", "Tungsten Carbide"],
    aspect: "standard",
    gridArea: "sub-inspection",
  },
  {
    id: "team-operations",
    title: "Pulpit Telemetry & Shadow Commissioning Review",
    category: "team",
    categoryLabel: "Our Team",
    location: "Supervisory Operations Room",
    description:
      "Field engineers monitoring real-time sensor streams, pyrometer feeds, and inter-stand looper data during zero-downtime shadow cutover runs.",
    image: "/images/gallery/team-operations.jpg",
    tags: ["Pulpit Telemetry", "Shadow Cutover", "Field Operations"],
    aspect: "wide",
    gridArea: "wide-operations",
  },
  {
    id: "deployment-rolling-mill",
    title: "16-Stand Continuous Bar & Rod Mill in Live Production",
    category: "deployments",
    categoryLabel: "Onsite Deployments",
    location: "Jamshedpur Steel Corridor",
    description:
      "Live operational floor governed by sysTROL Level-2 supervisory automation, executing continuous roll bite pacing and cobble avoidance algorithms.",
    image: "/images/gallery/deployment-rolling-mill.jpg",
    tags: ["Continuous Rolling", "16-Stand Mill", "Zero Cobble Run"],
    aspect: "featured",
    gridArea: "feat-deployment",
  },
  {
    id: "deployment-pulpit",
    title: "Mill Pulpit Operator HMI & Supervisory Telemetry",
    category: "deployments",
    categoryLabel: "Onsite Deployments",
    location: "Western India Steel Complex",
    description:
      "Central control pulpit running sysTROL real-time visualization screens, enabling operators to inspect stand loads, motor currents, and roll wear in real time.",
    image: "/images/gallery/deployment-pulpit.jpg",
    tags: ["Operator Pulpit", "HMI Visualization", "Live Telemetry"],
    aspect: "tall",
    gridArea: "tall-pulpit",
  },
  {
    id: "deployment-tooling",
    title: "High-Speed Finishing Block Tungsten Carbide Ring Sparing",
    category: "deployments",
    categoryLabel: "Onsite Deployments",
    location: "Eastern Region Rolling Plant",
    description:
      "Imported OEM-certified tungsten carbide composite roll rings mounted on high-speed finishing blocks, achieving 85 m/s rebar rolling velocity.",
    image: "/images/gallery/deployment-tooling.jpg",
    tags: ["Tungsten Carbide", "Finishing Block", "85 m/s Rebar"],
    aspect: "standard",
    gridArea: "sub-tooling",
  },
];
