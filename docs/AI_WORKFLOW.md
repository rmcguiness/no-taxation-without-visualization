# Building with AI agents — workflow & prompts

Yes: **keeping a markdown-first project pack and implementing phase-by-phase with Grok + Claude Code is a strong way to go.** Specs prevent agents from inventing a crypto ledger or a “fraud score” product you didn’t ask for.

This doc answers:

1. Is this the best way forward?  
2. What else should you do?  
3. What should you prompt next?

---

## 1. Is markdown + multi-agent the best path?

### What works well

| Practice | Why |
|----------|-----|
| **Spec pack in-repo** | Agents load the same truth; you don’t re-explain |
| **Phased plan with acceptance criteria** | Stops scope explosion |
| **AGENTS.md standing rules** | Claims policy + phase discipline |
| **One phase per long session** | Better code quality than “build the whole platform” |
| **Human review of money math** | Totals must match official sources |

### What to avoid

- One mega-prompt: “Build the entire anti-fraud government blockchain”  
- Letting agents choose random stacks each session  
- Skipping data validation because the UI “looks good”  
- Starting fraud flags before the federal pie works  

### Recommended team split

| Role | Tool | Strength |
|------|------|----------|
| **Product / architecture / review** | Grok (this chat) or planning mode | Specs, tradeoffs, red-team claims |
| **Implementation** | Claude Code / Cursor / Grok Build in the repo | Scaffold, ingest, UI |
| **You** | Human | Data truth checks, design taste, scope decisions |

---

## 2. What else you should do (non-code)

### A. Before heavy coding (1–2 days)

1. **Validate the federal pie by hand**  
   Open OMB Historical Tables; note latest FY totals for receipts and outlays. These become acceptance numbers.  

2. **Pick a short name** for the repo/domain (working title is fine).  

3. **Initialize git** in this folder and commit the docs as the first commit.  

4. **Decide hosting later** — local + Docker Postgres is enough for Phase 1.  

5. **Optional:** Follow 2–3 existing sites for UX inspiration only (USAspending, US Budget Explorer-type tools, state checkbooks)—do not copy branding.

### B. During build

1. After each phase, **spot-check 5 numbers** against the official source.  
2. Keep a `docs/CHANGELOG.md` or GitHub releases.  
3. When stuck on data, prefer **smaller geography** over inventing fields.  

### C. Before public launch

1. Re-read claims policy; screenshot review for forbidden language.  
2. Basic privacy policy if you use analytics.  
3. Consider a simple “Contact / corrections” email.  

### D. Community (later)

- Show a journalist or civic technologist a Phase 1 prototype  
- Ask: “Would you trust this enough to share?”  

---

## 3. Suggested operating rhythm

```
1. Open PHASE_PLAN → pick active phase
2. Prompt agent with phase + acceptance criteria
3. Agent implements
4. You verify numbers + UX
5. Commit
6. Optional: ask second agent to review against AGENTS.md
7. Next phase
```

**Session length tip:** “Implement Phase 0 completely” or “Phase 1 ingest only” beats “do everything.”

---

## 4. Copy-paste prompts

Replace paths if your clone lives elsewhere. Default project path:

`~/Desktop/Development/no-taxation-without-visualization`

### Prompt 0 — Orient any new agent

```
You are working in the repo No Taxation without Visualization.

Read and follow:
- AGENTS.md
- docs/PRODUCT_SPEC.md
- docs/PHASE_PLAN.md
- docs/ARCHITECTURE.md
- docs/DATA_SOURCES.md

Summarize in 10 bullets: mission, current phase to build, stack, claims policy, and what NOT to build yet.
Do not write application code until I confirm.
```

### Prompt 1 — Phase 0 scaffold

```
Implement Phase 0 from docs/PHASE_PLAN.md only.

Requirements:
- Next.js App Router + TypeScript + Tailwind
- Docker Compose for PostgreSQL
- Basic homepage with tagline "No Taxation without Visualization"
- Stub pages: About, Methodology
- ingest/ Python package skeleton with README
- .env.example, proper .gitignore (ignore data/raw large files)
- Update README checkboxes when done

Do not ingest real budget data yet. Follow AGENTS.md.
```

### Prompt 2 — Phase 1 data ingest only

