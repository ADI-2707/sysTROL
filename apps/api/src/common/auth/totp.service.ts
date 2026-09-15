import { authenticator } from "otplib";
import QRCode from "qrcode";
import { env } from "@systrol/config";
import { prisma } from "@systrol/database";

export class TotpService {
  static generateSecret(email: string): Promise<{ secret: string; qrCodeDataUrl: string }> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, env.TOTP_ISSUER, secret);

    return QRCode.toDataURL(otpauth).then((qrCodeDataUrl) => ({
      secret,
      qrCodeDataUrl,
    }));
  }

  static verifyToken(secret: string, token: string): boolean {
    try {
      return authenticator.verify({
        token,
        secret,
      });
    } catch {
      return false;
    }
  }

  static async enableTotp(userId: string, secret: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        totpSecret: secret,
        totpEnabled: true,
      },
    });
  }

  static async disableTotp(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        totpSecret: null,
        totpEnabled: false,
      },
    });
  }
}
