# sysTROL Engineering & Consultancy Pvt. Ltd.

Official web platform for sysTROL Engineering & Consultancy Pvt. Ltd., a Bengaluru-based industrial engineering firm delivering high-performance Level-2 (L2) automation software (C#) for process industries with deep specialization in steel rolling mills, alongside an international trading division supplying OEM-grade imported machinery, spares, and consumables.

---

## Technology Stack

- Framework: Next.js 15.2.0 (App Router)
- UI Library: React 19.0.0 and React-DOM 19.0.0
- Language: TypeScript 5.7.2 (Strict mode)
- Styling: Vanilla CSS Modules backed by global CSS custom properties (styles/tokens.css). Zero utility-class framework overhead.
- Icons: lucide-react 0.475.0
- Animation and Transitions: motion 12.4.7
- Forms and Validation: react-hook-form 7.54.2, zod 3.24.2, @hookform/resolvers 3.10.0
- Testing: Vitest 5.0.0, @testing-library/react 16.2.0, @testing-library/jest-dom 6.6.3, jsdom 26.0.0
- Package Management: pnpm with deterministic pnpm-lock.yaml

---

## Design System and Color Tokens

All design tokens are defined in styles/tokens.css and consumed via CSS custom properties:

| Category | Token | Value / Usage |
|---|---|---|
| Brand Colors | --color-brand-sys-navy | #16375B (Logo "sys" signature, section headings and primary titles) |
| | --color-brand-green-600 / 700 | #1F7A4D / #166339 (Logo "TROL" accent, heading highlight spans, primary CTAs) |
| | --color-deep-black | #050811 (Global footer bedrock and high-tonnage impact ribbon) |
| | --color-brand-navy-900 / 800 | #0A0F1D / #111827 (Hero surfaces, dark panels, card backdrops) |
| | --color-accent-teal-500 / 600 | #0EA5A5 / #0B8686 (International tags, circuits, and technical highlights) |
| Neutral Scale | --color-ink-900 / 700 / 500 | #0F172A / #334155 / #64748B (Charcoal slate body and technical readouts) |
| | --color-surface-0 / 50 / 100 | #FFFFFF / #F6F8FA / #EEF1F5 (Base white and section background shades) |
| | --color-border / --color-border-dark | #E2E8F0 / #1E293B (Clean structural division lines) |
| Typography | Space Grotesk (--font-heading) | Geometric engineering headings |
| | Inter (--font-body) | High-legibility technical body text |
| | JetBrains Mono (--font-mono) | C# tokens, status telemetry, and parameters |
| | Fluid Scale | clamp() scale: --text-xs (12px) to --text-5xl (64px) |
| Spacing | --space-1 to --space-32 | 4px base mathematical scale (4px to 128px) |
| Elevation | --shadow-sm, --shadow-md, --shadow-lg | Industrial elevations with hover transitions |

---

## Implemented Pages and Core Modules

- Homepage (/): Cinematic logo assembly sequence, Hero with typewriter telemetry, TrustStrip client marquee, WhatWeDo two-division breakdown, WhyUs engineering value props, FeaturedProjects highlights, IndustriesServed segment tags, GlobalNetwork international map, and CTA banner.
- About (/about): Corporate narrative, SVNIT and metals background of Managing Director Preet Tripathi, leadership profile with verified credentials, hardware-in-the-loop simulation facilities, and interactive metrics.
- Services Overview (/services): High-level architectural breakdown of Level-2 automation and global machinery spares trading with milestone timeline.
- Level-2 Automation (/services/automation-consultancy): Technical deep-dive into C# real-time pass schedule algorithms, mathematical models, and 5-stage commissioning stepper.
- Machinery and Spares Trading (/services/trading): Specialized import categories (Tungsten Carbide roll rings, hydraulic AGC servo valves, optical sensors), origin mapping, and EN 10204 3.1 certification protocols.
- Projects Showcase (/projects): Client-side filtered engineering project catalog with sector and division filters, NDA confidentiality notices, and slug-based case study detail pages (/projects/[slug]).
- Clients and Sectors (/clients): Representative client directory across primary steel, tube mills, alloy processors, and international plants, complete with client logo marquee.
- Careers (/careers): Specialized engineering hiring portal with job search, experience and department filters, detail pages (/careers/[id]), and validated job application modal.
- Visual Gallery (/gallery): Mosaic layout across workplace labs, engineering team, and live mill pulpit commissioning with category filtering and modal lightbox.
- Contact (/contact): Interactive technical inquiry form with client-side Zod validation, direct phone and WhatsApp links, and Bengaluru headquarters location information.
- System Layouts: Responsive navbar with smooth scroll, mobile drawer console, top progress bar, interactive scroll gears, floating quick-contact triggers, and global footer bedrock.

---

## Project Structure

```
sysTrol/
├── __tests__/
│   ├── careers/                                  # Career portal and content test suites
│   ├── gallery/                                  # Gallery mosaic and lightbox test suites
│   ├── layout/                                   # Navbar and navigation sequence tests
│   └── ui/                                       # Badge, Button, and SectionHeading unit tests
├── app/
│   ├── layout.tsx                                # Root layout with Space Grotesk, Inter, and JetBrains Mono
│   ├── page.tsx                                  # Homepage
│   ├── about/page.tsx                            # About page
│   ├── services/
│   │   ├── page.tsx                              # Services overview
│   │   ├── automation-consultancy/page.tsx       # L2 Automation and Stepper
│   │   └── trading/page.tsx                      # Machinery and spares trading
│   ├── projects/
│   │   ├── page.tsx                              # Projects directory with filter bar
│   │   └── [slug]/page.tsx                       # SSG Case study detail pages
│   ├── clients/page.tsx                          # Clients and sectors directory
│   ├── careers/
│   │   ├── page.tsx                              # Careers portal
│   │   └── [id]/page.tsx                         # Job details and application form
│   ├── gallery/page.tsx                          # Visual showcase and lightbox
│   ├── contact/page.tsx                          # Contact and RFQ form
│   ├── not-found.tsx                             # Custom 404 handler
│   ├── robots.ts                                 # Search engine robot rules
│   └── sitemap.ts                                # Dynamic XML sitemap generator
├── components/
│   ├── layout/                                   # Navbar, Footer, MobileDrawer, Container, FloatingContact, LogoIntro, TopProgressBar, ScrollGears
│   ├── ui/                                       # Badge, Button, Card, Stepper, StatCounter, Toast, Forms, SectionHeading, CountUp, Reveal
│   └── sections/                                 # Hero, TrustStrip, WhatWeDo, WhyUs, FeaturedProjects, GlobalNetwork, IndustriesServed, TeamSection, ImpactBand, CTASection, CapabilitiesTimeline, ClientLogoMarquee, Gallery, Careers
├── content/                                      # Typed data sources (services.ts, projects.ts, clients.ts, gallery.ts, careers.ts)
├── lib/                                          # Zod validation schemas
├── public/                                       # Logos, photography, and optimization assets
├── styles/                                       # tokens.css, globals.css
├── types/                                        # TypeScript type definitions
├── vitest.config.ts                              # Vitest test runner configuration
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 20 or higher
- pnpm 9 or higher

### Installation
```bash
git clone https://github.com/ADI-2707/sysTrol.git
cd sysTrol
pnpm install
```

### Development Server
```bash
pnpm dev
```
Open http://localhost:3000 in your browser.

### Running Automated Tests
```bash
pnpm test
```

### Production Build
```bash
pnpm build
pnpm start
```