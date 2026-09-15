export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
}

export const careerDepartments: string[] = [
  "All Roles",
  "L2 Software Engineering",
  "Field Engineering & Commissioning",
  "Process Engineering",
  "Spares Trading & Logistics",
  "Hardware & Electrical",
];

export const vacanciesData: Vacancy[] = [
  {
    id: "l2-lead-engineer",
    title: "Lead Level-2 Automation Engineer (C# / .NET 8)",
    department: "L2 Software Engineering",
    location: "Bengaluru, India (Hybrid)",
    type: "Full-time",
    experience: "5 - 8 Years",
    description:
      "Architect and deploy high-performance Level-2 mathematical mill-tracking, pass schedule calculation engines, and Level-1 PLC gateway services for heavy industrial rolling mills.",
    responsibilities: [
      "Develop multithreaded C# microservices communicating via high-throughput OPC UA and TCP/IP sockets.",
      "Formulate mathematical roll force, torque, and temperature decay models for billet reheating and continuous rolling.",
      "Lead factory acceptance testing (FAT) and coordinate live plant hot metal trials with on-site automation teams.",
    ],
    requirements: [
      "5+ years of production C# / .NET engineering with deep knowledge of multithreading, socket IPC, and memory efficiency.",
      "Practical experience with industrial protocols (OPC UA, Modbus TCP, Siemens S7Comm).",
      "Background in steel rolling mills, metallurgy, or heavy process manufacturing is a strong advantage.",
    ],
    skills: ["C# / .NET 8", "OPC UA", "Mathematical Modeling", "SQL Server", "TCP/IP Sockets"],
  },
  {
    id: "commissioning-specialist",
    title: "Rolling Mill Level-1 & Level-2 Commissioning Specialist",
    department: "Field Engineering & Commissioning",
    location: "Bengaluru HQ (Travel ~40%)",
    type: "Full-time",
    experience: "3 - 7 Years",
    description:
      "Direct on-site hot metal trials, finishing block speed cascade tuning, looper control calibration, and hydraulic AGC integration during high-speed bar and wire rod mill revamps.",
    responsibilities: [
      "Calibrate finishing block speed cascades, hydraulic roll gaps, and flying shear synchronization during live rolling.",
      "Conduct site acceptance testing (SAT) protocols directly with plant chief engineers and mechanical heads.",
      "Diagnose mill cobbles, tracking mismatches, and drive trip telemetry using high-speed data loggers.",
    ],
    requirements: [
      "Degree in Electrical, Instrumentation, or Mechanical Engineering.",
      "3+ years in continuous bar, wire rod, or section rolling mill commissioning.",
      "Willingness for domestic and international client site deployments across India, Oman, UAE, and GCC.",
    ],
    skills: ["Mill Kinematics", "Hydraulic AGC", "Drive Cascades", "SAT Protocols", "Cobble Diagnosis"],
  },
  {
    id: "scada-hmi-developer",
    title: "Industrial SCADA & Real-Time HMI Developer",
    department: "L2 Software Engineering",
    location: "Bengaluru HQ",
    type: "Full-time",
    experience: "2 - 5 Years",
    description:
      "Design operator console HMIs, live roll-line mimic screens, real-time alarm telemetry, and production KPI dashboards for 24/7 industrial steel plant control rooms.",
    responsibilities: [
      "Build responsive, high-contrast operator interfaces conforming to ISA-101 high-performance HMI standards.",
      "Interface real-time mill tracking telemetry from Level-2 C# engines into graphical visual displays.",
      "Create historical trend graphs, shift production reporting, and heat tracking visualization tools.",
    ],
    requirements: [
      "2+ years designing industrial HMIs, SCADA packages, or modern desktop UI (WPF / React / Web-based SCADA).",
      "Solid understanding of operator ergonomics and visual hierarchy in continuous industrial plant environments.",
      "Experience with WebSocket streams, REST APIs, and time-series database visualization.",
    ],
    skills: ["WPF / Modern UI", "SCADA / ISA-101", "WebSockets", "Data Visualization", "C#"],
  },
  {
    id: "process-metallurgist",
    title: "Process Metallurgist & Roll Pass Schedule Designer",
    department: "Process Engineering",
    location: "Bengaluru HQ",
    type: "Full-time",
    experience: "4 - 8 Years",
    description:
      "Calculate roll pass designs, groove geometries, elongation ratios, and temperature cooling pacing for structural sections, rebar, and specialty alloy wire rods.",
    responsibilities: [
      "Compute pass sequences and roll groove drawings for oval-round, diamond-square, and slit-rolling schedules.",
      "Validate Level-2 mathematical coefficients against actual finished product tolerances and grain structures.",
      "Consult steel plant clients on roll wear minimization and tungsten carbide composite roll longevity.",
    ],
    requirements: [
      "B.Tech or M.Tech in Metallurgical or Mechanical Engineering.",
      "4+ years of hands-on pass design or roll shop engineering in hot rolling mills.",
      "Familiarity with tungsten carbide rolls, guide systems, and TMT slitting technology.",
    ],
    skills: ["Roll Pass Design", "Metallurgy", "TMT / Rebar Slitting", "CAD Drawings", "Pass Schedules"],
  },
  {
    id: "procurement-specialist",
    title: "International Technical Procurement Specialist",
    department: "Spares Trading & Logistics",
    location: "Bengaluru HQ",
    type: "Full-time",
    experience: "3 - 6 Years",
    description:
      "Oversee cross-border sourcing, mill inspection certification (EN 10204 3.1), customs compliance, and expedited freight logistics for precision imported rolling mill spares.",
    responsibilities: [
      "Manage OEM vendor relations with manufacturers across Germany, Italy, Japan, and India.",
      "Examine mill test certificates, dimensional tolerances, and heat-treatment specifications before dispatch.",
      "Coordinate international air and ocean logistics, bonded warehouse clearance, and customs tariffs.",
    ],
    requirements: [
      "Proven background in industrial machinery procurement or international engineering trading.",
      "Understanding of mechanical drawings, metallurgy basics, and Incoterms 2020.",
      "Excellent commercial negotiation and documentation auditing skills.",
    ],
    skills: ["Import/Export Compliance", "EN 10204 3.1", "Vendor Management", "Incoterms 2020", "Spares Sourcing"],
  },
  {
    id: "instrumentation-engineer",
    title: "Industrial Instrumentation & Drive Systems Engineer",
    department: "Hardware & Electrical",
    location: "Bengaluru HQ (with site visits)",
    type: "Full-time",
    experience: "2 - 5 Years",
    description:
      "Interface optical pyrometers, hot metal detectors, laser diameter gauges, load cells, and variable frequency drives (VFD) with automation control systems.",
    responsibilities: [
      "Specify and calibrate mill optical pyrometers, laser scanners, and loop height sensors.",
      "Commission drive communications over Profinet / Profibus to synchronize multi-stand speed references.",
      "Generate electrical schematics, loop drawings, and junction box termination schedules.",
    ],
    requirements: [
      "Bachelor's in Instrumentation & Control or Electrical Engineering.",
      "Hands-on experience with field sensors, ABB/Siemens drive systems, and electrical schematics.",
      "Familiarity with industrial grounding, noise shielding, and harsh plant installation environments.",
    ],
    skills: ["Profinet / Profibus", "Drive Systems (VFD)", "Field Sensors", "Electrical Schematics", "Calibration"],
  },
];

export function getAllVacancies(): Vacancy[] {
  return vacanciesData;
}

export function getVacancyById(id: string): Vacancy | undefined {
  return vacanciesData.find((vacancy) => vacancy.id === id);
}
