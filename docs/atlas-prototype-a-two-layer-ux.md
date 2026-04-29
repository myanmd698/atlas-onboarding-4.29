# Atlas Prototype A — Two-layer UX (strict rules)

**Purpose:** Keep the **card layer** (financial briefing) and the **analysis layer** (full analysis) clearly separated while feeling like one system. Cards stay fast and confident; analysis adds understanding without becoming an unstructured dashboard.

**Implementation touchpoints (reference):**

- Card layer: `components/home/BriefingFlow.tsx`, `components/home/cards/*`, horizontal paging / web row.
- Entry to analysis: primary CTA **“See full analysis”** on each widget card.
- Analysis layer: `app/(app)/briefing-analysis/[topic].tsx` (and sibling full-analysis routes per widget), **vertically scrollable**.

---

## Product principles (non-negotiable)

- **Cards = clarity and confidence** — answer the question quickly.
- **Analysis = understanding and context** — explain the answer.
- **Connected, not identical** — same typography, color, gradients/atmosphere where used; **different information density and structure**.
- **No duplicate depth** — if detail lives in analysis, the card MUST NOT repeat it at the same granularity.
- **Strong contrast of modes** — “fast briefing” vs “deep read” must remain obvious after any layout polish.

---

## Layer 1 — Main card design (strict boundary)

Cards are the **primary** experience. They MUST remain lightweight, scannable, and single-minded.

### Required structure (order)

Each briefing card MUST include, in this order:

1. **Title** — clear answer or state (the takeaway).
2. **Summary** — **one or two short paragraphs** only.
3. **One supporting visual** — **either** a chart **or** a list (not both unless the second is trivial chrome; default: pick one).

### Card constraints

- **2–3 second takeaway:** A member MUST grasp the main point without scrolling or drilling.
- **No dense data tables** on cards; **no multi-section** card interiors (no “mini dashboard” inside one card).
- **Lists:** **Maximum 2–3 data rows** (labels + values or progress). If more is needed, move to analysis.
- **Charts:** **Simple** — minimal labels, **no heavy legends**, no multi-series complexity. Prefer a single clear comparison or trend cue.
- **Controls:** **At most one simple control family** per card (e.g. time range **or** category). Prefer zero controls on the card; push granularity to analysis.
- **Interaction depth:** **At most one level** of interaction inside the card (e.g. a single toggle). If a second level is required, **the data belongs on the full analysis screen**, not in the card.

### Card copy and tone

- Lead with the **outcome**, not methodology.
- Avoid framing that implies the card is the “full story.”

---

## Layer 2 — Full analysis page design

Full analysis is opened via **“See full analysis.”** It MUST **expand** the same story as the card, not introduce unrelated topics.

### Required sections (order)

Each analysis page MUST include the following **five** sections. Headings may be shortened for UI, but the **intent and content** of each block MUST be present.

#### 1. Summary (top)

- **Reuse the card headline** (or a clear superset of it — same core claim).
- **Expand** to **2–3 sentences** of plain-language restatement of the situation.
- Optionally include a **confidence or context** note (data freshness, caveats, scope) — calm, factual.

#### 2. What’s driving this (breakdown)

- **Category-level** or **grouped** breakdown (spending categories, asset classes, income buckets, etc.).
- **Top contributors** (e.g. categories, transactions, holdings) with **clear labels**.
- **Changes vs prior period or vs average** MUST be explicit where comparison is meaningful.

#### 3. Trend and context

- **Longer horizon** than the card (e.g. **3–12 months** or the relevant equivalent).
- **Larger / richer chart** than the card — enough detail to see pattern, not clutter.
- Surface **short-term fluctuation vs longer trend** (copy, annotations, or chart treatment).
- Goal: user understands **whether to care now** vs **watch over time**.

#### 4. What this means (advisor layer)

- **Clearly labeled** section (e.g. “What this means”).
- Translate data into meaning:
  - Is this **healthy** or **concerning** (without alarmism)?
  - Is this **expected** given context?
  - **Does it change anything** material for the member?
- Tone: **calm, rational, advisory** — not hype, not scolding.

#### 5. Suggested actions (lightweight guidance)

- **Optional** in strength; **non-prescriptive** in tone.
- Examples of acceptable patterns:
  - “No action needed.”
  - “Worth monitoring over the next few weeks.”
  - “Consider reviewing this category.”
- **Avoid** task-heavy, urgent, or guilt-inducing language.

---

## Data and content rules

### Analysis pages MAY include

- Multiple charts.
- Full category breakdowns.
- Longer transaction or line-item lists (still organized, not raw dumps).
- Comparisons (month-over-month, vs average, vs goal).
- More granular filters than the card allows.

### Analysis pages MUST NOT

- Become **cluttered dashboards** (everything at once, no hierarchy).
- Show **unrelated** metrics or cross-widget noise on a single topic page.
- **Overwhelm** with too many parallel sections without progressive structure — use clear hierarchy and spacing; prefer one primary chart per major idea.

---

## Visual and interaction relationship

- Analysis MUST feel like an **expansion** of the card: **carry over** gradient/atmosphere, key brand accents, and component language from `FinanceCardAtmosphere` / card shell patterns where applicable.
- **Typography and color tokens** MUST stay consistent with the rest of Atlas Prototype A (no second visual system).
- **Transition** card → analysis SHOULD feel smooth (**expand, slide, or fade**); avoid a jarring context switch.
- **Cards:** remain **horizontally paged** (deck / web row).
- **Analysis:** **vertical scroll**; may be denser than cards but MUST remain scannable (headings, spacing, section cards).

---

## Enforcement checklist (design + eng)

**Card**

- [ ] Title + 1–2 paragraphs + one chart **or** one short list.
- [ ] Takeaway in ~2–3 seconds; no tables; no multi-section layout.
- [ ] List ≤3 rows; chart simple; ≤1 control type; ≤1 interaction level.
- [ ] “See full analysis” present when deeper data exists.

**Analysis**

- [ ] Five required sections present with correct intent.
- [ ] Headline continuity from card; expanded summary; drivers; trend; meaning; light actions.
- [ ] No unrelated widgets; not a dashboard grab-bag.
- [ ] Visual continuity (gradient/atmosphere, tokens) with smooth transition from card.

**System**

- [ ] No duplicated “full” detail on both layers.
- [ ] Fast vs deep contrast preserved after changes.

---

## Revision note

When adding a **new briefing widget**, define **card content** and **analysis sections** together using this doc so the two layers stay aligned from day one.
