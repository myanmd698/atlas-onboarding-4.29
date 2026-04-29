# Product direction & MVP scope — meeting notes

**Date:** 2026-04-21  
**Context:** Problem definition / positioning discussion (John)  
**Purpose:** Capture direction and assumptions to inform Phoenix MVP scope.

---

## 1. Product direction & problem definition

### Financial behavior phases (framing)

John outlined three phases of personal financial behavior:

1. **Early savers** — Basic balance accumulation, emergency fund goals.
2. **Active budgeters** — Transaction categorization, detailed tracking (Mint, YNAB, etc.).
3. **“Good enough” budgeters** — Surplus management; limited time or desire for deep optimization.

**Strategic focus:** Stage 3 — users with financial knowledge but limited time.

### Target audience (Stage 3)

- Base income level; partners and/or young children.
- Pain around **couples’ financial discussions** (alignment, visibility, shared decisions).
- **Current tools feel too transaction-focused** for how they want to manage money.

### Core value proposition

Help high-income earners **understand present and future financial position** so they can make better decisions — without forcing transaction-level budgeting.

| Theme | Direction |
|--------|-----------|
| Savings & cash flow | **Net savings rate** and directional clarity vs. line-item budgeting |
| Investments | **Portfolio performance with market context** (not just balances) |
| Planning | **Scenario modeling** (e.g., “Can we afford a $40K car next year?”) |

---

## 2. Key assumptions & risks

| Assumption / risk | Notes |
|-------------------|--------|
| **Plaid vs. manual** | Willingness to **reconnect Plaid** (or maintain links) regularly vs. tolerating manual entry — affects onboarding and ongoing engagement. |
| **Product vs. ChatGPT** | Why use a **dedicated financial product** vs. uploading statements to general LLM tools — must be clear on trust, persistence, accuracy, and household scope. |
| **Read-only first** | **Read-only insights may be enough** to validate before money-movement features — scopes Phase 1 and de-risks compliance. |
| **Couples angle** | **Couples as a feature** vs. **primary GTM narrative** — positioning and MVP IA depend on which is primary. |

---

## 3. Implications for MVP scope (working)

Use this section with [`Project Phoenix MVP Product Plan.md`](./Project%20Phoenix%20MVP%20Product%20Plan.md) (same folder in the plan bundle) and hypotheses docs.

1. **Double down on “surplus / trajectory” narratives** — net savings rate, runway-style signals, and scenario answers over category drill-down as the default experience.
2. **Investment slice** — include performance + context if validating “not just Mint”; scope minimum viable data (read-only) and what “context” means (benchmarks, time horizon, simple explanations).
3. **Scenario modeling** — treat as a **differentiator** in MVP if feasible; otherwise stub with LLM + manual inputs until data quality supports it.
4. **Couples** — decide early: shared household view + dual “manager vs. stakeholder” tones (per existing MVP plan) vs. marketing-only couples story for v1.
5. **Validation path** — ship read-only **dashboard + narrative + light forecasting** first; defer money movement until insight value and link maintenance are proven.
6. **Competitive wedge** — articulate in-product why this beats “ChatGPT + PDFs” (ongoing sync, structured household model, privacy posture, specialized prompts).

---

## 4. Insight delivery — surface × trigger matrix

**Thesis:** Proactive delivery is the differentiator. The same underlying insight should be reachable via multiple doors (**push**, **in-app notification center**, home dashboard cards, chat, digest) but sourced from one canonical object to stay consistent. The **in-app notification center** is the durable index: **every** open Plaid relink item and **every** dismissible home alert appears there, even when push is off or the home card was dismissed; push is a higher-urgency subset, not a separate source of truth.

**No nav tab badges (v1):** Home is expected to refresh often, so a persistent badge would train users to ignore it. Ambient awareness lives on the dashboard itself; urgent items use push.

### Alert taxonomy (before mapping surfaces)

| Class | Examples | Default channel |
|-------|----------|-----------------|
| **Urgent / anomaly** | Duplicate charge, **single bill spike >30%** vs. last charge, **category total up 10–20%+ vs. recent baseline**, missed payment, Plaid link broken | Push / notification center |
| **Weekly directional** | Savings averaged over recent weeks, "on track" vs "off track" signal | In-app digest / home card |
| **Monthly narrative** | Full household summary (Manager + Stakeholder versions) | In-app digest + optional **Stakeholder** weekly email (Manager **checks** opt-in when adding Stakeholder in onboarding) |
| **Heads-up (non-urgent)** | Upcoming recurring charge in next ~30 days, investment payout posted, scenario answer | Home card (upcoming-renewals card is conditional) |

### Insight type × surface matrix

| Insight type | Home dashboard | Push / notification center | Chat answer | Digest / report |
|--------------|:--------------:|:--------------------------:|:-----------:|:---------------:|
| **Net worth** | ✓ primary Home card | — | ✓ | ✓ |
| **Net savings rate (trailing / surplus)** | Secondary in **cash flow card** + digest + chat — not a standalone headline | — | ✓ | ✓ |
| **Cash flow direction (monthly)** | ✓ card | — | ✓ | ✓ |
| **Anomaly / weird charge** | ✓ card (max one batched) | ✓ in-app list always; push high-priority when enabled | ✓ | ✓ |
| **Upcoming renewals (MVP)** | ✓ conditional card (next ~30 days) | ✓ on price increase only | ✓ | ✓ |
| **Full subscription management** | — | — | — | — *(Phase 2+; not in MVP)* |
| **Investments** *(permanent: performance + payouts / % of spend covered)* | ✓ single Home card | — | ✓ | ✓ |
| **Goal / scenario answer** | ✓ card | — | ✓ | — |
| **Plaid link broken / stale** | **Linked accounts** row (per item) + optional inline callout; **no** global top banner | ✓ in-app list always; push per phased policy | ✓ | — |
| **Couples alignment prompt** | ✓ card | — | ✓ | ✓ |
| **Stakeholder weekly email digest** | *—* (driven from onboarding) | — | *—* (email body can link to help / optional web) | **Weekly** Stakeholder-tone narrative when **opt-in** checked during onboarding; no pre-check by default |

