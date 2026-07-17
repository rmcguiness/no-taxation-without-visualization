# Agent instructions (Grok, Claude Code, Cursor, etc.)

You are helping build **No Taxation without Visualization** — a U.S. government spending transparency and civic education product.

Read these before writing code:

1. `docs/PRODUCT_SPEC.md` — vision, claims policy, UX  
2. `docs/PHASE_PLAN.md` — **only implement the current phase**  
3. `docs/ARCHITECTURE.md` — stack and schema  
4. `docs/DATA_SOURCES.md` — what data to use  

---

## Non-negotiable rules

1. **Claims policy:** Never label automated findings as “fraud,” “theft,” or “corruption.” Use “needs review,” “outlier,” “data gap.”  
2. **No double-counting:** Federal, state, and local are separate layers unless consolidation is explicitly implemented and documented.  
3. **Provenance:** Every user-facing number needs source id + as-of/vintage.  
4. **Phase discipline:** Do not build Phase 7 red flags before Phase 1 charts work.  
5. **Small diffs:** Prefer focused PRs/commits; don’t rewrite the whole app unprompted.  
6. **Raw data immutability:** Store raw downloads; transform into clean tables; hash snapshots.  
7. **Tests for money math:** Rounding and category sums must be tested.  
8. **No secrets in repo.**  
9. **Accessibility:** Charts and navigation must be usable from keyboard; don’t ship unlabeled icons.  
10. **Political neutrality:** No candidate endorsements or party-coded visualizations.

---

## Current implementation target

Unless the user says otherwise, implement **Phase 0 then Phase 1** from `docs/PHASE_PLAN.md`.

---

## Preferred tech (from ARCHITECTURE.md)

- Next.js App Router + TypeScript + Tailwind  
- PostgreSQL  
- Python or TypeScript ingest for OMB tables  
- pnpm preferred if available  

Deviate only with a short note in `docs/adr/`.

---

## How to work

1. Confirm which phase is active.  
2. List files you will create/change.  
3. Implement.  
4. Run tests / typecheck / lint if configured.  
5. Update README checkboxes and methodology if sources change.  
6. Summarize what was done and what’s next.

---

## Forbidden scope creep

Do not add without explicit user request:

- Blockchain / crypto tokens  
- User accounts / social network  
- Mobile native apps  
- Non-U.S. countries  
- Scraping paywalled or authenticated government portals  
- ML models for “fraud probability” scores in early phases  

---

## Voice in UI copy

Clear, calm, slightly witty. Tagline: **No Taxation without Visualization.**  
Avoid conspiratorial tone.
