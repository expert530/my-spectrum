# My Spectrum

> **Visualize. Share. Support.**
>
> A free, privacy-first tool that helps neurodivergent individuals, parents, and educators communicate support needs without lengthy explanations. Adjust six key metrics, generate a shareable QR code, and get personalized, evidence-based strategies — all without creating an account or sending any data to a server.

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Configuration](#configuration)
- [Privacy](#privacy)
- [Contributing](#contributing)
- [License](#license)

---

## Why This Exists

Explaining neurodiversity needs to teachers, therapists, and family members can be exhausting. My Spectrum was built by a parent of a neurodivergent child to make that conversation easier. Instead of filling out forms or writing paragraphs, you simply adjust sliders and share a link.

**No accounts. No tracking. No data collection. Your information never leaves your device.**

---

## Features

### Core Functionality

| Feature                        | Description                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Interactive Metric Sliders** | Adjust six dimensions (Focus, Social Interaction, Sensory Sensitivity, Motor Skills, Routine Preference, Emotional Regulation) on a 0–5 scale |
| **Support Recommendations**    | Evidence-based strategies for parents and teachers based on your profile                                                                      |
| **QR Code Sharing**            | Generate shareable QR codes/URLs to share settings instantly                                                                                  |
| **Viewing Mode**               | Clean, read-only view for teachers, caregivers, and others viewing shared profiles                                                            |
| **CSV Export**                 | Download a comprehensive report for healthcare providers or schools                                                                           |
| **Plaintext Copy**             | Copy your profile as text for emails or documents                                                                                             |
| **Offline-First PWA**          | Installable; works offline after the first visit (production builds)                                                                          |
| **Privacy & Terms Pages**      | Built-in Privacy Policy and Terms of Service                                                                                                  |
| **Contact Form**               | Optional feedback form; sent via Web3Forms only when you submit it                                                                            |
| **Accessibility**              | Skip-to-content link, ARIA landmarks, keyboard navigation                                                                                     |

### Support Levels (0–5 Scale)

| Score | Level        | Description                  |
| ----- | ------------ | ---------------------------- |
| 0–1   | High Support | Needs significant assistance |
| 2–3   | Moderate     | Benefits from some support   |
| 4–5   | Independent  | Manages well independently   |

### Two Modes

1. **Editing Mode** - Interactive sliders for creating and adjusting your profile
2. **Viewing Mode** - Read-only presentation when loading a shared profile URL

---

## Getting Started

### Prerequisites

- **Node.js** 22.12+ (LTS recommended)
- **npm** 9+

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/expert530/my-spectrum.git
   cd my-spectrum
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to http://localhost:5173

### Available Scripts

| Script                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build for production                     |
| `npm run preview`       | Preview production build locally         |
| `npm run test`          | Run tests in watch mode                  |
| `npm run test:run`      | Run tests once                           |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run test:e2e`      | Run Playwright E2E tests (Firefox)       |
| `npm run type-check`    | TypeScript type checking without emit    |
| `npm run lint`          | Run ESLint                               |
| `npm run lint:fix`      | Run ESLint with auto-fix                 |
| `npm run format:check`  | Check formatting with Prettier           |
| `npm run format`        | Format all files with Prettier           |

See [LINTING_SETUP.md](LINTING_SETUP.md) for lint, format and TypeScript rules.

---

## Usage

### Adjusting Metrics

1. Move any slider left/right to set a score (0–5)
2. The metric description updates instantly
3. Use **Low/Mid/High** preset buttons for quick adjustments
4. Click **Reset** to return to default (2)

### Sharing Your Settings

1. Click **Generate QR Code** in the Share section
2. Optionally add your name to personalize the share
3. Others can scan the QR code or use the shareable link
4. Shared links open in **Viewing Mode** - a clean, read-only presentation

### Exporting Data

- **CSV Export**: Click "Download CSV" for a comprehensive report
- **Plaintext**: Click "Show Text" to view/copy all values + descriptions

### Support Strategies

The "What Helps" section displays evidence-based recommendations that update dynamically based on your metric scores.

---

## Project Structure

```
my-spectrum/
├── .github/workflows/ci.yml    # CI: type-check, lint, format, tests, build
├── .agents/skills/             # Task guides for AI coding agents (see AGENTS.md)
├── e2e/app.spec.ts             # Playwright E2E tests
├── public/                     # Copied as-is to the site root on build
│   ├── service-worker.js       # Offline caching (production only)
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # PWA icons (192 and 512 px)
├── src/
│   ├── main.tsx                # Entry point; registers the service worker in production
│   ├── App.tsx                 # Root component: state, URL loading, edit/share/legal views
│   ├── styles.css              # Global styles and CSS variables
│   ├── components/             # UI components (sliders, viewing mode, legal pages, …)
│   ├── data/
│   │   ├── allSettingValues.json  # 0–5 score descriptions for each metric
│   │   └── resources.ts        # Curated resource links
│   ├── lib/
│   │   ├── metrics.ts          # Shared metric utilities and constants
│   │   ├── recommendations.ts  # Strategy table and recommendation engine
│   │   └── sharing.ts          # CSV, plaintext and URL parsing
│   ├── types/index.ts          # Shared TypeScript types
│   ├── __tests__/              # Unit tests (mirrors components/, data/, lib/, types/)
│   └── test/
│       ├── setup.ts            # Vitest setup (jest-dom, browser API mocks)
│       └── integration/        # Full-app flow tests
├── index.html                  # HTML entry point
├── AGENTS.md                   # Guidance for AI coding agents
├── LINTING_SETUP.md            # Lint, format and TypeScript rules
├── eslint.config.mjs, .prettierrc.json, tsconfig.json
└── vite.config.ts, vitest.config.ts, playwright.config.ts
```

---

## Architecture

### Key Design Decisions

1. **Single Page Application** - React with Vite for fast development and optimized builds
2. **Zero Backend** - All data processing happens client-side; privacy by design
3. **URL-based Sharing** - Metrics encoded in query parameters for stateless sharing
4. **Offline-First PWA** - A service worker caches the app shell and assets for offline use

### Component Architecture

```
App.tsx
├── SectionNav                # Sticky navigation
├── MetricSlider[]            # One per metric (edit view)
├── Share view                # QR code, link, CSV and plaintext (rendered inline)
├── SupportStrategiesSection
├── ResourcesSection
├── CollapsibleSection[]      # Wraps strategies, resources and About/contact
├── PrivacyPolicy / TermsOfService
└── ViewingMode               # Displayed when loading a shared URL
    ├── ProfileCard[]         # Read-only metric cards
    └── Embedded strategies/resources
```

### Data Flow

```
User Input → MetricSlider → App State → URL/QR Generation
                                     → Recommendations Engine
                                     → CSV/Plaintext Export
```

### Share URL Format

Shared links use short query keys: `f` (Focus), `si` (Social Interaction), `ss` (Sensory
Sensitivity), `ms` (Motor Skills), `rp` (Routine Preference), `er` (Emotional Regulation), each
0–5, plus an optional `name`. Existing QR codes depend on these keys, so they must not change.
URLs are built by `generateShareUrl` in `src/components/ShareModal.tsx` and parsed in
`src/App.tsx` and `src/lib/sharing.ts`.

### Shared Utilities (`src/lib/metrics.ts`)

Centralized functions to avoid duplication:

- `getMetricEmoji()`, `getMetricColorClass()` - Per-metric emoji and CSS class
- `getSupportLevel()`, `getSupportLevelLabel()`, `getSupportInfo()` - Support level, label and colors
- `getIntensityLabel()`, `getScoreColor()` - Low/Medium/High labels and color coding
- `isValidMetricScore()`, `isValidMetricName()` - Type guards for validation
- Constants: `METRIC_NAMES`, `MAX_METRIC_SCORE`, `DEFAULT_METRIC_SCORE`

---

## Testing

### Test Framework

- **Vitest** - Fast, Vite-native test runner
- **Testing Library** - React component testing utilities
- **jsdom** - Browser environment simulation

### Running Tests

```bash
# Watch mode (development)
npm run test

# Single run (CI)
npm run test:run

# With coverage report
npm run test:coverage
```

### Test Structure

Unit tests live in `src/__tests__/`, mirroring the source folders:

| Area          | Files                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `lib/`        | `metrics`, `recommendations`, `sharing` (CSV, plaintext, URL parsing)                              |
| `components/` | `MetricSlider`, `ProfileCard`, `ShareModal` (share URL), `SupportStrategiesSection`, `ViewingMode` |
| `data/`       | `resources` (resource data validation)                                                             |
| `types/`      | Type definitions                                                                                   |

### Integration Tests

Located in `src/test/integration/`, these tests verify:

- Full user flows (editing → sharing → viewing)
- URL parameter handling
- Mode switching behavior

### End-to-End Tests

`e2e/app.spec.ts` runs in Playwright (Firefox) against the dev server, which it starts
automatically:

```bash
npx playwright install firefox   # first time only
npm run test:e2e                 # or npm run test:e2e:headed
```

The contact-form tests only check the form fields; they never submit it, because submitting
sends a real message.

---

## Building for Production

```bash
npm run build
```

Output is generated in `dist/`:

- Minified and optimized JS/CSS bundles
- Asset hashing for cache busting
- `public/` contents (service worker, PWA manifest, icons) copied unhashed to the root

### Preview Production Build

```bash
npm run preview
```

The service worker only registers in production builds, so use `npm run preview` to test
offline behaviour.

### Deployment

The `dist/` folder can be deployed to any static hosting service. It must be served from the
domain root (Vite `base: '/'`) over HTTPS for the service worker to work:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

---

## Configuration

### Environment Variables

None required - the app is fully client-side.

### TypeScript Configuration

Path aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite Configuration

See `vite.config.ts` for:

- React plugin setup
- Path alias resolution
- Dev server port (5173)

### Vitest Configuration

See `vitest.config.ts` for:

- jsdom environment
- Test file patterns
- Coverage configuration

---

## Privacy

**Your privacy matters:** Your profile stays on your device and is never sent to a server.

- **No analytics** - Zero tracking scripts
- **No accounts** - No user data stored anywhere
- **No cookies** - No persistent identifiers
- **URL-only sharing** - Shared links and QR codes contain only the metric scores (0–5) and an optional name
- **Offline cache** - The service worker caches app files only, never your profile
- **Contact form** - Only what you type is sent to Web3Forms, and only when you submit it
- **Open source** - Verify the code yourself

---

## Contributing

Contributions are welcome! Please follow these guidelines:

> **AI coding agents:** start with [AGENTS.md](AGENTS.md). Task-specific skills live in [`.agents/skills/`](.agents/skills/).

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm run test:run`
5. Run type check: `npm run type-check`
6. Run lint: `npm run lint`
7. Check formatting: `npm run format:check`
8. Commit with descriptive message
9. Push and open a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint with recommended rules
- Prettier for formatting (`npm run format:check`)
- JSDoc comments for public APIs

### Commit Messages

Follow conventional commits:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

---

## License

This project is licensed under **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International).

You are free to share and adapt this work, but:

- **Attribution** — You must give appropriate credit
- **NonCommercial** — You may not use it for commercial purposes
- **ShareAlike** — Derivatives must use the same license

See [LICENSE](LICENSE) for details.

---

## Support

If you find this tool helpful, consider [buying me a coffee](https://ko-fi.com/myspectrumsettings) ☕

---

## Acknowledgments

- Evidence-based strategies sourced from peer-reviewed research
- Resources from Understood.org, CHADD, ADDitude, and ASAN
- Built with React, Vite, and TypeScript
- QR code generation by qrcode.react
