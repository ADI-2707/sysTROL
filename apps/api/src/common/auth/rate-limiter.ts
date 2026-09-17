import { redis } from "../redis.js";

interface AttemptRecord {
  attempts: number;
  lockedUntil: number;
}

const memoryStore = new Map<string, AttemptRecord>();

function getDuration(attempts: number): number {
  if (attempts >= 20) return 3600;
  if (attempts >= 15) return 900;
  if (attempts >= 10) return 300;
  if (attempts >= 5) return 60;
  return 0;
}

function makeKey(email: string, ip: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedIp = ip.trim();
  return `login_fail:${normalizedEmail}:${normalizedIp}`;
}

export class AuthRateLimiter {
  static async checkLockout(email: string, ip: string): Promise<{ locked: boolean; retryAfter?: number }> {
    const key = makeKey(email, ip);
    const now = Date.now();

    try {
      const data = await redis.get(key);
      if (data) {
        const record: AttemptRecord = JSON.parse(data);
        if (record.lockedUntil > now) {
          const retryAfter = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
          return { locked: true, retryAfter };
        }
      }
    } catch {
      const record = memoryStore.get(key);
      if (record && record.lockedUntil > now) {
        const retryAfter = Math.max(1, Math.ceil((record.lockedUntil - now) / 1000));
        return { locked: true, retryAfter };
      }
    }

    return { locked: false };
  }

  static async recordFailedAttempt(
    email: string,
    ip: string
  ): Promise<{ locked: boolean; retryAfter?: number; attempts: number }> {
    const key = makeKey(email, ip);
    const now = Date.now();
    let record: AttemptRecord = { attempts: 0, lockedUntil: 0 };

    try {
      const data = await redis.get(key);
      if (data) {
        record = JSON.parse(data);
      }
    } catch {
      const mem = memoryStore.get(key);
      if (mem) {
        record = { ...mem };
      }
    }

    record.attempts += 1;
    const duration = getDuration(record.attempts);
    if (duration > 0) {
      record.lockedUntil = now + duration * 1000;
    }

    const ttlSeconds = Math.max(duration, 3600);

    try {
      await redis.set(key, JSON.stringify(record), "EX", ttlSeconds);
    } catch {
      memoryStore.set(key, record);
    }

    const locked = record.lockedUntil > now;
    const retryAfter = locked ? Math.max(1, Math.ceil((record.lockedUntil - now) / 1000)) : undefined;

    return { locked, retryAfter, attempts: record.attempts };
  }

  static async resetAttempts(email: string, ip: string): Promise<void> {
    const key = makeKey(email, ip);
    memoryStore.delete(key);
    try {
      await redis.del(key);
    } catch {
    }
  }

  static clearMemory(): void {
    memoryStore.clear();
  }
}
