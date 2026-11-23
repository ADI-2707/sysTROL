import { PrismaClient } from "../packages/database/node_modules/@prisma/client/index.js";
import { SHOWCASE_CLIENTS, SHOWCASE_PROJECTS } from "../packages/database/src/showcase-projects.js";

const dbUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_Nj8xS0pAvwWZ@ep-orange-hat-aoyjiaxg-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasourceUrl: dbUrl,
});

async function main() {
  const adminUser = await prisma.user.findFirst({
    where: {
      email: { in: ["admin@systrol.com", "admin@systrol.in"] },
    },
  });

  if (!adminUser) {
    throw new Error("Admin user not found. Run seed-neon-superadmin first.");
  }

  for (const client of SHOWCASE_CLIENTS) {
    await prisma.clientCompany.upsert({
      where: { id: client.id },
      update: {
        name: client.name,
        country: client.country,
        sector: client.sector,
        contactEmail: client.contactEmail,
      },
      create: client,
    });
  }

  for (const p of SHOWCASE_PROJECTS) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {
        projectCode: p.projectCode,
        name: p.name,
        clientId: p.clientId,
        plantLocation: p.plantLocation,
        country: p.country,
        millType: p.millType,
        standCount: p.standCount,
        currentStage: p.currentStage,
        startDate: p.startDate,
        targetCutoverDate: p.targetCutoverDate,
        actualCutoverDate: p.actualCutoverDate,
        isPublished: p.isPublished,
        publishedAt: p.publishedAt,
        publishedById: adminUser.id,
        publicSlug: p.publicSlug,
        caseStudy: p.caseStudy,
      },
      create: {
        id: p.id,
        projectCode: p.projectCode,
        name: p.name,
        clientId: p.clientId,
        plantLocation: p.plantLocation,
        country: p.country,
        millType: p.millType,
        standCount: p.standCount,
        currentStage: p.currentStage,
        createdById: adminUser.id,
        startDate: p.startDate,
        targetCutoverDate: p.targetCutoverDate,
        actualCutoverDate: p.actualCutoverDate,
        isPublished: p.isPublished,
        publishedAt: p.publishedAt,
        publishedById: adminUser.id,
        publicSlug: p.publicSlug,
        caseStudy: p.caseStudy,
      },
    });
  }

  console.log("Seeded showcase projects successfully:", SHOWCASE_PROJECTS.map((p) => p.id));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
