---
name: Phoenix plan revisions
overview: "Phoenix MVP (April 2026 briefs): solo-first read-only MVP; Plaid-only (incl. read-only investments — Investments card is Phase 1 must-have, council-agreed). Nav Home | Forecast | Chat | Profile. Home = vibe + net worth + cash flow (trend, net savings as secondary) + linked accounts (no top Plaid banner) + investments + conditional renewals/anomaly; in-app notification center mirrors relink + dismissible alerts. Forecast tab = presets + saved scenario cards, trajectory + confidence, not buried in Chat. Monthly in-app digest (Manager + Stakeholder); Stakeholder in-app surface first-class; optional weekly Stakeholder email (onboarding checkbox). Push = high-bar subset. See phoenix-mvp-scope-ia-journey.md + 2026-04-21-product-direction-and-mvp-scope.md."
todos:
  - id: rename-future-forecast
    content: Find-replace 'Future' → 'Forecast' throughout phoenix-mvp-scope-ia-journey.md and product-direction doc (nav label, headings, mermaid nodes, IA constraints, copy guidance)
    status: completed
  - id: defer-persona-toggle
    content: Move persona toggle from Phase 1 must-have to nice-to-have; add 'solo first' as an explicit IA principle; update Profile screen content and Journey 2 note
    status: completed
  - id: brokerage-clarification
    content: Add Plaid investment/brokerage read-only scope note in out-of-scope section and Section 6 data constraints
    status: completed
  - id: home-card-composition
    content: Add permanent vs dismissible card taxonomy and 5 composition principles to Section 3.4 (Home) and Section 6
    status: completed
  - id: forecast-progress-relocation
    content: Move saved forecast progress card from Home to Forecast tab; add lightweight Forecast entry point row to Home; update mermaid screen hierarchy diagram
    status: completed
isProject: false
---

# Phoenix Plan Revisions

## Files being updated
- [phoenix-mvp-scope-ia-journey.md](./phoenix-mvp-scope-ia-journey.md) — full IA + notification center spec
- [2026-04-21-product-direction-and-mvp-scope.md](./2026-04-21-product-direction-and-mvp-scope.md) — meeting notes + surface matrix
- **This file:** `phoenix_plan_revisions_d1fd1187.plan.md` in this folder (in the research repo, a symlink at `~/.cursor/plans/` may point to a copy in `briefs/`).

---

## 1. Rename "Future" → "Forecast" everywhere

All references to the "Future" tab — nav label, section headings, screen hierarchy diagram, journey flows, IA constraints, copy guidelines — replaced with **Forecast**.

- Bottom nav becomes: `Home | Forecast | Chat | Profile`
- Section headers: "Future tab" → "Forecast tab"
- IA constraint #4: `"Scenario framing = 'Forecast' or 'What if'"` (was "Future")
- All mermaid node labels updated accordingly

---

## 2. Persona toggle → optional for MVP; solo read-only is primary

**What changes:**
- Phase 1 must-have: remove persona toggle from the list; solo Manager experience is the primary read-only build target
- Phase 1 nice-to-have: add persona toggle (both in Profile and app-wide tone switching) as explicitly optional
- Journey 2 (Returning Stakeholder): retain the journey but note it is gated on the optional toggle feature shipping
- IA principle added: **"Solo first"** — every screen and card must work as a complete experience without any partner or persona toggle context
- Profile screen: persona toggle entry moved to optional/deferred section

**Rationale captured in doc:** Focusing on the solo experience at its best before adding couple/persona complexity reduces scope risk and keeps the core value prop clean.

---

## 3. Brokerage account: read-only Plaid view is in scope

**What changes:**
- Out-of-scope line "Money movement, banking, brokerage trading" remains — but add a clarifying note: *users who linked a brokerage account via Plaid can view balances, holdings, and performance in read-only mode; they cannot open new accounts or transact*
- Investment card (nice-to-have, Phase 1) explicitly includes: Plaid-linked brokerage + retirement account balances, holdings summary, and simple performance vs benchmark — **display only, no trade actions**
- Add to Section 6 (data constraints): "Brokerage display is read-only Plaid data. No account opening, trading, or order routing in v1 or v2."

