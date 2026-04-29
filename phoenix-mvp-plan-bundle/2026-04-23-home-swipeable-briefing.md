---
title: Home as a swipeable financial briefing — UX direction
date: 2026-04-23
parents:
  - ./phoenix-mvp-scope-ia-journey.md
  - ./2026-04-21-product-direction-and-mvp-scope.md
status: Proposed — overlays existing Home IA
---

# Home — premium swipeable briefing

**Purpose:** UX / visual direction for Home. This overlays the **content model** already defined in [phoenix-mvp-scope-ia-journey.md §3.2 Home](./phoenix-mvp-scope-ia-journey.md) (same canonical insight objects, same IA constraints in §6). It does **not** replace that spec — it defines how those same reads are presented and navigated.

## 1. Experience framing

Home is a curated **financial briefing**, not a dashboard. The primary interaction is a horizontal deck of large, editorial insight cards that the user swipes through one at a time. It must work on web (React Native Web) as well as native.

**Governing feeling:** calm, premium, editorial, AI-forward but quiet. Closer to a beautifully art-directed story card than a banking dashboard. Avoid loud fintech blues, hard borders, dense widgets, or gamified/consumer-budgeting aesthetics.

## 2. Card ordering — household reading order

Cards are ordered by the natural order a household evaluates their finances:

1. **Immediate read — overall status** *("anything broken or on fire?")*
2. **Immediate read — cash flow this month** *("are we spending less than we earn?")*
3. **Immediate read — net worth stability** *("is net worth shrinking or stable?")*
4. **Directional read — trend** *("are we generally moving in the right direction?")*
5. **Planning read — goals** *("are we on track for the things we care about?")*
6. **Planning read — coming up** *("any surprises headed our way?")*
7. **Optional couples layer** *("are both partners seeing the same story?")* — gated on persona/couples shipping

## 3. Card anatomy (shared across the deck)

Every card answers exactly one question and uses the same anatomy:

1. **Title** — short, answer-like (e.g. "All clear", "You're saving this month", "Net worth is up")
2. **One-sentence summary** — plain-language meaning, directly below title
3. **Supporting visual** — chart or row list, sitting in the lower half / lower two-fifths
4. **Controls strip** — compact, translucent, below the visual (see §5)
5. **Expandable detail state** — smooth vertical reveal **in place**, not a new screen

Hierarchy is strict: title → summary → visual → controls. One card dominates the screen; the user should be able to stop after one or two cards and still understand their financial state.

## 4. Visual direction

**Card container**
- Large, warm off-white / white sheet; generous rounded radius; roomy interior padding.
- Very subtle elevation / soft shadow so the card reads as a physical sheet over the app background.
- Nearly full-screen width with slim side gutters; substantial height — one card per screen.

**Background**
- Soft neutral (light gray, warm gray, desaturated mist). Low contrast app chrome so cards float.

**First card (overall status / "financial weather report")**
- The most immersive card in the deck.
- Subtle gradient wash in the upper portion: pale lavender, soft blue, muted blush, warm cream, light sage, foggy gray. Fades into the white base as it moves downward.
- Atmospheric, never saturated or flashy.

**Other cards**
- Same white base; optional very light gradient tint / color haze only in the header area, always restrained and translucent.
- Lower half (charts / rows) stays clean and readable.

**Typography**
- Refined / editorial headline feel is acceptable for titles if tasteful; Funkis Headline per QDL (see [docs/guidelines/01-product-design.md](../docs/guidelines/01-product-design.md), "Aesthetic guidelines").
- Summaries remain highly readable and modern (Funkis Text).
- Avoid tiny finance-app labels; hierarchy via scale, weight, spacing — no extra fonts.

**Visuals inside cards**
- Minimal, soft chart styling: no strong gridlines; faint dividers only where needed. No dense legends or analytical labels.
- Rows (for renewals, anomalies) use subtle separators; premium, not dashboard-y.

## 5. Controls strip (within-card sub-interaction)

Below the visual, each card carries a **compact interactive controls strip**:

- Lightweight, translucent / softly framed; rounded pill or segmented controls.
- Signals the user can keep exploring inside the card without leaving the deck.
- Examples per card:
  - **Cash flow** — This month / 3 months / Income vs spend
  - **Net worth** — Total / Assets / Liabilities
  - **Directional trend** — 3M / 6M / 12M
  - **Goals** — Progress / Timing / What changed
  - **Coming up** — swipe across 2–3 notable upcoming items

**Two axes of motion**
1. **Deck-level** horizontal swipe between cards
2. **Card-level** horizontal swipe / segmented toggle inside the controls strip

The card-level interaction is **contained and secondary**. It must be visually distinct (framed pill region, clear hit area) so it does not compete with the deck swipe.

## 6. Motion / interaction

