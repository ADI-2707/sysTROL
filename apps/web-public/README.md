# @systrol/web-public

Official public corporate web platform for sysTROL Engineering & Consultancy Pvt. Ltd.

Built with Next.js 15.5.25 (App Router), React 19, TypeScript, Motion animations, and custom CSS token architecture.

---

## Live Production Deployment

- **Public URL**: [https://sys-trol-web-public-nu.vercel.app](https://sys-trol-web-public-nu.vercel.app)
- **Hosting Platform**: Vercel
- **Root Directory**: `apps/web-public`
- **Framework Preset**: Next.js
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://systrol-api.onrender.com`

---

## Architectural Overview

The Public Web application presents sysTROL's two primary business divisions to global steel manufacturers, rolling mill operators, and industrial clients:
1. Level-2 (L2) Automation and Process Consultancy: Real-time C# process control, pass schedule algorithms, mathematical roll-gap models, and turnkey mill commissioning.
2. Machinery and Spares Trading: OEM-grade imported mechanical spares, Tungsten Carbide roll rings, hydraulic AGC servo valves, and certified consumables.

---

## Directory Structure

```
apps/web-public/
├── __tests__/                        # Vitest automated test suites
│   ├── careers/                      # Careers portal filters and job modal tests
│   ├── gallery/                      # Visual gallery lightbox and filter tests
│   ├── layout/                       # Navbar, drawer, and footer layout tests
│   └── ui/                           # Badge, Button, Stepper, and Heading component tests
├── app/
│   ├── layout.tsx                    # Root HTML layout, font declarations, and metadata
│   ├── page.tsx                      # Corporate homepage
│   ├── about/page.tsx                # Leadership profile, company history, and facilities
│   ├── services/
│   │   ├── page.tsx                  # Services overview and dual-division breakdown
│   │   ├── automation-consultancy/   # L2 Automation, C# algorithms, and commissioning stepper
│   │   └── trading/                  # Machinery, spares, import origin mapping, certificates
│   ├── projects/
│   │   ├── page.tsx                  # Filterable project portfolio directory
│   │   └── [slug]/page.tsx           # Dynamic SSG project case study pages
│   ├── clients/page.tsx              # Client directory and industrial sectors
│   ├── careers/
│   │   ├── page.tsx                  # Engineering job listings and search
│   │   └── [id]/page.tsx             # Job description and application modal
│   ├── gallery/page.tsx              # Facility, pulpit, and commissioning visual gallery
│   ├── contact/page.tsx              # Technical RFQ inquiry form with Zod validation
│   ├── not-found.tsx                 # Custom 404 page
│   ├── robots.ts                     # Search engine crawler policies
│   └── sitemap.ts                    # Dynamic XML sitemap generator
├── components/
│   ├── layout/                       # Navbar, Footer, MobileDrawer, TopProgressBar, ScrollGears
│   ├── sections/                     # Hero, TrustStrip, WhatWeDo, WhyUs, FeaturedProjects, GlobalNetwork
│   └── ui/                           # Badge, Button, Card, Stepper, StatCounter, Toast, Forms
├── content/                          # Typed static data sources (services, projects, clients, gallery)
├── lib/                              # Validation schemas and client helpers
├── public/                           # Optimized brand assets, logos, and industrial photography
├── styles/
│   ├── tokens.css                    # CSS custom properties and color tokens
│   └── globals.css                   # Global reset and typography
├── vitest.config.ts                  # Vitest testing configuration
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json
```

---

## Page Catalog

- Homepage (`/`): Cinematic logo reveal, hero typewriter telemetry, client marquee, dual-division overview, engineering differentiators, featured projects, and contact call-to-action.
- About (`/about`): Corporate history, SVNIT alumni background of Managing Director Preet Tripathi, team credentials, and hardware-in-the-loop (HIL) testing laboratory.
- Services Overview (`/services`): Architectural comparison of L2 automation versus machinery supply.
- Level-2 Automation (`/services/automation-consultancy`): Technical deep-dive into C# mathematical modeling, pulpit automation, and 5-stage commissioning stepper.
- Machinery Trading (`/services/trading`): Tungsten Carbide roll rings, high-speed shear blades, hydraulic servo valves, origin countries, and EN 10204 3.1 material test certificate protocol.
- Projects Showcase (`/projects` and `/projects/[slug]`): Client-side filtered project catalog by industry sector and division, with detail case studies and technical specifications.
- Clients & Sectors (`/clients`): Client roster covering integrated steel plants, secondary rolling mills, tube mills, and alloy processors.
- Careers (`/careers` and `/careers/[id]`): Filterable job postings with search, department filtering, and validated modal application form.
- Visual Showcase (`/gallery`): Mosaic gallery covering shop floor, automation pulpits, and engineering facilities with modal image viewer.
- Contact and RFQ (`/contact`): Inquiry form with Zod validation, direct phone and WhatsApp links, and Bengaluru headquarters location.

---

## Design System and Typography

All design tokens are defined in `styles/tokens.css` and consumed via standard CSS custom properties:

- Typography:
  - Space Grotesk: Geometric engineering headings (`--font-heading`)
  - Inter: Technical body typography (`--font-body`)
  - JetBrains Mono: Mathematical parameters and code tokens (`--font-mono`)
- Primary Colors:
  - sys Navy (`#16375B`)
  - TROL Green (`#1F7A4D`, `#166339`)
  - Deep Bedrock (`#050811`)
  - Slate ink scale (`#0F172A`, `#334155`, `#64748B`)

---

## Testing

Automated test suites verify navigation layouts, forms, and interactive components:

```bash
# Run unit tests
pnpm --filter @systrol/web-public test

# Run tests in watch mode
pnpm --filter @systrol/web-public test:watch
```

---

## Development and Scripts

```bash
# Run development server on port 3000
pnpm --filter @systrol/web-public dev

# Type-check TypeScript code
pnpm --filter @systrol/web-public typecheck

# Lint source files
pnpm --filter @systrol/web-public lint

# Build production application
pnpm --filter @systrol/web-public build

# Run production server
pnpm --filter @systrol/web-public start
```