---

## 4. Home dashboard — net worth, net savings placement, and no Plaid banner

**Home dashboard card composition** (Section 3.4 + Section 6) — updated 2026-04-22.

### Card taxonomy for Home

**Permanent widgets** (always present, never dismissible, carry visual weight of the core dashboard):
- Vibe check header — the top-level status; always shown
- **Net worth card** — **primary** financial snapshot (aggregated from Plaid; trend + data-as-of) — *replaces* a standalone **net savings rate** headline card
- **Cash flow direction card** — includes **trailing net savings / surplus** as a **secondary line** (or sub-block), not a competing primary headline. Full savings narrative also in **monthly digest** and **Chat**
- **Linked accounts** — each institution/account row shows **label, last successful sync, health** (OK / action needed / stale). Tapping to **Reconnect** when needed. **Replaces a separate "Plaid health banner"** at the top of the app; no sticky global Plaid bar in v1
- Forecast entry row, digest (unchanged from prior plan)

**Conditional + dismissible cards** (appear only when triggered; can be acknowledged/dismissed):
- Anomaly card — appears on trigger; user can dismiss once acknowledged (dismissal feeds signal)
- **Investments card (Phase 1 must-have, permanent on Home when spec applies)** — read-only Plaid performance + rolling-12m payouts / % of spend covered; not a dismissible “alert” list item by default

**Removed from Home (relocated to Forecast tab):**
- Saved forecast progress card → see section 5 below

### Composition principles to prevent "banner wall" feel
1. **Max 1 dismissible alert card visible at once** — if multiple anomalies exist, they batch into a single summary card ("3 things to review") that expands, not a vertical stack of banners
2. **Visual tier distinction** — permanent widgets use a data/chart-primary style (heavier, more content); dismissible cards use an action-primary style (lighter, clear CTA + dismiss affordance)
3. **Section header rhythm** — optional light section label separates "Your current picture" (permanent) from "Things to review" (dismissible alerts). No section label if no active alerts
4. **No competing directional stories** — if anomaly card and **net worth / cash flow** would show opposing sentiment, reconcile before rendering (council: metric consistency)
5. **Silence feels monitored** — all-clear in alert zone when relevant; **per-row last synced** in **Linked accounts** is the main signal that the system is watching; no top Plaid banner

---

## 5. Saved forecast progress card → Forecast tab

**What changes:**
- Remove "Saved forecast progress card (after promotion)" from Home card stack
- Add to Forecast tab: **Promoted goals section** at the top of the Forecast tab, above saved scenario cards. Shows goal name, progress bar (if trackable), target date, and last-updated delta
- Home gets a lighter **Forecast entry point** instead: a single "Forecast" row in the permanent section (not a full card) that shows "1 active forecast · view →" — only appears after first scenario is saved. This keeps Home clean while surfacing awareness without duplicating the full card
- IA diagram updated: `GoalProgress` node moves from Home branch to Forecast branch

**Rationale:** Forecast progress belongs to a planning mental model, not a "how am I doing today" mental model. Home should only carry real-time financial state; the Forecast tab owns the forward-looking layer.

---

## Mermaid diagram changes (screen hierarchy)

```
Bottom nav: Home | Forecast | Chat | Profile

Home branch removes: GoalProgress node, NetSavings, PlaidBanner
Home adds: NetWorth[Net worth card], LinkedAccounts[Linked accounts list per sync/health], ForecastEntry[Forecast entry point], CashFlow[Cash flow + net savings subline]

Forecast branch adds: PromotedGoals[Promoted goals section, after first promotion]
Forecast renames: Future → Forecast throughout all node labels

App node: NotifCenter[Notification center — mirrors relink + dismissible alerts]
```

---

## 6. Notification center — canonical in-app list (addendum 2026-04-22, updated 2026-04-22)

