---
"@systrol/logger": minor
"@systrol/database": minor
"@systrol/types": minor
"@systrol/api": minor
"@systrol/internal": minor
"@systrol/web-public": minor
---

Implement industry-standard enterprise logging, compliance audit trails, and privacy-preserving telemetry architecture.

### Key Enhancements

- **@systrol/logger**:
  - Dynamic log levels controlled via `LOG_LEVEL` environment variable.
  - Standard ISO 8601 UTC timestamps for log aggregation.
  - Automatic PII and credential redaction across tokens, passwords, secrets, cookies, and authorization headers.

- **@systrol/database**:
  - Added unique `employeeCode` to `User` model for deterministic identity attribution.
  - Expanded `AuditLog` schema with compliance fields: `requestId`, `userId`, `user` relation, `employeeCode`, `actorRole`, `clientIp`, `userAgent`, `httpMethod`, `endpoint`, and `statusCode`.
  - Added high-performance compound indexes for audit filtering.

- **@systrol/types**:
  - Updated `JWTPayload` and `UserSummary` to propagate `employeeCode`.

- **@systrol/api**:
  - Fastify server structured HTTP access logging integrated with Pino.
  - Trusted proxy IP extraction (`trustProxy: true`).
  - Correlation tracking via `x-request-id` propagated to child request loggers.
  - Pre-mutation state capture and post-mutation field-level diffing in audit interceptor.
  - Security and authorization failure auditing for 401/403 and login attempts.
  - Global error handler logging correlation context and sanitized error stacks.

- **@systrol/internal**:
  - Removed mock diagnostics from latency monitor banner with genuine outage detection.
  - Audit log table displaying employee attribution `[employeeCode] Name`, HTTP status pills, and client IPs.
  - Visual field-level diff drawer displaying modified properties and state transitions.
  - Client runtime crash reporting via root error boundary.

- **@systrol/web-public**:
  - Privacy-compliant visitor IP tracking using salted HMAC-SHA256 hashing.
  - Correlation `x-request-id` header injection on attribution and telemetry events.
  - Structured client error reporting in error boundary.
