# Phoenix MVP — Council Review: Edge Cases & Risks

**Date:** 2026-04-21  
**Status:** Working draft — synthesized from 10-agent council review  
**Companion docs:** [phoenix-mvp-scope-ia-journey.md](./phoenix-mvp-scope-ia-journey.md) · [2026-04-21-product-direction-and-mvp-scope.md](./2026-04-21-product-direction-and-mvp-scope.md)

---

## Summary

The existing plan is strong on the macro journey and high-level edge cases. This review surfaces **gaps at the implementation layer** — metric definitions, data integrity, engineering realism, trust mechanics, and retention loops. Items are organized by domain and tagged with priority:

- 🔴 **P0** — Blocks launch or destroys trust if not addressed before F&F
- 🟡 **P1** — Must spec before design sprint; creates tech debt or UX debt if deferred
- 🟢 **P2** — Important, but survives a single iteration cycle

---

## 1. Data integrity & metric definitions 🔴

These gaps make the headline metrics wrong or misleading **before any LLM involvement.**

### 1.1 Transfer exclusion is not specified
Internal transfers (paycheck → savings, checking → brokerage, CC payment from checking) can be counted as **both income AND spend** — inflating or deflating net savings rate. Credit card purchases count as spend at transaction time; the subsequent payment from checking would double-count if not excluded.

- **Required spec:** Define one **primary ledger** (recommended: card purchases as spend; cash transfers between own accounts excluded from both numerator and denominator). Surface `"X% of activity was transfers — excluded"` when material.
- **Priority: 🔴 P0**

### 1.2 Weekly net savings rate denominator failure
`savings_rate = (income − spend) / income` yields −∞ or undefined on **non-paycheck weeks** (biweekly pay is standard). Users will see wildly swinging metrics and interpret a routine biweekly cycle as a crisis.

- **Required spec:** Default headline to **trailing 4-week rolling rate**; show weekly as a secondary view only. Label pay-week vs. non-pay-week context. Never show a standalone weekly rate as the primary trust signal without rolling context.
- **Priority: 🔴 P0**

### 1.3 Investment contributions misclassified as "spend"
401(k) deferrals, brokerage transfers, HSA funding appear as outflows in transaction data — **reducing** the savings rate even though they increase household wealth. 401(k) loan repayments and rollovers further confuse the picture.

- **Required spec:** Split "invested / deferred" from "consumption spend." Offer a **"Saved & invested rate"** as the primary household metric (not just "net savings rate"). Requires account-type rules per Plaid category for retirement and brokerage accounts.
- **Priority: 🔴 P0**

### 1.4 "Cash flow direction" is undefined
The plan names "cash flow direction (monthly)" as a card, but does not specify: sign of net inflows? trend vs. prior month? vs. a target? Each needs different data and copy. Weekly and monthly metrics can **actively contradict** each other without an explicit cross-metric consistency rule.

- **Required spec:** Define formula as **net external cash flow (after transfer exclusion), month-over-month, with a confidence band**. Add rule: home cards must never show opposing directional stories without an explicit explanatory string.
- **Priority: 🔴 P0**

### 1.5 "Vibe check" thresholds are opaque
On Track / Ahead / Needs Attention without inspectable rules feels **arbitrary and judgmental** to high earners — particularly those with lumpy income patterns (bonuses, RSUs). If Manager and Stakeholder variants show different labels from the same underlying numbers, trust collapses.

- **Required spec:** Tie labels to **explicit, editable rules** (e.g., trailing savings rate vs. user-stated target, minimum runway, outstanding anomaly flags). Always accompany with a "because…" string. Expose targets as user-editable in Profile.
- **Priority: 🟡 P1**

---

## 2. Plaid data quality & reliability 🔴

### 2.1 Shallow history window post-link / post-relink
Many institutions return limited transaction lookback on first sync. Anomaly baselines, net savings rate, and vibe check can be **statistically wrong** for 2–4 weeks after link or relink. The plan does not gate strong claims on minimum history.

- **Required spec:** Show **"Based on N weeks of linked data"** on every insight card. Define a **minimum history threshold** (e.g., 4 weeks of cash activity) before showing vibe check as a confident claim vs. "preliminary." Treat post-relink as a **cool-down window** for anomaly detection (suppress push alerts for 48 hours after relink).
- **Priority: 🔴 P0**

