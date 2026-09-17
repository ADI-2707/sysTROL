import crypto from "crypto";
import { PrismaClient, UserRole } from "../packages/database/node_modules/@prisma/client/index.js";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const neonUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_Nj8xS0pAvwWZ@ep-orange-hat-aoyjiaxg-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

const prisma = new PrismaClient({
  datasourceUrl: neonUrl,
});

async function main() {
  const adminCom = await prisma.user.upsert({
    where: { email: "admin@systrol.com" },
    update: {
      hashedPassword: hashPassword("admin123"),
      role: UserRole.SUPER_ADMIN,
      name: "Admin Controls",
    },
    create: {
      email: "admin@systrol.com",
      name: "Admin Controls",
      role: UserRole.SUPER_ADMIN,
      hashedPassword: hashPassword("admin123"),
    },
  });

  const adminIn = await prisma.user.upsert({
    where: { email: "admin@systrol.in" },
    update: {
      hashedPassword: hashPassword("dev-admin-secret-2026"),
      role: UserRole.SUPER_ADMIN,
      name: "System Admin",
    },
    create: {
      email: "admin@systrol.in",
      name: "System Admin",
      role: UserRole.SUPER_ADMIN,
      hashedPassword: hashPassword("dev-admin-secret-2026"),
    },
  });

  console.log("Seeded users successfully:", [adminCom.email, adminIn.email]);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
