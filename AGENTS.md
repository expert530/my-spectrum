# AGENTS.md

My Spectrum is a privacy-first, client-only React + Vite + TypeScript PWA. Users rate six
neurodiversity metrics (0–5), get sourced support strategies, and share a profile via URL/QR
(opens a read-only viewing mode) or export CSV/plaintext. There is no backend. See
[README.md](README.md) for features and architecture.

## Where things live

- `src/App.tsx` — app state, shared-URL loading, edit/share/legal views, contact form
- `src/components/` — UI; `src/lib/` — logic (`metrics.ts`, `recommendations.ts`, `sharing.ts`)
- `src/data/` — `allSettingValues.json` (score descriptions), `resources.ts` (links)
- `src/types/index.ts` — shared types (`MetricName`, `MetricScore`, `Strategy`)
- `public/` — `service-worker.js`, `manifest.json`, `icons/` (copied unhashed to the site root)
- Tests: `src/__tests__/` (unit), `src/test/integration/` (Vitest + jsdom, setup in
  `src/test/setup.ts`), `e2e/` (Playwright, Firefox)

## Invariants

- **Privacy:** no analytics, tracking, cookies, storage or new network calls. Profile data
  leaves the device only in a URL the user chooses to share. Keep
  `src/components/PrivacyPolicy.tsx` accurate if data handling changes.
- **Share URLs are a public contract:** keys `f, si, ss, ms, rp, er, name` live in both
  `src/lib/sharing.ts` and `src/components/ShareModal.tsx`. Renaming them breaks existing QR codes.
- **Metric names are duplicated** across types, `lib/metrics.ts`, both key maps,
  `lib/recommendations.ts`, `allSettingValues.json` and tests. Change them together or not at all.
- **Contact form posts to the live Web3Forms API** (`src/App.tsx`). Never submit it in manual or
  automated testing. The access key is public by design.
- The service worker (`public/service-worker.js`) only registers in production builds
  (`npm run build && npm run preview`). Bump `CACHE_NAME` when its caching logic or precache
  list changes.
- TypeScript is strict (`noUncheckedIndexedAccess`). Use the `@/` alias for `src/`. Prefer
  narrowing to `!` (lint forbids non-null assertions).
- Licence is CC BY-NC-SA 4.0. Only add content you may redistribute under it.

## Commands

Node 22.12+ (CI uses 24). Run `npm ci` to install dependencies. `package.json` scripts are authoritative.

```bash
npm run dev            # http://localhost:5173
npm run type-check     # ┐
npm run lint           # │ all run in CI
npm run format:check   # │ (.github/workflows/ci.yml)
npm run test:run       # │ Vitest
npm run build          # ┘
npm run test:e2e       # optional, local; starts the dev server
```

`lint:fix`, `format` and `lint-staged` rewrite files across the whole repo.

## Skills

- [verify-change](.agents/skills/verify-change/SKILL.md) — checks to run before finishing a change
- [edit-support-content](.agents/skills/edit-support-content/SKILL.md) — edit strategies,
  resources or score descriptions

More: [LINTING_SETUP.md](LINTING_SETUP.md) (lint, format and TypeScript rules),
[.github/workflows/ci.yml](.github/workflows/ci.yml).
