# Data Sources

**Principle:** Prefer authoritative, free, machine-readable public data. Record publisher, URL, license/public domain status, update cadence, and confidence for every ingest.

---

## 1. Confidence scale

| Level | Meaning | UI badge |
|-------|---------|----------|
| **High** | Official national series, stable definitions, widely cited | Green |
| **Medium** | Official but delayed, revised, or definition-sensitive | Yellow |
| **Low** | Partial coverage, scraper-based, or inconsistent schemas | Orange |
| **Incomplete** | Known missing geographies or categories | Gray |

---

## 2. Federal — money in / money out (Phase 1)

### 2.1 OMB Historical Tables (primary for long series)

| Item | Detail |
|------|--------|
| **What** | Receipts by source; outlays by function/subfunction; deficit/surplus |
| **Why** | Best multi-decade story for the homepage pie |
| **Where** | https://www.whitehouse.gov/omb/information-resources/budget/historical-tables/ |
| **Key tables** | 1.1 receipts/outlays/deficit; 2.x receipts by source; 3.1 / 3.2 outlays by function |
| **Format** | Excel (xlsx) downloads (URLs change by budget year) |
| **Cadence** | Annual with President’s Budget; revisions possible |
| **Confidence** | High for published historical; projections Medium |
| **Caveats** | Function definitions evolve; on-budget vs off-budget; always document FY |

### 2.2 CBO historical budget data

| Item | Detail |
|------|--------|
| **What** | Independent historical receipts/outlays series |
| **Where** | https://www.cbo.gov/data/budget-economic-data |
| **Machine-readable** | https://github.com/US-CBO/cbo-data |
| **Use** | Cross-check OMB; reconciliation dashboard (Phase 4) |
| **Confidence** | High |

### 2.3 Treasury Fiscal Data — Monthly Treasury Statement (MTS)

| Item | Detail |
|------|--------|
| **What** | Monthly receipts and outlays; YTD vs prior year |
| **Where** | https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/ |
| **Use** | “More current than annual tables” pulse; not full function history |
| **Confidence** | High for totals; function detail Medium |
| **API** | Fiscal Data API (JSON) |

### 2.4 USAspending.gov (awards — Phase 2+)

| Item | Detail |
|------|--------|
| **What** | Federal contracts, grants, loans, other assistance |
| **Site** | https://www.usaspending.gov/ |
| **API** | https://api.usaspending.gov/ |
| **Code** | https://github.com/fedspendingtransparency/usaspending-api |
| **Use** | Place-based federal flows; vendor patterns; later red flags |
| **Not a substitute for** | Full federal budget function totals (awards ≠ all outlays) |
| **Confidence** | Medium–High (known lag, DoD delays, data quality issues) |
| **Key concepts** | Obligations vs outlays; prime vs subaward; UEI recipient IDs |

### 2.5 Budget function reference

Federal budget **functions** (examples): National Defense; International Affairs; Health; Medicare; Income Security; Social Security; Education/Training/Employment/Social Services; Transportation; etc.

**Product requirement:** Map OMB function codes → citizen-friendly sector names with tooltips.

---

## 3. Education vertical (Phase 3)

### 3.1 NCES Common Core of Data (CCD)

| Item | Detail |
|------|--------|
| **What** | Universe of public schools and districts; enrollments; identifiers |
| **Where** | https://nces.ed.gov/ccd/ |
| **Use** | Geography hierarchy, district/school IDs, enrollment denominators |
| **Confidence** | High for directory/enrollment |

### 3.2 School District Finance Survey (F-33)

| Item | Detail |
|------|--------|
| **What** | LEA-level revenues by source; expenditures by function/object |
| **Where** | NCES F-33 + Census Annual Survey of School System Finances |
| **Use** | Core district pages: instruction vs support vs operations, etc. |
| **Confidence** | High at **district** level; lag often 1–2 years |
| **Caveats** | Charter treatment differs NCES vs Census; NYC and a few large systems special-cased |

### 3.3 School-level finance

| Item | Detail |
|------|--------|
| **What** | School-level spending (SLFS / NERD$ and related) |
| **Coverage** | Improving but **not uniform** nationwide |
| **Use** | Optional deeper drill where available; always show Incomplete elsewhere |
| **Confidence** | Low–Medium |

