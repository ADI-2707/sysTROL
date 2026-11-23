# @systrol/internal

## 2.10.2

### Patch Changes

- a965af6: Eliminate hardcoded analytics fallbacks, ensure strictly accurate calculations, and introduce reusable shimmering skeleton loaders across internal operations dashboards.
- Updated dependencies [a965af6]
  - @systrol/ui@0.3.1

## 2.10.1

### Patch Changes

- da74795: Synchronize showcase projects with database, harden case study publishing, and ensure honest toast notifications.

## 2.10.0

### Minor Changes

- 9ee18c4: Introduce shared `@systrol/ui` package with core primitives, custom bottom-right bouncy toast notification engine with real-time progress bar, and 60-30-10 light/dark theme harmonization.

### Patch Changes

- Updated dependencies [9ee18c4]
  - @systrol/ui@0.3.0

## 2.9.2

### Patch Changes

- 839c000: Remove decorative SVG icons from page headings across all portal views for clean typography, and eliminate the sidebar logout button animation flash by unifying the logout button into a single persistent DOM element with fluid CSS overflow transitions.

## 2.9.1

### Patch Changes

- 4cd7a22: Add universal media URL resolver with graceful onError image fallback. Bundle static project case study images in internal ops public directory for self-contained hosting on Vercel, preventing 404 image errors on project cards.

## 2.9.0

### Minor Changes

- 6f0a512: Standardize Project Management with reusable TabGroup component and 3-tab lifecycle (Ongoing, Commissioned, Published). Mirror public website projects in internal ops with full case study data. Add PublishCaseStudyModal with 3-image upload, card thumbnail selection, challenge/solution fields, and custom KPI cards repeater. Add RBAC-governed publishing and unpublishing API endpoints with audit logging wrapped in atomic Prisma transactions. Remove PROJECTS category from Media CMS filter bar and upload modal to enforce domain isolation. Implement dynamic-first public website resolution with on-demand ISR revalidation, HTTP stale-while-revalidate caching headers, and resilient fail-open fallback.

### Patch Changes

- Updated dependencies [6f0a512]
  - @systrol/types@0.3.0

## 2.8.2

### Patch Changes

- 86ba1d3: Standardize top spacing across internal ops portal pages by removing redundant page container padding on Analytics, CTA Inquiries, and Media CMS, and normalizing loading skeleton and fallback padding to align all views with the canonical 24px layout baseline.

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

## 2.7.2

### Patch Changes

- b08d906: Make logout endpoint resilient, idempotent, and unblocked by expired JWTs, while ensuring client passes authorization header gracefully and cookies are always cleared.

## 2.7.1

### Patch Changes

- 2feaea2: Implement resilient authentication session lifecycle with 15-second atomic token rotation grace period, in-flight silent refresh mutex deduplication, dashboard hydration lock, and secure bcrypt credential verification.

## 2.7.0

### Minor Changes

- ddb3b0e: Implement industry-standard authentication, O(1) Upstash Redis session key architecture, atomic token rotation, native cookie-forwarding Next.js BFF proxy, and resilient session lifecycle preventing false logouts on page refresh.

## 2.6.3

### Patch Changes

- e693df9: Redesign internal operations login portal with coherent two-side lockup, enlarged sysTROL logo, subtle engineering blueprint grid with brand ambient gradients, synchronized pop-reveal micro-animation, permanent light mode, and UI interaction locking during authentication.

## 2.6.2

### Patch Changes

- f281d8b: Implement visibility-aware polling to pause background requests on inactive tabs, 401 circuit breaker to prevent zombie polling, and proactive token refresh scheduling before JWT expiration.

## 2.6.1

### Patch Changes

- 9b03f72: Implement in-memory token management, HttpOnly cookie-based silent refresh, sanitized local storage session persistence, and session expiration callback on dashboard keep-alive probe.

## 2.6.0

### Minor Changes

- 3f85aa2: Implement dual-channel audit ledger system with dedicated internal operations governance and public web telemetry tabs, zero-overhead in-memory latency monitoring with p95 and p99 percentiles, and project creation and commissioning step mutation audit tracking.

### Patch Changes

- Updated dependencies [3f85aa2]
  - @systrol/types@0.1.1

## 2.5.0

### Minor Changes

- 1376f1e: Add enterprise observability architecture including deep dependency health diagnostics, in-portal audit trail ledger with mutation diff inspection, synthetic uptime keep-alive monitoring, and development session resilience.
