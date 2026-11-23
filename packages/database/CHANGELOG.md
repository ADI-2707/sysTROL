# @systrol/database

## 0.4.0

### Minor Changes

- 187a7cd: Implement industry-standard enterprise logging, compliance audit trails, and privacy-preserving telemetry architecture.

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

## 0.3.1

### Patch Changes

- da74795: Synchronize showcase projects with database, harden case study publishing, and ensure honest toast notifications.

## 0.3.0

### Minor Changes

- 6f0a512: Standardize Project Management with reusable TabGroup component and 3-tab lifecycle (Ongoing, Commissioned, Published). Mirror public website projects in internal ops with full case study data. Add PublishCaseStudyModal with 3-image upload, card thumbnail selection, challenge/solution fields, and custom KPI cards repeater. Add RBAC-governed publishing and unpublishing API endpoints with audit logging wrapped in atomic Prisma transactions. Remove PROJECTS category from Media CMS filter bar and upload modal to enforce domain isolation. Implement dynamic-first public website resolution with on-demand ISR revalidation, HTTP stale-while-revalidate caching headers, and resilient fail-open fallback.

## 0.2.0

### Minor Changes

- 1b86dfc: Add Project Log feature to the sysTROL Project Management system:

  - Introduces day-wise, week-grouped chronological project logs on `/projects/[id]` under a dedicated tab.
  - Two-tab navigation separating "Lifecycle Steps" (with log count badges and completion attribution) from "Project Log".
  - Strict Anti-Backfilling enforcement: restricts new entries to the active week (Monday through Today) with both server-side and client-side guards.
  - Security character limit safeguards preventing database bloat and DoS: 10 to 3,000 characters for content, 800 for blockers, 500 for next steps, and max 5 attachments.
  - Automated weekly lifecycle lock via BullMQ cron job every Sunday at midnight UTC, with weekly email digest delivery.
  - Comprehensive test suite additions covering Zod schema validation, ISO week resolution, service atomic upsert, RBAC permissions, and frontend component workflows.

## 0.1.2

### Patch Changes

- 58ca9e2: Implement transparent auto-upgrade from legacy SHA-256 to bcrypt on login and update database seed scripts with bcrypt hashing.

## 0.1.1

### Patch Changes

- ddb3b0e: Implement industry-standard authentication, O(1) Upstash Redis session key architecture, atomic token rotation, native cookie-forwarding Next.js BFF proxy, and resilient session lifecycle preventing false logouts on page refresh.
