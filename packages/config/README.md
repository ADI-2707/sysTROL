# @systrol/config

Environment variable parsing and centralized configuration package for the sysTROL Industrial Engineering Platform.

Validates application configurations at boot using Zod to prevent misconfigured runtime crashes.

---

## Architectural Overview

- Validation: Zod schema parsing process environment variables (`process.env`)
- Fail-Safe Defaults: Provides safe local defaults for local development services (Postgres, Redis, MinIO, MailHog)
- Type Safety: Exports inferred `Env` type definition for cross-workspace usage

---

## Directory Structure

```
packages/config/
├── src/
│   └── index.ts                      # Zod envSchema, Env type, and parsed env export
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json
```

---

## Environment Schema

| Variable | Type / Constraints | Default Value |
|---|---|---|
| `NODE_ENV` | `development \| production \| test` | `development` |
| `PORT` | String port number | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/systrol` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | String (min 32 characters) | Development test secret |
| `JWT_REFRESH_SECRET` | String (min 32 characters) | Development test refresh secret |
| `JWT_ACCESS_TTL` | String seconds | `900` (15m) |
| `JWT_REFRESH_TTL` | String seconds | `604800` (7d) |
| `S3_ENDPOINT` | URL | `http://localhost:9000` |
| `S3_BUCKET` | S3 bucket name | `systrol-documents` |
| `S3_ACCESS_KEY` | Storage access key | `minioadmin` |
| `S3_SECRET_KEY` | Storage secret key | `minioadmin` |
| `S3_REGION` | S3 region | `us-east-1` |
| `INTERNAL_APP_URL` | Internal ERP URL | `http://localhost:3001` |
| `PUBLIC_APP_URL` | Public Website URL | `http://localhost:3000` |
| `TOTP_ISSUER` | TOTP authenticator label | `sysTROL` |

---

## Usage Example

```typescript
import { env } from "@systrol/config";

console.log(`Application started in ${env.NODE_ENV} mode on port ${env.PORT}`);
```

---

## Scripts

```bash
# Type-check configuration package
pnpm --filter @systrol/config typecheck
```
