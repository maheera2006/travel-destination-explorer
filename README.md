# Travel Destination Explorer
> **Web Technology Capstone Project**  
> Built strictly to the **Production-Ready Standard**: fully validated, defensive against failure, accessible (WCAG 2.2 AA), responsive across all devices (320px–2560px), and engineered with verified data, graceful degradation, and client-side persistence.

---

## 🛠️ Changelog — Bug Fixes & Usability Hardening

The following issues were identified via manual QA and fixed:

1. **Shared debounce timer (`js/components/tripFinder.js`)** — the budget slider, days slider, and search box previously shared a single `this.debounceTimer`. Rapidly interacting with more than one control cancelled the other's pending update, so changes were silently dropped. Each control now uses its own dedicated timer (`_budgetDebounce`, `_daysDebounce`, `_searchDebounce`).
2. **Currency-blind budget display** — the Trip Finder's budget label, the results counter, the Compare modal header, and the map popups were hardcoded to `$` regardless of the selected currency. All now read from `APP_CONFIG.CURRENCIES[appStore.activeCurrency]`, matching the pattern already used correctly in the destination cards.
3. **Currency changes didn't propagate everywhere** — switching currency only re-rendered the destination grid. It now also re-renders the Trip Finder and refreshes map markers/popups.
4. **Budget slider floor too high** — the minimum was hardcoded to `200`, making it impossible to test low-budget / no-match scenarios. Lowered to `50`.
5. **Matching engine baked a currency symbol into its summary text** — `matching.js` is meant to be a pure, currency-agnostic function (§12.1), but its over-budget summary line hardcoded a `$` figure. Replaced with a currency-neutral percentage (e.g. "Exceeds your budget by roughly 22%"), since the exact converted figure is already shown correctly elsewhere.
6. **Removed dead code** — `js/components/filterBar.js` was an unused leftover from an earlier catalog-style version of the app (superseded by the Trip Finder's built-in search) and was never imported anywhere. Removed to avoid confusion.

All 88 existing automated tests (`tests/run-node-tests.mjs`) pass after these changes with no regressions.

> **Note:** the feature list below still describes some phrasing from the earlier catalog-style version of the app (e.g. "category chips"). The actual current UI is the Decision-First Trip Finder described in the product spec — worth a documentation pass if this README is submitted as-is.

---

## 🌟 Overview & Key Features

* **Instant Multi-Facet Discovery**: Search across 16 global destinations by text query, vibe category chips (*Cultural, Nature, Beach, Mountain, Romantic, Adventure*), continent, budget tier, and best travel season.
* **Truthful Weather Service**: Retrieves current weather from Open-Meteo API when online, caches results with a 30-minute TTL, and gracefully degrades to verified regional seasonal averages when offline or disconnected.
* **Dynamic Budget Calculator**: Computes personalized trip estimates using the formula:
  $$\text{Adjusted Cost} = \left(\text{dailyCost} \times \text{travelers} \times \text{days}\right) \times \text{styleMultiplier}$$
  with clear fixed reference currency conversion (USD, EUR, GBP, JPY, INR).
* **Interactive Geographic Map**: Leaflet.js / OpenStreetMap integration with synchronized pins, falling back to a structured tabular location overview if offline or if CDN tiles fail.
* **Persistent "My Trips" (CRUD)**: Guest-first storage engine utilizing versioned `localStorage` (`travelExplorer:v1`) with full support for custom itinerary notes, deletion with undo toasts, and safe JSON backup/restore.
* **Safe JSON Backup & Restore**: Data import includes schema validation, an import preview, and explicit **Merge** or **Replace** choices.
* **Accessible Architecture**: Native HTML5 `<dialog>` elements with focus restoration, backdrop dismiss, Escape key handlers, and complete keyboard navigation.

---

## 🏗️ Architecture & Component Design

```
                         TRAVEL DESTINATION EXPLORER
                                      │
                              ┌───────▼───────┐
                              │   UI / DOM    │
                              │ (Web Semantic)│
                              └───────┬───────┘
                                      │
                              ┌───────▼───────┐
                              │   App Store   │
                              │(Single Source)│
                              └───────┬───────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
             Trip Repository   Weather Service     Map Service
             (Abstraction)      (Open-Meteo)      (Leaflet.js)
                    │                 │                 │
                    ▼                 ▼                 ▼
           LocalTripRepository   Cache Layer       Tile Loader
           (localStorage:v1)   (30-min TTL)             │
                    │                 │                 ▼
                    ▼                 ▼          [Success: Map]
               Validated         [Success: Live] [Fail: Text Info
               JSON Data         [Fail: Seasonal]  Location Panel]
```

### Directory Structure
```text
travel-destination-explorer/
├── index.html                       # Semantic HTML5, accessible shell, native dialogs
├── manifest.json                    # Web App Manifest for PWA readiness
├── css/
│   ├── variables.css                # Color tokens, typography, Dark/Light mode tokens
│   ├── base.css                     # Reset, base typography, accessible focus outlines
│   ├── layout.css                   # CSS Grid, Flexbox, responsive shell, containers
│   ├── components.css               # Cards, badges, modals, drawers, toasts, calculator
│   └── responsive.css               # 320px, 360px, 414px, 768px, 1024px, 1440px, 2560px
├── js/
│   ├── config.js                    # App constants, reference currency rates, TTL configs
│   ├── data/
│   │   └── destinations.js          # 16 verified destinations with complete metadata & weather fallbacks
│   ├── models/
│   │   ├── validator.js             # Data-only validation, bounds check, URL safety validator
│   │   └── schema.js                # Schema definitions & migrations for travelExplorer:v1
│   ├── repositories/
│   │   ├── tripRepository.js        # Repository base contract
│   │   └── localTripRepository.js   # Production localStorage implementation with schema migration
│   ├── services/
│   │   ├── logger.js                # Client-side diagnostic logger (no production console spam)
│   │   ├── cacheService.js          # In-memory & storage TTL cache manager
│   │   ├── weatherService.js        # Open-Meteo client with 5s timeout, cache, & seasonal fallback
│   │   └── mapService.js            # Leaflet wrapper with tile-failure fallback panel
│   ├── state/
│   │   └── store.js                 # Reactive AppStore (single source of truth with pub/sub)
│   ├── components/
│   │   ├── destinationGrid.js       # Dynamic card rendering, skeleton loaders, empty states
│   │   ├── detailModal.js           # WCAG 2.2 AA compliant <dialog> with focus trap & escape key
│   │   ├── costCalculator.js        # Live trip cost calculator with formula & reference rates
│   │   ├── tripDrawer.js            # My Trips accessible drawer, notes editor, undo deletion
│   │   ├── toast.js                 # ARIA live region notification alerts
│   │   └── importExportModal.js     # Safe JSON export & preview/merge/replace import modal
│   └── app.js                       # Bootstrap, component wiring, & global error boundaries
├── tests/
│   ├── smoke-test.html              # In-browser test runner UI
│   └── test-suite.js                # Automated test assertions (units, validators, repo, calculator, E2E)
└── README.md                        # Documentation, architecture, licensing, Viva defense
```

---

## 🚀 How to Run Locally

Because this application uses standard modern ES6 JavaScript modules:
1. Open the project folder in **Visual Studio Code**.
2. Right-click `index.html` and select **"Open with Live Server"** (or use any static HTTP server such as `npx serve .` or Python's `python -m http.server 8000`).
3. Access the web app at `http://127.0.0.1:5500/index.html`.
4. Run the automated test battery by navigating to `http://127.0.0.1:5500/tests/smoke-test.html`.

---

## 📸 Verified Destinations & Image Licensing

All 16 destination images are sourced from Unsplash and used under the **Unsplash License** (free for commercial and non-commercial use, no permission required):

| Destination | Country | Continent | Coordinates | Photographer | Source / License |
|---|---|---|---|---|---|
| **Kyoto** | Japan | Asia | `35.0116, 135.7681` | Su San Lee | Unsplash License |
| **Bali** | Indonesia | Asia | `-8.3405, 115.0920` | Oliver Sjöström | Unsplash License |
| **Hoi An** | Vietnam | Asia | `15.8801, 108.3380` | Tron Le | Unsplash License |
| **Petra** | Jordan | Asia | `30.3285, 35.4444` | Brian Kairuz | Unsplash License |
| **Santorini** | Greece | Europe | `36.3932, 25.4615` | Heidi Kaden | Unsplash License |
| **Swiss Alps** | Switzerland | Europe | `46.5600, 7.9000` | Dino Reichmuth | Unsplash License |
| **Rome** | Italy | Europe | `41.9028, 12.4964` | David Cohen | Unsplash License |
| **Reykjavik** | Iceland | Europe | `64.1466, -21.9426` | Mahlke Jon | Unsplash License |
| **Banff** | Canada | Americas | `51.1784, -115.5708` | Kalep Tapp | Unsplash License |
| **Cusco** | Peru | Americas | `-13.5319, -71.9675` | Willian Justen | Unsplash License |
| **New York City** | United States | Americas | `40.7128, -74.0060` | Alexander Rotker | Unsplash License |
| **Costa Rica** | Costa Rica | Americas | `10.4678, -84.7036` | Etienne Delorieux | Unsplash License |
| **Cape Town** | South Africa | Africa | `-33.9249, 18.4241` | Jean van der Meulen | Unsplash License |
| **Marrakech** | Morocco | Africa | `31.6295, -7.9811` | Annie Spratt | Unsplash License |
| **Queenstown** | New Zealand | Oceania | `-45.0312, 168.6626` | Tobias Keller | Unsplash License |
| **Sydney** | Australia | Oceania | `-33.8688, 151.2093` | Dan Freeman | Unsplash License |

---

## 🎓 Academic Viva & Lab Defense Guide

### 1. Why Vanilla ES6+ over React or Angular for this project?
> *"Vanilla ES6+ modules with a pub/sub AppStore provide complete transparency and testability. It demonstrates raw DOM manipulation, Web Storage API, and Fetch API fundamentals required by the Web Technology curriculum, while eliminating `node_modules` compilation overhead and runtime bundle bloat."*

### 2. How is data persisted without a database server?
> *"The application implements a Repository Pattern (`TripRepository` contract $\rightarrow$ `LocalTripRepository` implementation) storing data in `localStorage` under the versioned key `travelExplorer:v1`. It features schema migration, input validation on every read, and an in-memory fallback for private browsing."*

### 3. How does the application handle offline degradation?
> *"Core features (browsing, filtering, calculators, itinerary inspection, and saved trips) require zero network access. For external services, the Weather Service uses a 5-second `AbortController` timeout and falls back to verified seasonal data, while the Map Service displays a structured textual location table if map tiles cannot load."*

### 4. How is security handled on the client side?
> *"The search input treats queries strictly as plain data without naive regex mutilation. External URLs are validated using the browser's `new URL()` parser to enforce `https:` protocols and reject unsafe schemes (`javascript:`, `data:`). JSON imports are strictly schema-validated before merging into storage."*

### 5. How are WCAG 2.2 AA accessibility standards met?
> *"Using native HTML5 `<dialog>` elements with `showModal()`, focus trapping, `Escape` key listeners, background inertness, and focus restoration to the trigger element on close. Color contrast ratios exceed 4.5:1 across both Light and Dark themes."*
