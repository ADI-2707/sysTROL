import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { AuthService } from "./auth.service.js";
import { TotpService } from "../../common/auth/totp.service.js";
import { UserRole } from "@systrol/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  totpToken: z.string().optional(),
});

const totpVerifySchema = z.object({
  secret: z.string().min(1),
  token: z.string().length(6),
});

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = loginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Invalid login credentials format",
        issues: parseResult.error.issues,
      });
    }

    const { email, password, totpToken } = parseResult.data;
    const user = await AuthService.findUserByEmail(email);

    if (!user) {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    const validPassword = await AuthService.verifyPassword(password, user.hashedPassword);
    if (!validPassword) {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Check TOTP if enabled
    if (user.totpEnabled) {
      if (!totpToken) {
        return reply.status(200).send({
          requiresTotp: true,
          message: "TOTP verification required",
        });
      }

      const validTotp = user.totpSecret
        ? TotpService.verifyToken(user.totpSecret, totpToken)
        : false;

      if (!validTotp) {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid TOTP code",
        });
      }
    }

    const tokens = await fastify.issueTokens(user.id, user.role as UserRole, reply);

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        totpEnabled: user.totpEnabled,
      },
      accessToken: tokens.accessToken,
    });
  });

  fastify.post("/auth/refresh", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await fastify.refreshTokens(request, reply);
      return reply.send(result);
    } catch {
      // reply already sent in refreshTokens
    }
  });

  fastify.post(
    "/auth/logout",
    { preHandler: [fastify.verifyJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user.sub;
      await AuthService.revokeUserSessions(userId);

      reply.clearCookie("refreshToken", {
        path: "/",
      });

      return reply.send({ success: true, message: "Logged out successfully" });
    }
  );

  fastify.get(
    "/auth/me",
    { preHandler: [fastify.verifyJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await AuthService.findUserById(request.user.sub);
      if (!user) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "User not found",
        });
      }

      return reply.send({ user });
    }
  );

  fastify.post(
    "/auth/totp/setup",
    { preHandler: [fastify.verifyJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await AuthService.findUserById(request.user.sub);
      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      const totpData = await TotpService.generateSecret(user.email);
      return reply.send(totpData);
    }
  );

  fastify.post(
    "/auth/totp/verify",
    { preHandler: [fastify.verifyJWT] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parse = totpVerifySchema.safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid TOTP verification payload",
        });
      }

      const { secret, token } = parse.data;
      const isValid = TotpService.verifyToken(secret, token);
      if (!isValid) {
        return reply.status(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Invalid verification code",
        });
      }

      await TotpService.enableTotp(request.user.sub, secret);
      return reply.send({ success: true, message: "TOTP successfully activated" });
    }
  );
}
