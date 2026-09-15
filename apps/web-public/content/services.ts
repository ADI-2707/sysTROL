import { ServiceDetail } from "@/types";

export const servicesData: ServiceDetail[] = [
  {
    id: "automation-consultancy",
    slug: "automation-consultancy",
    title: "Automation Engineering & Consultancy",
    shortDescription:
      "Level-2 (L2) process automation software, Python & C# mathematical models (deterministic calculation matrices and grade-based calculation rules, not AI/ML), and supervisory control systems engineered specifically for steel rolling mills.",
    heroTagline: "Precision Level-2 Automation Architectures for High-Speed Mill Environments",
    fullOverview:
      "sysTROL delivers end-to-end Level-2 (L2) supervisory automation software, deterministic Python & C# calculation matrix models, and SCADA/HMI integrations. Our engineering core is built around high-performance C# services and rigorous Python calculation matrices that bridge Level-1 PLCs/drives with plant-wide ERP and MES tiers. By deploying physics-based calculation matrices and steel grade calculation rules (pure deterministic metallurgy, not black-box AI/ML), we optimize inter-stand tension, thermal pacing, roll wear calculation, and pass-schedule execution to maximize yield and eliminate cobbles.",
    iconName: "Cpu",
    domainTags: [
      "Level-2 Systems",
      "C# / .NET Industrial Core",
      "Python Mathematical Models",
      "Calculation Matrix Engines",
      "Grade Calculation Rules",
      "Steel Rolling Mills",
      "Pass Schedule Calculation",
      "Thermal Pacing Models",
      "SCADA & Level-1 PLC Integration",
      "OPC UA / Industrial Ethernet",
    ],
    capabilities: [
      {
        title: "Level-2 Supervisory Software (C#)",
        description:
          "High-availability server services built in modern C# that compute rolling mill setpoints, track billets and coils in real time, and dynamically manage mill line pace.",
        highlights: [
          "Microsecond-accurate tracking through roughing, intermediate, and finishing blocks",
          "Automated roll gap, looper tension, and speed cascade setpoint distribution",
          "Comprehensive diagnostic logging, trend analysis, and alarm correlation",
        ],
      },
      {
        title: "Mathematical Process Modeling (Python & C#)",
        description:
          "Physics-based calculation matrices, roll torque equations, and temperature rundown models calibrated for carbon, alloy, and special steel grades (deterministic calculation rules, not AI/ML).",
        highlights: [
          "Python calculation matrix engines executing grade-specific metallurgy rules",
          "Adaptive model feedback adjusting mill stiffness coefficients after every pass",
          "Reheating furnace discharge pacing based on mill absorption capacity",
        ],
      },
      {
        title: "Level-1 & MES System Integration",
        description:
          "Seamless communication pipelines linking shop-floor PLCs (Siemens, ABB, Rockwell) with enterprise production planning systems.",
        highlights: [
          "Robust OPC UA, Modbus TCP, and raw socket protocol drivers",
          "Automated heat/billet genealogy recording from charging grid to cooling bed",
          "Real-time operator dashboards with sub-second parameter refresh rates",
        ],
      },
      {
        title: "Mill Commissioning & Retrofit Audits",
        description:
          "Brownfield modernization and greenfield commissioning consultancy to eliminate legacy system bottlenecks without protracted plant shutdowns.",
        highlights: [
          "Shadow-run testing against existing automation to de-risk live changeover",
          "On-site cold and hot commissioning by senior steel automation specialists",
          "24/7 post-commissioning stabilization and remote telemetry support",
        ],
      },
    ],
    processSteps: [
      {
        step: 1,
        title: "Assess & Audit",
        shortDesc: "Mill audit & protocol review",
        detailedDesc:
          "Comprehensive on-site assessment of mechanical kinematics, drive responsiveness, L1 PLC communication topologies, and grade catalogs.",
        deliverables: [
          "Mill Automation Audit Report",
          "Interface Control Document (ICD)",
          "Risk & Roll-out Strategy",
        ],
      },
      {
        step: 2,
        title: "Design & Model",
        shortDesc: "L2 architecture & math models",
        detailedDesc:
          "Customization of pass scheduling algorithms, roll wear tracking modules, and database schemas tailored to the plant's production mix.",
        deliverables: [
          "Functional Design Specification (FDS)",
          "Mathematical Model Parameter Tables",
          "Database Architecture & API Schemas",
        ],
      },
      {
        step: 3,
        title: "Develop & Simulate",
        shortDesc: "C# service build & shadow test",
        detailedDesc:
          "Engineering of modular C# services, high-fidelity mill simulator testing, and Factory Acceptance Testing (FAT) with simulated L1 signals.",
        deliverables: [
          "Compiled L2 Software Package",
          "FAT Test Execution Protocols",
          "Offline Simulation Test Records",
        ],
      },
      {
        step: 4,
        title: "Commission & Tune",
        shortDesc: "On-site hot & cold trials",
        detailedDesc:
          "Deployment during scheduled maintenance shutdowns, cold sensor checks, hot metal tracking trials, and active model tuning during production ramp-up.",
        deliverables: [
          "Site Acceptance Test (SAT) Signoff",
          "Tuned Model Coefficient Archive",
          "Operator & Maintenance Training Manuals",
        ],
      },
      {
        step: 5,
        title: "Support & Elevate",
        shortDesc: "Long-term SLA & remote telemetry",
        detailedDesc:
          "Dedicated 24/7 technical hotline, periodic roll-schedule fine-tuning for newly introduced steel grades, and system health health-checks.",
        deliverables: [
          "Quarterly Mill Performance Reports",
          "Software Security & Patch Releases",
          "24/7 Tier-3 Engineering Support",
        ],
      },
    ],
  },
  {
    id: "trading",
    slug: "trading",
    title: "Imported Machinery & Spares Trading",
    shortDescription:
      "Global procurement and supply of specialized imported heavy machinery, precision rolling mill spares, sensors, and critical industrial consumables for steel plants.",
    heroTagline: "Trusted International Sourcing for Heavy Mill Machinery, Spares & Consumables",
    fullOverview:
      "Modern steel plants cannot afford unscheduled downtime due to component failure. Leveraging our deep engineering knowledge of rolling mills and process lines, sysTROL operates a specialized trading division that sources OEM-grade machinery, certified spare parts, and critical consumables directly from reputed international manufacturers in Europe, Japan, and North America. Because our team consists of practicing automation and mill engineers, we don't just supply catalog numbers — we verify metallurgical specifications, tolerances, and electrical ratings to ensure drop-in field compatibility.",
    iconName: "Truck",
    domainTags: [
      "Imported Mill Spares",
      "Tungsten Carbide Rolls",
      "Hydraulic Valves & Servos",
      "Optical Hot Metal Detectors",
      "Non-Contact Laser Gauges",
      "Critical Consumables",
      "OEM Certified Sourcing",
    ],
    capabilities: [
      {
        title: "Mill Mechanical Spares & Tooling",
        description:
          "High-wear mechanical components engineered to withstand extreme thermal shock and cyclic loading in continuous rolling conditions.",
        highlights: [
          "Composite roll rings and solid Tungsten Carbide (TC) roll rings",
          "Precision guide equipment (roller entry guides, twist guides, exit guides)",
          "Universal drive spindles, slipper pads, and heavy-duty gear couplings",
        ],
      },
      {
        title: "Precision Sensors & Instrumentation",
        description:
          "Specialized measurement instrumentation built to survive the high steam, heat, and vibration of modern rolling mills.",
        highlights: [
          "Hot Metal Detectors (HMD) and scanning loop sensors with fiber-optic heads",
          "Laser surface velocity gauges and non-contact bar dimension measurement units",
          "High-pressure load cells for rolling stand screwdown force monitoring",
        ],
      },
      {
        title: "Hydraulic & Pneumatic Control Spares",
        description:
          "Certified proportional valves, servo valves, and high-response cylinders for hydraulic Automatic Gauge Control (AGC) and looper actuators.",
        highlights: [
          "Moog / Rexroth compatible high-frequency servo valves and filter cartridges",
          "Hydraulic accumulator bladders and rotary manifolds",
          "High-pressure seamless hydraulic piping and metric bite-type fittings",
        ],
      },
      {
        title: "Quality Assurance & Logistics Support",
        description:
          "End-to-end import compliance, customs clearance facilitation, mill test certifications, and door-step delivery across India and international plant sites.",
        highlights: [
          "EN 10204 3.1 material test certificates with every critical batch",
          "Pre-shipment dimensional inspection and protective export packaging",
          "Strategic stocking agreements for high-frequency consumable lines",
        ],
      },
    ],
    tradingCategories: [
      {
        category: "Rolling Mill Mechanical Spares",
        items: [
          "Tungsten Carbide Roll Rings (grades up to 20% Co/Ni)",
          "Entry & Delivery Roller Guides for High-Speed Wire Rod Mills",
          "Universal Joint Spindles & Drive Couplings",
          "Chock Bearings & High-Load Spherical Roller Bearings",
        ],
        sourcingOrigin: "Germany, Sweden, Japan",
      },
      {
        category: "Industrial Automation & Mill Sensors",
        items: [
          "Infrared Hot Metal Detectors (HMD) with Water-Cooled Jackets",
          "Laser Thickness & Profile Gauges",
          "Optical Pyrometers (Dual-Wavelength for Scale Penetration)",
          "Incremental & Absolute Heavy-Duty Rotary Encoders (IP67+)",
        ],
        sourcingOrigin: "Germany, USA, Switzerland",
      },
      {
        category: "Hydraulic AGC & Looper Actuation",
        items: [
          "High-Response Dynamic Servo Valves (Zero-Overlap Spool)",
          "Proportional Directional Valves with Integrated Electronics",
          "Heavy-Duty Double-Acting Mill Cylinders with Linear Transducers",
          "High-Pressure Inline Filtration Systems (3 Micron Absolute)",
        ],
        sourcingOrigin: "Germany, Italy, Japan",
      },
      {
        category: "Plant Consumables & Wear Parts",
        items: [
          "High-Temperature Synthetic Lubricants & Greases",
          "Water-Lubricated Phenolic Resin Bearings",
          "Ceramic Thermal Barrier Sleeves & Nozzles",
          "Cobble Cutting Shear Blades & Flying Shear Knives",
        ],
        sourcingOrigin: "Austria, UK, South Korea",
      },
    ],
  },
];
