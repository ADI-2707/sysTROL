---
"@systrol/types": minor
"@systrol/database": minor
"@systrol/api": minor
"@systrol/internal": minor
---

Add Project Log feature to the sysTROL Project Management system:

- Introduces day-wise, week-grouped chronological project logs on `/projects/[id]` under a dedicated tab.
- Two-tab navigation separating "Lifecycle Steps" (with log count badges and completion attribution) from "Project Log".
- Strict Anti-Backfilling enforcement: restricts new entries to the active week (Monday through Today) with both server-side and client-side guards.
- Security character limit safeguards preventing database bloat and DoS: 10 to 3,000 characters for content, 800 for blockers, 500 for next steps, and max 5 attachments.
- Automated weekly lifecycle lock via BullMQ cron job every Sunday at midnight UTC, with weekly email digest delivery.
- Comprehensive test suite additions covering Zod schema validation, ISO week resolution, service atomic upsert, RBAC permissions, and frontend component workflows.
