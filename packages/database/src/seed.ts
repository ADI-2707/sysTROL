import { PrismaClient, UserRole, EnquirySource, LifecycleStage, JobPostingStatus } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@systrol.in" },
    update: {},
    create: {
      email: "admin@systrol.in",
      name: "System Admin",
      role: UserRole.SUPER_ADMIN,
      hashedPassword: hashPassword("dev-admin-secret-2026"),
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@systrol.com" },
    update: {},
    create: {
      email: "admin@systrol.com",
      name: "Rajiv Malhotra",
      role: UserRole.SUPER_ADMIN,
      hashedPassword: hashPassword("admin123"),
    },
  });

  const hr = await prisma.user.upsert({
    where: { email: "hr@systrol.in" },
    update: {},
    create: {
      email: "hr@systrol.in",
      name: "HR Manager",
      role: UserRole.HR_RECRUITER,
      hashedPassword: hashPassword("dev-hr-secret-2026"),
    },
  });

  const lead = await prisma.user.upsert({
    where: { email: "lead@systrol.in" },
    update: {},
    create: {
      email: "lead@systrol.in",
      name: "Commissioning Lead",
      role: UserRole.COMMISSIONING_LEAD,
      hashedPassword: hashPassword("dev-lead-secret-2026"),
    },
  });

  const client1 = await prisma.clientCompany.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "JSW Steel Ltd",
      country: "India",
      sector: "Steel & Integrated Plants",
      contactEmail: "procurement@jsw.in",
    },
  });

  const client2 = await prisma.clientCompany.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Tata Steel Ltd",
      country: "India",
      sector: "Steel & Integrated Plants",
      contactEmail: "automation@tatasteel.com",
    },
  });

  const project = await prisma.project.upsert({
    where: { projectCode: "PROJ-2026-0001" },
    update: {},
    create: {
      projectCode: "PROJ-2026-0001",
      name: "JSW Wire Rod Mill L2 Revamp",
      clientId: client1.id,
      plantLocation: "Vijayanagar",
      country: "India",
      millType: "Wire Rod Mill",
      standCount: 10,
      currentStage: LifecycleStage.ENQUIRY,
      createdById: admin.id,
      startDate: new Date("2026-01-15"),
      targetCutoverDate: new Date("2026-12-31"),
    },
  });

  await prisma.projectStageHistory.upsert({
    where: { id: "00000000-0000-0000-0000-000000000010" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000010",
      projectId: project.id,
      fromStage: null,
      toStage: LifecycleStage.ENQUIRY,
      changedById: admin.id,
      reason: "Project created from seed",
      isDeviation: false,
    },
  });

  const jobsData = [
    {
      slug: "l2-lead-engineer",
      title: "Lead Level-2 Automation Engineer (C# / .NET 8)",
      department: "L2 Software Engineering",
      location: "Bengaluru, India (Hybrid)",
      employmentType: "FULL_TIME",
      experienceMin: 5,
      experienceMax: 8,
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
    },
    {
      slug: "commissioning-specialist",
      title: "Rolling Mill Level-1 & Level-2 Commissioning Specialist",
      department: "Field Engineering & Commissioning",
      location: "Bengaluru HQ (Travel ~40%)",
      employmentType: "FULL_TIME",
      experienceMin: 3,
      experienceMax: 7,
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
    },
    {
      slug: "process-metallurgist",
      title: "Process Metallurgist & Roll Pass Schedule Designer",
      department: "Process Engineering",
      location: "Bengaluru HQ",
      employmentType: "FULL_TIME",
      experienceMin: 4,
      experienceMax: 8,
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
    },
  ];

  for (const job of jobsData) {
    await prisma.jobPosting.upsert({
      where: { slug: job.slug },
      update: {},
      create: {
        ...job,
        status: JobPostingStatus.PUBLISHED,
        postedById: hr.id,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Seed complete");
  console.log(`Users: ${admin.email}, ${hr.email}, ${lead.email}`);
  console.log(`Clients: ${client1.name}, ${client2.name}`);
  console.log(`Project: ${project.projectCode}`);
  console.log(`Job postings: ${jobsData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
