# Architecture

**Status:** Proposed for implementation. Agents should follow this unless the implementer documents a justified deviation in a short ADR (`docs/adr/`).

---

## 1. Goals

- Reproducible ingest (raw → clean → serve)  
- Fast interactive charts for national series  
- Clear path to place + education drill-downs  
- Simple enough for a solo founder + AI agents  
- Methodology and claims policy enforced in data model  

---

## 2. Recommended stack (MVP)

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **App** | Next.js (App Router) + TypeScript | Great for content + charts + API routes |
| **UI** | Tailwind + accessible component lib (e.g. shadcn/ui) | Fast, consistent |
| **Charts** | Observable Plot, Recharts, or ECharts | Pick one; prefer accessible SVG |
| **DB** | PostgreSQL | Relational fit for series + entities |
| **Analytics SQL** | Optional DuckDB for bulk transforms | Nice for F-33 / large CSVs |
| **ORM / SQL** | Drizzle or Prisma | Prefer migrations in repo |
| **Ingest** | Python 3.11+ (pandas/polars) **or** Node scripts | Python often easier for Excel/gov data |
| **Jobs** | Cron / GitHub Actions for scheduled pulls | Start simple |
| **Hosting** | Vercel/Fly/Railway + managed Postgres | Defer until MVP works locally |
| **Cache** | HTTP cache + DB materialized views | National series are small |

**Alternative monorepo (also fine):**

```
apps/web          # Next.js
apps/ingest       # Python package
packages/shared   # Types, sector mappings
```

---

## 3. High-level diagram

```
┌──────────────────┐     ┌─────────────────┐
│ OMB xlsx / CBO   │     │ USAspending API │
│ NCES / F-33 …    │     │ FiscalData API  │
└────────┬─────────┘     └────────┬────────┘
         │                        │
         ▼                        ▼
   ┌────────────────────────────────────┐
   │  Ingest workers (raw storage)      │
   │  content-hash + metadata registry  │
   └────────────────┬───────────────────┘
                    ▼
   ┌────────────────────────────────────┐
   │  Transform → clean tables          │
   │  fiscal_series, sectors, places…   │
   └────────────────┬───────────────────┘
                    ▼
   ┌────────────────────────────────────┐
   │  PostgreSQL                        │
   └────────────────┬───────────────────┘
                    ▼
   ┌────────────────────────────────────┐
   │  Next.js API / server components   │
   └────────────────┬───────────────────┘
                    ▼
   ┌────────────────────────────────────┐
   │  Web UI (charts, place, sectors)   │
   └────────────────────────────────────┘
```

---

## 4. Logical data model (v1)

### 4.1 Core tables

#### `data_source`

| Column | Type | Notes |
|--------|------|-------|
| id | text PK | e.g. `omb_hist_3_2` |
| name | text | |
| publisher | text | |
| homepage_url | text | |
| license | text | |
| confidence | enum | high/medium/low/incomplete |
| notes | text | |

#### `dataset_snapshot`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| data_source_id | text FK | |
| retrieved_at | timestamptz | |
| content_hash | text | sha256 of raw file |
| raw_uri | text | path/S3/local |
| schema_version | int | |

#### `fiscal_series`

Long-format national (and later state) series.

| Column | Type | Notes |
|--------|------|-------|
| id | bigserial PK | |
| snapshot_id | uuid FK | lineage |
| government_level | enum | federal/state/local |
| metric | enum | receipt, outlay, deficit, obligation, … |
| category_code | text | OMB function code or receipt code |
| category_name | text | |
| parent_category_code | text null | hierarchy |
| fiscal_year | int | |
| amount | numeric | USD nominal unless noted |
| amount_unit | text | `usd_nominal` default |
| is_projection | bool | |
| notes | text null | |

#### `sector`

Citizen-facing sectors mapped from budget functions.

| Column | Type | Notes |
|--------|------|-------|
| slug | text PK | `education`, `defense`, … |
| name | text | |
| description | text | plain English |
| omb_function_codes | text[] | mapping |
| sort_order | int | |

#### `place` (Phase 2+)

| Column | Type | Notes |
|--------|------|-------|
| id | text PK | e.g. `state:CA`, `lea:06XXXX` |
| kind | enum | state/county/city/lea/… |
| name | text | |
| state_code | char(2) null | |
| parent_id | text null | |
| geoid | text null | Census/NCES ids |

#### `school_district_finance` (Phase 3)

| Column | Type | Notes |
|--------|------|-------|
| lea_id | text | |
| fiscal_year | int | |
| enrollment | numeric null | |
| rev_local | numeric | |
| rev_state | numeric | |
| rev_federal | numeric | |
| exp_instruction | numeric | |
| exp_support | numeric | |
| exp_operations | numeric | |
| … | | extend per F-33 fields used |
| snapshot_id | uuid | |

