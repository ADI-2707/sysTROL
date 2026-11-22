---
"@systrol/types": minor
"@systrol/database": minor
"@systrol/api": minor
"@systrol/internal": minor
---

Add Project Log feature to the project management system.

Introduces day-wise, week-grouped update entries per project accessible from a new tab on the project detail page. Week blocks auto-lock after 7 days via a BullMQ cron job. Full RBAC integration with existing UserRole constraints. Works for both site commissioning projects and software development projects.
