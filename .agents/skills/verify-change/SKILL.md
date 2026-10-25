---
name: verify-change
description: Verify a code, config, content or dependency change in the my-spectrum repo before declaring it done. Use after editing anything under src/, e2e/, public/, config files or package.json, or when asked to "run the checks", "make sure CI passes", or reproduce a CI failure. Covers type-check, lint, Prettier, Vitest, build, optional Playwright E2E and a PWA/offline smoke check.
---

# Verify a change

All commands run from the repo root and are local and deterministic. None of them contact live
services, provided you follow the E2E rules below.

## 1. Fast, scoped feedback

Run the tests closest to what you changed first:

```bash
npx vitest run src/__tests__/lib/sharing.test.ts   # one file
npx vitest run src/__tests__/lib                   # one folder
npx vitest run -t "Recommendations Engine"         # by describe/it name
```

Test locations mirror the source tree: `src/lib/x.ts` → `src/__tests__/lib/x.test.ts`, and
`src/components/X.tsx` → `src/__tests__/components/X.test.tsx`. For changes to `App.tsx` or
cross-component behaviour, use the full-flow tests in `src/test/integration/app-flow.test.tsx`.

## 2. Full local gate

Run every command below and report the result of each. Together they match
`.github/workflows/ci.yml`.

```bash
npm run type-check
npm run lint           # 0 errors required; no-console warnings in src/main.tsx are expected
npm run format:check
npm run test:run
npm run build          # writes dist/ (gitignored)
```

If a check fails in a file you did not touch, re-run it on a clean checkout (`git stash`)
before reporting it as pre-existing. Do not silently fix unrelated files.

## 3. Fixing failures

- To fix formatting, run Prettier on specific files only:
  `npx prettier --write <files>`. Avoid `npm run format`, `npm run lint:fix` and
  `npm run lint-staged`, because they rewrite the whole repo. Use them only if the user asks.
- Lint forbids `!` non-null assertions. With `noUncheckedIndexedAccess`, narrow values instead,
  for example with a guard or destructuring and a throw in tests.
- Shared test setup lives in `src/test/setup.ts`. It mocks `IntersectionObserver` and
  `window.scrollTo`. Component tests mock `qrcode.react` locally with `vi.mock`.
- `npm run test:coverage` writes `coverage/`, which is gitignored. CI uploads it as an
  artifact.

## 4. Optional: E2E (Playwright)

Run E2E for UI, navigation, sharing-flow or PWA changes, or when the user asks:

```bash
npm run test:e2e
npx playwright test -g "Share Flow"
```

- This starts `npm run dev` on port 5173, or reuses a server already running there. Only the
  Firefox project is configured. If browsers are missing, run `npx playwright install firefox`
  (a download) only with the user's consent.
- It writes `playwright-report/` and `test-results/`. Both are gitignored.
- **Never submit the contact form or add a test that does.** It posts to the live Web3Forms API
  and sends a real email. Existing tests only assert that the fields are present.

## 5. Optional: PWA / offline smoke check

Do this when `public/` or `src/main.tsx` changes. The service worker is unregistered in dev, so
test against a production build:

```bash
npm run build && npm run preview   # http://localhost:4173
```

- `dist/` must contain `service-worker.js`, `manifest.json` and `icons/` at its root.
- In a browser, check that the service worker activates and that cache `spectrum-pwa-v<N>`
  holds `/` and the hashed `/assets/*`. Then go offline and confirm that a shared URL such as
  `/?f=1&si=2&ss=3&ms=4&rp=5&er=0` still loads in viewing mode.
- Stop the preview server afterwards.

## 6. Report

List each command with pass or fail, plus anything skipped and why (for example, "E2E not run:
no UI change").