### 2.2 Pending vs. posted transaction mutability
Plaid transactions arrive as pending and then mutate (amount, merchant name, sometimes removed entirely) when posted. Anomaly cards and chat answers built on point-in-time snapshots can **contradict the bank** or fire false alerts.

- **Required spec:** Model **versioned ingest** (or nightly reconcile pass). Define alert logic so a single pending→posted flip does not trigger push without persistence across two syncs.
- **Priority: 🔴 P0**

### 2.3 Webhook reliability — cannot be sole trigger
Webhooks are best-effort: delays, duplicates, and missed events are common. `ITEM_LOGIN_REQUIRED` webhooks appear asynchronously and out of sequence. Relinking can trigger bursts. The plan relies entirely on webhooks for "LLM re-processing."

- **Required spec:** Webhooks are **hints only**. Add **scheduled reconciliation** (nightly Plaid transactions sync cursor + balances polling) as the source of truth. Implement **idempotent job keys** per `item_id` + cursor. Expose **"last successful sync"** (distinct from "webhook received") in UI.
- **Priority: 🔴 P0**

### 2.4 Investment API timeliness and performance narrative risk
Holdings and balances can **lag market close** by hours or days. Cost basis and tax lots are often absent, making "performance vs. benchmarks" math unreliable from Plaid alone. The plan includes "investment performance + context" as a nice-to-have.

- **Recommendation:** Cap all investment claims at **"approximate as of [sync date]."** Separate balance snapshot from return math. Do not show a benchmark comparison unless you have cost basis data. Investment card should be **balance + context only** in Phase 1 — not "performance."
- **Priority: 🟡 P1**

### 2.5 HNW cash flow classification failures
For HHI ≥ $200K, **bonuses, RSU sales, 401(k) loans, rental deposits, estimated tax payments, and private investment distributions** routinely confuse Plaid categorization. The anomaly detector and digest tone will mislabel one-off liquidity events as lifestyle drift.

- **Recommendation:** Add **high-value override patterns** (tag as "likely transfer / investment / tax / payroll artifact") and a lightweight **"mark this transaction"** user action that feeds the canonical model. Define a "large transaction" threshold (e.g., $10K+) that triggers a special handling path.
- **Priority: 🟡 P1**

### 2.6 Anomaly detection false positives: annual and seasonal spikes
`>30% bill spike` will fire on **annual insurance renewals, property tax payments, holiday spending, back-to-school, and end-of-year charity**. For HNW users, variance between months is structurally high.

- **Required spec:** Pair threshold logic with **recurrence detection** (annual, semi-annual patterns) and a **"Not unusual"** dismiss that suppresses the same category+merchant+month pattern for 12 months. Do not push anomaly alerts for transactions that match known recurring annual patterns.
- **Priority: 🔴 P0**

---

## 3. LLM pipeline risks 🟡

### 3.1 Prompt injection via Plaid transaction text
Merchant names, transaction memos, and payroll descriptors can contain natural language that skews LLM summaries or, in adversarial cases, instructions. This is **not limited to chat** — it affects anomaly detection, digest generation, and scenario narratives.

- **Required spec:** Treat transaction strings as untrusted data. Use **structured/JSON separation** between instructions and data in LLM calls. Prefer deterministic features (amount, date, MCC code) for decisions; use LLM only for **labeling and narrative** on pre-structured outputs.
- **Priority: 🟡 P1**

### 3.2 Scenario math hallucination
If the LLM performs arithmetic inline (for scenario projections, time-to-goal), it can **confabulate plausible but wrong numbers** even when the baseline is visible.

- **Required spec:** Use a **deterministic calculation engine for all scenario numbers** (inputs → outputs). The LLM writes labels and interpretation from those outputs only. Block narrative that invents inputs not present in the engine output schema.
- **Priority: 🔴 P0**

### 3.3 Answer inconsistency across sessions
Without fixed decoding and a frozen data slice, the same "Ask why" question answered twice can yield **contradictory explanations** — a trust-destroying experience for financial data.

- **Required spec:** For a given `snapshot_id` + normalized question, use **temperature 0**, fixed model version, and optional **response cache**. Bind every chat turn to `data_snapshot_id + as_of`. If data changes mid-session, show a non-blocking **"New activity — refresh insight"** prompt.
- **Priority: 🟡 P1**

### 3.4 Explainability for anomaly detection
If "why did you flag this?" is answered by the LLM free-form, the model can confabulate a plausible-but-wrong explanation. Users who discover this lose all trust in the anomaly system.

