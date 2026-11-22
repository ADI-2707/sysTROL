import { Queue } from "bullmq";
import nodemailer from "nodemailer";
import { env } from "@systrol/config";
import { prisma } from "@systrol/database";
import { createLogger } from "@systrol/logger";

const logger = createLogger("weekly-digest-job");

export async function processWeeklyDigest() {
  logger.info("Generating weekly project log digest");
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const lockedWeeks = await prisma.projectLogWeek.findMany({
    where: {
      status: "LOCKED",
      lockedAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          projectCode: true,
          client: { select: { name: true } },
        },
      },
      entries: {
        include: {
          author: { select: { name: true, email: true } },
          step: { select: { title: true } },
        },
      },
    },
  });

  if (lockedWeeks.length === 0) {
    logger.info("No recently locked weeks to digest");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT, 10),
      secure: env.SMTP_PORT === "465",
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    for (const week of lockedWeeks) {
      if (week.entries.length === 0) continue;

      const entriesHtml = week.entries
        .map(
          (e) => `
        <div style="margin-bottom: 12px; padding: 10px; background: #f8fafc; border-left: 3px solid #3b82f6;">
          <p style="margin: 0 0 4px 0; font-weight: bold; font-size: 13px;">${e.category} - ${e.author.name} (${new Date(e.entryDate).toLocaleDateString()})</p>
          ${e.step ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b;">Step: ${e.step.title}</p>` : ""}
          <p style="margin: 0; font-size: 13px;">${e.content}</p>
          ${e.blockers ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #ef4444;">Blocker: ${e.blockers}</p>` : ""}
        </div>
      `
        )
        .join("");

      await transporter.sendMail({
        from: `"sysTROL Project Management" <${env.SMTP_USER}>`,
        to: env.SMTP_USER || "operations@systrol.com",
        subject: `[Weekly Digest] ${week.project.projectCode} - Week ${week.weekNumber} (${week.year})`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.5; color: #1e293b;">
            <h2>Weekly Summary: ${week.project.name}</h2>
            <p><strong>Project:</strong> ${week.project.projectCode} | ${week.project.client.name}</p>
            <p><strong>Week:</strong> ${week.weekNumber} (${new Date(week.startDate).toLocaleDateString()} - ${new Date(week.endDate).toLocaleDateString()})</p>
            <p><strong>Total Entries:</strong> ${week.entries.length}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            ${entriesHtml}
          </div>
        `,
      });
    }

    logger.info("Weekly digest emails processed");
  } catch (err: any) {
    logger.warn({ err: err.message }, "Weekly digest delivery warning");
  }
}

export async function registerWeeklyDigestJob(queue: Queue) {
  await queue.add(
    "weekly-digest",
    {},
    {
      repeat: {
        pattern: "30 12 * * 5",
      },
      jobId: "weekly-digest-cron",
    }
  );
}
