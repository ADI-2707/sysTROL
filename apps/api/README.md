# @systrol/api

Backend REST API service and background worker engine for the sysTROL Industrial Engineering Platform.

Built with Fastify, TypeScript, Prisma ORM, PostgreSQL, Redis, BullMQ, and MinIO/S3 object storage.

---

## Live Production Deployment

- **Service URL**: [https://systrol-api.onrender.com](https://systrol-api.onrender.com)
- **Hosting Platform**: Render (Web Service)
- **Monorepo Build Command**: `pnpm install --frozen-lockfile && pnpm --filter @systrol/database generate && pnpm --filter @systrol/api build`
- **Start Command**: `node apps/api/dist/server.js`
- **Cloud Database**: Neon PostgreSQL (Serverless, Singapore `ap-southeast-1`)
- **Cloud Cache / Queue**: Upstash Redis (TLS)
- **Cloud Storage**: Supabase Storage (S3-compatible bucket, Mumbai `ap-south-1`)

---

## Architectural Overview

The API application is structured as a modular monolith providing high-throughput REST endpoints and asynchronous worker queues:

- Framework: Fastify 5.2.1
- Language: TypeScript 5.7.2 (ESM)
- Database Layer: PostgreSQL 16 managed via Prisma ORM (`@systrol/database`)
- Job Processing: BullMQ 5.41.6 backed by Redis 7
- File Storage: S3-compatible object storage (MinIO in development, Supabase/AWS S3 in production) via `@aws-sdk/client-s3`
- Authentication & Security Architecture:
  - Fastify JWT (`@fastify/jwt`) with access and refresh token rotation
  - Password hashing with `bcryptjs`
  - Two-factor authentication (TOTP) using `otplib` and QR code generation
  - Partitioned, HTTP-only, `SameSite=None; Secure` refresh cookies for resilient cross-domain auth
  - Compound Rate Limiting (`login_fail:${email}:${ip}`) preventing office/NAT false positives while penalizing brute-force attacks with progressive backoff tiers (5 fails -> 60s, 10 fails -> 300s, 15 fails -> 900s, 20+ fails -> 3600s)
  - CORS origin verification strictly locking down allowed frontend origins
- Query Scalability & Pagination:
  - Standardized bounded pagination schemas (`PaginationQuerySchema` with max 100 limit cap and offset support)
  - Total count and pagination metadata returned across all internal list queries
  - Decoupled relational queries for complex project subresources (drawings, BOQ, review notes) to prevent memory bottlenecks
- Validation: Zod schemas (`@systrol/types`)

---

## Directory Structure

```
apps/api/
├── src/
│   ├── common/                       # Shared plugins, middleware, errors, and utils
│   │   ├── auth/                     # Rate limiting, compound lockout strategies, JWT plugin
│   │   ├── config.ts                 # Environment validation and typed configurations
│   │   ├── errors.ts                 # Custom HTTP exception hierarchy
│   │   ├── plugins/                  # Fastify plugins (auth, db, redis, s3, cors, ratelimit)
│   │   └── utils/                    # Password hashing, tokens, pagination helpers
│   ├── modules/                      # Business domain modules
│   │   ├── analytics/                # Dwell time metrics, stage aging, conversion funnel, AMC forecast
│   │   ├── auth/                     # Login, register, refresh tokens, TOTP 2FA setup & verify
│   │   ├── careers/                  # Job postings and candidate application ingestion
│   │   ├── commissioning/            # Commissioning DAG execution engine, dependency graphs
│   │   ├── dispatch/                 # Shipment packing lists, carrier manifests, gate passes
│   │   ├── engineering/              # Design reviews, document vault, BOQ revisions
│   │   ├── enquiries/                # Customer RFQs, technical feasibility analysis
│   │   ├── finance/                  # Milestone billing, invoices, retention ledger, AMC contracts
│   │   ├── lifecycle/                # Global project lifecycle state transitions
│   │   ├── manufacturing/            # Production batches, stage sign-offs, FAT reports
│   │   ├── procurement/              # Purchase orders, vendor tracking, line items
│   │   ├── sales-visits/             # On-site client visit reports, GPS check-ins
│   │   └── trials/                   # Performance Guarantee (PG) tests, trial runs, MOM signoffs
│   ├── server.ts                     # Fastify server bootstrap and route registration
│   └── worker.ts                     # BullMQ asynchronous queue worker processes
├── test/                             # Vitest unit and integration test suites
├── tsup.config.ts                    # Production bundler configuration
├── tsconfig.json                     # TypeScript compiler options
└── package.json
```

---

## Domain Modules and Key Routes

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login`: User login with email and password (enforces compound rate limiting)
- `POST /api/v1/auth/refresh`: Refresh expired JWT access token using HTTP-only partitioned cookie
- `POST /api/v1/auth/logout`: Invalidate user session and clear refresh cookie
- `POST /api/v1/auth/2fa/setup`: Generate TOTP secret and QR code
- `POST /api/v1/auth/2fa/verify`: Verify TOTP passcode to enable 2FA

### Sales Visits (`/api/v1/sales-visits`)
- `GET /api/v1/sales-visits`: Query client visit records with search and bounded pagination
- `POST /api/v1/sales-visits`: Create visit log with mill contact details and notes
- `GET /api/v1/sales-visits/:id`: Detailed view of a single visit

### Enquiries (`/api/v1/enquiries`)
- `GET /api/v1/enquiries`: List enquiries with stage filtering and bounded pagination
- `POST /api/v1/enquiries`: Create technical enquiry
- `PATCH /api/v1/enquiries/:id/status`: Update status (Qualified, In Review, Quoted, Closed)
- `POST /api/v1/enquiries/:id/qualify`: Mark enquiry as qualified
- `POST /api/v1/enquiries/:id/disqualify`: Disqualify enquiry with recorded reason
- `POST /api/v1/enquiries/:id/convert`: Convert qualified enquiry to active project

### Lifecycle and Projects (`/api/v1/lifecycle`, `/api/v1/projects`)
- `GET /api/v1/projects`: List projects with bounded pagination and total count
- `GET /api/v1/projects/:id`: Fetch project summary (core fields with decoupled subresources)
- `GET /api/v1/projects/:id/drawings`: Decoupled project drawings query
- `GET /api/v1/projects/:id/reviews`: Decoupled design reviews query
- `GET /api/v1/lifecycle/:projectId`: Fetch project timeline and stage milestone state
- `POST /api/v1/lifecycle/:projectId/transition`: Advance project through industrial stages

### Engineering and BOQ (`/api/v1/engineering`)
- `GET /api/v1/engineering/documents`: Query engineering drawings and specifications with pagination
- `POST /api/v1/engineering/documents/presign-upload`: Presign S3 URL for technical drawing upload
- `GET /api/v1/engineering/boq/:projectId`: Retrieve active Bill of Quantities
- `POST /api/v1/engineering/boq/:projectId`: Submit new BOQ version

### Procurement (`/api/v1/procurement`)
- `GET /api/v1/procurement/vendors`: List vendors with bounded pagination and total count
- `GET /api/v1/procurement/purchase-orders`: List purchase orders with vendor details and pagination
- `POST /api/v1/procurement/purchase-orders`: Issue purchase order with line items
- `POST /api/v1/procurement/purchase-orders/:id/send`: Dispatch purchase order to vendor
- `PATCH /api/v1/procurement/purchase-orders/:id/delivery`: Update PO delivery milestone

### Manufacturing (`/api/v1/manufacturing`)
- `GET /api/v1/manufacturing/batches`: Production batch tracker with pagination
- `POST /api/v1/manufacturing/batches`: Schedule new production batch
- `POST /api/v1/manufacturing/batches/:id/stages`: Sign off manufacturing milestone (Fabrication, Wiring, FAT)

### Dispatch and Logistics (`/api/v1/dispatch`)
- `GET /api/v1/dispatch/shipments`: Query active and delivered consignments
- `POST /api/v1/dispatch/shipments`: Create shipment with transport details
- `PATCH /api/v1/dispatch/shipments/:id/deliver`: Mark consignment as delivered on site

### Commissioning DAG Engine (`/api/v1/commissioning`)
- `GET /api/v1/commissioning/:projectId/graph`: Retrieve DAG steps, dependencies, and execution state
- `POST /api/v1/commissioning/:projectId/steps`: Define new commissioning step and prerequisites
- `POST /api/v1/commissioning/:projectId/steps/:stepId/signoff`: Sign off step (validates predecessor resolution)

### Post-Commissioning, Trials, and Handover (`/api/v1/trials`)
- `GET /api/v1/trials/:projectId`: Retrieve cold/hot trial run records and parameters
- `POST /api/v1/trials/:projectId/pg-tests`: Log Performance Guarantee (PG) test results
- `POST /api/v1/trials/:projectId/mom`: Submit customer Minutes of Meeting (MOM) signoff

### Finance, Retention, and AMC (`/api/v1/finance`)
- `GET /api/v1/finance/invoices`: Milestone invoices and payment statuses
- `POST /api/v1/finance/invoices`: Issue milestone billing invoice
- `GET /api/v1/finance/retention`: Retention ledger tracking release dates and guarantees
- `GET /api/v1/finance/amc`: AMC contracts with annual renewal forecasts

### Executive Analytics (`/api/v1/analytics`)
- `GET /api/v1/analytics/dwell-times`: Average dwell duration per lifecycle stage
- `GET /api/v1/analytics/funnel`: Conversion rates across the end-to-end project funnel
- `GET /api/v1/analytics/aging`: Aging telemetry for open enquiries and procurement orders
- `GET /api/v1/analytics/amc-forecast`: 12-month revenue forecast for AMC contracts

---

## Environment Configuration

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `PORT` | HTTP server listening port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://systrol:systrol_secret_password@localhost:5432/systrol_erp?schema=public` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for signing access tokens (min 32 chars) | Required |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens (min 32 chars) | Required |
| `JWT_ACCESS_TTL` | Access token time-to-live in seconds | `900` (15m) |
| `JWT_REFRESH_TTL` | Refresh token time-to-live in seconds | `604800` (7d) |
| `S3_ENDPOINT` | MinIO or AWS S3 endpoint URL | `http://localhost:9000` |
| `S3_BUCKET` | S3 bucket name for document uploads | `systrol-documents` |
| `S3_ACCESS_KEY` | Storage access key | `minioadmin` |
| `S3_SECRET_KEY` | Storage secret key | `minioadminpassword` |
| `S3_REGION` | Storage region | `us-east-1` |

---

## Development and Scripts

```bash
# Start API development server with live reload
pnpm --filter @systrol/api dev

# Start background queue worker with live reload
pnpm --filter @systrol/api dev:worker

# Type-check TypeScript sources
pnpm --filter @systrol/api typecheck

# Run automated tests (128 passing tests across 12 test suites)
pnpm --filter @systrol/api test

# Build production bundle with tsup
pnpm --filter @systrol/api build

# Start production server
pnpm --filter @systrol/api start
```
