import { Redis } from "ioredis";
import { env } from "@systrol/config";
import { createLogger } from "@systrol/logger";

const log = createLogger("redis");

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 1,
  lazyConnect: true,
  enableReadyCheck: false,
  enableOfflineQueue: false,
  connectTimeout: 2000,
  retryStrategy(times) {
    return Math.min(times * 1000, 15000);
  },
});

redis.on("error", (err) => {
  log.warn({ err: err.message }, "Redis client notification");
});
