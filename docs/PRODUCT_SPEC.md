# Product Specification

**Project:** No Taxation without Visualization  
**Version:** 0.1.0  
**Last updated:** 2026-07-17  
**Status:** Spec complete — implementation not started

---

## 1. Vision

### 1.1 Problem

Citizens pay taxes but rarely understand:

1. How much money government collects and from which sources  
2. How spending is split across sectors (defense, health, education, etc.)  
3. That federal, state, and local governments are **different checkbooks**  
4. How to drill into their own community (state → county → school district → city)  
5. When and where decisions are made (school board, city council, elections)

Opacity enables confusion, cynicism, and low participation. Full “prove zero fraud” is impossible from public data alone—but **making the money map legible** is achievable and high impact.

### 1.2 Mission

> Help Americans **see** where public money comes from and goes, **understand** which government decides it, **spot** opacity and odd patterns, and **act** in the meetings and elections that control the checkbook.

### 1.3 Tagline

**No Taxation without Visualization**

### 1.4 Product principles

1. **Honesty over drama** — Never imply open books prove no theft. Gaps ≠ proven fraud.  
2. **Layered government** — Always clarify federal vs state vs local. Avoid double-counting.  
3. **Progressive depth** — Sharp national overview; deep drill only where data quality supports it.  
4. **Explainability** — Every number has source, vintage (year), and confidence.  
5. **Actionable** — Visualization should lead to civic participation, not just doomscrolling.  
6. **Open methods** — Rules, transforms, and methodology published and versioned.  
7. **Citizen-first language** — Plain English; avoid budget jargon without tooltips.

---

## 2. Target users

| Persona | Needs | Success |
|---------|--------|---------|
| **Curious taxpayer** | “Where does my money go?” | Completes federal pie journey in &lt; 3 min |
| **Local parent / homeowner** | School and city spending near them | Finds their district and per-pupil / function split |
| **Journalist / researcher** | Reproducible data + exports | Downloads series with citations |
| **Civic activist** | Meetings, agendas, elections | Knows next local meeting and what budget items are up |
| **Skeptical auditor type** | Completeness, reconciliation | Sees source comparison and residual “other” buckets |

**Primary launch persona:** Curious taxpayer + local parent.

---

## 3. Scope

### 3.1 In scope (product lifetime)

- Federal revenue and outlays by major function (multi-year)  
- Sector story pages (education first; then defense, health, transportation, etc.)  
- Geographic drill-down where data exists (state → local/district)  
- Reconciliation of published totals across authoritative sources  
- Data confidence badges and methodology pages  
- Progressive integrity layers:
  1. Accounting completeness / opacity  
  2. Entity concentration / duplication signals  
  3. Waste / overpricing benchmarks  
- Civic engagement: representatives, elections, local meetings  
- Export of charts/data with citations  

### 3.2 Explicitly out of scope (v1–v2)

- Claiming to “stop fraud” or prove officials are clean  
- Real-time banking of every government entity  
- Blockchain as the primary ledger for government (optional evidence-hash later only)  
- Partisan scorecards or “who to vote for” recommendations  
- Tax preparation / filing  
- Non-U.S. governments (future consideration only)  

### 3.3 Scope by phase

See [PHASE_PLAN.md](./PHASE_PLAN.md). Summary:

| Phase | Name | Core outcome |
|-------|------|----------------|
| **1** | Federal story | Money in / money out visualizations |
| **2** | Place | ZIP/state → federal flows + state profile stub |
| **3** | Education vertical | State → district finance drill-down |
| **4** | Reconciliation | Multi-source totals + gap report |
| **5** | Second vertical | Defense contracts or transportation |
| **6** | Civic action | Elections, meetings, “how to engage” |
| **7** | Integrity signals | Entity red flags, then price outliers |

---

## 4. Core user journeys

### Journey A — National pie (Phase 1)

1. Land on homepage  
2. See **this year’s** federal receipts total and sources  
3. See **outlays** by major function (treemap / stacked bar / sankey)  
4. Toggle year; toggle % of GDP / per capita  
5. Click **Education** (or other sector) → sector explainer  
6. See “what this includes / excludes” and data confidence  

### Journey B — “My community” (Phase 2–3)

1. Enter ZIP or allow location  
2. Resolve state, county, school district(s), city if possible  
3. See federal awards / spending linked to that place (USAspending geo)  
4. Open education → district page: revenue mix, spend by function, trends  
5. Compare to peer districts (same state, similar size)  

### Journey C — Integrity check (Phase 4, then 7)

1. Open “Does the pie add up?”  
2. View source A vs source B totals; residual categories  
3. Later: flag list with “needs review” language and methodology  

### Journey D — Take action (Phase 6)

1. From any place page, open **Get involved**  
2. See next election dates, who represents you, meeting calendars when available  
3. Read short explainer: “Who decides this budget?”  

---

## 5. Information architecture (IA)

```
/                         Home: national dashboard
/about                    Mission, methods, what we claim
/methodology              Sources, transforms, confidence
/federal
  /revenue                Receipts by source
  /spending               Outlays by function
  /year/[fy]              Year deep link
/sectors
  /[sector]               Sector story (education, defense, …)
/places
  /                     Search
  /state/[code]
  /district/[id]          School district (Phase 3)
/awards                   Federal awards search (later)
/integrity
  /reconciliation
  /flags                  Phase 7
/civic
  /elections
  /meetings
/api/…                    Optional public API later
```