- Deck swipe is the primary navigation; polished, fluid transitions between cards.
- Cards open in a **collapsed state by default**; tapping a card expands it **in place** (smooth vertical reveal inside the same card, not a modal or new screen).
- Expanded state shows fuller numbers, full charts, or more rows.
- Controls animate subtly when toggled or swiped.
- First card has the strongest sense of immersion and polish.
- Respect platform reduce-motion settings.

## 7. Card-by-card spec (mapping to canonical insights)

All cards read from the same canonical insight objects defined in the scope doc. Nothing here introduces a new calculation or insight class; this is presentation only.

| # | Card | Maps to (scope doc §3.2 / §4) | Title examples | Summary | Visual | Controls |
|---|---|---|---|---|---|---|
| 1 | **Overall status** | Vibe check + anomaly (absorbed here, §3.2 Status) | "All clear" / "Needs attention" | Plain-language read on whether anything is broken | Status timeline, small pulse chart, or alert row stack | Coach mark on first open; "Show what changed" toggle |
| 2 | **Cash flow** | Cash flow card (§3.2; §6 #23) | "You're saving this month" | Spending vs. income for the period | Money in vs money out bars / soft line comparison; three-number expand | This month / 3 months / Income vs spend |
| 3 | **Net worth stability** | Net worth card (§3.2; §6 #10) | "Net worth is up this month" | Month-over-month directional change | Mini trend line; account rows in expand (with sync health / reconnect) | Total / Assets / Liabilities |
| 4 | **Directional trend** | Net worth + cash flow multi-month (same objects, longer window) | "You're moving in the right direction" | Broader trend across several months | Multi-month line | 3M / 6M / 12M |
| 5 | **Goals / forecast teaser** | Per-scenario trajectory (§3.2 Forecast; §6 #21) | "On track for your down payment" | Progress + estimated readiness date range (§6 #27) | Progress bar, milestone timeline, or trajectory sparkline | Progress / Timing / What changed |
| 6 | **Coming up** | Upcoming renewals card (§3.2; §6 #25) | "Coming up" | Upcoming renewals, spikes, or large expenses | Row list (merchant, amount, timing) | Swipe through items / Renewals vs Anomalies |
| 7 | **Couples layer** *(gated)* | Couples / persona variant (§3.2; §6 #4) | "Same picture for both of you" | What each partner is seeing | Side-by-side digest snippets | Manager view / Stakeholder view |

**Investments card**: the existing plan ships a permanent Investments card on Home (§2 Phase 1 must-have; §6 #24). It is **not** in the 7-card household reading order above. Options to resolve before build:
- **(a)** Insert Investments as card 3.5 (between net worth and directional trend).
- **(b)** Absorb Investments performance into the directional trend card's controls (e.g. All / Investments / Net worth).
- **(c)** Keep it as a permanent card after the reading-order deck and treat it as a standing entry.

**Digest entry**: the existing plan has a monthly digest entry at the end of Home (§3.2). Either include as final card or as a dedicated "Last month" card after 7, or surface as a link from card 1's expanded state. Needs to be explicit before build.

## 8. Constraints that still apply (from existing IA)

These are non-negotiable regardless of the swipeable presentation:

- **Summary-first, expand for detail** (§3.2 Home composition #1).
- **Max one active alert** (§3.2 #4): card 1 absorbs anomaly; multiple anomalies batch into "N things to review".
- **No competing directional stories** (§3.2 #5): cards 2/3/4 must reconcile with card 1 sentiment.
- **Home = present state, Forecast = forward-looking** (§6 #16): card 5 is a **teaser** for saved Forecast cards — it does not host the full scenario engine UX; tapping routes into the Forecast tab.
- **No global Plaid health banner** (§6 #19): reconnect affordance lives inside the Net Worth card's expand state (account rows), not as a separate deck card.
- **Contextual AI per card** (§3.2; §4 principle 2): every card exposes a Chat entry point grounded on that card's insight. Add as a persistent affordance (e.g. small "Ask" pill inside the controls strip or a floating entry) so it does not disappear with deck swipes.
- **Top nav bell** (§3.2 Notification center): bell icon for the in-app notification center must remain present on the Home screen, above the deck.
- **TopNavBar on every mobile screen** (QDL rule 9): required first child of the Screen; deck sits below it.
- **Tokens only** (QDL rules 2, 12): all colors, radii, spacing, typography via QDL tokens; semantic tokens so dark mode works.
- **Realistic, internally consistent mockup data** (§8 prototype mockup data): every card reads from the same authored dataset; no contradictions across the deck.

## 9. Cross-platform / implementation notes

- React Native + RN Web. Prefer `react-native-reanimated` + `react-native-gesture-handler` for deck swipe and in-card controls to keep gestures consistent across native and web. Validate web gesture behavior early.
- Two horizontal gesture layers is a known UX pitfall: wrap the in-card controls in a visually framed region with its own gesture responder; prefer segmented-tap over horizontal swipe where possible to reduce conflict.
- Card expand-in-place must not break deck measurement (fixed card footprint with animated inner height) to keep deck swipe stable.
- Respect safe areas, reduce-motion, large-text (QDL accessibility).

### 9.1 Web gesture implementation (required)

**Setup**
- Confirm `GestureHandlerRootView` wraps the root on the web bundle (Expo Router should include it; verify it is not stripped in the web build). Without it, RNGH pointer event interception is a no-op on web.

**Deck pan gesture configuration**
- Use `Gesture.Pan()` with:
  - `activeOffsetX: [-10, 10]` — gesture only activates on clear horizontal intent.
  - `failOffsetY: [-5, 5]` — yields to vertical scroll if the user moves vertically first. This prevents the deck from eating vertical scroll inside an expanded card.
  - `enableTrackpadTwoFingerGesture(true)` — enables trackpad two-finger horizontal swipe on macOS/web.
- Wrap the deck in a `View` with `style={{ overflow: 'hidden' }}` on web so off-screen cards do not widen the page and trigger browser-level horizontal scroll.

**In-card controls strip (avoid gesture conflict)**
- **Do not** use a horizontal `Pan` gesture or `ScrollView` with `horizontal` for the controls strip. Use a **segmented `Pressable` row** (tap-to-select) instead.
- This eliminates the two-gesture-on-one-axis conflict on web entirely. The deck pan is the only horizontal gesture in the component tree.

**Web-only navigation affordances**
- Render **dot pagination + previous/next arrow buttons** alongside the deck on web (`Platform.OS === 'web'`). These are hidden on native.
- Attach `onKeyDown` for `ArrowLeft` / `ArrowRight` on the deck container so keyboard-only users can navigate cards. This is a web accessibility requirement; swipe-only is not sufficient on desktop.

**Card expand behavior on web (resolves §10.6)**
- Collapsed → expanded: tap/click anywhere on the card header area.
- Expanded state must render a visible collapse affordance (e.g. chevron-up or "Show less" label).
- **Deck swipe is disabled while any card is expanded.** Re-enable on collapse. This prevents the pan gesture from firing mid-expand animation and avoids the user accidentally navigating away from an open card.
- Collapse is not required before navigating; collapsing is implicit if the user uses arrows/dots (native swipe is disabled by the gesture lock above).

## 9.2 Expo Go + versioning (confirmed)

- **Do not downgrade Reanimated.** Expo SDK 55 bundles Reanimated v4 in Expo Go — v4 is the correct version. `react-native-worklets` is already a dependency; setup is correct.
- **Expo Go for SDK 55 is not on the App Store yet.** For iOS testing: install via TestFlight External Beta or `eas go`. For Android: install directly via Expo CLI.
- The swipe deck will be validated on **both Expo Go (phone)** and **web** before merging. These are the two required test targets.

## 9.3 MVP deck scope (confirmed)

- **2–3 cards** for MVP. Sufficient to prove the "financial briefing" swipe UX.
- Suggested cards: **Overall status → Cash flow → Net worth stability** (cards 1–3 from §7).
- Remaining cards (4–7) are deferred to a follow-up build cycle.

## 10. Open decisions (flagged for resolution)

1. Placement of the permanent **Investments** card in the 7-card sequence (§7 options a/b/c).
2. Placement of the monthly **Digest** entry within or after the deck.
3. Couples card (#7) is gated on persona toggle / couples shipping — confirm it is **hidden** in solo MVP per §6 #3.
4. Whether card 4 (directional trend) is a distinct card or becomes a controls-level range switch on card 2/3 (possible consolidation to keep the deck tight).
5. "Financial weather report" framing vs. existing "vibe check" label — pick one canonical label across product, content, and instrumentation.
6. ~~Card expand behavior on web (tap vs. hover vs. click-to-expand) and whether collapse is required before horizontal deck swipe.~~ **Resolved in §9.1:** tap/click header to expand; deck swipe disabled while expanded; collapse is implicit on arrow/dot navigation.
7. Default vs. dismissible: in existing plan, Upcoming renewals and Couples are **conditional**; confirm the deck hides empty conditional cards (so the deck length varies by user state) rather than showing empty placeholders.

## 11. Success criteria for this direction

- A Stage-3 household user can open Home, read card 1, and walk away with an accurate "are we okay?" read in under 5 seconds.
- First card clearly feels more immersive than the rest; the deck feels like one coherent system.
- Deck swipe and in-card controls never conflict in usability testing.
- Every numeric claim on every card is traceable to a single canonical insight object used elsewhere in the app.
