import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, "apps", "api", ".env"));

const s3 = new S3Client({
  region: process.env.S3_REGION || "ap-south-1",
  endpoint: process.env.S3_ENDPOINT || "https://jvbwajcypzryqbvmuirv.storage.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

const prisma = new PrismaClient();
const bucket = process.env.S3_MEDIA_BUCKET || "systrol-media";

const GALLERY_METADATA: Record<string, { title: string; altText: string; tags: string[]; category: "GALLERY" | "PROJECTS" }> = {
  "deployment-pulpit.jpg": {
    title: "Continuous Bar Mill L2 Pulpit",
    altText: "Operators running high-speed bar rolling mill pulpit with C# supervisory control",
    tags: ["pulpit", "l2-automation", "bar-mill"],
    category: "GALLERY",
  },
  "deployment-rolling-mill.jpg": {
    title: "16-Stand Continuous Rolling Mill Run",
    altText: "High-tonnage hot steel billet passing through finishing stands",
    tags: ["rolling-mill", "hot-metal", "finishing-stands"],
    category: "GALLERY",
  },
  "deployment-tooling.jpg": {
    title: "Tungsten Carbide Roll Ring Tooling",
    altText: "Precision CNC ground carbide roll rings mounted on high-speed wire rod blocks",
    tags: ["carbide-rolls", "tooling", "wire-rod"],
    category: "GALLERY",
  },
  "team-collaboration.jpg": {
    title: "Commissioning Review & Technical Handoff",
    altText: "sysTROL commissioning engineers reviewing Level-2 automation parameters with plant managers",
    tags: ["commissioning", "engineering-review", "team"],
    category: "GALLERY",
  },
  "team-inspection.jpg": {
    title: "Mechanical Spares Dimension Verification",
    altText: "Quality inspection of imported CNC ground machinery spares and EN 10204 test logs",
    tags: ["quality-control", "inspection", "spares"],
    category: "GALLERY",
  },
  "team-operations.jpg": {
    title: "Hot Trial Supervisory Control",
    altText: "Field engineering staff verifying stand speed cascade calculations during trial roll",
    tags: ["hot-trial", "speed-cascade", "field-engineering"],
    category: "GALLERY",
  },
  "workplace-digital-twin.jpg": {
    title: "Rolling Mill Digital Twin & HIL Test Bay",
    altText: "Hardware-in-the-loop simulation environment testing stand speed cascades and AGC reaction",
    tags: ["digital-twin", "hil-simulation", "c-sharp-core"],
    category: "GALLERY",
  },
  "workplace-electronics.jpg": {
    title: "PLC & Remote I/O Engineering Stations",
    altText: "Industrial communication testing rack for Profinet and OPC UA telemetry",
    tags: ["profinet", "opc-ua", "plc"],
    category: "GALLERY",
  },
  "workplace-hil-lab.jpg": {
    title: "Hardware-In-The-Loop Validation Suite",
    altText: "Real-time electrical automation simulation bay before on-site deployment",
    tags: ["hil", "simulation", "automation"],
    category: "GALLERY",
  },
  "workplace-hydraulic-bench.jpg": {
    title: "Hydraulic AGC & Servo Valve Test Bench",
    altText: "Precision calibration rig for high-response servo valves and mill gap control",
    tags: ["hydraulic-agc", "servo-valve", "gap-control"],
    category: "GALLERY",
  },
  "workplace-workstations.jpg": {
    title: "Mathematical Modeling Engineering Bays",
    altText: "Engineering workstations computing pass schedules and thermal tracking models",
    tags: ["pass-schedules", "thermal-tracking", "modeling"],
    category: "GALLERY",
  },
  "agc-cylinder-stand.jpg": {
    title: "Hydraulic AGC Cylinder Assembly",
    altText: "High-tonnage hydraulic AGC cylinder stand for precision gauge control",
    tags: ["hydraulic-agc", "gauge-control"],
    category: "PROJECTS",
  },
  "agc-laser-gauge.jpg": {
    title: "Optical Laser Thickness Gauge",
    altText: "High-accuracy optical laser gauge feeding real-time bar profile telemetry",
    tags: ["laser-gauge", "profile-measurement"],
    category: "PROJECTS",
  },
  "bar-mill-cooling-bed.jpg": {
    title: "Rake Type Cooling Bed System",
    altText: "Automatic rake type cooling bed with variable pitch indexing and apron plates",
    tags: ["cooling-bed", "bar-mill"],
    category: "PROJECTS",
  },
  "bar-mill-pulpit.jpg": {
    title: "Bar Mill Master Control Pulpit",
    altText: "Air-conditioned master automation pulpit with multi-screen HMI SCADA suite",
    tags: ["pulpit", "scada", "hmi"],
    category: "PROJECTS",
  },
  "furnace-combustion-skid.jpg": {
    title: "Furnace Combustion & Fuel Skid",
    altText: "Automated gas and dual-fuel combustion skid with mass flow control",
    tags: ["furnace", "combustion-skid"],
    category: "PROJECTS",
  },
  "furnace-pyrometer.jpg": {
    title: "Billet Optical Pyrometer Array",
    altText: "Dual-wavelength infrared pyrometers measuring surface and core billet temperature",
    tags: ["pyrometer", "thermal-tracking"],
    category: "PROJECTS",
  },
  "tube-finished-bundle.jpg": {
    title: "ERW Structural Tube Finished Bundles",
    altText: "Hexagonal strapped structural steel tube bundles with EN 10219 compliance",
    tags: ["tube-mill", "structural-steel"],
    category: "PROJECTS",
  },
  "tube-forming-stands.jpg": {
    title: "Breakdown & Fin-Pass Forming Stands",
    altText: "Heavy-duty CNC machined roll stands forming high-yield steel coils into round tubes",
    tags: ["tube-mill", "roll-stands"],
    category: "PROJECTS",
  },
  "wirerod-control-console.jpg": {
    title: "High-Speed Wire Rod Control Console",
    altText: "Finishing block automation console monitoring laying head and water cooling boxes",
    tags: ["wire-rod", "finishing-block"],
    category: "PROJECTS",
  },
  "wirerod-cooling-conveyor.jpg": {
    title: "Stelmor Controlled Cooling Conveyor",
    altText: "Controlled air-cooling roller conveyor producing consistent metallurgical grain structure",
    tags: ["stelmor-cooling", "metallurgy", "wire-rod"],
    category: "PROJECTS",
  },
};

async function migrateFolder(dirPath: string) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) continue;

    const meta = GALLERY_METADATA[file] || {
      title: file.replace(/[-_]/g, " ").replace(/\.[^/.]+$/, ""),
      altText: file,
      tags: ["industrial", "rolling-mill"],
      category: "GALLERY" as const,
    };

    const s3Key = `${meta.category.toLowerCase()}/${file}`;
    const fileBuffer = fs.readFileSync(fullPath);
    const sizeBytes = fileBuffer.length;
    const mimeType = file.endsWith(".png") ? "image/png" : "image/jpeg";

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: mimeType,
        })
      );
    } catch (err: any) {
      console.error(`Failed to upload ${s3Key} to S3:`, err.message);
      continue;
    }

    const publicUrl = `https://jvbwajcypzryqbvmuirv.storage.supabase.co/storage/v1/object/public/${bucket}/${s3Key}`;

    await prisma.mediaAsset.upsert({
      where: { s3Key },
      update: {
        title: meta.title,
        altText: meta.altText,
        fileUrl: publicUrl,
        sizeBytes,
        mimeType,
        tags: meta.tags,
        category: meta.category,
      },
      create: {
        title: meta.title,
        altText: meta.altText,
        fileUrl: publicUrl,
        s3Key,
        sizeBytes,
        mimeType,
        tags: meta.tags,
        category: meta.category,
        width: 1920,
        height: 1080,
      },
    });

    console.log(`✓ Migrated: ${file} -> ${publicUrl}`);
  }
}

async function run() {
  console.log("=== Migrating Local Media to Supabase S3 & Neon DB ===");
  const galleryDir = path.join(rootDir, "apps", "web-public", "public", "images", "gallery");
  const projectsDir = path.join(rootDir, "apps", "web-public", "public", "images", "projects", "gallery");

  await migrateFolder(galleryDir);
  await migrateFolder(projectsDir);

  console.log("=== Migration Complete ===");
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