#### `reconciliation_run` (Phase 4)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| fiscal_year | int | |
| source_a | text | |
| source_b | text | |
| metric | text | |
| amount_a | numeric | |
| amount_b | numeric | |
| delta | numeric | |
| status | enum | match/mismatch/explained |

#### `integrity_flag` (Phase 7)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| flag_type | text | concentration, new_vendor, … |
| severity | enum | info/review/high_review |
| entity_id | text | |
| summary | text | non-accusatory |
| rule_id | text | versioned rule |
| evidence jsonb | | |
| created_at | timestamptz | |

---

## 5. API surface (internal first)

Prefer server components reading DB directly for MVP. If REST is needed:

```
GET /api/federal/receipts?from=2000&to=2025
GET /api/federal/outlays?from=2000&to=2025
GET /api/federal/outlays/[function]
GET /api/sectors
GET /api/sectors/[slug]
GET /api/places/resolve?zip=94107
GET /api/places/[id]
GET /api/education/states
GET /api/education/districts/[id]?year=2022
GET /api/integrity/reconciliation?year=2024
```

All responses should include:

```json
{
  "data": {},
  "meta": {
    "sources": [{ "id": "omb_hist_3_2", "as_of": "2026-04-01", "confidence": "high" }],
    "unit": "usd_nominal",
    "fiscal_year_type": "federal"
  }
}
```

---

## 6. Ingest pipeline

### 6.1 Steps

1. **Fetch** remote file/API page  
2. **Store raw** under `data/raw/{source}/{date}/{filename}`  
3. **Hash** and register `dataset_snapshot`  
4. **Transform** to tidy long format  
5. **Validate** (totals, nulls, year ranges, row counts)  
6. **Load** into Postgres (transactional replace per source+year or full series)  
7. **Publish** meta: last success, row counts  

### 6.2 Validation rules (Phase 1)

- Sum of receipt categories ≈ total receipts (within rounding tolerance)  
- Sum of function outlays ≈ total outlays (document exceptions: undistributed, rounding)  
- No future FY actuals marked as actual  
- Amounts non-negative where required (deficit series separate)  

### 6.3 Idempotency

Re-running ingest for the same content_hash should not duplicate series rows.

---

## 7. Frontend architecture

### Routes (App Router)

```
app/
  page.tsx                 # National dashboard
  about/page.tsx
  methodology/page.tsx
  federal/
    revenue/page.tsx
    spending/page.tsx
  sectors/[slug]/page.tsx
  places/
    page.tsx
    state/[code]/page.tsx
  education/
    page.tsx
    state/[code]/page.tsx
    district/[id]/page.tsx
  integrity/page.tsx
  civic/page.tsx
```

### State

- URL query params for year range and unit toggles (shareable)  
- Minimal client state; prefer server-fetched props  

### Chart performance

National series are tiny (hundreds of rows). No special big-data frontend needed until awards explore.

---

## 8. Security & compliance

- No PII collection required for MVP; if analytics, prefer privacy-friendly  
- Rate-limit any public API  
- Respect source ToS (especially SAM, Google Civic, etc.)  
- Do not scrape behind logins  
- Legal: defamation-safe copy; claims policy in PRODUCT_SPEC  

---

## 9. Testing strategy

| Layer | What |
|-------|------|
| Unit | Category mappings, money formatters, FY helpers |
| Ingest | Snapshot fixtures → expected tidy rows |
| Integration | API returns meta.sources |
| E2E | Homepage loads chart; sector navigation |
| Data | CI job fails if reconciliation delta exceeds threshold unexplained |

---

## 10. Observability

- Ingest logs with source id + hash  
- Health endpoint: last successful ingest times  
- Simple admin page (local only) listing snapshots  

---

## 11. “Decentralized” posture (later)

Not required for MVP. When added:

1. Publish `content_hash` of raw snapshots and rule packs on a public page  
2. Optional IPFS/// content-addressed mirror of methodology PDFs  
3. Open-source rule YAML for integrity flags  

Do **not** put OMB tables on a blockchain as the system of record.

---

## 12. Repo layout (target)

```
/
  README.md
  AGENTS.md
  docs/
    PRODUCT_SPEC.md
    DATA_SOURCES.md
    ARCHITECTURE.md
    PHASE_PLAN.md
    AI_WORKFLOW.md
    adr/
  apps/web/                 # or root Next app
  ingest/
    pyproject.toml
    README.md
    sources/
    transforms/
    tests/fixtures/
  data/
    raw/                    # gitignored large files; keep tiny fixtures
    processed/              # optional parquet
  package.json / pnpm-workspace
```

---

## 13. Environment variables

```
DATABASE_URL=
NEXT_PUBLIC_SITE_URL=
# later:
# USA_SPENDING_BASE=https://api.usaspending.gov
# GOOGLE_CIVIC_API_KEY=
```

No secrets required for OMB file downloads or public USAspending API in basic use.
