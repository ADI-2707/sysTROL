# @systrol/api

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
