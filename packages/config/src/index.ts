import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/systrol"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  JWT_SECRET: z.string().min(32).default("super-secret-jwt-key-for-systrol-development-2026-min32"),
  JWT_REFRESH_SECRET: z.string().min(32).default("super-secret-jwt-refresh-key-for-systrol-development-2026-min32"),
  JWT_ACCESS_TTL: z.string().default("900"),
  JWT_REFRESH_TTL: z.string().default("604800"),
  S3_ENDPOINT: z.string().default("http://localhost:9000"),
  S3_BUCKET: z.string().default("systrol-documents"),
  S3_ACCESS_KEY: z.string().default("minioadmin"),
  S3_SECRET_KEY: z.string().default("minioadmin"),
  S3_REGION: z.string().default("us-east-1"),
  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.string().default("1025"),
  SMTP_USER: z.string().default("test"),
  SMTP_PASS: z.string().default("test"),
  INTERNAL_APP_URL: z.string().default("http://localhost:3001"),
  PUBLIC_APP_URL: z.string().default("http://localhost:3000"),
  TOTP_ISSUER: z.string().default("sysTROL"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
