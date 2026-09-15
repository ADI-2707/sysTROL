import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@systrol/database";
import { UserRole } from "@systrol/types";
import { TotpService } from "../../common/auth/totp.service.js";
import { redis } from "../../common/redis.js";

export class AuthService {
  static async verifyPassword(plain: string, hashed: string): Promise<boolean> {
    if (hashed.startsWith("$2a$") || hashed.startsWith("$2b$")) {
      return bcrypt.compare(plain, hashed);
    }
    const sha = crypto.createHash("sha256").update(plain).digest("hex");
    return sha === hashed;
  }

  static async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totpEnabled: true,
        createdAt: true,
      },
    });
  }

  static async revokeUserSessions(userId: string) {
    try {
      const keys = await redis.keys(`refresh:${userId}:*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Redis unavailable in offline mode
    }
  }
}
