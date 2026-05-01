# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project

**key-pulse-view** — an education KPI dashboard with an embedded LLM assistant. Single-page React app with eight tabbed views (overview, executive summary, student journey, student profile, access & equity, teacher excellence, quality assurance, institutional efficiency), plus a floating chat bubble powered by a local Ollama model.

Dashboard data is **static mock data** in `src/data/*.ts`. There is no DB or auth. The chat assistant is a Python FastAPI service in `server/`, dockerized along with Ollama.

Originally generated with Lovable; detached and now developed directly with Claude Code.

## Commands

Frontend uses **bun** (or **npm**, both lockfiles work). Backend stack runs in **Docker**.

| Task                                  | Command                       |
| ------------------------------------- | ----------------------------- |
| Install frontend deps                 | `bun install` / `npm install` |
| Frontend dev server (port 8080)       | `bun dev` / `npm run dev`     |
| Production build                      | `bun run build`               |
| Lint                                  | `bun run lint`                |
| Unit tests (vitest)                   | `bun test` / `npm test`       |
| E2E tests                             | `bunx playwright test`        |
| **Bring up Docker stack** (api+ollama)| `npm run stack:up`            |
| Stop stack                            | `npm run stack:down`          |
| Tail stack logs                       | `npm run stack:logs`          |
| Rebuild after Dockerfile change       | `npm run stack:rebuild`       |

**Typical dev session:** `npm run stack:up` (once, to start backend + Ollama), then `npm run dev` (Vite frontend with proxy to backend). Visit `http://localhost:8080`.

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
  App.tsx              router + providers + DashboardProvider + ChatBubble
  main.tsx             entry point
  pages/
    Index.tsx          single-page dashboard (reads tab from DashboardContext)
    NotFound.tsx
  contexts/
    DashboardContext.tsx   exposes activeTab + selectedStudent (also fed to chat)
  components/
    chat/              ChatBubble, ChatPanel — floating LLM assistant
    dashboard/         feature components, one folder per tab
      landing/  student/  profile/  equity/
      teacher/  quality/  efficiency/
      KpiCard.tsx, Sparkline.tsx, GapAnalysisChart.tsx, ...
    ui/                shadcn primitives — DO NOT hand-edit
  data/                static mock KPI datasets (one file per pillar)
  hooks/               use-mobile, use-toast
  lib/
    chatClient.ts      SSE streaming client for /api/chat
    utils.ts           cn() helper
  test/setup.ts        vitest + jest-dom + matchMedia stub

server/                FastAPI + Ollama backend (Dockerized)
  main.py              /api/health, /api/chat (SSE streaming)
  Dockerfile           python:3.12-slim
  requirements.txt
  .env / .env.example  OLLAMA_HOST, OLLAMA_MODEL
docker-compose.yml     ollama + bootstrap (model pull) + api
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

## Backend / Ollama notes

- Stack runs as 3 services: **`kpv-ollama`** (Ollama on host port 11436), **`kpv-bootstrap`** (one-shot, pulls `qwen2.5:7b` if missing), **`kpv-api`** (FastAPI on host port 8765).
- Host port 11436 is used because port 11434 is already taken on this dev machine by `arch-assistant-ollama`. Inside the Docker network the api still talks to ollama on `:11434`.
- GPU is enabled by default in `docker-compose.yml` via NVIDIA reservations. Comment out the `deploy` block if you don't have NVIDIA Container Toolkit.
- `OLLAMA_MODEL` defaults to `qwen2.5:7b`. Change in `docker-compose.yml` (or via env) — bootstrap will pull it on next `up`.
- Vite proxies `/api/*` → `http://localhost:8765` (see `vite.config.ts`).

## History

Originally scaffolded by Lovable; detached and now developed directly. No `lovable-tagger`, no Lovable-specific Playwright config, no binary lockfile.

## Git

Single-branch workflow: **work directly on `main`**. No feature branches unless explicitly requested.

## Quick checks before declaring work done

1. `bun run lint` — no new errors.
2. `bun test` — all unit tests pass.
3. For UI changes, run `bun dev` and verify in the browser; type-check alone doesn't validate UI.
