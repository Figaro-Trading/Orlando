# Orlando Park Assistant

[![Build](https://github.com/Figaro-Trading/Orlando/actions/workflows/deploy.yml/badge.svg)](https://github.com/Figaro-Trading/Orlando/actions/workflows/deploy.yml)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0--only-blue.svg)](LICENSE)
[![Node.js >=20](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](https://nodejs.org/)

Real-time PWA for Walt Disney World and Universal Orlando parks. Live wait times, schedules, GPS-based recommendations, and smart day planning — all offline-capable, no account required.

**[Live demo](https://figaro-trading.github.io/Orlando/)** · [Contributing](CONTRIBUTING.md)

## Features

- **Live wait times** — real-time queue data for 7 parks (MK, EPCOT, HS, AK, USF, IOA, Epic Universe)
- **Smart "What's next?"** — context-aware scoring engine factoring wait time, proximity, crowd level, showtimes, and Lightning Lane windows
- **Day templates** — 9 pre-built itineraries with plan-aware recommendations
- **GPS auto-detection** — identifies your current park and land automatically
- **Offline support** — service worker caching for seamless use in the parks
- **Installable PWA** — add to home screen for a native app experience
- **WCAG 2.1 AA** — accessible color contrast, keyboard navigation, screen reader support
- **Dark / light / auto theme**

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | [Preact](https://preactjs.com/) + [Preact Signals](https://preactjs.com/guide/v10/signals/) |
| Build | [Vite](https://vitejs.dev/) |
| PWA | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + [Workbox](https://developer.chrome.com/docs/workbox/) |
| Language | TypeScript (strict mode) |
| Data | [ThemeParks.wiki API](https://api.themeparks.wiki/docs/v1/) |
| Hosting | GitHub Pages |

## Getting started

### Prerequisites

- Node.js >= 20 (see `.nvmrc`)

### Install & run

```bash
git clone https://github.com/Figaro-Trading/Orlando.git
cd Orlando
npm install
npm run dev
```

Open `http://localhost:5173/Orlando/` in your browser.

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |

## Project structure

```
src/
  components/     UI components (dashboard, park, planning, settings, nextmove)
  data/           Static config, park definitions, day templates, alerts
  engine/         Scoring, filtering, feasibility, and recommendation logic
  services/       API client, geolocation, refresh orchestration
  state/          Reactive signals and persistence layer
  types/          TypeScript type definitions
  styles/         Global CSS
  utils/          Date, geo, formatting, and matching helpers
```

## Deployment

Automatic via GitHub Actions on push to `main`. The workflow runs `npm ci && npm run build` and deploys `dist/` to GitHub Pages.

## Acknowledgements

Live park data provided by **[ThemeParks.wiki](https://themeparks.wiki/)** — a free, community-maintained API. If you build on their data, consider [sponsoring the project](https://github.com/ThemeParks/parksapi).

## License

[GPL-3.0](LICENSE)
