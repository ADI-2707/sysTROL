# @systrol/ui

Shared UI component foundations, React props contracts, and design token definitions for the sysTROL Industrial Engineering Platform.

---

## Architectural Overview

This package provides common UI type exports, base interactive primitives, and shared design token specifications across sysTROL frontend applications:
- Clean React 19 component definitions
- Zero TailwindCSS lock-in; relies on CSS custom properties and standard HTML5 attributes
- Shared props interfaces for standard controls (buttons, inputs, card containers)

---

## Directory Structure

```
packages/ui/
├── src/
│   └── index.ts                      # Common UI component type exports
├── tsconfig.json                     # TypeScript compiler configuration
└── package.json
```

---

## Development Scripts

```bash
# Type-check package sources
pnpm --filter @systrol/ui typecheck
```
