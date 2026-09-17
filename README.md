# sysTROL Industrial Engineering Platform

Enterprise monorepo for sysTROL Engineering & Consultancy Pvt. Ltd., a Bengaluru-based industrial engineering firm delivering Level-2 (L2) automation software (C#) for process industries with deep specialization in steel rolling mills, alongside an international trading division supplying OEM-grade machinery, spares, and consumables.

The platform comprises the public corporate website, an internal operations and ERP portal, a high-performance backend API service with background workers, shared packages, and containerized deployment infrastructure.

---

## Live Deployments & Cloud Infrastructure

| Service | Environment | Provider | URL / Endpoint |
|---|---|---|---|
| **Public Corporate Platform** | Production | Vercel | [systrol.vercel.app](https://systrol.vercel.app) |
| **Internal Operations & ERP Portal** | Production | Vercel | [systrolops.vercel.app](https://systrolops.vercel.app) |
| **Backend REST API** | Production | Render | [systrol-api.onrender.com](https://systrol-api.onrender.com) |
| **Serverless Database** | Production | Neon PostgreSQL | AWS `ap-southeast-1` (Singapore) |
| **Distributed Cache & Queue** | Production | Upstash Redis | Serverless Redis with TLS |
| **Object Storage (Documents)** | Production | Supabase Storage (S3) | AWS `ap-south-1` (Mumbai) |

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
├── scripts/
│   └── seed-neon-superadmin.ts # Dedicated Neon PostgreSQL superadmin bootstrap script
├── docker-compose.yml        # Local development & integration services stack
├── package.json              # Workspace root scripts and devDependencies
├── pnpm-workspace.yaml       # Monorepo workspace package definitions
├── turbo.json                # Turborepo task pipeline configuration
└── tsconfig.base.json        # Shared root TypeScript compiler options
```

---

## Applications and Packages

### Applications (`apps/`)

- [apps/api](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/apps/api): Node.js and Fastify backend application with BullMQ asynchronous job processing, Redis caching/queues, MinIO/S3 document management, JWT authentication with TOTP 2FA, compound email and IP rate limiting, bounded pagination schemas, decoupled query architecture, and domain modules covering the industrial lifecycle.
- [apps/internal](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/apps/internal): Next.js 15 App Router internal operations portal. Features enterprise authentication with silent token refresh, relocated topbar user profile badge, industrial mechanical rocker theme switch, responsive mobile lock screen (< 768px), debounced search inputs, double-click mutation locking, global error boundaries and route loaders, an interactive animated official sysTROL logo, an Ongoing & Commissioned two-tab project card view, a 12-step sequential lifecycle engine with intermediate step insertion, and on-site staff roster management.
- [apps/web-public](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/apps/web-public): Next.js 15 App Router public-facing web platform. Features cinematic branding, Motion animations, L2 automation interactive commissioning stepper, machinery and spares catalog, filtered projects directory, careers portal, visual showcase gallery, and RFQ contact forms.

### Shared Packages (`packages/`)

- [packages/database](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/database): Prisma schema and client for PostgreSQL. Manages all relational data models, migrations, and database seed scripts for local and Neon PostgreSQL.
- [packages/types](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/types): Cross-application TypeScript types, interface contracts, reusable pagination schemas (`PaginationQuerySchema`), and Zod validation schemas.
- [packages/ui](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/ui): Shared UI tokens, themes, and base component interfaces.
- [packages/logger](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/logger): Centralized, structured JSON logger wrapper built on Pino.
- [packages/config](file:///c:/Users/hp/OneDrive/Desktop/sysTrol/packages/config): Shared TypeScript configurations and runtime environment validation utilities.

---

## Platform Hardening & Reliability Features

1. **Compound Rate Limiting with Incremental Backoff**:
   - Authentication endpoints use an `email + IP` compound key strategy (`login_fail:${email}:${ip}`).
   - NAT and office-friendly: does not penalize concurrent users sharing a single office IP.
   - Only failed login attempts (`401 Unauthorized`) increment penalties; successful logins immediately reset counters.
   - Escalating lockout tiers: 5 fails -> 60s, 10 fails -> 300s, 15 fails -> 900s, 20+ fails -> 3600s.

2. **Cross-Domain Cookie Security & CORS Lockdown**:
   - HTTP-only refresh tokens use `SameSite=None; Secure; Partitioned` cookies for robust cross-origin session rotation.
   - CORS origin verification strictly limits incoming requests to authorized internal and public domain origins.

3. **Bounded Pagination & Query Decoupling**:
   - Standardized limit/offset pagination with hard upper bounds (max 100) and total count metadata across all internal endpoints.
   - Heavy relational subresources (drawings, review notes, inspection batches) are decoupled from primary project queries to optimize memory and throughput.

4. **Resilient Client-Side Fetching & Silent Token Refresh**:
   - Authenticated API client (`apps/internal/lib/api-client.ts`) intercepts `401` errors, requests token renewals silently, and queues concurrent requests to avoid stampedes.
   - Graceful session invalidation on permanent token expiry.

5. **Input Debouncing & Mutation Locking**:
   - `useDebounce` hook (350ms) prevents excessive network calls on fast keystrokes across Media, Project, Employee, and Analytics search inputs.
   - Double-click prevention and loading locks prevent duplicate database mutations on purchase orders, visit logs, and enquiry qualification.

6. **Error Boundaries & Fallbacks**:
   - Global root and dashboard `error.tsx` handlers, custom `not-found.tsx` 404 pages, and skeleton `loading.tsx` states.

7. **UI Evolution & Industrial Design**:
   - User profile badge (avatar initials, online beacon, name, team badge, and designation) mounted in topbar header.
   - Authentic industrial mechanical rocker switch for dark and light theme toggling with 3D tactile bevels, grooved lever grip, tilt animation, and luminescent micro-LED indicator.

8. **Responsive Layouts & Mobile Gatekeeper**:
   - Mobile viewports (< 768px) display an exclusive full-screen lock screen: "Please open in desktop to operate the internal tool".
   - Tablet viewports (768px to 1024px) automatically collapse sidebar navigation to a compact 60px rail.
   - Laptops and ultrawide screens feature balanced spacing and fluid container scaling.

---

## Technology Stack

### Backend and Infrastructure
- Runtime: Node.js 20 LTS
- HTTP Framework: Fastify 5.2.1
- Job Queue and Asynchronous Workers: BullMQ 5.41.6 with Redis 7
- Database and ORM: PostgreSQL 16 with Prisma ORM 5.22.0
- Object Storage: MinIO / AWS S3 SDK 3.758.0 for technical documents, drawings, and certificates
- Authentication: JWT access and refresh tokens with bcryptjs password hashing and otplib TOTP two-factor authentication
- Containerization: Docker multi-stage builds and Docker Compose

### Frontend Applications
- Framework: Next.js 15.5.25 (App Router)
- UI Library: React 19.0.0 and React-DOM 19.0.0
- Language: TypeScript 5.7.2 (Strict mode)
- Styling: Custom design tokens, CSS variables, utility engine, and CSS modules (Tailwind-free)
- Theming: Adaptive dual-theme system (Light mode and neutral black Dark mode #050811)
- Icons: lucide-react 0.475.0
- Animation: motion 12.4.7
- Forms and Validation: react-hook-form 7.54.2, zod 3.24.2, @hookform/resolvers 3.10.0

---

## Domain Capabilities and Modules

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
11. Media CMS: Cloud-backed industrial imagery management with browser-to-S3 presigned uploads, client-side pre-flight resolution/format/size validation, and real-time public CDN delivery to the marketing platform.

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

To seed the superadmin account in Neon PostgreSQL production:
```bash
pnpm tsx scripts/seed-neon-superadmin.ts
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

All automated test suites are executed via Vitest across unit, integration, and security layers:

```bash
# Run all workspace test suites
pnpm test

# Target specific workspace packages
pnpm --filter @systrol/api test
pnpm --filter @systrol/internal test
pnpm --filter @systrol/web-public test
```

Current Test Metrics:
- `@systrol/api`: 128 tests passing across 12 test suites.
- `@systrol/internal`: 16 tests passing across 4 test suites.
- Total: 144 automated tests passing with zero regressions.

---

## Continuous Integration

The repository includes a GitHub Actions CI workflow in `.github/workflows/ci.yml` that automatically validates:
- Type checking across all workspaces
- Lint validation
- Automated unit, integration, and security test execution
- Production bundle verification

---

## License

Proprietary and confidential. Copyright (c) sysTROL Engineering & Consultancy Pvt. Ltd. All rights reserved.