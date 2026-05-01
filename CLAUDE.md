# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project

**key-pulse-view** — an education KPI dashboard. Single-page React app with eight tabbed views (overview, executive summary, student journey, student profile, access & equity, teacher excellence, quality assurance, institutional efficiency).

All data is **static mock data** in `src/data/*.ts`. There is no backend, auth, or database. Treat the data files as the source of truth when adding charts or KPIs.

Originally generated with Lovable; now developed directly with Claude Code.

## Commands

Package manager is **bun** (see `bun.lock` / `bun.lockb`).

| Task            | Command                |
| --------------- | ---------------------- |
| Install deps    | `bun install`          |
| Dev server      | `bun dev`              |
| Production build | `bun run build`       |
| Dev-mode build  | `bun run build:dev`    |
| Preview build   | `bun run preview`      |
| Lint            | `bun run lint`         |
| Unit tests      | `bun test` (vitest)    |
| Watch tests     | `bun run test:watch`   |
| E2E tests       | `bunx playwright test` |

Dev server runs on `http://localhost:8080` (configured in `vite.config.ts`).

## Tech stack

- **Vite 5** + **React 18** + **TypeScript**, SWC plugin (`@vitejs/plugin-react-swc`)
- **Tailwind CSS 3** + **shadcn/ui** (full Radix UI suite under `src/components/ui/`)
- **TanStack Query**, **React Router 6**, **React Hook Form** + **Zod**
- **Recharts** for charts, **lucide-react** for icons, **next-themes**
- **Vitest** + **Testing Library** (jsdom) for unit tests
- **Playwright** for E2E (uses `lovable-agent-playwright-config`)

## Path alias

- `@/*` resolves to `src/*` — configured in `vite.config.ts`, `vitest.config.ts`, and `tsconfig.json`.
- Always import via `@/...` rather than relative paths beyond a single directory.

## Project layout

```
src/
  App.tsx              router + providers (QueryClient, Tooltip, Toaster)
  main.tsx             entry point
  pages/
    Index.tsx          single-page dashboard, holds tab state
    NotFound.tsx
  components/
    NavLink.tsx
    dashboard/         feature components, one folder per tab
      landing/  student/  profile/  equity/
      teacher/  quality/  efficiency/
      KpiCard.tsx, Sparkline.tsx, GapAnalysisChart.tsx, ...
    ui/                shadcn primitives — DO NOT hand-edit
  data/                static mock KPI datasets (one file per pillar)
  hooks/               use-mobile, use-toast
  lib/utils.ts         cn() helper
  test/setup.ts        vitest + jest-dom + matchMedia stub
```

## Conventions

- **shadcn/ui primitives in `src/components/ui/` are generated** — do not hand-edit. To add or update one, run the shadcn CLI (`bunx shadcn@latest add <component>`); see `components.json` for config.
- **Feature components** live in `src/components/dashboard/<feature>/` — one folder per tab.
- **Data is mock-only.** When a chart needs new fields, edit the relevant `src/data/*.ts` file and update its TypeScript types. Don't introduce fetching/API code without discussion.
- **Tailwind first.** Use `cn()` from `@/lib/utils` to merge classes. Theme tokens come from `tailwind.config.ts` + CSS variables in `src/index.css` (slate base, `cssVariables: true`).
- **File naming**: PascalCase for components (`KpiCard.tsx`), camelCase for data/hooks/utils (`kpiData.tsx`, `use-mobile.tsx`). Follow the existing pattern in each folder.
- **Imports**: prefer `@/...` over relative paths beyond one level.
- **Tabs**: to add a tab, extend `DashboardTab` in `src/components/dashboard/DashboardTabs.tsx`, add an entry to the `tabs` array, and add a case to the `switch` in `src/pages/Index.tsx`.

## Tests

- Unit tests live next to source as `*.test.ts(x)` or `*.spec.ts(x)` under `src/`.
- Vitest setup: `src/test/setup.ts` (loads `@testing-library/jest-dom`, stubs `matchMedia`).
- Playwright config: `playwright.config.ts` (delegates to `lovable-agent-playwright-config`).

## Lovable integration

- `lovable-tagger` is enabled only in dev mode (`vite.config.ts`). Safe to keep; safe to remove if detaching from Lovable.
- `bun.lockb` is the Lovable-style binary lockfile; `bun.lock` is the text version. Both are committed.

## Git

Single-branch workflow: **work directly on `main`**. No feature branches unless explicitly requested.

## Quick checks before declaring work done

1. `bun run lint` — no new errors.
2. `bun test` — all unit tests pass.
3. For UI changes, run `bun dev` and verify in the browser; type-check alone doesn't validate UI.
