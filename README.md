# sysTROL Industrial Engineering Platform

Enterprise monorepo for sysTROL Engineering & Consultancy Pvt. Ltd., a Bengaluru-based industrial engineering firm delivering Level-2 (L2) automation software (C#) for process industries with deep specialization in steel rolling mills, alongside an international trading division supplying OEM-grade machinery, spares, and consumables.

The platform comprises the public corporate website, an internal operations and ERP portal, a high-performance backend API service with background workers, shared packages, and containerized deployment infrastructure.

---

## Monorepo Architecture

The repository is organized as a Turborepo monorepo powered by pnpm workspaces:

```
sysTrol/
├── apps/
│   ├── api/                  # Fastify backend service, BullMQ worker, REST endpoints
│   ├── internal/             # Next.js 15 enterprise internal operations & ERP portal
│   └── web-public/           # Next.js 15 public corporate & engineering web platform
├── packages/
│   ├── config/               # Shared TypeScript and tooling configurations
│   ├── database/             # Prisma ORM schema, PostgreSQL migrations, and seed scripts
│   ├── logger/               # Centralized structured logging with Pino
│   ├── types/                # Shared TypeScript types, enums, and Zod schemas
│   └── ui/                   # Shared UI primitives, design tokens, and theme definitions
├── docker/
│   ├── Dockerfile.api        # Multi-stage production container build for API
│   ├── Dockerfile.internal   # Multi-stage production container build for Internal Web
│   └── README.md             # Docker infrastructure guide
├── .github/
│   └── workflows/ci.yml      # GitHub Actions CI workflow (lint, test, build, docker)
├── docker-compose.yml        # Local development & integration services stack
├── package.json              # Workspace root scripts and devDependencies
├── pnpm-workspace.yaml       # Monorepo workspace package definitions
├── turbo.json                # Turborepo task pipeline configuration
└── tsconfig.base.json        # Shared root TypeScript compiler options
```

---

## Applications and Packages

### Applications (`apps/`)

- [apps/api](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/apps/api): Node.js and Fastify backend application with BullMQ asynchronous job processing, Redis caching/queues, MinIO/S3 document management, JWT authentication with TOTP 2FA, and domain modules covering the industrial lifecycle.
- [apps/internal](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/apps/internal): Next.js 15 App Router internal management portal. Includes responsive dual-theme system (dark mode neutral black and light mode), collapsible icon-rail navigation with tooltips, top progress bar, standardized Button, Badge, and KpiCard components, and dedicated dashboards for all operational departments.
- [apps/web-public](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/apps/web-public): Next.js 15 App Router public-facing web platform. Features cinematic branding, Motion animations, L2 automation interactive commissioning stepper, machinery and spares catalog, filtered projects directory, careers portal, visual showcase gallery, and RFQ contact forms.

### Shared Packages (`packages/`)

- [packages/database](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/database): Prisma schema and client for PostgreSQL. Manages all relational data models, migrations, and database seed scripts.
- [packages/types](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/types): Cross-application TypeScript types, interface contracts, and Zod validation schemas.
- [packages/ui](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/ui): Shared UI tokens, themes, and base component interfaces.
- [packages/logger](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/logger): Centralized, structured JSON logger wrapper built on Pino.
- [packages/config](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/config): Shared TypeScript configurations and shared runtime config utilities.

---

## Technology Stack

### Backend and Infrastructure
- Runtime: Node.js 20 LTS
- HTTP Framework: Fastify 5.2.1
- Job Queue and Asynchronous Workers: BullMQ 5.41.6 with Redis 7
- Database and ORM: PostgreSQL 16 with Prisma ORM 5.22.0
- Object Storage: MinIO / AWS S3 SDK 3.758.0 for technical documents, drawings, and certificates
- Authentication: JWT access/refresh tokens with bcryptjs password hashing and otplib TOTP two-factor authentication
- Containerization: Docker multi-stage builds and Docker Compose

### Frontend Applications
- Framework: Next.js 15.2.0 (App Router)
- UI Library: React 19.0.0 and React-DOM 19.0.0
- Language: TypeScript 5.7.2 (Strict mode)
- Styling: Custom design tokens, CSS variables, utility engine, and CSS modules (Tailwind-free)
- Theming: Adaptive dual-theme system (Light mode and soothing neutral black Dark mode #050811)
- Icons: lucide-react 0.475.0
- Animation: motion 12.4.7
- Forms and Validation: react-hook-form 7.54.2, zod 3.24.2, @hookform/resolvers 3.10.0

---

## Domain Capabilities and Modules

The platform implements an end-to-end industrial execution and management pipeline:

1. Sales and Enquiries: Lead tracking, client visit logs with GPS coordinates, technical enquiries, and preliminary feasibility review.
2. Engineering and BOQ: Design reviews, engineering document vault (drawings, schematics, manuals), Bill of Quantities (BOQ) with multi-revision support.
3. Procurement: Vendor management, purchase orders (PO), line item tracking, and material inspection status.
4. Manufacturing and Batches: Production batch tracking, quality checkpoints, stage sign-offs, and FAT (Factory Acceptance Test) records.
5. Dispatch and Logistics: Shipment dispatch manifests, carrier details, packaging lists, and gate pass tracking.
6. Commissioning DAG Engine: Directed Acyclic Graph (DAG) dependency engine enforcing topological execution order of commissioning steps, cycle detection, and step sign-offs.
7. Post-Commissioning and Trials: Performance Guarantee (PG) test records, trial runs telemetry, Minutes of Meeting (MOM) customer signoffs, and project handover.
8. Finance and Retention: Commercial milestones, milestone billing invoices, retention money management, and Annual Maintenance Contracts (AMC) forecasting.
9. Executive Analytics: Stage dwell time analysis, sales-to-commissioning funnel conversion, procurement aging telemetry, and recurring AMC forecast matrices.
10. Careers Administration: Public job listings management, job application intake, candidate resume storage, and status pipelines.

---

## Design System and Theming

The platform implements an industrial design language matching sysTROL corporate identity:

### Color System
- Brand Primary: sys Navy (`#16375B`)
- Brand Accent: TROL Green (`#1F7A4D`, `#166339`, `#22C55E`)
- Dark Theme Background: Neutral Black (`#050811`)
- Dark Theme Surface: Slate-900 / Slate-800 (`#0A0F1D`, `#111827`, `#0F172A`)
- Light Theme Background: Crisp Surface (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`)
- Accent Teal: Technical highlight (`#0EA5A5`, `#0B8686`)
- Status Colors: Success Green, Warning Amber, Destructive Red, Info Sky Blue

### Typography
- Headings: Space Grotesk
- Body: Inter
- Telemetry and Code: JetBrains Mono

---

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- pnpm 9.15.x or higher
- Docker and Docker Compose

### Clone and Installation
```bash
git clone https://github.com/ADI-2707/sysTrol.git
cd sysTrol
pnpm install
```

### Environment Configuration
Copy the sample environment file to `.env`:
```bash
cp .env.example .env
```
Ensure database credentials, Redis URL, JWT secrets, and S3/MinIO configurations are populated.

### Start Supporting Services (Docker)
Start PostgreSQL, Redis, and MinIO locally:
```bash
docker compose up -d postgres redis minio
```

### Database Setup
Generate Prisma client and run database migrations:
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### Running in Development
Start all applications concurrently via Turborepo:
```bash
pnpm dev
```

Default application ports:
- Public Web Portal: http://localhost:3000
- Internal ERP Portal: http://localhost:3001
- API Backend Service: http://localhost:4000
- MinIO Object Storage Console: http://localhost:9001 (Credentials: minioadmin / minioadminpassword)
- PostgreSQL Database: localhost:5432

---

## Monorepo Scripts

The root `package.json` provides scripts orchestrated by Turborepo:

| Script | Purpose |
|---|---|
| `pnpm dev` | Run all applications and workers in development mode concurrently |
| `pnpm build` | Build all applications and packages |
| `pnpm test` | Run test suites across all apps and packages |
| `pnpm typecheck` | Run TypeScript type checks across all projects |
| `pnpm lint` | Run ESLint across all projects |
| `pnpm format` | Format files with Prettier |
| `pnpm db:generate` | Generate Prisma client in `@systrol/database` |
| `pnpm db:migrate` | Deploy migrations against target PostgreSQL database |
| `pnpm db:seed` | Populate the database with development seed data |

---

## Testing Strategy

- Unit and Integration Tests: Executed with Vitest across API routes, commissioning DAG engine, trials calculations, and UI components.
- Automated Tests Execution:
  ```bash
  pnpm test
  ```
- Target specific workspace package tests:
  ```bash
  pnpm --filter @systrol/api test
  pnpm --filter @systrol/web-public test
  ```

---

## Continuous Integration

The repository includes a GitHub Actions CI workflow in `.github/workflows/ci.yml` that automatically runs on pull requests and pushes to `main`:
- Type checking across all workspaces
- Lint validation
- Automated unit and integration test execution
- Production container build validation for API and internal applications

---

## License

Proprietary and confidential. Copyright (c) sysTROL Engineering & Consultancy Pvt. Ltd. All rights reserved.