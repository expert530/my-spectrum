# My Spectrum

> **Visualize. Share. Support.**
>
> A free, privacy-first tool that helps neurodivergent individuals, parents, and educators communicate support needs without lengthy explanations. Adjust six key metrics, generate a shareable QR code, and get personalized, evidence-based strategies — all without creating an account or sending any data to a server.

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [Features](#features)
- [Live Demo](#live-demo)
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

| Feature | Description |
|---------|-------------|
| **Interactive Metric Sliders** | Adjust six dimensions (Focus, Social Interaction, Sensory Sensitivity, Motor Skills, Routine Preference, Emotional Regulation) on a 0–5 scale |
| **Support Recommendations** | Evidence-based strategies for parents and teachers based on your profile |
| **QR Code Sharing** | Generate shareable QR codes/URLs to share settings instantly |
| **Viewing Mode** | Clean, read-only view for teachers, caregivers, and others viewing shared profiles |
| **CSV Export** | Download a comprehensive report for healthcare providers or schools |
| **Plaintext Copy** | Copy your profile as text for emails or documents |
| **Offline-First PWA** | Works fully offline, installable on any device |
| **Privacy & Terms Pages** | Built-in Privacy Policy and Terms of Service |
| **Accessibility** | Skip-to-content link, ARIA landmarks, keyboard navigation |

### Support Levels (0–5 Scale)

| Score | Level | Description |
|-------|-------|-------------|
| 0–1 | High Support | Needs significant assistance |
| 2–3 | Moderate | Benefits from some support |
| 4–5 | Independent | Manages well independently |

### Two Modes

1. **Editing Mode** - Interactive sliders for creating and adjusting your profile
2. **Viewing Mode** - Read-only presentation when loading a shared profile URL

---

## Live Demo

Visit the live app at: [Your deployed URL here]

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
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

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run type-check` | TypeScript type checking without emit |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |

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
my-spectrum-settings/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── src/
│   ├── main.tsx                # Application entry point
│   ├── App.tsx                 # Root component with routing logic
│   ├── styles.css              # Global styles and CSS variables
│   ├── vite-env.d.ts           # Vite type declarations
│   ├── components/
│   │   ├── CollapsibleSection.tsx  # Collapsible content wrapper
│   │   ├── MetricSlider.tsx    # Interactive slider component
│   │   ├── ProfileCard.tsx     # Read-only metric card (viewing mode)
│   │   ├── PrivacyPolicy.tsx   # Privacy Policy page
│   │   ├── ResourcesSection.tsx
│   │   ├── SectionNav.tsx      # Sticky navigation
│   │   ├── ShareModal.tsx      # QR code generation modal
│   │   ├── SupportStrategiesSection.tsx
│   │   ├── TermsOfService.tsx  # Terms of Service page
│   │   └── ViewingMode.tsx     # Read-only profile view
│   ├── data/
│   │   ├── resources.ts        # Curated resource links
│   │   └── resources.test.ts
│   ├── lib/
│   │   ├── metrics.ts          # Shared metric utilities
│   │   ├── recommendations.ts  # Strategy generation engine
│   │   ├── sharing.ts          # CSV, plaintext, URL utilities
│   │   └── sharing.test.ts
│   ├── test/
│   │   ├── setup.ts            # Test environment setup
│   │   └── integration/        # Integration test suites
│   └── types/
│       ├── index.ts            # TypeScript type definitions
│       └── index.test.ts
├── allSettingValues.json       # Metric definitions (0–5 scale descriptions)
├── index.html                  # HTML entry point
├── manifest.json               # PWA manifest
├── service-worker.js           # Offline caching
├── package.json
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
└── vitest.config.ts            # Test runner configuration
```

---

## Architecture

### Key Design Decisions

1. **Single Page Application** - React with Vite for fast development and optimized builds
2. **Zero Backend** - All data processing happens client-side; privacy by design
3. **URL-based Sharing** - Metrics encoded in query parameters for stateless sharing
4. **Offline-First PWA** - Service Worker caches assets for offline use

### Component Architecture

```
App.tsx
├── SectionNav          # Sticky navigation
├── MetricSlider[]      # One per metric (editing mode)
├── ShareModal          # QR code generation
├── SupportStrategiesSection
├── ResourcesSection
└── ViewingMode         # Displayed when loading shared URL
    ├── ProfileCard[]   # Read-only metric cards
    └── Embedded strategies/resources
```

### Data Flow

```
User Input → MetricSlider → App State → URL/QR Generation
                                     → Recommendations Engine
                                     → CSV/Plaintext Export
```

### Shared Utilities (`src/lib/metrics.ts`)

Centralized functions to avoid duplication:
- `getMetricEmoji()` - Emoji for each metric
- `getSupportInfo()` - Support level with colors
- `getIntensityLabel()` - Low/Medium/High labels
- `getScoreColor()` - Visual color coding
- `isValidMetricScore()` - Type guard for validation
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

| File | Coverage |
|------|----------|
| `MetricSlider.test.tsx` | Component rendering, user interactions, keyboard navigation |
| `ShareModal.test.ts` | URL generation, QR code rendering |
| `SupportStrategiesSection.test.tsx` | Strategy display, metric correlation |
| `sharing.test.ts` | CSV generation, URL parsing, plaintext output |
| `resources.test.ts` | Resource data validation |
| `index.test.ts` | Type definitions and type guards |

### Integration Tests

Located in `src/test/integration/`, these tests verify:
- Full user flows (editing → sharing → viewing)
- URL parameter handling
- Mode switching behavior

---

## Building for Production

```bash
npm run build
```

Output is generated in `dist/`:
- Minified and optimized JS/CSS bundles
- Asset hashing for cache busting
- PWA manifest and service worker

### Preview Production Build

```bash
npm run preview
```

### Deployment

The `dist/` folder can be deployed to any static hosting service:
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
- Build optimization settings

### Vitest Configuration

See `vitest.config.ts` for:
- jsdom environment
- Test file patterns
- Coverage configuration

---

## Privacy

**Your privacy matters:** All data stays on your device. Nothing is sent to any server.

- **No analytics** - Zero tracking scripts
- **No accounts** - No user data stored anywhere
- **No cookies** - No persistent identifiers
- **URL-only sharing** - The QR code contains only metric scores (0-5 values)
- **Open source** - Verify the code yourself

---

## Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm run test:run`
5. Run type check: `npm run type-check`
6. Run lint: `npm run lint`
7. Commit with descriptive message
8. Push and open a Pull Request

### Code Style

- TypeScript strict mode enabled
- ESLint with recommended rules
- Prettier for formatting (optional)
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
