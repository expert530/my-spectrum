# Linting, Formatting & Type Checking

How code quality is enforced in this repo. The config files are the source of truth; this page
summarises them.

## Commands

| Command                | What it does                                    | In CI |
| ---------------------- | ----------------------------------------------- | ----- |
| `npm run type-check`   | `tsc --noEmit` over `src/` and `e2e/`           | Yes   |
| `npm run lint`         | ESLint over the repo (fails on errors only)     | Yes   |
| `npm run format:check` | Prettier check over the repo                    | Yes   |
| `npm run lint:fix`     | ESLint with auto-fix (rewrites files)           | —     |
| `npm run format`       | Prettier write (rewrites files)                 | —     |
| `npm run lint-staged`  | `lint:fix` + `format` + `type-check` in one run | —     |

`lint-staged` is a plain script, not the `lint-staged` package, and there are no git hooks.
To format only what you changed, run `npx prettier --write <files>`.

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs type-check, lint and format
check, then the Vitest suite and the production build.

## TypeScript — [`tsconfig.json`](tsconfig.json)

- `strict` plus `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`,
  `noImplicitOverride`, `noImplicitReturns`, `noUnusedLocals` and `noUnusedParameters`.
- `noEmit`; Vite does the bundling. `moduleResolution: bundler` and `isolatedModules`.
- Path alias `@/*` → `src/*`. It is also configured in `vite.config.ts` and
  `vitest.config.ts`.

Because of `noUncheckedIndexedAccess`, indexing an array or record yields `T | undefined`.
Narrow the value with a guard instead of using `!`, which lint rejects.

## ESLint — [`eslint.config.mjs`](eslint.config.mjs)

ESLint 9 flat config:

- **TS/TSX:** `@eslint/js` recommended plus `typescript-eslint` `recommended`, `strict` and
  `stylistic`, with type information from `tsconfig.json`. Notable rules:
  - `no-non-null-assertion`, from the strict config: error
  - unused variables: error, unless the name starts with `_`
  - `no-explicit-any`: warn
  - `prefer-nullish-coalescing` and `prefer-optional-chain`: warn
  - `semi`, `quotes` (single), `prefer-const` and `no-var`: error
  - `no-console`: warn (`console.warn` and `console.error` are allowed)
- **Tests** (`__tests__/`, `*.test.*`, `*.spec.*`): Vitest globals are allowed, and
  `no-explicit-any` and `no-console` are off.
- **Config files:** type-aware linting is disabled.
- **Ignored:** `node_modules/`, `dist/`, `build/`, `coverage/`, `playwright-report/`,
  `test-results/`.

`eslint-plugin-react`, `eslint-plugin-react-hooks` and `eslint-config-prettier` are installed
but not enabled in the config yet.

## Prettier — [`.prettierrc.json`](.prettierrc.json)

Single quotes, semicolons, 2-space indent, 100-character lines, ES5 trailing commas and LF line
endings. Ignored paths are listed in [`.prettierignore`](.prettierignore).

## Editor setup (optional)

In VS Code, install the ESLint (`dbaeumer.vscode-eslint`) and Prettier
(`esbenp.prettier-vscode`) extensions. Then set `"editor.defaultFormatter":
"esbenp.prettier-vscode"` and `"editor.formatOnSave": true` in your user or workspace
settings.
