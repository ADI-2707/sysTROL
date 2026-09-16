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
  - Streamlined 5-Item Navigation: Dashboard, Project Management, Employee Management, Analytics, Settings.
  - Interactive Official sysTROL Logo: In collapsed state, the left mark (gear & globe) and right mark (bulb & connecting nodes) meet side-by-side to form a unified circular emblem without overlapping. Clicking it smoothly expands the sidebar and reveals the full brand name (`sysTROL`) and tagline (`Engineering Redefined`).
  - Active route synchronization with deep parent-child path matching.
  - Top progress bar (`top-progress-bar.tsx`) with brand green accent rendering during route transitions.
- Authentication & Security:
  - Dedicated enterprise landing page (`/login`) with session management.
  - Protected dashboard routes with automatic redirection for unauthenticated visitors.
  - Settings page with password change capability, session telemetry, and role designation display.

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
│   │   └── layout.tsx                # Dashboard shell with 5-item sidebar and animated official logo
│   ├── login/                        # Dedicated enterprise login page
│   ├── globals.css                   # Core layout reset, table styling, and spacing rules
│   ├── layout.tsx                    # Root HTML layout and AuthProvider
│   ├── page.tsx                      # Root landing page routing to /login or /dashboard
│   ├── theme-provider.tsx            # Context provider managing dark/light modes
│   ├── theme-toggle.tsx              # Header button component to switch theme
│   └── top-progress-bar.tsx          # Top route transition progress indicator
├── components/
│   ├── brand/
│   │   └── SysTrolLogo.tsx           # Official animated sysTROL logo (circular collapsed / full expanded)
│   └── ui/                           # Reusable standardized UI components
│       ├── badge.tsx                 # Status pill badge
│       ├── button.tsx                # Action button
│       ├── kpi-card.tsx              # Metric KPI card with trend indicators
│       └── index.ts                  # Component barrel export
├── lib/
│   ├── auth-context.tsx              # Authentication session context and credentials store
│   └── projects-data.ts              # Lifecycle stages, on-site personnel models and persistence
├── public/
│   └── images/                       # Official sysTROL logo vectors and assets
├── styles/
│   ├── tokens.css                    # Canonical CSS custom properties for color, space, radius
│   └── utilities.css                 # Token-mapped flex, grid, border, and spacing utility classes
├── tsconfig.json
└── package.json
```

---

## Core Operational Modules

| Module | Route | Key Capabilities |
|---|---|---|
| Dashboard | `/dashboard` | Executive KPI readout, lifecycle stage distribution, monthly project delivery pace, recent telemetry feed |
| Project Management | `/projects` | Two-tab system (Ongoing and Commissioned) displaying project cards with client name, line name, and location |
| Project Detail & Lifecycle | `/projects/[id]` | 12 predefined sequential lifecycle steps, step marking (Pending/In Progress/Completed), dynamic intermediate step insertion, on-site staff roster |
| Employee Management | `/employees` | Complete corporate directory with employee names, designations, departments, contact numbers, and plant deployment status |
| Analytics | `/analytics` | Dwell duration per stage, end-to-end conversion funnel, aging enquiries/procurement telemetry matrix, and 12-month AMC revenue projection |
| Settings | `/settings` | Profile summary, designation, role verification, and self-service password change |
| Authentication | `/login` | Enterprise login screen with brand logo, credential authentication, and demo quick-switch |

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
