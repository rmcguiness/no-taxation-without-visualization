# Roadmap

An honest view of where the project is. The detailed, phase-by-phase plan (with
acceptance criteria) lives in [docs/PHASE_PLAN.md](docs/PHASE_PLAN.md); this page is
the short version. Contributions are welcome on anything under **Next**.

## Done

- **Phase 0 — bootstrap:** Next.js App Router + TypeScript + Tailwind, Postgres via
  Docker Compose, ESLint/Prettier, Python `ingest/` package.
- **Phase 1 data layer:** OMB Historical Tables 2.1 (receipts by source) and 3.2
  (outlays by function/subfunction) are fetched, stored raw with sha256 hashes,
  transformed, sum-checked, and loaded idempotently into `fiscal_series`.
- **Phase 1 UI:** homepage dashboard, `/federal/revenue`, `/federal/spending`,
  `/sectors/[slug]` for every budget function, year-range and $ / % toggles, a source
  footer with as-of date on every chart, About and Methodology pages.
- **Security baseline:** patched Next.js, CI (format, lint, typecheck, tests, build,
  ingest tests), dependency review, gitleaks, Dependabot, `SECURITY.md`.

## In progress

- **Design polish (Phase 2 design pass):** design tokens, light/dark themes, refined
  charts with reduced-motion-aware animation, custom tooltips, loading/empty states,
  accessibility pass, per-page metadata, sitemap and robots. Under review in a pull
  request; not yet merged.

## Next

- **Place-based views (Phase 2 in the plan):** ZIP/state resolver, state profile pages,
  USAspending geographic aggregates, a clear explanation of awards vs budget functions.
- **Education vertical (Phase 3):** federal education programs, then state and district
  layers, kept separate to avoid double counting.
- **More tests:** component tests for charts and controls, accessibility checks
  (axe) and Playwright smoke tests of key pages in CI.
- **Data:** GDP-relative view once a GDP series is ingested; on/off-budget split;
  scheduled re-ingest when OMB publishes a new vintage.

## Later

- Reconciliation ("is money accounted for?"), a second vertical, civic engagement
  tools, and integrity signals, in that order (Phases 4–7). Automated findings will be
  labelled "needs review" or "data gap", never "fraud".

## Not planned

User accounts, crypto, native mobile apps, non-U.S. data, or scraping authenticated
portals (see [AGENTS.md](AGENTS.md)).
