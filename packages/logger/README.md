# @systrol/logger

Centralized structured logging package for the sysTROL Industrial Engineering Platform.

Built on Pino for high-performance JSON logging in production and readable formatting during local development.

---

## Architectural Overview

- Engine: Pino 9.6.0
- Development Mode: Uses `pino-pretty` for colorized, timestamped console output
- Production Mode: High-throughput, asynchronous JSON streams with contextual metadata (`service`, timestamps, log levels)

---

## Directory Structure

```
packages/logger/
├── src/
│   └── index.ts                      # Logger factory function (createLogger) and Logger type
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json
```

---

## Usage Example

```typescript
import { createLogger } from "@systrol/logger";

const log = createLogger("api-server");

log.info({ port: 4000 }, "Fastify API server started successfully");
log.error({ err, userId: "u-123" }, "Failed to process transaction");
```

---

## Scripts

```bash
# Type-check logger package
pnpm --filter @systrol/logger typecheck
```