- **Required spec:** Store **structured anomaly metadata** (feature deltas, comparator window, threshold, category) and render the primary explanation from that. LLM may **rephrase** but must not be the sole source of causality. Add a **"Show calculation"** affordance.
- **Priority: 🟡 P1**

### 3.5 LLM subprocessor contracts (DPA gap)
The plan does not specify which model APIs are used, data residency, whether zero-retention / no-training terms are in place, or whether prompt logging is disabled. Sending household financial data to an LLM without enterprise DPAs is a compliance and reputational risk.

- **Required spec:** Execute DPAs with LLM subprocessors before launch. Configure **no training / minimal logging** explicitly per vendor offer. Document subprocessor list in the privacy notice. Align data residency if marketing to privacy-sensitive audiences.
- **Priority: 🔴 P0**

---

## 4. Onboarding & activation 🟡

### 4.1 Two users creating duplicate households
Role selection at step 3 does not define who creates the household, what happens if both partners install simultaneously, or how the join flow reconciles with the invite flow.

- **Required spec:** First authenticated user **creates** household. Partner **joins via invite token or verified email match** — self-declared role alone is insufficient. Until join completes, show **scoped solo view** with copy that avoids implying shared data. Define "two Managers" as impossible by policy — enforce at account level.
- **Priority: 🔴 P0**

### 4.2 Wrong non-zero baseline destroys trust immediately
The plan handles zero-income but not **wrong non-zero baselines** (double-counted transfers, misclassified CC payments, brokerage swings as income, partial-month annualization). A first vibe check that is wildly wrong poisons the product immediately.

- **Required spec:** Gate **"High confidence"** vibe check on minimum quality criteria (e.g., checking account present + consistent pay pattern + ≥4 weeks history). Otherwise show **"Preliminary"** label with ranges, not point estimates. Add **one-tap "This looks off"** that surfaces the 3 highest-impact overrides (income, pay frequency, transfer toggle) — not a full budget wizard.
- **Priority: 🔴 P0**

### 4.3 Confidence check screen: activation fatigue
"One confirmation screen" conflicts with the real-world need to fix income + spend window + transfer exclusions. Unbounded corrections lead to drop-off; forcing it → abandonment.

- **Required spec:** Cap the edit session to **3 high-impact fields** (income, pay frequency, major-transfer toggle). Include **"I'll refine later"** to land directly on home. Persist partial overrides; do not force another full quiz on next open.
- **Priority: 🟡 P1**

### 4.4 Plaid multi-institution OAuth friction
Chase, Wells Fargo, and others use institution-specific OAuth with external redirects, session expiry mid-link, and MFA. A user who bails after 1 of 4 account types leaves **worse** than "some accounts" implies.

- **Required spec:** **Progressive disclosure**: require only **primary checking** to reach first value; then surface **"Strengthen your picture"** nudge for the rest. Save per-institution state; support **resume Plaid** from exact institution. Banner copy must reflect **which specific slices are missing**, not generic "add more."
- **Priority: 🟡 P1**

### 4.5 LLM pipeline latency on first load
The plan does not address what the user sees during LLM processing after Plaid link. A blank screen or generic spinner reads as broken.

- **Required spec:** **Deterministic-first path**: render non-LLM cards immediately from normalized aggregates (balances, transaction count); hydrate vibe check and narrative **when ready**. Show explicit phases: "Syncing → Organizing → Drafting your summary." Timeout fallback: show data-only cards with "Your financial narrative is being prepared."
- **Priority: 🟡 P1**

---

## 5. Scenario modeling (Future tab) 🟡

### 5.1 "One-time purchase" cash path is unspecified
The plan does not define which balance funds the purchase, whether partial financing is allowed, or what "delta" means (net worth same day vs. 12-month cash runway). Users will interpret results based on their own mental model.

- **Required spec:** Document default rule: "depletes cash above emergency floor first; flags shortfall." Show funding path on card. Let users override funding source. Never show an ambiguous "you can / can't afford it" without a funding path.
- **Priority: 🟡 P1**

### 5.2 "Increase 401(k) to X%" requires payroll data not in Plaid
Gross pay, pre-tax line items, and employer match are not reliably available via Plaid. An allocation-change scenario cannot be accurate without tax and IRS limit logic.

- **Required spec:** Phase 1: treat 401(k) as a **user-stated assumption** (gross income, existing deferral %). Show as "approximate impact on monthly surplus" with wide confidence bands. Add disclosure: "This estimates your take-home impact; your actual numbers depend on your payroll settings."
- **Priority: 🟡 P1**