```
Implement Phase 1 DATA layer only (no fancy UI yet).

1. Download OMB Historical Tables for receipts by source and outlays by function
   (see docs/DATA_SOURCES.md). Store raw files under data/raw/ with content hash.
2. Transform to tidy fiscal_series rows as in docs/ARCHITECTURE.md.
3. Load into Postgres.
4. Add pytest (or equivalent) fixtures proving category sums match published totals
   within a documented rounding tolerance.
5. Document exact source URLs and FY coverage in docs/methodology notes or Methodology page content.

Stop when `ingest` can be re-run idempotently and tests pass.
```

### Prompt 3 — Phase 1 UI

```
Wire Phase 1 UI to the ingested federal series.

- Homepage: money in + money out overview charts
- /federal/revenue and /federal/spending
- /sectors/[slug] for major functions with plain-English descriptions
- Year range control via URL query params
- Every chart shows source footer + as-of date
- Include claims policy summary on About

Match docs/PRODUCT_SPEC.md journeys A. Do not add place search or fraud flags.
```

### Prompt 4 — Hardening before Phase 2

```
Review the codebase against AGENTS.md and PRODUCT_SPEC claims policy.

- Find any language that overclaims fraud or "fully accounted"
- Find any chart missing source provenance
- Add missing tests for money totals
- List residual gaps for Phase 1 acceptance criteria in PHASE_PLAN.md

Propose a short PR-style summary of fixes; then implement fixes.
```

### Prompt 5 — Phase 2 place (when ready)

```
Implement Phase 2 from docs/PHASE_PLAN.md.

ZIP/state resolver, state profile, USAspending geographic aggregates.
Emphasize awards ≠ full budget in UI copy.
Follow DATA_SOURCES.md and ARCHITECTURE.md.
```

### Prompt 6 — Phase 3 education (when ready)

```
Implement Phase 3 education vertical: CCD + F-33 district finance.
National → state → district pages with revenue mix, function spend, per-pupil, peers.
Show data lag and confidence badges. No school-level claims unless data exists.
```

### Prompt 7 — Spec change control

```
I want to change the product as follows: <describe change>.

Update the relevant docs (PRODUCT_SPEC, PHASE_PLAN, ARCHITECTURE, DATA_SOURCES)
before writing code. Show me a diff summary of doc changes and wait for approval.
```

### Prompt 8 — Review / red team

```
Act as a skeptical civic data reviewer.

Read the running app behavior and docs.
List the top 10 ways a user could misunderstand the numbers
or how we might accidentally double-count.
Suggest copy and UX fixes only (no new features).
```

---

## 5. What to prompt Grok (me) for vs Claude Code

| Ask Grok / planner | Ask implementer agent |
|--------------------|------------------------|
| Scope tradeoffs | Scaffold & code |
| Claims/legal-ish wording review | Ingest scripts |
| Which vertical next | Chart components |
| Architecture ADRs | DB migrations |
| Prompt writing for next phase | Tests & lint |
| Competitive / data source research | Refactors within phase |

---

## 6. Optional extras you can request later

When you want them, ask for any of these as **new doc files** (don’t invent early):

- `docs/DESIGN_SYSTEM.md` — colors, type, chart style  
- `docs/CONTENT_STYLE_GUIDE.md` — how to write sector explainers  
- `docs/INTEGRITY_RULES.yaml` — integrity rules (Phase 7)  
- `docs/adr/0001-stack.md` — formal stack decision  
- Logo / brand exploration  
- Landing page marketing copy  

---

## 7. Immediate next step (recommended)

1. `cd ~/Desktop/Development/no-taxation-without-visualization`  
2. `git init && git add . && git commit -m "docs: product spec pack for NTwV"`  
3. Open Claude Code (or Grok Build) **in that directory**  
4. Paste **Prompt 0**, then **Prompt 1**  

If you want Grok to do the scaffold here in this environment next, say:

> “Implement Phase 0 and Phase 1 in this repo.”

---

## 8. Success criteria for “process working”

You’ll know the process is healthy when:

- Agents rarely invent features outside the active phase  
- You can verify homepage totals against OMB in under 5 minutes  
- Docs stay slightly ahead of code  
- Each week ships a visible citizen-facing improvement  
