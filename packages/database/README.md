# @systrol/database

Relational database package for the sysTROL Industrial Engineering Platform.

Manages the PostgreSQL schema, Prisma ORM generation, migrations, and database seed scripts for both transactional workloads and operational analytics.

---

## Architectural Overview

- Local Engine: PostgreSQL 16 (Docker Compose)
- Cloud Production Engine: Neon Serverless PostgreSQL (`ap-southeast-1` AWS Singapore)
- ORM: Prisma 5.22.0
- Schema: `prisma/schema.prisma`
- Connection: Managed via `DATABASE_URL` environment variable (with connection pooling)

The database models map directly to the 14-stage industrial execution lifecycle:
`ENQUIRY` -> `SALES_VISIT` -> `PROCUREMENT` -> `ENGINEERING` -> `MANUFACTURING` -> `DISPATCH` -> `ERECTION` -> `COMMISSIONING` -> `COLD_TRIAL` -> `HOT_TRIAL` -> `PERFORMANCE_GUARANTEE_TEST` -> `MOM_AND_HANDOVER` -> `PAYMENT` -> `AMC`.

---

## Directory Structure

```
packages/database/
├── prisma/
│   ├── migrations/                   # Sequential SQL migration files
│   └── schema.prisma                 # Core Prisma domain schema definition
├── src/
│   ├── index.ts                      # Instantiated PrismaClient singleton export
│   └── seed.ts                       # Test and development database seeding script
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json
```

---

## Domain Data Models

Key entities declared in `schema.prisma`:

- `User`: Platform accounts with role-based access control (`UserRole`: `SUPER_ADMIN`, `SALES_EXEC`, `PROCUREMENT_MANAGER`, `COMMISSIONING_LEAD`, `FIELD_ENGINEER`, `FINANCE_MANAGER`, `HR_RECRUITER`, `METALLURGY_SPECIALIST`, `CLIENT_AUDITOR`) and TOTP two-factor secrets.
- `Project`: Core industrial project entity tracking client, plant location, capacity, commissioning target date, and current `LifecycleStage`.
- `SalesVisit`: Field mill visit reports, plant attendees, discussion logs, and action items.
- `Enquiry`: Customer RFQ records, source channels, metallurgical technical parameters, and qualification status.
- `Boq` and `BoqItem`: Multi-revision Bill of Quantities items with component specifications, unit prices, and quantities.
- `PurchaseOrder` and `PoItem`: Vendor orders, tracking numbers, line-item quantities, and delivery milestones.
- `Batch` and `BatchStage`: Manufacturing production batches, inspection checklists, and sign-offs.
- `Shipment`: Consignment manifests, packing list references, and dispatch gate passes.
- `CommissioningStep` and `StepDependency`: Directed Acyclic Graph (DAG) nodes and dependencies enforcing linear milestone clearance before site sign-off.
- `TrialRun` and `PgTest`: Cold trial, hot trial, and Performance Guarantee test logs with parameter measurements.
- `MomDocument`: Minutes of Meeting signoff documents for plant handover.
- `Invoice`: Milestone billing invoices (`ADVANCE`, `DISPATCH`, `ERECTION`, `COMMISSIONING`, `PERFORMANCE_GUARANTEE`, `RETENTION`, `AMC_RENEWAL`).
- `RetentionLedger`: Retention fund tracking, bank guarantee records, and scheduled maturity dates.
- `AmcContract`: Post-commissioning Annual Maintenance Contracts with recurring renewal schedules.
- `JobPosting` and `JobApplication`: Recruitment and applicant tracking system models.

---

## Development Scripts

```bash
# Generate Prisma client artifacts
pnpm --filter @systrol/database generate

# Apply pending migrations to the local or remote database
pnpm --filter @systrol/database migrate:deploy

# Create and apply new migration during development
pnpm --filter @systrol/database migrate:dev

# Seed database with development records
pnpm --filter @systrol/database seed

# Open visual Prisma Studio database browser
pnpm --filter @systrol/database studio
```

---

## Usage in Applications

The package exports an instantiated Prisma client singleton:

```typescript
import { db } from "@systrol/database";

// Query active projects
const activeProjects = await db.project.findMany({
  where: { currentStage: "COMMISSIONING" },
  include: { commissioningSteps: true }
});
```