### 5.3 Multiple scenarios competing for the same dollars
Two saved scenarios (car + max 401k + vacation) each look fine in isolation but are not combinable. The plan does not state whether scenarios are independent or stacked.

- **Required spec:** Scenarios are independent by default. Show a **combined stress test warning** if the sum of discretionary outflows across all saved scenarios exceeds a conservative surplus threshold (e.g., 3-month average). Label it clearly: "If you did all of these…"
- **Priority: 🟡 P1**

### 5.4 Refresh after major baseline change: stale mental model
"Refresh" recalculates, but a saved name + old mental model can mislead after job loss, large transfers, or new accounts. Users may not realize the scenario is now completely different.

- **Required spec:** On Refresh, show **"What changed in baseline"** (income, spend, balance deltas vs. last save). Auto-tag scenarios as **"Review recommended"** when baseline shifts beyond a threshold (e.g., >20% income change). Store a snapshot of baseline at time of save for diff.
- **Priority: 🟡 P1**

### 5.5 Chat-created vs. form-created scenarios: schema mismatch
Chat can spawn a scenario, but freeform fields (funding source, tax assumptions, horizon) may not map to structured form fields. This creates unmaintainable "half-modeled" cards.

- **Required spec:** One canonical **scenario schema**. Chat only **pre-fills the form**. Anything that can't map to the schema stays as advisory text + "Complete in form" CTA — not a saved runnable card.
- **Priority: 🟡 P1**

---

## 6. Couples & household model 🟡

### 6.1 Manager seat = one-sided household picture
If the Stakeholder holds primary income, cards, or investment accounts but does not link Plaid in V1, the household financial picture is structurally incomplete. "Alignment prompts" may inadvertently blame the wrong person.

- **Required spec:** Define a **minimum household completeness signal** (e.g., "We're only seeing accounts from one partner"). Tune alignment and anomaly copy to never imply shared fault when coverage is one-sided. Reserve "full household" language until coverage rules pass.
- **Priority: 🟡 P1**

### 6.2 No "preview as partner" path
The persona toggle rewrites the whole app, but what the Manager actually wants is to **preview what the Stakeholder sees** — not to switch their own persona permanently.

- **Required spec:** Add an explicit **"Preview Stakeholder report"** action (same renderer as the share URL, scoped read-only, no persistent flag change). This is distinct from the persona toggle and does not affect analytics or personalization.
- **Priority: 🟡 P1**

### 6.3 Share link lifecycle: TTL, rotation, revocation
The plan does not specify: TTL, one active link vs. many, what happens when the Manager regenerates, or whether the Stakeholder is notified.

- **Required spec:** Default **7–30 day expiry + renew**. Explicit one-click **revoke**. On rotation: show Manager warning "Previous links stop working." Optional email to Stakeholder on rotation (opt-in). Consider **named links** ("Partner — April") for auditability.
- **Priority: 🔴 P0**

### 6.4 Separation / divorce: data exposure and emergency cut-off
A persistent magic link becomes a post-breakup surveillance surface. The plan has no household dissolution path.

- **Required spec:** Ship with **one-click revoke all Stakeholder access**, audit of active share links, and a support path for account/household split. Minimum necessary detail on Stakeholder surface; document retention if one party deletes the app.
- **Priority: 🟡 P1**

---

## 7. Retention & engagement loops 🟡

### 7.1 No clear "aha moment" defined
The plan lists mechanisms but not a measurable first-session or first-week aha. Without a defined aha, D7/D30 tracking has no north star.

- **Required spec:** Define **1–2 measurable aha metrics** before pilot launch (candidates: "Manager saves a scenario," "Stakeholder acknowledges digest," "Chat answers a why-question with positive satisfaction signal"). Gate MVP success on these, not just digest opens.
- **Priority: 🔴 P0**

### 7.2 App feels "dead" when anomalies are rare
High bar for push is correct for trust. But if anomalies are infrequent (good news for healthy users), the in-app experience can feel empty — no proof the system is watching.

- **Required spec:** Add **in-product "quiet confidence" signals**: last successful sync timestamp, "all clear" row, or ambient health indicator on Home. Silence should feel like "monitored," not "abandoned." Consider a low-noise in-app channel (not push) for "nothing unusual this week."
- **Priority: 🟡 P1**