### Design principles for this layer

1. **High bar for push; full in-app list** — only anomaly-class and broken-link alerts ship as **push** in early phases. **Separately,** the in-app **notification center** always lists every open Plaid relink and every dismissible home alert (same objects as **Linked accounts** rows and Home), so nothing lives only in push or only on a card that the user swiped away. **No** separate Plaid “health” strip — use **account list** + **notification center** + **push** only.
2. **Chat as explainer, not gatekeeper** — every dashboard card should expose contextual AI (Chat opens pre-grounded on that widget with copy that explains that region’s insight) so answers use the same data snapshot and stay consistent.
3. **One canonical object** — the same insight object powers all surfaces; no separate logic paths per channel.
4. **Couples variant on every row** — each insight has a Manager view (granular) and Stakeholder view (directional headline) by default.

### MVP scope cut (which rows ship first)

- **Phase 1 must-have:** Net worth home card, cash flow card with explicit money in / money out / difference plus a last-few-months difference trend in expand (net savings averaged over recent weeks as secondary context), Linked accounts health via net-worth account rows + notification center, Investments card *(permanent; council-agreed)* combining performance and payouts (rolling 12-month dividends/interest with % of typical monthly spend covered), upcoming renewals conditional card (next ~30 days; heads-up only, not a manager), anomaly detection with pinned rule thresholds, in-app notification center mirroring dismissible alerts + relink (push policy per phased rollout). No separate Plaid health banner — health is visible in the account list and notification center.
- **Phase 1 nice-to-have:** goal/scenario answer in chat *(Investments card is must-have above)*.
- **Target for read-only:** **Weekly Stakeholder digest (email)** — **checkbox opt-in** when Manager adds Stakeholder in onboarding; not the same as generic “Manager email” (still defer broad Manager/marketing email).
- **Defer:** Subscription tracking, broad **Manager**-focused or marketing **email** beyond the Stakeholder weekly exception.

---

## 5. Scenario modeling & "Forecast" tab — IA decisions

### Nav placement: a dedicated "Forecast" tab

Scenario modeling lives in the **bottom nav as a first-class tab** — **"Forecast."** This signals that planning is a core product pillar alongside the present-state dashboard, not a buried tool or chat-only feature.

### Saved scenarios as cards on the Forecast tab

- Scenarios are **persistent, named cards** on the Forecast tab — not ephemeral chat results.
- Each card shows: the scenario question, the baseline, the projected outcome, and a last-updated timestamp.
- Users can initiate a scenario from:
  1. **The Forecast tab directly** — structured entry (pick a scenario type, enter variables).
  2. **Chat** — freeform "what if" question; at the end of the exchange, the app prompts: *"Want to save this as a forecast plan?"* One tap saves it as a card on the Forecast tab.
- Saved cards are re-runnable — tapping "Refresh" re-calculates against current account data.

### Baseline assumptions: system-inferred + user-editable

- The **system infers the baseline** from linked accounts (income from deposits, spend from transactions, savings rate, asset/liability snapshot).
- Users can **override any assumption** — e.g., adjust estimated income, add an expected salary increase, change a rate assumption.
- When the system has low confidence in an inferred value, it surfaces it explicitly: *"We estimated your monthly income at $X from deposits — is that right?"* Transparency is part of the trust model.
- Baseline is a shared household object; both partners (Manager + Stakeholder) see scenarios calculated from the same numbers.

### Scenario taxonomy and MVP phasing

| Scenario type | Inputs | MVP phase |
|---------------|--------|-----------|
| **One-time purchase** ("Can I buy X?") | Item cost, target date | Phase 1 |
| **Allocation change** ("What if I increased 401k to X%?") | New % or dollar | Phase 1 |
| **Major asset acquisition** ("What if I bought a $Xm house?") | Price, down payment, rate | Phase 2 |
| **Life event** ("What if we had another kid?") | Cost assumptions | Phase 2 |
| **Retirement timing** ("What if I retired at 55?") | Target age, spend rate | Phase 2+ |

### Scenarios → goals promotion

- Running a scenario creates a **"draft goal"** object.
- Saving a forecast plan promotes it to a **tracked goal** — surfaced on the dashboard as a progress card and in the digest.
- This is the primary, low-friction path to goal capture — no separate goal-setup form required at onboarding.

### Key IA constraints to preserve

1. **Baseline is always visible** — every scenario card shows *current trajectory → with this change → delta*; never the hypothetical alone.
2. **Data gaps are named, not silently filled** — missing or estimated values are flagged with an override affordance.
3. **Don't call it "Calculator"** — naming and framing should be "Forecast" or "What if" — not anything that evokes a spreadsheet or tool.

---

## 6. Open questions for follow-up

- What income / asset thresholds define “Stage 3” for Phoenix ICP?
- Minimum viable **relink** cadence we assume users will accept?
- For couples: is v1 **two seats** required, or single seat with “share report” enough?
