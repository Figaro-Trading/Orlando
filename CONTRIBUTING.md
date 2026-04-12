# Contributing

Thanks for your interest in contributing to Orlando Park Assistant! This document explains how to get involved.

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## Prerequisites

- Node.js >= 20 (see `.nvmrc`)
- npm

## Setup

```bash
git clone https://github.com/Figaro-Trading/Orlando.git
cd Orlando
npm install
npm run dev
```

## Development workflow

1. **Fork** the repository
2. **Create a branch** from `main` — name it after the change (`feat/show-wait-trend`, `fix/gps-fallback`, etc.)
3. **Make your changes** — follow existing code patterns, keep TypeScript strict mode happy
4. **Type-check** before pushing: `npx tsc --noEmit`
5. **Open a Pull Request** against `main`

## Commit conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/) going forward:

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `style:` | Formatting, whitespace, missing semicolons |
| `test:` | Adding or updating tests |
| `chore:` | Build config, dependencies, CI |

Example: `feat: add wait time trend sparkline to EntityCard`

## Pull request guidelines

- One logical change per PR
- Describe **what** changed and **why**
- Run `npx tsc --noEmit` — PRs that fail type-checking won't be merged
- Include a screenshot for any UI change

## Code style

- TypeScript with strict mode — no `any` unless absolutely necessary
- Preact functional components with Signals for state
- Follow existing file and folder conventions in `src/`
- No external runtime dependencies without discussion first

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |

## Questions?

Open an [issue](https://github.com/Figaro-Trading/Orlando/issues) — we're happy to help.
