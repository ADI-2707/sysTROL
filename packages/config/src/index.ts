import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default("900"),
  JWT_REFRESH_TTL: z.string().default("604800"),
  S3_ENDPOINT: z.string().url(),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_REGION: z.string().default("us-east-1"),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  INTERNAL_APP_URL: z.string().url(),
  PUBLIC_APP_URL: z.string().url(),
  TOTP_ISSUER: z.string().default("sysTROL"),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
