# @systrol/api

## 2.9.2

### Patch Changes

- a965af6: Eliminate hardcoded analytics fallbacks, ensure strictly accurate calculations, and introduce reusable shimmering skeleton loaders across internal operations dashboards.

## 2.9.1

### Patch Changes

- da74795: Synchronize showcase projects with database, harden case study publishing, and ensure honest toast notifications.
- Updated dependencies [da74795]
  - @systrol/database@0.3.1

## 2.9.0

### Minor Changes

- 6f0a512: Standardize Project Management with reusable TabGroup component and 3-tab lifecycle (Ongoing, Commissioned, Published). Mirror public website projects in internal ops with full case study data. Add PublishCaseStudyModal with 3-image upload, card thumbnail selection, challenge/solution fields, and custom KPI cards repeater. Add RBAC-governed publishing and unpublishing API endpoints with audit logging wrapped in atomic Prisma transactions. Remove PROJECTS category from Media CMS filter bar and upload modal to enforce domain isolation. Implement dynamic-first public website resolution with on-demand ISR revalidation, HTTP stale-while-revalidate caching headers, and resilient fail-open fallback.

### Patch Changes

- Updated dependencies [6f0a512]
  - @systrol/types@0.3.0
  - @systrol/database@0.3.0

## 2.8.1

### Patch Changes

- 0768fd8: Fix foreign key constraint violation on project log week creation by auto-provisioning missing project database records, synchronizing client project creation directly with the backend API, and preserving strict multi-project daily log isolation.

## 2.8.0

### Minor Changes

- 1b86dfc: Add Project Log feature to the sysTROL Project Management system:

  - Introduces day-wise, week-grouped chronological project logs on `/projects/[id]` under a dedicated tab.
  - Two-tab navigation separating "Lifecycle Steps" (with log count badges and completion attribution) from "Project Log".
  - Strict Anti-Backfilling enforcement: restricts new entries to the active week (Monday through Today) with both server-side and client-side guards.
  - Security character limit safeguards preventing database bloat and DoS: 10 to 3,000 characters for content, 800 for blockers, 500 for next steps, and max 5 attachments.
  - Automated weekly lifecycle lock via BullMQ cron job every Sunday at midnight UTC, with weekly email digest delivery.
  - Comprehensive test suite additions covering Zod schema validation, ISO week resolution, service atomic upsert, RBAC permissions, and frontend component workflows.

### Patch Changes

- Updated dependencies [1b86dfc]
  - @systrol/types@0.2.0
  - @systrol/database@0.2.0

## 2.7.3

### Patch Changes

- b08d906: Make logout endpoint resilient, idempotent, and unblocked by expired JWTs, while ensuring client passes authorization header gracefully and cookies are always cleared.

## 2.7.2

### Patch Changes

- 58ca9e2: Implement transparent auto-upgrade from legacy SHA-256 to bcrypt on login and update database seed scripts with bcrypt hashing.
- Updated dependencies [58ca9e2]
  - @systrol/database@0.1.2

## 2.7.1

### Patch Changes

- 2feaea2: Implement resilient authentication session lifecycle with 15-second atomic token rotation grace period, in-flight silent refresh mutex deduplication, dashboard hydration lock, and secure bcrypt credential verification.

## 2.7.0

### Minor Changes

- ddb3b0e: Implement industry-standard authentication, O(1) Upstash Redis session key architecture, atomic token rotation, native cookie-forwarding Next.js BFF proxy, and resilient session lifecycle preventing false logouts on page refresh.

### Patch Changes

- Updated dependencies [ddb3b0e]
  - @systrol/database@0.1.1

## 2.6.0

### Minor Changes

- 3f85aa2: Implement dual-channel audit ledger system with dedicated internal operations governance and public web telemetry tabs, zero-overhead in-memory latency monitoring with p95 and p99 percentiles, and project creation and commissioning step mutation audit tracking.

### Patch Changes

- Updated dependencies [3f85aa2]
  - @systrol/types@0.1.1

## 2.5.0

### Minor Changes

- 1376f1e: Add enterprise observability architecture including deep dependency health diagnostics, in-portal audit trail ledger with mutation diff inspection, synthetic uptime keep-alive monitoring, and development session resilience.

### Patch Changes

- Updated dependencies [1376f1e]
  - @systrol/config@0.1.1
  - @systrol/logger@0.1.1
