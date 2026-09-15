import { Project } from "@/types";

export const projectsData: Project[] = [
  {
    id: "proj-1",
    slug: "rolling-mill-l2-automation-upgrade",
    title: "Level-2 Automation Modernization for 650,000 TPA Bar Mill",
    clientRepresentative: "Client A — Major Integrated Steel Plant",
    industry: "Steel Rolling Mills",
    serviceType: "Automation & Consultancy",
    shortBlurb:
      "Engineered and commissioned a high-speed C#-based Level-2 supervisory automation system with dynamic pass scheduling and roll wear tracking.",
    featured: true,
    year: "2024",
    location: "Eastern India",
    challenge:
      "The client operated an existing 18-stand continuous merchant bar mill hampered by an obsolete legacy VMS/Fortran Level-2 system. Operators faced frequent section discrepancies during grade changeovers, lack of real-time roll gap calculations, and high cobble rates during section changes of high-tensile rebar.",
    solution:
      "sysTROL architected a modern C# .NET Level-2 automation suite executing physics-based pass-schedule models. We integrated OPC UA gateways to interface with existing Siemens S7-400 PLCs, deployed automatic roll gap calculation with stand stiffness feedback, and implemented a real-time billet tracking visualizer across the roughing, intermediate, and finishing stands.",
    outcomes: [
      "Reduced section changeover stabilization time from 45 minutes to under 8 minutes",
      "Decreased annual mill cobble rate by 38%, saving hundreds of hours in downtime",
      "Achieved tighter cross-sectional tolerance compliance (within ±0.5% of nominal diameter)",
      "Zero-downtime shadow commissioning: cutover executed cleanly within a scheduled 36-hour maintenance shutdown",
    ],
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
    metrics: [
      { label: "Changeover Time Reduction", value: "82%" },
      { label: "Cobble Rate Reduction", value: "38%" },
      { label: "Annual Billet Throughput", value: "650k TPA" },
      { label: "Tolerances Maintained", value: "±0.5%" },
    ],
    gallery: [
      {
        url: "/images/projects/gallery/bar-mill-pulpit.jpg",
        caption: "Level-2 Supervisory Pulpit with real-time pass schedule calculation and mill floor tracking",
        tag: "Control Room Pulpit",
      },
      {
        url: "/images/hero-rolling-mill.jpg",
        caption: "18-stand continuous bar mill train rolling high-tensile structural rebar",
        tag: "Mill Floor Operation",
      },
      {
        url: "/images/projects/gallery/bar-mill-cooling-bed.jpg",
        caption: "Automatic flying shear transfer and rake cooling bed alignment",
        tag: "Finishing & Cooling Bed",
      },
    ],
  },
  {
    id: "proj-2",
    slug: "reheating-furnace-level2-thermal-pacing",
    title: "Reheating Furnace Level-2 Thermal Tracking & Mill Pacing",
    clientRepresentative: "Client B — Primary Process Steel Manufacturer",
    industry: "Integrated Steel Plants",
    serviceType: "Automation & Consultancy",
    shortBlurb:
      "Developed an 8-zone dynamic billet temperature calculation and rolling mill pacing model to optimize gas consumption and discharge temperature uniformity.",
    featured: true,
    year: "2023",
    location: "Western India",
    challenge:
      "Uneven billet surface and core temperature profiles caused stand roll force surges and roll breakage in the breakdown mill. The furnace operators lacked visibility into real-time heat absorption across 8 firing zones, resulting in either underheated billets or excessive scale loss and high specific fuel gas consumption.",
    solution:
      "Engineered an online 2D finite-difference heat conduction model in C# running on a dedicated industrial server. The L2 software tracks each billet's thermal trajectory from charging through preheat, heating, and soaking zones. It dynamically calculates furnace push commands synchronized with rolling mill pace to guarantee an exact target discharge temperature.",
    outcomes: [
      "Cut specific fuel gas consumption by 6.4%, yielding significant annual cost savings",
      "Reduced rolling stand peak load spikes caused by cold billet cores by over 22%",
      "Eliminated skid mark cold spots via predictive firing setpoint correction",
      "Delivered full traceability from cast heat number to billet discharge timestamp",
    ],
    technologies: [
      "C# Mathematical Engine",
      "Python Calculation Matrices",
      "2D Heat Conduction Models",
      "Modbus TCP / ABB Freelance Integration",
      "WPF / Avalonia Engineering Terminal",
      "SQL Server Historian",
    ],
    metrics: [
      { label: "Fuel Gas Savings", value: "6.4%" },
      { label: "Roll Force Surges", value: "-22%" },
      { label: "Billet Temp Uniformity", value: "±12°C" },
      { label: "Pacing Sync Rate", value: "99.8%" },
    ],
    gallery: [
      {
        url: "/images/projects/reheating-furnace.jpg",
        caption: "8-zone walking beam reheating furnace discharging uniformly heated steel billets at 1150°C",
        tag: "Furnace Discharge",
      },
      {
        url: "/images/projects/gallery/furnace-pyrometer.jpg",
        caption: "Optical pyrometer array and FLIR thermal imaging for cross-billet temperature uniformity",
        tag: "Thermal Instrumentation",
      },
      {
        url: "/images/projects/gallery/furnace-combustion-skid.jpg",
        caption: "Automated natural gas combustion regulation skid and zone burner valves",
        tag: "Combustion Control Skid",
      },
    ],
  },
  {
    id: "proj-3",
    slug: "high-speed-wire-rod-mill-automation",
    title: "Finishing Block Speed Cascade & Looper Control for 110 m/s Wire Rod Mill",
    clientRepresentative: "Client C — Leading Special Steel Manufacturer",
    industry: "Steel Rolling Mills",
    serviceType: "Automation & Consultancy",
    shortBlurb:
      "Supervisory speed coordination, roll wear compensation, and pinch roll/laying head synchronization for high-speed alloy steel rod production.",
    featured: true,
    year: "2024",
    location: "Southern India",
    challenge:
      "At delivery speeds exceeding 100 meters per second, minute errors in inter-stand tension calculation cause ring-pattern distortions, tail-end snap-backs, and erratic coil packaging in the cooling conveyor.",
    solution:
      "Designed a real-time speed cascade supervisory engine in C# that receives roll diameter calibrations, computes exact gear ratio compensation, and outputs ultra-low-latency trim setpoints to high-response drive regulators. Integrated optical scanning pyrometers to compensate for thermal shrinkage in real-time.",
    outcomes: [
      "Enabled stable rolling operations at 105 m/s for 5.5mm high-carbon tire cord steel",
      "Reduced laying head ring lap eccentricity by 45%",
      "Decreased tail-end cobbles at pinch roll transfer by over 30%",
      "Implemented automated roll wear logs tracking tons rolled per groove",
    ],
    technologies: [
      "C# High-Performance Services",
      "Real-time Speed Cascade Algorithm",
      "Optical Pyrometer Interfaces",
      "Rockwell ControlLogix Interfacing",
      "High-Speed Trend Capture (5ms intervals)",
    ],
    metrics: [
      { label: "Max Rolling Speed", value: "110 m/s" },
      { label: "Ring Eccentricity", value: "-45%" },
      { label: "Tail Cobbles", value: "-30%" },
      { label: "Groove Life Tracking", value: "100%" },
    ],
    gallery: [
      {
        url: "/images/projects/wire-rod-mill.jpg",
        caption: "High-speed 10-stand wire rod finishing block operating at 110 m/s delivery speed",
        tag: "High-Speed Block",
      },
      {
        url: "/images/projects/gallery/wirerod-cooling-conveyor.jpg",
        caption: "Stelmor controlled cooling conveyor with precision ring lap distribution",
        tag: "Stelmor Line",
      },
      {
        url: "/images/projects/gallery/wirerod-control-console.jpg",
        caption: "Speed cascade coordination console capturing 5ms mill motor current and tension trends",
        tag: "Speed Cascade Desk",
      },
    ],
  },
  {
    id: "proj-4",
    slug: "hydraulic-agc-system-modernization",
    title: "Hydraulic AGC Servo Valve & Cylinder Retrofit for Narrow Strip Mill",
    clientRepresentative: "Client D — Flat Products Rolling Facility",
    industry: "Process Industries",
    serviceType: "Trading & Spares",
    shortBlurb:
      "Rapid turnaround procurement and on-site integration of German high-frequency servo valves, transducers, and mill chock bearings.",
    featured: false,
    year: "2023",
    location: "Northern India",
    challenge:
      "A sudden catastrophic contamination failure in the mill hydraulic rack destroyed four matched high-response servo valves and cylinder position transducers, halting prime strip production with European OEM lead times quoted at 16 weeks.",
    solution:
      "sysTROL leveraged its direct European manufacturer supply lines to locate, verify, and air-freight four zero-overlap matched servo valves and high-precision magnetostrictive position sensors within 9 business days, accompanied by complete EN 10204 3.1 inspection certifications.",
    outcomes: [
      "Delivered certified OEM-grade replacement parts in 9 days vs. original 16-week lead time",
      "sysTROL automation engineers assisted on-site with servo null balancing and frequency response verification",
      "Restored cold-strip gauge deviation back to within ±0.008 mm specifications",
      "Established strategic emergency consignment inventory agreement with client",
    ],
    technologies: [
      "Moog/Rexroth High-Response Servos",
      "Magnetostrictive Position Transducers",
      "Bespoke High-Pressure Manifolds",
      "On-site Fluid Particle Counting & Calibration",
    ],
    metrics: [
      { label: "Lead Time Slashed", value: "9 days vs 16 wks" },
      { label: "Strip Gauge Deviation", value: "±0.008 mm" },
      { label: "Certification", value: "EN 10204 3.1" },
    ],
    gallery: [
      {
        url: "/images/projects/gallery/agc-cylinder-stand.jpg",
        caption: "Heavy cold rolling mill stand equipped with retrofitted hydraulic AGC cylinders",
        tag: "Mill Housing Retrofit",
      },
      {
        url: "/images/hydraulic-agc-system.jpg",
        caption: "German high-frequency Moog/Rexroth servo valve manifold and stainless hydraulic lines",
        tag: "Servo Valve Manifold",
      },
      {
        url: "/images/projects/gallery/agc-laser-gauge.jpg",
        caption: "Non-contact laser thickness sensor confirming continuous strip gauge within ±0.008 mm",
        tag: "Laser Gauge Metrology",
      },
    ],
  },
  {
    id: "proj-5",
    slug: "critical-imported-spares-sourcing-turnaround",
    title: "Tungsten Carbide Roll Ring Supply & Technical Pairing for Wire Rod Block",
    clientRepresentative: "Client E — International Steel Producer",
    industry: "International Plants",
    serviceType: "Trading & Spares",
    shortBlurb:
      "Supply of customized Tungsten Carbide (TC) composite roll rings with high fracture toughness for extreme high-speed finishing blocks.",
    featured: false,
    year: "2024",
    location: "Middle East",
    challenge:
      "Standard commercial roll rings suffered premature groove micro-spalling during rolling of hard stainless and boron-alloy steel grades, leading to unacceptable surface marking on the finished product and frequent roll changes.",
    solution:
      "sysTROL sourced specialized TC roll rings with an optimized 15% Cobalt-Nickel-Chromium binder matrix from a specialized German manufacturer, engineered specifically to resist thermal fatigue cracking under high coolant spray pressure.",
    outcomes: [
      "Increased tonnage rolled per groove regrind by 2.4x",
      "Virtually eliminated micro-spalling marks on finished wire coil surfaces",
      "Provided customized groove pass templates and CNC grinding wheel recommendations",
      "Successfully expanded relationship into a recurring annual supply contract",
    ],
    technologies: [
      "Composite Tungsten Carbide (TC)",
      "Co-Ni-Cr Binder Matrix",
      "Ultrasonic Flaw Inspection (NDT)",
      "Precision CNC Profile Pairing",
    ],
    metrics: [
      { label: "Groove Life Multiplier", value: "2.4x" },
      { label: "Binder Matrix", value: "15% Co-Ni-Cr" },
      { label: "Surface Rejection Rate", value: "< 0.05%" },
    ],
    gallery: [
      {
        url: "/images/tungsten-carbide-rolls.jpg",
        caption: "15% Co-Ni-Cr matrix Tungsten Carbide roll rings engineered for high fracture toughness",
        tag: "Tungsten Carbide Spares",
      },
      {
        url: "/images/global-logistics-freight.jpg",
        caption: "International air freight and protective moisture-barrier packaging for urgent plant delivery",
        tag: "Expedited Logistics",
      },
      {
        url: "/images/about/engineering-facility.jpg",
        caption: "Quality assurance laboratory testing dimensional tolerances and EN 10204 3.1 compliance",
        tag: "Inspection & NDT Lab",
      },
    ],
  },
  {
    id: "proj-6",
    slug: "tube-mill-pass-schedule-optimization",
    title: "Structural ERW Tube Mill Forming & Sizing Level-2 Automation",
    clientRepresentative: "Client F — Structural Steel Tube Manufacturer",
    industry: "Process Industries",
    serviceType: "Automation & Consultancy",
    shortBlurb:
      "Automated roll gap calculation, weld seam tracking, and synchronized flying cold saw integration for high-yield hollow section production.",
    featured: false,
    year: "2023",
    location: "Central India",
    challenge:
      "Manual setup of breakdown and fin-pass stands during product changeover led to excessive coil strip wastage during weld seam stabilization and erratic tube ovality in large square and rectangular hollow sections.",
    solution:
      "Built a custom C# Level-2 pass scheduling tool that calculates roll positioning setpoints for circular, square, and rectangular hollow sections based on steel grade yield strength and strip thickness. Integrated an automated flying cut-to-length optimizer to minimize tube end scrap.",
    outcomes: [
      "Cut changeover setup scrap from an average of 42 meters to under 9 meters per coil change",
      "Achieved consistent corner radius and side flatness within ASTM A500 tolerance requirements",
      "Synchronized high-speed optical seam detector with automatic reject marking",
    ],
    technologies: [
      "C# Sizing & Forming Algorithm",
      "Flying Saw Synchro Optimization",
      "ASTM A500 Geometric Validation",
      "EtherNet/IP Industrial Bus Interfacing",
    ],
    metrics: [
      { label: "Changeover Scrap Cut", value: "-78%" },
      { label: "Dimensional Standard", value: "ASTM A500" },
      { label: "Flying Saw Sync Accuracy", value: "±1.5 mm" },
    ],
    gallery: [
      {
        url: "/images/projects/erw-tube-mill.jpg",
        caption: "ERW structural tube breakdown and fin-pass forming roll stands",
        tag: "Tube Forming Stands",
      },
      {
        url: "/images/automation-control-room.jpg",
        caption: "Level-2 sizing and pass schedule calculation supervisory engineering console",
        tag: "Pass Schedule Console",
      },
      {
        url: "/images/hero-rolling-mill.jpg",
        caption: "Synchronized flying cold saw cutoff section and automated tube bundle transfer",
        tag: "Flying Cold Saw Line",
      },
    ],
  },
];