### 7.3 Monthly digest: one-and-done read risk
A strong digest can be fully consumed in one sitting. Next touch is 30 days away — the product then competes with email/PDF in memory, not in habit.

- **Required spec:** Build **one digest-based loop back into the app within 7 days**: e.g., "1 question for chat," "1 item to confirm for next month." Stakeholder digest should create a **return path for the Manager** (comment, shared priority, question) — not just a static read.
- **Priority: 🟡 P1**

### 7.4 Future tab: scenarios are a one-time setup trap
After 1–2 scenarios are saved, what brings users back to the Future tab? Persistent cards don't create pull unless something changes.

- **Required spec:** Tie scenarios to **life events and date-based nudges** (in digest/chat, not push). Surface "scenario drift" alerts when baseline assumptions have aged significantly. Consider a **quarterly scenario review** prompt as part of the Manager digest.
- **Priority: 🟡 P1**

---

## 8. Engineering & scope feasibility 🔴

### 8.1 LLM pipeline is multiple products, not one sprint
PII stripping, persona routing, anomaly detection, forecasting, and chat grounding are distinct engineering systems — each needs eval harness, prompt versioning, refusal/safety, latency caps, and regression testing when Plaid data shape changes.

- **Recommended cuts for pre-summer launch:**
  - Ship **Manager persona only** first; Stakeholder = shortened template of same facts.
  - **Anomaly = rules-based detection + templated LLM explanation of rule output** (not free-form LLM detection).
  - **Scenario projections = deterministic calculation engine; LLM writes narrative only.**
  - Defer open-ended forecasting in chat to precomputed scenario cards only.
- **Priority: 🔴 P0**

### 8.2 Auth + billing + Plaid + LLM: true critical path
Auth and billing are gateways, but the critical path is: identity → Plaid link → normalized financial snapshot → insight generation. Billing before proven retention adds payment edge cases (failed cards, proration) during the same window as data bugs.

- **Recommended simplification:** 
  - Use a **managed IdP** (Auth0/Clerk/Cognito) — a new custom auth service is a timeline multiplier.
  - **Defer full self-serve billing to free / invite-only** for F&F v0.5. A "billing placeholder" screen is sufficient.
- **Priority: 🔴 P0**

### 8.3 Stakeholder magic-link web is a second product surface
Tokenized links (expiry, rotation, abuse prevention), a separate frontend, responsive layout, and separate content QA for two narrative tones are routinely underestimated.

- **Recommended simplification:** **Email PDF or static HTML** rendered from the canonical digest JSON for v0.5. One responsive read-only page with no interactive chrome. Cut Stakeholder brand polish until Manager path is stable.
- **Priority: 🔴 P0**

### 8.4 Push notification infrastructure is non-trivial
APNs/FCM device token management, permission UX, quiet hours, duplicate suppression, and deep links add scope that competes with core data work.

- **Recommended simplification:** **In-app notification center only** first. Push only for **broken Plaid link** (highest trust, most actionable). **Defer anomaly push** until false positive rate is measured on real data. **Email** as backup channel for digest and urgent alerts.
- **Priority: 🔴 P0**

### 8.5 Monthly digest as scheduled job: silent failure risk
The digest is listed as a must-have but has no specified delivery mechanism, failure handling, or retry logic.

- **Required spec:** Define as scheduled job with **retry + dead-letter handling**. Define failure state in-app (user sees "Your digest is being prepared" vs. silent blank). Set SLA: digest delivered within X hours of calendar trigger.
- **Priority: 🟡 P1**

---

## 9. Privacy & compliance 🔴

### 9.1 GLBA / CCPA / state privacy laws require a position
The plan defers to "no money movement = no regulatory bottleneck," but aggregating financial account data triggers GLBA (through bank/fintech program structures) and CCPA/CPRA for California users. "Sensitive data" categories under state laws may apply to financial transaction patterns.

- **Required action:** Obtain legal review of data flow before launch. Confirm position on GLBA applicability, CCPA financial data categories, and applicable state breach notification laws. Document in privacy notice.
- **Priority: 🔴 P0**

### 9.2 Plaid access revocation on app deletion
Uninstalling the app does not revoke Plaid item access. Users who delete the app may remain linked without knowing it.

- **Required spec:** App deletion and account deletion flows must **revoke all Plaid items** (call `/item/remove` for each). Show explicit "What happens to your data" screen in offboarding. Document retention policy for canonical insight objects and webhook payloads.
- **Priority: 🔴 P0**

