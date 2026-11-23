# @systrol/web-public

## 1.4.0

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

## 1.3.1

### Patch Changes

- da74795: Synchronize showcase projects with database, harden case study publishing, and ensure honest toast notifications.

## 1.3.0

### Minor Changes

- 6f0a512: Standardize Project Management with reusable TabGroup component and 3-tab lifecycle (Ongoing, Commissioned, Published). Mirror public website projects in internal ops with full case study data. Add PublishCaseStudyModal with 3-image upload, card thumbnail selection, challenge/solution fields, and custom KPI cards repeater. Add RBAC-governed publishing and unpublishing API endpoints with audit logging wrapped in atomic Prisma transactions. Remove PROJECTS category from Media CMS filter bar and upload modal to enforce domain isolation. Implement dynamic-first public website resolution with on-demand ISR revalidation, HTTP stale-while-revalidate caching headers, and resilient fail-open fallback.

## 1.2.1

### Patch Changes

- 3a4f716: Eliminate hover flicker across interactive UI elements and add arrow hover animation to hero projects button.

## 1.2.0

### Minor Changes

- 6a6e8d5: Optimize SEO, Core Web Vitals, and Lighthouse scores across all public routes with dynamic domain configuration, bot splash screen bypass, dedicated metadata layouts, canonical URLs, and structured JSON-LD schemas (JobPosting, BreadcrumbList, Article).

## 1.1.0

### Minor Changes

- 1376f1e: Add enterprise observability architecture including deep dependency health diagnostics, in-portal audit trail ledger with mutation diff inspection, synthetic uptime keep-alive monitoring, and development session resilience.
