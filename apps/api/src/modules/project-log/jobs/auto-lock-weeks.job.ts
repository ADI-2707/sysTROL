import { Queue } from "bullmq";
import { prisma } from "@systrol/database";
import { createLogger } from "@systrol/logger";
import { LogWeekStatus } from "@systrol/types";

const logger = createLogger("auto-lock-weeks-job");

export async function processAutoLockWeeks(): Promise<number> {
  logger.info("Executing auto-lock for expired open weeks");
  const now = new Date();
  const result = await prisma.projectLogWeek.updateMany({
    where: {
      status: LogWeekStatus.OPEN,
      endDate: {
        lt: now,
      },
    },
    data: {
      status: LogWeekStatus.LOCKED,
      lockedAt: now,
    },
  });
  logger.info({ count: result.count }, "Auto-locked expired project log weeks");
  return result.count;
}

export async function registerAutoLockWeeksJob(queue: Queue) {
  await queue.add(
    "auto-lock-weeks",
    {},
    {
      repeat: {
        pattern: "0 19 * * 0",
      },
      jobId: "auto-lock-weeks-cron",
    }
  );
}
