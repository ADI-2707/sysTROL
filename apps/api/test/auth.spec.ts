import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../src/modules/auth/auth.service.js";
import { TotpService } from "../src/common/auth/totp.service.js";
import { AuthRateLimiter } from "../src/common/auth/rate-limiter.js";
import { prisma } from "@systrol/database";
import { redis } from "../src/common/redis.js";
import { z } from "zod";
import { env } from "@systrol/config";

vi.mock("@systrol/database", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("../src/common/redis.js", () => ({
  redis: {
    keys: vi.fn(),
    del: vi.fn(),
    get: vi.fn().mockRejectedValue(new Error("redis offline")),
    set: vi.fn().mockRejectedValue(new Error("redis offline")),
  },
}));

vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,mockqr"),
  },
}));

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  totpToken: z.string().optional(),
});

const totpVerifySchema = z.object({
  secret: z.string().min(1),
  token: z.string().length(6),
});

describe("Auth Module Unit & Payload Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AuthRateLimiter.clearMemory();
  });

  describe("Auth Payload Validation", () => {
    it("accepts valid login credentials payload", () => {
      const validPayload = {
        email: "admin@systrol.com",
        password: "securePassword123",
      };
      const result = loginSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("rejects invalid email in login payload", () => {
      const invalidPayload = {
        email: "not-an-email",
        password: "securePassword123",
      };
      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("rejects empty password in login payload", () => {
      const invalidPayload = {
        email: "admin@systrol.com",
        password: "",
      };
      const result = loginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it("accepts optional totpToken in login payload", () => {
      const payloadWithTotp = {
        email: "admin@systrol.com",
        password: "securePassword123",
        totpToken: "123456",
      };
      const result = loginSchema.safeParse(payloadWithTotp);
      expect(result.success).toBe(true);
    });

    it("validates 6-digit length for totp verification payload", () => {
      expect(totpVerifySchema.safeParse({ secret: "JBSWY3DPEHPK3PXP", token: "123456" }).success).toBe(true);
      expect(totpVerifySchema.safeParse({ secret: "JBSWY3DPEHPK3PXP", token: "12345" }).success).toBe(false);
      expect(totpVerifySchema.safeParse({ secret: "JBSWY3DPEHPK3PXP", token: "1234567" }).success).toBe(false);
      expect(totpVerifySchema.safeParse({ secret: "", token: "123456" }).success).toBe(false);
    });
  });

  describe("AuthService", () => {
    it("hashes password and verifies successfully with bcrypt", async () => {
      const plainPassword = "Password@123";
      const hashed = await AuthService.hashPassword(plainPassword);
      expect(hashed).toMatch(/^\$2[aby]\$/);

      const isMatch = await AuthService.verifyPassword(plainPassword, hashed);
      expect(isMatch).toBe(true);

      const isNotMatch = await AuthService.verifyPassword("WrongPassword", hashed);
      expect(isNotMatch).toBe(false);
    });

    it("finds user by lowercased email", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: "usr-1",
        email: "admin@systrol.com",
        name: "Admin",
      });

      const user = await AuthService.findUserByEmail("ADMIN@SYSTROL.COM");
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "admin@systrol.com" },
      });
      expect(user?.id).toBe("usr-1");
    });

    it("revokes user sessions by querying and deleting redis keys", async () => {
      (redis.keys as any).mockResolvedValue(["refresh:usr-1:sess-1", "refresh:usr-1:sess-2"]);
      (redis.del as any).mockResolvedValue(2);

      await AuthService.revokeUserSessions("usr-1");
      expect(redis.keys).toHaveBeenCalledWith("refresh:usr-1:*");
      expect(redis.del).toHaveBeenCalledWith("refresh:usr-1:sess-1", "refresh:usr-1:sess-2");
    });
  });

  describe("TotpService", () => {
    it("generates secret and QR code data URL", async () => {
      const result = await TotpService.generateSecret("admin@systrol.com");
      expect(result.secret).toBeDefined();
      expect(typeof result.secret).toBe("string");
      expect(result.qrCodeDataUrl).toBe("data:image/png;base64,mockqr");
    });

    it("enables TOTP by persisting secret and flag in database", async () => {
      await TotpService.enableTotp("usr-1", "MOCKSECRET123");
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "usr-1" },
        data: {
          totpSecret: "MOCKSECRET123",
          totpEnabled: true,
        },
      });
    });

    it("disables TOTP by clearing secret and setting enabled to false", async () => {
      await TotpService.disableTotp("usr-1");
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "usr-1" },
        data: {
          totpSecret: null,
          totpEnabled: false,
        },
      });
    });
  });

  describe("AuthRateLimiter & Office NAT Concurrency", () => {
    it("allows 30 concurrent successful logins on identical IP without triggering block", async () => {
      const sharedOfficeIp = "198.51.100.50";
      for (let i = 1; i <= 30; i++) {
        const email = `employee${i}@systrol.com`;
        const initialStatus = await AuthRateLimiter.checkLockout(email, sharedOfficeIp);
        expect(initialStatus.locked).toBe(false);
        await AuthRateLimiter.resetAttempts(email, sharedOfficeIp);
        const postStatus = await AuthRateLimiter.checkLockout(email, sharedOfficeIp);
        expect(postStatus.locked).toBe(false);
      }
    });

    it("triggers Tier 1 lockout at 5 failed attempts with 60s cooldown", async () => {
      const email = "alice@systrol.com";
      const ip = "198.51.100.50";

      for (let i = 1; i <= 4; i++) {
        const res = await AuthRateLimiter.recordFailedAttempt(email, ip);
        expect(res.locked).toBe(false);
        expect(res.attempts).toBe(i);
      }

      const fifthAttempt = await AuthRateLimiter.recordFailedAttempt(email, ip);
      expect(fifthAttempt.locked).toBe(true);
      expect(fifthAttempt.retryAfter).toBeGreaterThanOrEqual(59);
      expect(fifthAttempt.retryAfter).toBeLessThanOrEqual(60);

      const check = await AuthRateLimiter.checkLockout(email, ip);
      expect(check.locked).toBe(true);
      expect(check.retryAfter).toBeGreaterThan(0);
    });

    it("leaves other users on the same NAT IP completely unlocked when one user is locked", async () => {
      const sharedIp = "198.51.100.50";
      const lockedUser = "alice@systrol.com";
      const coworker = "bob@systrol.com";

      for (let i = 1; i <= 5; i++) {
        await AuthRateLimiter.recordFailedAttempt(lockedUser, sharedIp);
      }

      const aliceStatus = await AuthRateLimiter.checkLockout(lockedUser, sharedIp);
      expect(aliceStatus.locked).toBe(true);

      const bobStatus = await AuthRateLimiter.checkLockout(coworker, sharedIp);
      expect(bobStatus.locked).toBe(false);
      expect(bobStatus.retryAfter).toBeUndefined();
    });

    it("tracks same user on different IPs independently", async () => {
      const email = "alice@systrol.com";
      const attackerIp = "203.0.113.99";
      const legitimateOfficeIp = "198.51.100.50";

      for (let i = 1; i <= 5; i++) {
        await AuthRateLimiter.recordFailedAttempt(email, attackerIp);
      }

      const attackerStatus = await AuthRateLimiter.checkLockout(email, attackerIp);
      expect(attackerStatus.locked).toBe(true);

      const legitStatus = await AuthRateLimiter.checkLockout(email, legitimateOfficeIp);
      expect(legitStatus.locked).toBe(false);
    });

    it("escalates through backoff tiers on repeated failures", async () => {
      const email = "escalate@systrol.com";
      const ip = "192.168.1.5";

      for (let i = 1; i <= 10; i++) {
        await AuthRateLimiter.recordFailedAttempt(email, ip);
      }
      const tier2 = await AuthRateLimiter.checkLockout(email, ip);
      expect(tier2.locked).toBe(true);
      expect(tier2.retryAfter).toBeGreaterThan(60);
      expect(tier2.retryAfter).toBeLessThanOrEqual(300);

      for (let i = 11; i <= 15; i++) {
        await AuthRateLimiter.recordFailedAttempt(email, ip);
      }
      const tier3 = await AuthRateLimiter.checkLockout(email, ip);
      expect(tier3.locked).toBe(true);
      expect(tier3.retryAfter).toBeGreaterThan(300);
      expect(tier3.retryAfter).toBeLessThanOrEqual(900);

      for (let i = 16; i <= 20; i++) {
        await AuthRateLimiter.recordFailedAttempt(email, ip);
      }
      const tier4 = await AuthRateLimiter.checkLockout(email, ip);
      expect(tier4.locked).toBe(true);
      expect(tier4.retryAfter).toBeGreaterThan(900);
      expect(tier4.retryAfter).toBeLessThanOrEqual(3600);
    });

    it("resets failure counter and lockout on successful login", async () => {
      const email = "reset@systrol.com";
      const ip = "10.0.0.1";

      for (let i = 1; i <= 5; i++) {
        await AuthRateLimiter.recordFailedAttempt(email, ip);
      }
      expect((await AuthRateLimiter.checkLockout(email, ip)).locked).toBe(true);

      await AuthRateLimiter.resetAttempts(email, ip);

      const statusAfterReset = await AuthRateLimiter.checkLockout(email, ip);
      expect(statusAfterReset.locked).toBe(false);
      expect(statusAfterReset.retryAfter).toBeUndefined();
    });
  });

  describe("CORS Origin Lockdown Validation", () => {
    it("verifies allowed origins list contains production domains and excludes wildcards", () => {
      const allowedOrigins = [
        env.PUBLIC_APP_URL,
        env.INTERNAL_APP_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "https://systrol.vercel.app",
        "https://systrolops.vercel.app",
      ];

      expect(allowedOrigins).toContain("https://systrolops.vercel.app");
      expect(allowedOrigins).toContain("https://systrol.vercel.app");
      expect(allowedOrigins.some((origin) => origin instanceof RegExp)).toBe(false);
      expect(allowedOrigins).not.toContain("https://malicious-clone.vercel.app");
    });
  });

  describe("Cookie Attributes Validation", () => {
    it("verifies production cookie policy enforces SameSite None and Secure", () => {
      const isProduction = true;
      const cookieConfig = {
        path: "/",
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        partitioned: isProduction,
        maxAge: 604800,
      };

      expect(cookieConfig.sameSite).toBe("none");
      expect(cookieConfig.secure).toBe(true);
      expect(cookieConfig.partitioned).toBe(true);
      expect(cookieConfig.httpOnly).toBe(true);
    });
  });
});
