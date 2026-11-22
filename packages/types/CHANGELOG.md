# @systrol/types

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

## 0.1.1

### Patch Changes

- 3f85aa2: Implement dual-channel audit ledger system with dedicated internal operations governance and public web telemetry tabs, zero-overhead in-memory latency monitoring with p95 and p99 percentiles, and project creation and commissioning step mutation audit tracking.
