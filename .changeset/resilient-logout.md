---
"@systrol/api": patch
"@systrol/internal": patch
---

Make logout endpoint resilient, idempotent, and unblocked by expired JWTs, while ensuring client passes authorization header gracefully and cookies are always cleared.
