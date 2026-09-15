# @systrol/types

Shared TypeScript type definitions, enums, interfaces, and Zod validation schemas for the sysTROL Industrial Engineering Platform.

Ensures end-to-end type safety across the Fastify API backend (`@systrol/api`), internal ERP dashboard (`@systrol/internal`), and public web portal (`@systrol/web-public`).

---

## Architectural Overview

The package acts as the single source of truth for domain data contracts and input validation:

- Runtime Validation: Zod schemas (`zod`) ensuring runtime payload validation at API request boundaries and frontend form submissions.
- Static Typing: TypeScript interfaces and type aliases exported for API responses, UI component props, and state stores.
- Strict Type Consistency: Zero drift between frontend forms and backend REST controllers.

---

## Directory Structure

```
packages/types/
├── src/
│   ├── amc.ts                        # AMC contract types and revenue forecast models
│   ├── analytics.ts                  # Telemetry matrix, dwell times, aging, funnel metrics
│   ├── auth.ts                       # Login, token payload, user session, and 2FA types
│   ├── careers.ts                    # Job posting and applicant intake data contracts
│   ├── commissioning.ts              # Commissioning DAG nodes, dependencies, and sign-offs
│   ├── dispatch.ts                   # Shipment manifests, packing lists, and logistics DTOs
│   ├── engineering.ts                # Engineering documents, drawing metadata, and BOQ items
│   ├── enquiries.ts                  # Customer RFQs, qualification states, and technical params
│   ├── finance.ts                    # Milestone invoices, retention records, payment states
│   ├── lifecycle.ts                  # 14-stage industrial lifecycle enums and transitions
│   ├── manufacturing.ts              # Production batches, inspection stages, FAT records
│   ├── procurement.ts                # Purchase orders, vendor types, and receipt items
│   ├── trials.ts                     # Cold/hot trials, PG test logs, and MOM handovers
│   └── index.ts                      # Barrel export for all types and schemas
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json
```

---

## Usage Example

Import types or validation schemas into any workspace application:

```typescript
import {
  type CommissioningStepDto,
  type ProjectTelemetryMatrix,
  CreateEnquirySchema,
  LifecycleStage
} from "@systrol/types";

// Validate payload with Zod schema
const result = CreateEnquirySchema.safeParse(req.body);
if (!result.success) {
  throw new ValidationError(result.error);
}
```

---

## Scripts

```bash
# Type-check type definitions
pnpm --filter @systrol/types typecheck
```
