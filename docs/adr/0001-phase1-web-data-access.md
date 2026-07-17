# ADR 0001 — Phase 1 web data access

**Status:** accepted (2026-07-17)

Deviations from ARCHITECTURE.md for the Phase 1 UI, per the "deviate only with
a short note" rule in AGENTS.md.

## 1. Plain SQL via `postgres` client instead of Drizzle/Prisma

The schema is owned by `ingest/schema.sql` (applied idempotently by
`ntwv-ingest run`), so an ORM would either duplicate the schema definition or
introspect it — both add moving parts while the web app runs five read-only
queries. We use the `postgres` npm client with typed wrappers in
`lib/queries.ts`. Revisit when the web app needs writes or the query surface
grows past a dozen statements.

## 2. Sector mapping lives in `lib/sectors.ts`, not the `sector` DB table

The sector table's content (slug, name, blurbs, includes/excludes copy) is
UI copy that changes with editing, not with data ingest. Keeping it in code
gives type safety, versioned review of copy, and no seed-ordering coupling
between web deploys and ingest runs. The DB table from ARCHITECTURE §4.1 gets
created when something other than the web UI (public API, ingest joins)
needs the mapping — likely Phase 2+.

## 3. Charts: Recharts

ARCHITECTURE offers Observable Plot, Recharts, or ECharts. Recharts chosen:
SVG output, first-class React 19 support, small enough for our tiny national
series. Chart colors come from the validated data-viz palette defined as CSS
custom properties in `app/globals.css` (`--viz-*`); components never hardcode
hex values.