### 3.4 Suggested education metrics

- Total current expenditure  
- Revenue: local / state / federal share  
- Expenditure by function (instruction, admin, operations, food, etc.)  
- Per-pupil current spending  
- Year-over-year change  
- Peer set: same state, similar enrollment band  

**Salaries vs maintenance:** Prefer official **function/object** categories rather than inventing “salary” from incomplete payroll. Label honestly (e.g., “Instruction” includes teacher salaries in aggregate, not individual pay).

---

## 4. Place / geo

| Source | Use |
|--------|-----|
| Census TIGER / gazetteer | State, county, place boundaries |
| HUD / Census ZIP → county crosswalks | ZIP resolver |
| NCES district boundaries | Map school districts |
| USAspending geographic endpoints | Federal award amounts by state/county/CD |

**Rule:** Never invent jurisdiction membership. If ZIP maps to multiple districts, show disambiguation UI.

---

## 5. Civic engagement (Phase 6)

| Source ideas | Use |
|--------------|-----|
| Google Civic Information API or alternatives | Representatives by address |
| Vote.gov / state SOS | Election dates (verify licensing/ToS) |
| Ballotpedia / Democracy Works APIs (if licensed) | Elections metadata |
| Local Legistar / city open data | Meeting agendas (city-by-city) |
| Congress.gov | Federal legislative context (optional) |

**Start small:** Federal + state representatives + general election calendar for user’s state. Local meeting scrape is opportunistic per city.

---

## 6. Integrity / awards (Phase 7)

| Source | Use |
|--------|-----|
| USAspending recipients & awards | Concentration, growth, geography |
| SAM.gov entity registration | UEI, address, exclusion status (ToS/rate limits) |
| FPDS (via USAspending) | Contract vehicles, competition type |
| Open Contracting Data Standard | Future interoperability |

---

## 7. Cross-level accounting rules (critical)

### 7.1 Do not double-count

Federal grants to states appear in:

1. Federal outlays (grantor side), and  
2. State budgets (grantee revenue/spend)

**UI rule:** When showing “all government,” either:

- Present **separate layers** (recommended for v1), or  
- Build an explicit consolidated view with documented consolidation methodology (hard; Phase 4+)

### 7.2 Vocabulary

| Term | Meaning |
|------|---------|
| **Receipts / revenue** | Money collected |
| **Budget authority** | Legal authority to spend |
| **Obligation** | Binding commitment |
| **Outlay** | Actual cash out the door |
| **Transfer / grant** | Money moving between governments |

Homepage Phase 1 should prefer **receipts** and **outlays** for the federal story.

---

## 8. Ingest requirements

For every dataset in `data_sources` registry:

```yaml
id: omb_hist_outlays_function
name: OMB Historical Table 3.2 Outlays by Function
publisher: Office of Management and Budget
url: ...
license: public domain / U.S. government work
update_cadence: annual
confidence: high
fiscal_year_end: 09-30
retrieved_at: ISO-8601
content_hash: sha256
schema_version: 1
notes: ...
```

Store raw files immutable; write cleaned tables separately; never overwrite raw without versioning.

---

## 9. Phase 1 minimum dataset pack

1. OMB Historical Tables — receipts by source (multi-year)  
2. OMB Historical Tables — outlays by function (multi-year)  
3. Optional: CBO historical for reconciliation stub  
4. Static mapping: function code → sector slug + plain-English description  

---

## 10. Known limitations (document in-app)

1. Award data ≠ full budget (many mandatory payments not “awards”)  
2. School finance lag  
3. Local government checkbooks highly fragmented  
4. “Other / undistributed” categories exist legitimately  
5. Revisions happen; show as-of dates  
6. Defense and intelligence detail often aggregated  

---

## 11. Future sources (backlog)

- Census Annual Survey of State Government Finances  
- Census Annual Survey of Local Government Finances  
- CMS Medicare/Medicaid statistical summaries  
- FHWA highway statistics  
- DHS / immigration agency budget justifications  
- State open checkbook portals (whitelist best states first)  
