# Code Linting & Formatting Setup (April 2026 Best Practices)

## Overview

Your project now has comprehensive linting and code formatting configured with the latest 2026 best practices for TypeScript and React development.

## What Was Added

### 1. ESLint (Modern Flat Config)
- **File**: `eslint.config.mjs`
- **Format**: ESLint 9+ flat config (the new standard)
- **Features**:
  - TypeScript support via `typescript-eslint`
  - Strict type checking rules
  - React/JSX support (modern React 17+ compatible)
  - Test-specific configuration for Vitest
  - Global ignore patterns built-in

### 2. Prettier Code Formatter
- **File**: `.prettierrc.json`
- **Configuration**:
  - Single quotes
  - Semicolons enforced
  - 2-space indentation
  - 100-character line width
  - Unix line endings (LF)
  - Trailing commas (ES5)

### 3. Updated TypeScript Configuration
- **File**: `tsconfig.json` (enhanced)
- **Key Improvements**:
  - All strict mode options enabled
  - `noUncheckedIndexedAccess`: Prevents unsafe index access
  - `noImplicitOverride`: Enforces explicit `override` keyword
  - `noPropertyAccessFromIndexSignature`: Type safety for objects
  - `verbatimModuleSyntax`: Modern import/export handling
  - `declaration` + `declarationMap`: Generated type definitions

### 4. New NPM Scripts

```json
"lint": "eslint .",              // Check for lint errors
"lint:fix": "eslint . --fix",    // Auto-fix lint errors
"format": "prettier --write .",  // Format all files
"format:check": "prettier --check ."  // Check formatting
"lint-staged": "eslint . --fix && prettier --write . && tsc --noEmit"
```

## Usage

### Check for Issues
```bash
npm run lint              # ESLint only
npm run format:check      # Prettier formatting
npm run type-check        # TypeScript compiler
```

### Fix Issues Automatically
```bash
npm run lint:fix          # Fix linting issues
npm run format            # Fix formatting
npm run lint-staged       # All checks + fixes in one command
```

### Run in Development
```bash
npm run dev     # Vite dev server (code will be checked on save if IDE integration is enabled)
```

## Linting Rules Enforced

### JavaScript/TypeScript (All Files)
- ✅ **Semicolons required**: `semi: error`
- ✅ **Single quotes**: `quotes: error`
- ✅ **No unused variables**: `no-unused-vars: error`
- ✅ **Prefer const**: `prefer-const: error`
- ✅ **No var keyword**: `no-var: error`
- ✅ **No console in production**: `no-console: warn` (allows warn/error)

### TypeScript-Specific
- ✅ **No explicit any**: `@typescript-eslint/no-explicit-any: warn`
- ✅ **Unused variables**: Catches both TS and JS unused vars
- ✅ **Nullish coalescing**: `@typescript-eslint/prefer-nullish-coalescing: warn`
- ✅ **Optional chaining**: `@typescript-eslint/prefer-optional-chain: warn`
- ✅ **Strict configs**: Recommended + Strict + Stylistic from typescript-eslint

### React/JSX
- ✅ **React in JSX scope**: Not required (React 17+ compatible)
- ✅ **No prop-types**: Using TypeScript instead

### Test Files (`.test.ts`, `.spec.ts`, etc.)
- ✅ **Allow explicit any**: Disabled for tests (more flexibility)
- ✅ **Allow console**: Disabled for tests
- ✅ **Vitest globals** supported: `describe`, `it`, `test`, `expect`, etc.

## Configuration Files

### `eslint.config.mjs`
Modern flat config format with:
- Global ignores (node_modules, dist, coverage, etc.)
- JavaScript baseline rules
- TypeScript-specific rules with parser configuration
- React/JSX file handling
- Test file exceptions
- Config file exceptions

### `.prettierrc.json`
Formatter configuration with consistent style settings for:
- Code indentation
- Line lengths
- Quote styles
- Trailing commas
- End-of-line handling

### `tsconfig.json` (Enhanced)
Stricter compiler options for:
- Type safety
- Null/undefined checking
- Return type inference
- Unused variable detection
- Property access safety

### `.prettierignore`
Files ignored by Prettier (built files, dependencies, etc.)

## IDE Integration

### VS Code
The project will benefit from:
1. **ESLint Extension** (`dbaeumer.vscode-eslint`): Real-time linting
2. **Prettier Extension** (`esbenp.prettier-vscode`): Format on save

Add to `.vscode/settings.json` for automatic fixing:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Type Errors Found

The stricter TypeScript configuration has identified type issues in test files that should be fixed:

```
src/__tests__/components/MetricSlider.test.tsx:7
src/__tests__/components/ProfileCard.test.tsx:13
src/__tests__/components/SupportStrategiesSection.test.tsx:7
src/__tests__/components/ViewingMode.test.tsx:15
src/test/integration/app-flow.test.tsx:13
```

These are mostly related to:
- Missing type imports from `@testing-library/react`
- Parameters needing explicit type annotations

### How to Fix
1. Run `npm run type-check` to see all errors
2. Add proper imports: `import { screen, fireEvent, waitFor } from '@testing-library/react'`
3. Add type annotations to function parameters like `(link: unknown)` or `(slider: Element)`

## Dependencies Added

```json
{
  "eslint": "^10.2.1",
  "typescript-eslint": "^8.x",
  "@eslint/js": "^9.x",
  "prettier": "^3.4.x",
  "eslint-config-prettier": "^9.x",
  "eslint-plugin-react": "^7.x",
  "eslint-plugin-react-hooks": "^4.x"
}
```

## Best Practices Implemented (April 2026)

1. **Flat Config Format**: Modern ESLint 9+ format (recommended over legacy .eslintrc)
2. **TypeScript Support**: Full type-aware linting with typescript-eslint
3. **Strict Mode**: Maximum type safety with all strict compiler options
4. **Prettier Integration**: Consistent code formatting separate from linting
5. **React Best Practices**: Modern React 17+ compatible configuration
6. **Test Exceptions**: Relaxed rules for test files where needed
7. **Global Ignores**: Built-in ignores without separate .eslintignore file
8. **Naming Conventions**: Enforced camelCase for variables, PascalCase for types
9. **Code Quality**: Rules for detecting unused code and common mistakes
10. **Developer Experience**: Automatic fixing and formatting capabilities

## Next Steps

1. **Fix existing TypeScript errors**: Run `npm run type-check` and address the reported issues
2. **Set up IDE integration**: Install ESLint and Prettier extensions in VS Code
3. **Pre-commit hooks** (optional): Consider adding `husky` and `lint-staged` for automatic checks before commits
4. **CI/CD Integration**: Add linting checks to your GitHub Actions workflow

## Resources

- **ESLint Documentation**: https://eslint.org/docs/latest/
- **TypeScript-ESLint**: https://typescript-eslint.io/
- **Prettier Documentation**: https://prettier.io/docs/
- **ESLint Flat Config Migration**: https://eslint.org/docs/latest/use/configure/migration-guide

---

**Setup Date**: April 25, 2026  
**Configuration Version**: 1.0.0  
**Standards Compliance**: ESLint 10+, TypeScript 5.8+, React 18.2+
