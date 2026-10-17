import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@systrol/database";
import { redis } from "../../common/redis.js";

export class AuthService {
  static async verifyPassword(plain: string, hashed: string, userId?: string): Promise<boolean> {
    const isBcrypt = await bcrypt.compare(plain, hashed).catch(() => false);
    if (isBcrypt) {
      return true;
    }
    const sha256 = crypto.createHash("sha256").update(plain).digest("hex");
    if (hashed.length === 64 && crypto.timingSafeEqual(Buffer.from(hashed.toLowerCase()), Buffer.from(sha256.toLowerCase()))) {
      if (userId) {
        const upgraded = await bcrypt.hash(plain, 10);
        await prisma.user.update({
          where: { id: userId },
          data: { hashedPassword: upgraded },
        }).catch(() => {});
      }
      return true;
    }
    return false;
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
        for (const k of keys) {
          const parts = k.split(":");
          const token = parts[2];
          if (token) {
            await redis.del(`session:${token}`);
          }
        }
        await redis.del(...keys);
      }
    } catch {
    }
  }
}
