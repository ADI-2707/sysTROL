import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../src/modules/auth/auth.service.js";
import { TotpService } from "../src/common/auth/totp.service.js";
import { prisma } from "@systrol/database";
import { redis } from "../src/common/redis.js";
import { z } from "zod";

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
});
