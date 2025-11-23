# My Spectrum Settings — PWA Proof of Concept

A modern Progressive Web App that lets users visualize and self-regulate their neurodiversity "settings" across six key metrics: **Focus**, **Social Interaction**, **Sensory Sensitivity**, **Motor Skills**, **Routine Preference**, and **Emotional Regulation**.

## Features

### Core Functionality
- **Interactive Metric Sliders** — Each metric (0–10 scale) has a smooth slider with real-time description updates and a pulsing badge animation on change.
- **Responsive Modern UI** — Clean, centered layout with card-based design, accessible controls, and full mobile/tablet support. Colors use an indigo/violet accent palette for a professional, non-childish feel.
- **Real-time Plaintext Output** — Below the metrics, a selectable plaintext block displays all metric values and descriptions. Updates live as you move sliders so you can easily copy/paste data.
- **CSV Export** — Download your current metric snapshot as a CSV file (`spectrum-metrics.csv`) with category, score, and description columns.
- **Supabase Auth (Email/Password)** — Sign up and sign in with email/password. JWT tokens are securely stored locally (encrypted in IndexedDB) for future Supabase sync.
- **Local Encrypted Storage** — All metric changes are logged to IndexedDB using XChaCha20-Poly1305 symmetric encryption (libsodium-wrappers). An install-derived key encrypts entries automatically.
- **Offline-First PWA** — Works fully offline with a Service Worker that caches assets. When connectivity returns, queued changes can be synced to Supabase (scaffolded; not yet integrated).

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone or download this repository.

2. Install dependencies:
```bash
npm install
```

3. **(Optional) Configure Supabase** for backend sync:
   - Create a `.env` file in the project root:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```
   - Or set environment variables on your system (e.g., in `~/.profile` or `~/.bashrc`):
   ```bash
   export VITE_SUPABASE_URL="https://your-project.supabase.co"
   export VITE_SUPABASE_ANON_KEY="your-public-anon-key"
   ```

4. Run the dev server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser.

## Usage

### Adjusting Metrics
- Move any slider left/right to set a score (0–10).
- The metric description updates instantly and a small animation plays.
- Changes are automatically logged to encrypted IndexedDB.

### Exporting Data
- Click **Export CSV** to download your current metrics as a CSV file.
- Use the **Plaintext metrics** block to select and copy all values + descriptions at once.

### Authentication (Optional)
- Use the **Sign in / Sign up** form to create an account or log in via Supabase Auth.
- Your JWT token is stored locally and can be used for future backend sync.

## Architecture & Security Notes

### Storage & Encryption
- All metric logs are encrypted with XChaCha20-Poly1305 (libsodium-wrappers) before being written to IndexedDB.
- An installation-derived key is generated on first use and stored locally for decryption at runtime.
- **Important**: This POC uses a simple symmetric encryption approach. For production and true post-quantum safety, integrate a KEM library like `liboqs-js` to wrap/unwrap keys with Kyber/NTRU.

### Service Worker & Offline
- The Service Worker is disabled in development to avoid cached stale bundles. In production builds, it caches assets for offline use.
- Sync to Supabase when connectivity returns is scaffolded but not yet fully integrated.

### Supabase Auth
- Email/password authentication only (no social providers).
- The public anon key is safe to include in client code; it is used for public operations and sign-up/login.
- Never commit service-role or admin keys to source control.

## Project Structure

```
my-spectrum-settings/
├── src/
│   ├── main.jsx              # App entry point; registers service worker (prod only)
│   ├── App.jsx               # Main app component (metrics state, CSV export)
│   ├── styles.css            # Global styles (colors, grid, card styling)
│   ├── components/
│   │   ├── MetricSlider.jsx  # Slider component for each metric
│   │   └── AuthPanel.jsx     # Sign in/sign up form
│   └── lib/
│       ├── encryption.js     # libsodium-based encrypt/decrypt helpers
│       ├── db.js             # IndexedDB wrapper (idb library)
│       └── supabaseClient.js # Supabase client factory
├── allSettingValues.json     # Metric definitions (0–10 with descriptions)
├── index.html                # HTML entry point
├── manifest.json             # PWA manifest for installability
├── service-worker.js         # Service Worker for asset caching (prod)
├── package.json              # Dependencies (React, Supabase, libsodium, idb, Vite)
├── vite.config.js            # Vite configuration
├── .env                       # (gitignored) Supabase config
└── README.md                  # This file
```

## Environment Variables

### Development
Set via `.env` file or system environment:
- `VITE_SUPABASE_URL` — Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Your Supabase public anon key

Both are exposed to the client and are safe (anon key is intended for public use).

### System-wide (Linux)
Add to `~/.profile` for persistence across reboots:
```bash
export VITE_SUPABASE_URL="https://your-project.supabase.co"
export VITE_SUPABASE_ANON_KEY="your-key"
source ~/.profile
```

## Building for Production

```bash
npm run build
```

Output is in `dist/`. The Service Worker will be registered in production builds to enable offline caching and PWA install prompts.

## Known Limitations & Future Work

- **Post-Quantum Cryptography**: Currently uses XChaCha20-Poly1305 (not post-quantum). To meet true PQ requirements, integrate `liboqs-js` or similar for Kyber/NTRU KEM-based key wrapping.
- **Backend Sync**: Sync to Supabase is scaffolded but not yet connected. Requires a Supabase table schema and background sync logic.
- **JWT Storage**: Currently stored with a simple encryption scheme. For production, use proper key escrow or derive keys from passwords.
- **Tests**: No test suite yet. Add Jest/Vitest + React Testing Library for unit and integration tests.
- **Accessibility**: Keyboard controls for sliders can be improved; ARIA labels refined.

## Development Notes

### Service Worker in Development
- The Service Worker is unregistered during development to avoid stale cached bundles.
- To manually clear service workers:
  - Open DevTools → Application → Service Workers → Unregister
  - Or run in the console: `navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()))`

### Debugging
- Use React DevTools browser extension for component inspection.
- IndexedDB contents are visible in DevTools → Storage → IndexedDB.
- Encrypted logs are stored as base64 strings; decryption happens at runtime when the app loads.

## License

This is a proof-of-concept. Use freely for educational and development purposes.

## Contributing

Feedback and PRs welcome. Key areas for improvement:
- Post-quantum KEM integration
- Backend sync implementation
- Enhanced accessibility
- Test coverage
- UI refinement and animations

