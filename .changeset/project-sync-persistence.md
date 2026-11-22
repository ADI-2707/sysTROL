---
"@systrol/api": patch
"@systrol/internal": patch
---

Fix foreign key constraint violation on project log week creation by auto-provisioning missing project database records, synchronizing client project creation directly with the backend API, and preserving strict multi-project daily log isolation.
