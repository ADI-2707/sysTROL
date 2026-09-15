import { Worker, Job } from "bullmq";
import { env } from "@systrol/config";
import { createLogger } from "@systrol/logger";
import { redis } from "./common/redis.js";
import { processApplicationNotification } from "./modules/careers/jobs/notify-application.job.js";

const logger = createLogger("bullmq-worker");

const connection = {
  host: new URL(env.REDIS_URL).hostname || "localhost",
  port: parseInt(new URL(env.REDIS_URL).port || "6379", 10),
};

export const pdfWorker = new Worker(
  "pdf-generation",
  async (job: Job) => {
    logger.info({ jobId: job.id, name: job.name }, "Processing PDF generation job");
    // Handlers will be registered by modules
    return { success: true, processedAt: new Date() };
  },
  { connection }
);

export const emailWorker = new Worker(
  "email-notifications",
  async (job: Job) => {
    logger.info({ jobId: job.id, name: job.name }, "Processing email notification job");
    if (job.name === "new-application") {
      await processApplicationNotification(job.data);
    }
    return { success: true, processedAt: new Date() };
  },
  { connection }
);

export const amcWorker = new Worker(
  "amc-reminders",
  async (job: Job) => {
    logger.info({ jobId: job.id, name: job.name }, "Processing AMC reminder job");
    // Handlers will be registered by modules
    return { success: true, processedAt: new Date() };
  },
  { connection }
);

const workers = [pdfWorker, emailWorker, amcWorker];

workers.forEach((worker) => {
  worker.on("completed", (job) => {
    logger.info({ jobId: job.id, queue: worker.name }, "Job completed successfully");
  });

  worker.on("failed", (job, err) => {
    logger.error({ jobId: job?.id, queue: worker.name, err: err.message }, "Job failed");
  });

  worker.on("error", (err) => {
    logger.warn({ queue: worker.name, err: err.message }, "Worker connection warning");
  });
});

async function shutdown() {
  logger.info("Gracefully shutting down background workers...");
  await Promise.all(workers.map((w) => w.close()));
  await redis.quit();
  logger.info("All workers closed");
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

logger.info("sysTROL BullMQ background workers initialized");
