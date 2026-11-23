# @systrol/web-public

## 1.3.1

### Patch Changes

- da74795: Synchronize showcase projects with database, harden case study publishing, and ensure honest toast notifications.

## 1.3.0

### Minor Changes

- 6f0a512: Standardize Project Management with reusable TabGroup component and 3-tab lifecycle (Ongoing, Commissioned, Published). Mirror public website projects in internal ops with full case study data. Add PublishCaseStudyModal with 3-image upload, card thumbnail selection, challenge/solution fields, and custom KPI cards repeater. Add RBAC-governed publishing and unpublishing API endpoints with audit logging wrapped in atomic Prisma transactions. Remove PROJECTS category from Media CMS filter bar and upload modal to enforce domain isolation. Implement dynamic-first public website resolution with on-demand ISR revalidation, HTTP stale-while-revalidate caching headers, and resilient fail-open fallback.

## 1.2.1

### Patch Changes

- 3a4f716: Eliminate hover flicker across interactive UI elements and add arrow hover animation to hero projects button.

## 1.2.0

### Minor Changes

- 6a6e8d5: Optimize SEO, Core Web Vitals, and Lighthouse scores across all public routes with dynamic domain configuration, bot splash screen bypass, dedicated metadata layouts, canonical URLs, and structured JSON-LD schemas (JobPosting, BreadcrumbList, Article).

## 1.1.0

### Minor Changes

- 1376f1e: Add enterprise observability architecture including deep dependency health diagnostics, in-portal audit trail ledger with mutation diff inspection, synthetic uptime keep-alive monitoring, and development session resilience.
