# @systrol/internal

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