- **In-app notification center** lists **every** open **Plaid / connection** relink item and **every** **dismissible** home **alert** (anomalies, including batched "N things" at the data level). Same **canonical insight objects** as **Linked accounts** rows and Home alert cards — **one state, no forked logic**. **Not** a duplicate of a *removed* top Plaid banner; there is no such banner in v1.
- **Push** is a **high-bar, optional** loud channel; insights still appear in the **in-app** list even if push is off, dismissed on Home, or not yet eligible for push (per council phased anomaly push).
- **Dismiss/ack** from Home or from the list updates the **same** object; no Home vs. list mismatch.
- **Investments** read-only **card** (P1 must-have) is **not** a dismissible alert by default — **does not** need to mirror in the list; optional later if we add separate informational nudges.
- **Spec home:** [phoenix-mvp-scope-ia-journey.md §3.4a](./phoenix-mvp-scope-ia-journey.md) and constraints **#18–19** in Section 6.

## 7. What is the “Plaid health banner”? — superseded (2026-04-22)

**Former idea:** a sticky strip at the top of Home for “reconnect / connection unhealthy.”

**Current plan:** **no global Plaid health banner**. Users infer health from **(1) Linked accounts** (per-item **last sync** + **status** + **Reconnect**), **(2) notification center**, and **(3) optional push**. Same insights; no redundant top-level strip.

## 8. Stakeholder weekly email digest (read-only; addendum 2026-04-22, updated)

- **Goal:** **Checkbox** in onboarding: while the Manager adds **Stakeholder** contact, they can **opt in** to a **weekly** Stakeholder-tone digest (not pre-checked by default). No **auto-enroll** without the explicit check. High value for read-only (partner can get email without the app when opted in).
- **Content:** Same **canonical digest narrative** family as in-app Stakeholder digest; **weekly** cadence (not necessarily the same as Manager’s **monthly** in-app card).
- **Controls:** Stakeholder **unsubscribe** in email; Manager can **change** in Profile (notification settings). Legal/compliance (consent copy, list hygiene) before ship.
- **Spec home:** [phoenix-mvp-scope-ia-journey.md](./phoenix-mvp-scope-ia-journey.md) (Phase 1 item 6, onboarding mermaid, §4 table, Section 6 constraint #20); [2026-04-21-product-direction-and-mvp-scope.md](./2026-04-21-product-direction-and-mvp-scope.md) (matrix + MVP cut).

---

## 9. Post-revision alignments (2026-04-21+)

Captured in the two briefs above; this section records deltas relative to *earlier* revision notes in sections 1–8.

- **Investments** — **Phase 1 must-have** (council-agreed), not optional: single Home **Investments** card with read-only performance (vs. index for context) + rolling-12m dividends/interest/payouts and **% of typical monthly spend covered**; empty/ link prompts when no brokerage; no trading.
- **Digest / Stakeholder** — In-app **monthly** household narrative; **Stakeholder** has a **first-class in-app** digest (not email-only). **Weekly Stakeholder email** remains the narrow **onboarding checkbox** opt-in; Manager/marketing email broadly still deferred.
- **Forecast (tab)** — First-class **bottom-nav Forecast**; saved scenarios are **cards on Forecast**; baseline inferred + user-editable; “draft goal” → **tracked goal** promotion path; scenario taxonomy and phasing in product-direction §5. Home does not host a full “saved progress” card stack (per §5 prior revision — Forecast owns forward-looking).
- **Insight delivery** — Section 4 of `2026-04-21-product-direction-and-mvp-scope.md` adds the **surface × trigger matrix** (no nav tab badges v1, notification center as durable index, push as subset).
- **Solo-first** — Persona toggle and partner invite remain **nice-to-have**; build targets solo Manager first (see `phoenix-mvp-scope-ia-journey.md`).

**Parent 1-pager** ([`Project Phoenix MVP Product Plan.md`](./Project%20Phoenix%20MVP%20Product%20Plan.md)) should be read together with the other docs in this folder; a **Source of truth (April 2026)** block at the top of that file points here for executional detail.
