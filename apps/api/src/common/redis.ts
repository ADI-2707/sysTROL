import { Redis } from "ioredis";
import { env } from "@systrol/config";
import { createLogger } from "@systrol/logger";

const log = createLogger("redis");

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableReadyCheck: false,
});

redis.on("error", (err) => {
  log.warn({ err: err.message }, "Redis client notification");
});