### 9.3 Fake door testing consent and disclosure
Showing a landing page that collects email/intent for a non-existent product is a marketing law question. Depending on copy and locale, there may be disclosure obligations.

- **Required action:** Run copy by legal before Apr 23 fake-door test. Ensure clear **"Beta / waitlist"** framing. Collect only email (not financial data). Document opt-in consent and data use.
- **Priority: 🔴 P0**

---

## 10. Competitive positioning gaps 🟢

### 10.1 Monarch / Copilot / Simplifi need explicit head-to-head
The plan frames competition as Mint/YNAB vs. ChatGPT. But modern PFM 2.0 tools (Monarch, Copilot) already offer read-forward flows, AI summaries, and Plaid aggregation. "No transaction-level budgeting" alone is not differentiation.

- **Recommendation:** Identify **one screen or flow** where Phoenix clearly wins (dual-tone household narrative, scenario answers tied to live balances, anomaly + digest as a single household story). Validate in research that the specific JTBD doesn't feel solved by Monarch/Copilot.
- **Priority: 🟡 P1**

### 10.2 "Ongoing sync" advantage weakened by relink friction
The "persistent sync vs. ChatGPT + PDF" narrative overpromises if users must relink frequently. The competitive advantage is **structured, rerunnable truth when links are healthy** — invest in link-health UX as the story, not infinite freshness.

- **Recommendation:** Lead messaging with **reliability and transparency** (last sync, data freshness visible, re-link is smooth) — not "always current."
- **Priority: 🟡 P1**

### 10.3 Stage 3 users need a sharper purchase trigger
"Directional clarity" sounds optional for people who are already "good enough." The sharper pain is **couples alignment** and **pre-big-decision confidence**. Tie MVP messaging and onboarding to one acute JTBD.

- **Recommendation:** Test one acute JTBD in messaging and product (monthly partner check-in, "are we on track for X," pre-big-purchase decision). Tie MVP to that loop so "why download now?" is obvious.
- **Priority: 🟡 P1**

---

## 11. Revised MVP cut list

Based on the council review, these items should be **deferred or simplified** for pre-summer F&F launch without compromising the core hypothesis:

| Item | Current status | Recommendation |
|------|---------------|----------------|
| Stakeholder full app seat | Deferred to Phase 2 | ✅ Keep deferred |
| Stakeholder magic-link web | Phase 1 must-have | **⬇️ Simplify to static digest email/HTML for v0.5** |
| Push anomaly alerts | Phase 1 must-have | **⬇️ Defer to after false-positive rate measured; ship in-app only** |
| New custom auth service | Engineering | **⬇️ Use managed IdP (Auth0/Clerk/Cognito)** |
| Self-serve billing | Engineering | **⬇️ Free / invite-only for v0.5** |
| Stakeholder persona in LLM pipeline | Phase 1 must-have | **⬇️ Ship Manager only; Stakeholder = template variant** |
| Open-ended scenario chat | Phase 1 nice-to-have | **⬇️ Pre-computed scenario cards only; defer chat-created scenarios** |
| Investment performance + benchmarks | Phase 1 nice-to-have | **⬇️ Balance snapshot + static context only; no return math** |
| Subscription tracking | Out of scope | ✅ Keep out of scope |
| Email digest delivery | Out of scope | ✅ Keep out of scope (but consider as backup for Stakeholder) |

---

## 12. New open questions (added by council review)

| Question | Priority | Owner |
|----------|----------|-------|
| What is the LLM subprocessor? Are DPAs in place? | 🔴 P0 | Legal / Eng |
| What is the exact transfer exclusion rule set? | 🔴 P0 | Product |
| What is the minimum history threshold for "high confidence" vibe check? | 🔴 P0 | Product |
| Anomaly detection: rules-based or LLM? What is the eval harness? | 🔴 P0 | Eng |
| How does household creation + invite work if both partners install simultaneously? | 🔴 P0 | Product |
| What is the Plaid item revocation flow on app deletion? | 🔴 P0 | Eng |
| What is the managed IdP choice? | 🔴 P0 | Eng |
| What is the measurable "aha moment" for the pilot? | 🔴 P0 | Product |
| Does Monarch/Copilot solve the specific scenario JTBD? (Validate in research) | 🟡 P1 | Research |
| What are the D30/D90 retention benchmarks for PFM-adjacent products? | 🟡 P1 | Product |
