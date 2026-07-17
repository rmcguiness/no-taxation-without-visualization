# No Taxation without Visualization

**Mission:** Help U.S. citizens see where public money comes from and where it goes, understand which level of government decides it, spot opacity and odd patterns, and take civic action.

**Tagline:** *No Taxation without Visualization*

This repository is a **product + engineering specification** for a government transparency platform. It is designed so humans and coding agents (Grok, Claude Code, Cursor, etc.) can implement the project phase by phase without losing the original vision.

---

## Start here

| Doc | Purpose |
|-----|---------|
| [docs/PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md) | Vision, users, scope, UI, claims policy, success metrics |
| [docs/DATA_SOURCES.md](./docs/DATA_SOURCES.md) | Federal/state/local data sources and confidence levels |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, stack, schema, pipelines |
| [docs/PHASE_PLAN.md](./docs/PHASE_PLAN.md) | MVP → deep dives → fraud → civic engagement |
| [docs/AI_WORKFLOW.md](./docs/AI_WORKFLOW.md) | How to build with AI agents + copy-paste prompts |
| [AGENTS.md](./AGENTS.md) | Standing instructions for coding agents |

---

## One-sentence product

A layered map of public money (revenue → sectors → place → entity) that reconciles published totals, drills into high-quality categories (starting with education), and helps people engage locally—without overclaiming that open data proves “no corruption.”

---

## Status

- [x] Product vision and specs
- [x] Phase 0 bootstrap (Next.js + Tailwind app, Docker Postgres, ingest skeleton)
- [x] Phase 1 data layer (OMB Tables 2.1 + 3.2 → validated `fiscal_series` in Postgres)
- [ ] Phase 1 UI (revenue + outlays visualization)
- [ ] Phase 2 place-based views
- [ ] Phase 3 education deep-dive
- [ ] Later: more verticals, red flags, civic calendar

---

## Local development

```bash
pnpm install        # install web dependencies
pnpm dev            # serve the site at http://localhost:3000
docker compose up   # start Postgres 16 (defaults in .env.example)
```

Optional: copy `.env.example` to `.env` to override Postgres credentials/port.
The Python ingest package lives in [ingest/](./ingest/) (skeleton only until Phase 1).

---

## License / non-affiliation

Not affiliated with any government agency. Uses public open data. See PRODUCT_SPEC for language about what the product can and cannot claim.