---

## 6. UI / UX requirements

### 6.1 Visual design direction

- Clean, civic, nonpartisan (neutral palette; avoid red/blue party coding)  
- Charts first; dense tables available via “View data”  
- Mobile-friendly; key charts readable on phone  
- Accessibility: WCAG 2.1 AA target; keyboard navigation; alt text for charts  

### 6.2 Required UI components

| Component | Notes |
|-----------|--------|
| **Revenue card stack** | Sources as stacked bar or donut + table |
| **Spending treemap** | Functions as nested rectangles; click to sector |
| **Sankey (optional v1.1)** | Receipts → major functions (careful with deficit) |
| **Year scrubber** | Multi-year comparison |
| **Unit toggle** | Nominal $ / inflation-adjusted / % GDP / per capita |
| **Confidence badge** | High / Medium / Low / Incomplete |
| **Source footer** | Dataset name, publisher, as-of date, link |
| **Place resolver** | ZIP → jurisdictions |
| **Drill crumbtrail** | Federal › Education › California › District X |
| **Claim callout** | Static disclaimer on integrity pages |

### 6.3 Copy requirements

Every major view must include:

1. **What this number is** (receipts vs outlays vs obligations)  
2. **Which government** (federal / state / local)  
3. **Time period** (fiscal year definition: federal FY ends Sep 30)  
4. **Source link**  

### 6.4 Disclaimers (must appear in product)

**Global footer (short):**  
“Public data for civic understanding. Balanced books do not prove absence of fraud. Gaps may mean missing data, not theft.”

**Integrity module (longer):**  
See §8 Claims policy.

---

## 7. Feature requirements by priority

### P0 — Phase 1 (MVP)

- [ ] Homepage with federal receipts total + by major source  
- [ ] Federal outlays by budget function (OMB-style functions)  
- [ ] Multi-year historical view (at least 20+ years if source allows)  
- [ ] Sector list linking to stub sector pages  
- [ ] About + methodology pages  
- [ ] Mobile-responsive layout  
- [ ] Automated data ingest for chosen federal sources  

### P1 — Phase 2–3

- [ ] Place search (ZIP / state)  
- [ ] State profile page  
- [ ] Education vertical: national → state → school district  
- [ ] District: revenue by source; expenditure by function  
- [ ] Per-pupil metrics and simple peer comparison  
- [ ] Data confidence per view  

### P2 — Phase 4–6

- [ ] Multi-source reconciliation dashboard  
- [ ] Second sector vertical  
- [ ] Civic: election dates + representatives (start federal/state)  
- [ ] “Who decides?” explainers per sector  

### P3 — Phase 7+

- [ ] Entity / vendor concentration flags  
- [ ] Address / UEI clustering  
- [ ] Price outlier heuristics  
- [ ] Case files / saved investigations  
- [ ] Optional content-addressed snapshots of methodology + datasets  

---

## 8. Claims policy (non-negotiable)

### Allowed

- “According to [source], federal outlays for function X were $Y in FY Z.”  
- “These published totals reconcile within $W / do not reconcile; residual category R is $V.”  
- “This vendor received an unusually large share of awards in category C relative to peers (needs review).”  
- “School-level finance data is incomplete for this state.”  

### Forbidden

- “This proves fraud / theft / pocketing.”  
- “All government money is accounted for; therefore no corruption.”  
- “Unaccounted-for = stolen.”  
- Partisan endorsements or vote recommendations.  
- Defamatory statements about named individuals without journalistic/legal standards.

### Preferred language for anomalies

Use **Needs review**, **Unusual pattern**, **Data gap**, **Outlier vs peers** — never **Fraudulent** as an automated label.

---

## 9. Success metrics

### Product

| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| Time to first “aha” (pie understood) | &lt; 3 minutes median |
| % sessions that open a sector | ≥ 40% |
| % sessions that try place search | ≥ 25% |
| Methodology page views / session | Track; aim rising with trust content |

### Quality

| Metric | Target |
|--------|--------|
| Primary totals match source within rounding | 100% for published rollups |
| Every chart has source + vintage | 100% |
| Automated tests on ingest | Required before public launch |

### Civic (later)

- Clicks through to election/meeting resources  
- Newsletter / return visits (if added)  

---

## 10. Brand notes

- **Name (working):** No Taxation without Visualization  
- **Short name options:** NTwV, TaxViz, Open Pie, Citizen Ledger, Public Pie  
- **Tone:** Serious, clear, slightly witty; never conspiratorial  
- **Avoid:** Crypto-bro aesthetics; doom aesthetics; party colors as encoding  

---

## 11. Related docs

- [DATA_SOURCES.md](./DATA_SOURCES.md)  
- [ARCHITECTURE.md](./ARCHITECTURE.md)  
- [PHASE_PLAN.md](./PHASE_PLAN.md)  
- [AI_WORKFLOW.md](./AI_WORKFLOW.md)  
- [../AGENTS.md](../AGENTS.md)  
