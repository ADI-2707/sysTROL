import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import crypto from "crypto";
import { env } from "@systrol/config";
import { JWTPayload, UserRole } from "@systrol/types";
import { redis } from "../redis.js";
import { prisma } from "@systrol/database";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; role: UserRole; iat?: number; exp?: number };
    user: JWTPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    verifyJWT: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (
      allowedRoles: string[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    issueTokens: (
      userId: string,
      role: UserRole,
      reply: FastifyReply
    ) => Promise<{ accessToken: string; refreshToken: string }>;
    refreshTokens: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<{ accessToken: string }>;
  }
  interface FastifyRequest {
    auditBefore?: unknown;
  }
}

async function jwtPluginAsync(fastify: FastifyInstance) {
  if (!fastify.hasPlugin("@fastify/cookie")) {
    await fastify.register(fastifyCookie);
  }

  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: Number(env.JWT_ACCESS_TTL),
    },
  });

  const verifyAuth = async function (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Missing, invalid, or expired authentication token",
      });
    }
  };

  fastify.decorate("verifyJWT", verifyAuth);
  fastify.decorate("authenticate", verifyAuth);

  fastify.decorate("authorize", function (allowedRoles: string[]) {
    return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
      const user = request.user;
      if (!user) {
        reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Authentication required before role check",
        });
        return;
      }

      if (!allowedRoles.includes(user.role as string) && (user.role as string) !== "SUPER_ADMIN" && (user.role as string) !== "ADMIN") {
        reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: `User role '${user.role}' does not have sufficient permissions for this resource`,
        });
        return;
      }
    };
  });

  fastify.decorate(
    "issueTokens",
    async function (
      userId: string,
      role: UserRole,
      reply: FastifyReply
    ): Promise<{ accessToken: string; refreshToken: string }> {
      const accessToken = fastify.jwt.sign(
        { sub: userId, role },
        { expiresIn: Number(env.JWT_ACCESS_TTL) }
      );

      const refreshToken = crypto.randomBytes(40).toString("hex");
      const refreshKey = `refresh:${userId}:${refreshToken}`;
      const refreshTtl = Number(env.JWT_REFRESH_TTL);

      try {
        await redis.set(refreshKey, role, "EX", refreshTtl);
      } catch (redisErr) {
        // In local mode if Redis is temporarily unreachable
      }

      reply.setCookie("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: refreshTtl,
      });

      return { accessToken, refreshToken };
    }
  );

  fastify.decorate(
    "refreshTokens",
    async function (
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<{ accessToken: string }> {
      const rawToken =
        request.cookies?.refreshToken ||
        (request.body as { refreshToken?: string } | undefined)?.refreshToken;

      if (!rawToken) {
        reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "No refresh token provided",
        });
        throw new Error("No refresh token provided");
      }

      // Search keys matching refresh:*:{rawToken}
      let foundUserId: string | null = null;
      let foundRole: UserRole | null = null;
      let matchingKey: string | null = null;

      try {
        const keys = await redis.keys(`refresh:*:${rawToken}`);
        if (keys.length > 0) {
          matchingKey = keys[0];
          const parts = matchingKey.split(":");
          foundUserId = parts[1];
          const storedRole = await redis.get(matchingKey);
          foundRole = (storedRole as UserRole) || null;
        }
      } catch (redisErr) {
        // Fallback: decode user from db
      }

      if (!foundUserId) {
        reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid or expired refresh token",
        });
        throw new Error("Invalid or expired refresh token");
      }

      if (matchingKey) {
        try {
          await redis.del(matchingKey);
        } catch {
          // ignore
        }
      }

      const user = await prisma.user.findUnique({ where: { id: foundUserId } });
      if (!user) {
        reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "User no longer exists",
        });
        throw new Error("User no longer exists");
      }

      const role = (foundRole || user.role) as UserRole;
      const { accessToken } = await fastify.issueTokens(user.id, role, reply);
      return { accessToken };
    }
  );
}

export const jwtPlugin = fp(jwtPluginAsync, {
  name: "jwt-plugin",
});
