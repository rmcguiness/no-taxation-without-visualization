# Phase Plan

Implement **one phase at a time**. Do not start Phase N+1 until Phase N acceptance criteria pass.

---

## Phase 0 — Project bootstrap

**Goal:** Runnable empty app + docs already present.

### Tasks

- [ ] Initialize git repo  
- [ ] Scaffold Next.js + TypeScript + Tailwind  
- [ ] Add Postgres (Docker Compose recommended)  
- [ ] Add lint/format (ESLint, Prettier)  
- [ ] Add `ingest/` Python package skeleton  
- [ ] `.env.example`, `.gitignore` for `data/raw`  
- [ ] Homepage placeholder with tagline and links to About/Methodology stubs  

### Acceptance

- `pnpm dev` (or npm) serves site  
- `docker compose up` starts Postgres  
- README status checkboxes accurate  

### Estimate

1–3 days with AI assistance.

---

## Phase 1 — Federal story (MVP public)

**Goal:** Citizens can see federal money in and money out by sector over time.

### Tasks

- [ ] Register OMB sources in `data_source`  
- [ ] Download + store raw Historical Tables  
- [ ] Transform receipts by source → `fiscal_series`  
- [ ] Transform outlays by function → `fiscal_series`  
- [ ] Sector mapping table + plain-English blurbs  
- [ ] Homepage dashboard: totals + charts  
- [ ] `/federal/revenue` and `/federal/spending`  
- [ ] `/sectors/[slug]` pages for major functions  
- [ ] Year range + unit toggles ($ and % of total; GDP later if series available)  
- [ ] Every chart: source footer + as-of date  
- [ ] About page with claims policy summary  
- [ ] Methodology page listing sources  

### Acceptance

- [ ] Latest available FY total receipts and outlays display and match source within rounding  
- [ ] Clicking a sector navigates to a page with definition + multi-year trend  
- [ ] Mobile layout usable  
- [ ] Ingest is re-runnable and idempotent  
- [ ] Fixture tests cover transform  

### Explicitly deferred

Place search, education districts, awards, flags, elections.

### Estimate

2–4 weeks part-time.

---

## Phase 2 — Place

**Goal:** “What does federal spending look like where I live?”

### Tasks

- [ ] ZIP / state resolver  
- [ ] State profile page  
- [ ] USAspending geo aggregates for state (and county if reliable)  
- [ ] Explain awards vs budget functions (education callout)  
- [ ] Crumbtrail: Federal › Place  

### Acceptance

- [ ] User enters ZIP → sees state + caveats if multi-match  
- [ ] State page shows recent federal award totals by major category  
- [ ] Clear disclaimer: awards ≠ full federal budget  

### Estimate

2–3 weeks.

---

## Phase 3 — Education vertical

**Goal:** Flagship drill-down: Education → state → school district.

### Tasks

- [ ] Ingest CCD directory (districts)  
- [ ] Ingest F-33 finance  
- [ ] `/education` overview tied to federal education function + note on state/local dominance  
- [ ] State education rollup  
- [ ] District page: revenue mix, expenditure functions, per-pupil, trend  
- [ ] Peer comparison (same state, enrollment band)  
- [ ] Confidence badges (district High; school Incomplete unless data present)  

### Acceptance

- [ ] Can open a known district and see finance breakdown with source  
- [ ] National education sector page links into this vertical  
- [ ] Document lag year prominently  

### Estimate

3–5 weeks (data wrangling heavy).

---

## Phase 4 — Reconciliation (“is money accounted for?”)

**Goal:** Multi-source comparison and residual opacity reporting—not fraud prosecution.

### Tasks

- [ ] Load CBO (or Treasury) parallel totals  
- [ ] Reconciliation table by FY for receipts/outlays  
- [ ] Surface large “other/undistributed” categories  
- [ ] UI: match / explained difference / unresolved gap  
- [ ] Export CSV of reconciliation  

### Acceptance

- [ ] At least one cross-source comparison for 10+ years  
- [ ] Copy uses claims policy language  
- [ ] Unresolved gaps listed without “theft” framing  

### Estimate

1–2 weeks after Phase 1 data layer exists.

---

## Phase 5 — Second vertical

Pick **one**:

**Option A — Defense / military (recommended for awards richness)**  
- Function totals + USAspending DoD contracts  
- Top recipients, competition type mix  

**Option B — Transportation / roads**  
- Federal function + highway stats / grants by state  

### Acceptance

- Same IA pattern as education: overview → geography or entity drill  
- Confidence and sources complete  

### Estimate

2–4 weeks.

---

## Phase 6 — Civic engagement

**Goal:** Turn understanding into participation.

### Tasks

- [ ] “Get involved” section on place pages  
- [ ] Representatives by address (API)  
- [ ] Election dates for state/federal (licensed source)  
- [ ] Static guides: school board, city council, how budgets are passed  
- [ ] Optional: city meeting links for pilot cities  

### Acceptance

- [ ] From a state page, user can find who represents them and next major election  
- [ ] No voting recommendations  

### Estimate

2–3 weeks for solid v1.

---

## Phase 7 — Integrity signals

**Order matters.**

### 7A — Entity patterns

- Vendor concentration  
- New entity + large awards  
- Shared address / multi-UEI clusters  
- Labels: **Needs review** only  

### 7B — Waste / pricing

- Unit price outliers vs peers  
- Sole-source share  
- Large upward modifications  

### Acceptance

- [ ] Flags cite rule_id + evidence fields  
- [ ] No automated “fraud” wording  
- [ ] Methodology page for each rule  

### Estimate

4–8 weeks iterative.

---

## Suggested build order for first coding session

1. Phase 0 scaffold  
2. Phase 1 ingest for one OMB table end-to-end  
3. One chart on homepage wired to DB  
4. Then expand series + UI polish  

---

## Definition of Done (any phase)

- Spec section updated if behavior changed  
- README status checkboxes updated  
- Tests for new transforms  
- Methodology/sources updated  
- No forbidden claims language introduced  
