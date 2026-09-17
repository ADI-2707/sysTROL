# @systrol/internal

Enterprise Operations & ERP Dashboard for sysTROL Engineering & Consultancy Pvt. Ltd.

Built with Next.js 15.5.25 (App Router), React 19, TypeScript, and a custom design system featuring dual-theme dark/light support, collapsible icon-rail navigation, an industrial mechanical rocker switch, and responsive workstation layouts.

---

## Live Production Deployment

- **Portal URL**: [https://systrolops.vercel.app](https://systrolops.vercel.app)
- **Hosting Platform**: Vercel
- **Root Directory**: `apps/internal`
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://systrol-api.onrender.com`

---

## Architecture and Design Philosophy

The Internal application is an operational portal engineered for field engineers, project managers, procurement specialists, and executive management:

- Zero CSS Utility Overhead: Built without TailwindCSS dependencies. Utilizes custom CSS variables (`styles/tokens.css`) mapped through a token utility engine (`styles/utilities.css`) and global styling (`app/globals.css`).
- Dual-Theme System:
  - Dark Mode: Uses an eye-comfort neutral black bedrock (`#050811`) with slate card surfaces (`#0A0F1D`, `#111827`, `#0F172A`) and subtle borders (`#1E293B`).
  - Light Mode: Clean high-contrast surfaces (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`) with slate borders (`#E2E8F0`).
  - Industrial Mechanical Rocker Toggle: Tactile 3D rocker switch (`theme-toggle.tsx`) with grooved grip ridges, realistic tilt animation, luminescent micro-LED indicator (amber for light, cyan for dark), and ARIA switch accessibility.
- Navigation Shell:
  - Streamlined 5-Item Navigation: Dashboard, Project Management, Employee Management, Analytics, Settings.
  - Interactive Official sysTROL Logo: In collapsed state, the left mark (gear and globe) and right mark (bulb and connecting nodes) meet side-by-side to form a unified circular emblem. Clicking expands the sidebar to display the full brand typography (`sysTROL`) and tagline (`Engineering Redefined`).
  - Topbar User Profile: Avatar initials, live green status beacon, user name, team badge (e.g. `Leadership`), and designation mounted directly in the header bar.
- Responsive Workstation Architecture:
  - Mobile Lock Screen (< 768px): Restricts access on small screens with an exclusive workstation lock screen: "Please open in desktop to operate the internal tool".
  - Tablet Rail (768px to 1024px): Automatically collapses navigation to a compact 60px icon rail to maximize screen space for complex tables and workflows.
  - Laptop & Ultrawide: Fluid, centered container layouts with max-width scaling.
- Client Resilience & Security:
  - Authenticated API Client (`lib/api-client.ts`): Intercepts `401 Unauthorized` responses, initiates silent token refresh, queues concurrent requests, and retries seamlessly.
  - Input Debouncing: `useDebounce` hook prevents network congestion on rapid search inputs across Media, Projects, Employees, and Analytics.
  - Action Mutation Locking: Prevents double-click duplicate mutations on purchase order status changes, enquiry conversions, and sales visit creation.
  - Global Error Boundaries: Root and dashboard `error.tsx` error boundaries, custom `not-found.tsx` 404 pages, and skeleton `loading.tsx` states.

---

## Directory Structure

```
apps/internal/
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/                # Central operations dashboard with KPI telemetry and charts
│   │   ├── projects/                 # Project management with Ongoing & Commissioned cards
│   │   │   └── [id]/                 # 12-step lifecycle tracker, sub-step insertion & on-site roster
│   │   ├── employees/                # Employee management directory with designations & site status
│   │   ├── analytics/                # Telemetry matrix, dwell times, aging, AMC forecasts
│   │   ├── settings/                 # Account profile, password change, theme preferences
│   │   ├── error.tsx                 # Dashboard-scoped error boundary
│   │   ├── loading.tsx               # Dashboard route transition loading skeleton
│   │   └── layout.tsx                # Dashboard shell with responsive gate and topbar profile
│   ├── login/                        # Dedicated enterprise login page
│   ├── error.tsx                     # Root application error boundary
│   ├── not-found.tsx                 # Custom 404 handler
│   ├── globals.css                   # Core layout reset, responsive media queries, table styling
│   ├── layout.tsx                    # Root HTML layout and AuthProvider
│   ├── page.tsx                      # Root landing page routing to /login or /dashboard
│   ├── theme-provider.tsx            # Context provider managing dark/light modes
│   ├── theme-toggle.tsx              # Industrial mechanical rocker switch component
│   ├── theme-toggle.test.tsx         # Automated tests for mechanical switch toggle
│   ├── responsive-layout.test.tsx    # Automated tests for mobile lock screen & tablet rail
│   └── top-progress-bar.tsx          # Top route transition progress indicator
├── components/
│   ├── brand/
│   │   └── SysTrolLogo.tsx           # Official animated sysTROL logo (circular collapsed / full expanded)
│   └── ui/                           # Reusable standardized UI components
│       ├── badge.tsx                 # Status pill badge
│       ├── button.tsx                # Action button with loading state
│       ├── kpi-card.tsx              # Metric KPI card with trend indicators
│       └── index.ts                  # Component barrel export
├── lib/
│   ├── api-client.ts                 # Authenticated fetch client with silent refresh queueing
│   ├── api-client.test.ts            # Automated tests for token refresh and request queueing
│   ├── auth-context.tsx              # Authentication session context and credentials store
│   ├── permissions.ts                # RBAC rules, team labels, and page access control
│   ├── projects-data.ts              # Lifecycle stages, on-site personnel models and persistence
│   ├── token-utils.ts                # Client-side JWT expiration checking
│   ├── use-debounce.ts               # Input debounce hook
│   ├── use-debounce.test.ts          # Automated tests for debounce hook and mutation locking
│   └── use-keep-alive.ts             # Backend cold-start keep-alive heartbeat
├── public/
│   ├── icon.jpeg                     # Official application icon
│   └── images/                       # Brand vectors and diagram assets
├── styles/
│   ├── tokens.css                    # Canonical CSS custom properties for color, space, radius
│   └── utilities.css                 # Token-mapped flex, grid, border, and spacing utility classes
├── vitest.config.ts                  # Vitest test runner configuration
├── tsconfig.json
└── package.json
```

---

## Core Operational Modules

| Module | Route | Key Capabilities |
|---|---|---|
| Dashboard | `/dashboard` | Executive KPI readout, lifecycle stage distribution, monthly project delivery pace, recent telemetry feed |
| Project Management | `/projects` | Two-tab system (Ongoing and Commissioned) displaying project cards with debounced search |
| Project Detail & Lifecycle | `/projects/[id]` | 12 predefined sequential lifecycle steps, step marking (Pending/In Progress/Completed), dynamic intermediate step insertion, on-site staff roster |
| Employee Management | `/employees` | Complete corporate directory with employee names, designations, departments, contact numbers, and plant deployment status |
| Media CMS | `/media` | Cloud-backed media library with drag-and-drop upload, client-side pre-flight checks (format, size <=5MB, 1200x800 resolution), debounced search |
| Careers & Jobs | `/careers-admin/postings` | Job posting management, publishing/pausing openings, candidate application review, and real-time synchronization with the public careers platform |
| Analytics | `/analytics` | Dwell duration per stage, end-to-end conversion funnel, aging enquiries/procurement telemetry matrix, and 12-month AMC revenue projection |
| Settings | `/settings` | Profile summary, designation, role verification, and self-service password change |
| Authentication | `/login` | Enterprise login screen with brand logo, credential authentication, and compound rate limit protection |

---

## 12-Step Project Lifecycle

Each rolling mill project tracks progress across the predefined sequential phases:
1. Enquiry
2. Sales visit
3. Procurement
4. Engineering phase
5. Material / Manufacturing
6. Dispatch
7. Erection and commissioning
8. Cold trial / Hot trial
9. Performance and guarantee testing (PG test)
10. MOM (Minutes of Meeting)
11. Payment
12. AMC (Annual Maintenance)

Users can mark each predefined step, update timestamps and signoffs, insert custom intermediate sub-steps between predefined steps, and deploy or relieve on-site personnel.

---

## Environment Configuration

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API service | `http://localhost:4000` |
| `PORT` | Listening port for the Next.js dev and production server | `3001` |

---

## Development and Testing Scripts

```bash
# Start development server on port 3001 with hot module reloading
pnpm --filter @systrol/internal dev

# Type-check TypeScript sources
pnpm --filter @systrol/internal typecheck

# Lint source files
pnpm --filter @systrol/internal lint

# Run automated tests (16 tests across 4 test suites)
pnpm --filter @systrol/internal test

# Build production bundle
pnpm --filter @systrol/internal build

# Start production server on port 3001
pnpm --filter @systrol/internal start
```
