# @systrol/internal

Enterprise Operations & ERP Dashboard for sysTROL Engineering & Consultancy Pvt. Ltd.

Built with Next.js 15 (App Router), React 19, TypeScript, and a custom design system featuring dual-theme dark/light support, collapsible icon-rail navigation, and standardized industrial UI components.

---

## Architecture and Design Philosophy

The Internal application is an operational portal designed for field engineers, project managers, procurement specialists, and executive management:

- Zero CSS Utility Overhead: Built without TailwindCSS dependencies. It utilizes custom CSS variables (`styles/tokens.css`) mapped through a token utility engine (`styles/utilities.css`) and global styling (`app/globals.css`).
- Dual-Theme System:
  - Dark Mode: Uses an eye-comfort neutral black bedrock (`#050811`) with slate card surfaces (`#0A0F1D`, `#111827`, `#0F172A`) and subtle borders (`#1E293B`).
  - Light Mode: Clean high-contrast surfaces (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`) with slate borders (`#E2E8F0`).
  - Theme toggling persists via `theme-provider.tsx` and `theme-toggle.tsx` in the dashboard header.
- Navigation Shell:
  - Collapsible icon-rail sidebar matching top header height.
  - Hover tooltip popovers for collapsed rail navigation.
  - Active route synchronization with deep parent-child path matching.
  - Top progress bar (`top-progress-bar.tsx`) with brand green accent rendering during route transitions.

---

## Directory Structure

```
apps/internal/
├── app/
│   ├── (dashboard)/                  # Authenticated ERP dashboard layout and routes
│   │   ├── analytics/                # Telemetry matrix, dwell times, aging, AMC forecasts
│   │   ├── careers-admin/            # Job postings and candidate management
│   │   ├── commissioning/            # Commissioning DAG engine step verification
│   │   ├── dispatch/                 # Logistics, packing manifests, gate passes
│   │   ├── engineering/              # Drawings vault, BOQ revisions, design reviews
│   │   ├── enquiries/                # Technical RFQ qualification and quotation review
│   │   ├── finance/                  # Milestone invoices, retention money, AMC contracts
│   │   ├── lifecycle/                # Global project lifecycle milestone progression
│   │   ├── manufacturing/            # Production batches and FAT stage sign-offs
│   │   ├── post-commissioning/       # Trials, PG test telemetry, MOM customer handovers
│   │   ├── procurement/              # Purchase orders, vendor tracking, line items
│   │   ├── projects/                 # Project index mapped to lifecycle state
│   │   ├── sales-visits/             # Client mill visit logs and GPS check-ins
│   │   ├── trials/                   # Post-commissioning route alias
│   │   └── layout.tsx                # Dashboard shell with sidebar rail and header
│   ├── globals.css                   # Core layout reset, table styling, and spacing rules
│   ├── layout.tsx                    # Root HTML layout and font configurations
│   ├── page.tsx                      # Root redirect to /lifecycle dashboard
│   ├── theme-provider.tsx            # Context provider managing dark/light modes
│   ├── theme-toggle.tsx              # Header button component to switch theme
│   └── top-progress-bar.tsx          # Top route transition progress indicator
├── components/
│   └── ui/                           # Reusable standardized UI components
│       ├── badge.tsx                 # Status pill badge (default, success, warning, etc.)
│       ├── button.tsx                # Action button (default green with white text, outline, etc.)
│       ├── kpi-card.tsx              # Metric KPI card with trend indicators
│       └── index.ts                  # Component barrel export
├── styles/
│   ├── tokens.css                    # Canonical CSS custom properties for color, space, radius
│   └── utilities.css                 # Token-mapped flex, grid, border, and spacing utility classes
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json
```

---

## Standardized UI Components

The application standardizes core interactive elements in `components/ui`:

### Button (`components/ui/button.tsx`)
- Supports multiple variants:
  - `default`: sysTROL signature green (`#1F7A4D`) with white text and hover state.
  - `outline`: Bordered button with subtle background hover.
  - `ghost`: Transparent button with subtle text highlight on hover.
  - `secondary`: Neutral slate button for secondary actions.
  - `destructive`: Crimson danger button for critical deletions or cancellations.
- Sizes: `default`, `sm`, `lg`, `icon`.

### Badge (`components/ui/badge.tsx`)
- Standardized status badges for project and document states.
- Variants: `default`, `secondary`, `outline`, `success`, `warning`, `destructive`, `info`.

### KpiCard (`components/ui/kpi-card.tsx`)
- High-visibility statistical cards displaying key metrics.
- Includes support for:
  - Metric title and large primary value readout.
  - Trend badges (positive/negative/neutral percentage changes).
  - Comparative subtitle or description.
  - Lucide icon integration with theme-adaptive background containers.

---

## Operational Modules

| Module | Route | Key Capabilities |
|---|---|---|
| Executive Analytics | `/analytics` | Dwell duration per stage, end-to-end conversion funnel, aging enquiries/procurement telemetry matrix, and 12-month AMC revenue projection |
| Sales Visits | `/sales-visits` | Mill visit records, client contact persons, discussion logs, and action items |
| Technical Enquiries | `/enquiries` | Inbound RFQ analysis, feasibility review, scope definition, and quotation status |
| Project Lifecycle | `/lifecycle` | Global milestone progression from enquiry to project sign-off |
| Engineering & BOQ | `/engineering` | Engineering document vault, technical schematics, and multi-revision BOQ management |
| Procurement | `/procurement` | Purchase orders (POs), supplier delivery schedules, and receipt verification |
| Manufacturing | `/manufacturing` | Production batch tracking, component fabrication, wiring checks, and FAT records |
| Dispatch & Logistics | `/dispatch` | Consignment manifests, transporter details, packing lists, and site gate passes |
| Commissioning DAG | `/commissioning` | Directed Acyclic Graph step resolution, prerequisites, and engineer sign-offs |
| Post-Commissioning | `/post-commissioning` | Hot/cold trial logs, PG tests, customer MOM signoffs, and warranty tracking |
| Finance & Retention | `/finance` | Milestone invoices, retention money ledger, bank guarantees, and AMC contracts |
| Careers Admin | `/careers-admin` | Active job posting management and job applicant tracking |

---

## Environment Configuration

The Internal dashboard reads configuration from `apps/internal/.env` or root `.env`:

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API service | `http://localhost:4000` |
| `PORT` | Listening port for the Next.js dev and production server | `3001` |

---

## Development and Scripts

```bash
# Start development server on port 3001 with hot module reloading
pnpm --filter @systrol/internal dev

# Type-check TypeScript sources
pnpm --filter @systrol/internal typecheck

# Lint source files
pnpm --filter @systrol/internal lint

# Build production bundle
pnpm --filter @systrol/internal build

# Start production server on port 3001
pnpm --filter @systrol/internal start
```
