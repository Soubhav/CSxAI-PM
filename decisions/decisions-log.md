# CSxAI — Decisions Log

> Claude maintains this file. To add a decision, say: "Log a decision: [what was decided]"
> Claude will ask for rationale and sign-off status if not provided.

---

## Decision Template

```
## [Decision Title]
- **Date:** YYYY-MM-DD
- **Type:** Technical / Functional / Process / Scope
- **Decision:** What was decided
- **Alternatives considered:** What else was on the table
- **Rationale:** Why this choice
- **Sign-off status:** Pending / Signed off / Damco-led (no sign-off needed)
- **Sign-off from:** [Name] (if applicable)
- **Notes:** Any follow-up context
```

---

## Decisions

## Remove Multi-Tenancy from Phase 2 — Adopt Config-Driven Deployment Model
- **Date:** 2026-04-16
- **Type:** Scope / Architectural
- **Decision:** Multi-tenancy (row-level `tenant_id` isolation + RLS in Postgres, tier enforcement in schema) is removed from Phase 2 and will not be reintroduced without a deliberate product decision. Replaced with a config-driven deployment model where each project/vertical is its own configured instance.
- **Alternatives considered:** Proceeding with row-level multi-tenancy as originally planned (locked in Phase 2 ideation doc).
- **Rationale:** Multi-tenancy creates structural rigidity — `tenant_id` hardwired across every table, tier gating baked into the data model — that assumes CSxAI is a fixed-vertical SaaS. The actual goal is a portable platform that can be tailored for any AI voice agent engagement (credit unions, real estate, insurance, etc.) with minimal rework. A config-driven model keeps that flexibility intact. Each deployment is its own instance; MCP connectors and project config live at the deployment level, not the tenant level.
- **Sign-off status:** Soubhav (product decision)
- **Notes:** Phase 3 will revisit RBAC and vertical expansion independently of multi-tenancy. **Updated by D-17/D-18 below** (CSxIQ session) — posture refined to single-tenant-per-CU deployments now with a tenant-aware schema.

---

# CSxIQ — Session Decisions (2026-06-29)

> CSxIQ is the CSR-facing portal of the CSxAI platform. These decisions came out of a planning + build session (grilling → screens → light redesign → History → strategy). All planning docs live in [`docs/csxiq/`](../docs/csxiq/). Naming is standardized to **CSxIQ** — "AI Assist" and "CSIQ" are deprecated.

**Tag index:** `[Naming]` `[Architecture]` `[Callbacks]` `[History]` `[Home]` `[Escalation]` `[Analytics]` `[Auth]` `[Tenancy]` `[UI]` `[Navigation]` `[Scope]` `[Process]`

### D-01 · CSxIQ is the canonical product name
- **Tags:** `[Naming]`
- **Decision:** The CSR-facing portal is named **CSxIQ**. "AI Assist" is a plain-English descriptor only; "CSIQ" is dropped as a typo. CSxIQ sits under the CSxAI platform/project.
- **Rationale:** Three names on screen would confuse the demo and the team. Mirrors "CSxAI."
- **Sign-off:** Soubhav.

### D-02 · Unresolved callback is a separate async/outbound workflow
- **Tags:** `[Architecture]` `[Callbacks]`
- **Decision:** The unresolved-callback feature is a distinct, asynchronous, *outbound* workflow — not an extension of the live (synchronous) escalation handoff. It gets its own surface ("Callbacks").
- **Rationale:** A live escalation has a member waiting on the line; a callback does not. Mixing them confuses urgency.
- **Sign-off:** Soubhav.

### D-03 · Two unresolved triggers: Dropped + Unresolved
- **Tags:** `[Callbacks]`
- **Decision:** A call enters the callback queue when (a) **Dropped** — early hangup/disconnect, or (b) **Unresolved** — AI resolution score below a configurable threshold. Tags are visually distinguished.
- **Rationale:** Dropped calls are often low-value (wrong numbers); the AI-completed-but-failed case is the high-value callback and must be captured too.
- **Sign-off:** Soubhav.

### D-04 · Callback queue = shared pool, pull + claim-lock
- **Tags:** `[Callbacks]`
- **Decision:** CSRs *pull* callbacks from a shared pool (no presence-based push). Opening one **claim-locks** it to the CSR so no two reps dial the same member. Supervisors may optionally assign.
- **Rationale:** Nobody is waiting on the line, so live-ticket push routing is wrong here; claim-lock prevents double-dials.
- **Sign-off:** Soubhav.

### D-05 · One reusable AI summary/context card
- **Tags:** `[Callbacks]` `[Escalation]`
- **Decision:** A single "AI summary" card is reused at the live-escalation handoff *and* on the callback/History context view.
- **Rationale:** Both flows need "here's what happened, here's why it's open" before the CSR talks. Build once.
- **Sign-off:** Soubhav (escalation summary card is a small add-on to the already-built escalation).

### D-06 · Outbound dial mechanics + retry + fallback
- **Tags:** `[Callbacks]`
- **Decision:** Call back via **WebRTC** to the captured ANI (fallback: profile number). Outcomes: **Connected / No-answer / Voicemail / Busy**. Retry up to ~3 with cooldown; calling-hours guardrail. After max attempts → **Unreachable**, offer **SMS/Email** follow-up from the platform.
- **Rationale:** Most callbacks won't be answered first try; the journey must design the not-answered paths, not just the happy path.
- **Sign-off:** Soubhav.

### D-07 · Disposition set + reuse live workspace
- **Tags:** `[Callbacks]`
- **Decision:** Connected-callback dispositions: **Resolved / Follow-up needed / Escalate / Wrong number**. During the call, reuse the live workspace + Copilot + notes.
- **Sign-off:** Soubhav.

### D-08 · Resolution write-back loop (the headline metric)
- **Tags:** `[Callbacks]` `[Analytics]`
- **Decision:** Marking a callback **Resolved** flips the original AI call `unresolved → resolved-by-callback` and writes back to CSxAI, feeding the **AI resolution rate → final resolution rate** funnel.
- **Rationale:** That delta ("AI handled the volume, humans closed the gap, nothing fell through") is the core sales story.
- **Sign-off:** Soubhav (chosen as the "most intelligent option").

### D-09 · Feature #2 = CSR personal Home (not team analytics)
- **Tags:** `[Home]`
- **Decision:** The "counts + chat window" feature is the CSR's **personal Home**: a personal stat strip (my open chats / closed today / inquiries today / avg handle) beside an inline chat window. Personal/operational, not team-wide.
- **Rationale:** Keeps each surface single-purpose; team rollups belong to analytics (see D-10).
- **Sign-off:** Soubhav.

### D-10 · No analytics dashboards in CSxIQ — analytics live in CSxAI
- **Tags:** `[Analytics]` `[Architecture]`
- **Decision:** CSxIQ has **no metrics dashboard**. The resolution funnel and operational/leaderboard metrics render in **CSxAI** (the single analytics home), fed by the callback write-back and the existing observability APIs. CSxIQ keeps only the CSR's personal strip. The manager dashboards previously spec'd inside CSxIQ retire.
- **Rationale:** CSxIQ is a focused CSR work tool; CSxAI is the brains + the story. Clean product identity.
- **Sign-off:** Soubhav.

### D-11 · Cross-link: simple CSxAI → CSxIQ sidebar link
- **Tags:** `[Navigation]`
- **Decision:** A link pinned to the bottom of the **CSxAI** sidebar opens CSxIQ (seamless, no second login for the demo). Context-aware deep-linking is deferred.
- **Sign-off:** Soubhav.

### D-12 · Sector-agnostic by design; demo on Lakeside
- **Tags:** `[Scope]`
- **Decision:** Built credit-union-first but kept **sector-neutral in logic** (no hard-coded "member"/"loan" in flow logic). Demo data is Lakeside Credit Union. Aligns with the config-driven, multi-vertical direction.
- **Sign-off:** Soubhav.

### D-13 · Deliverable = high-fidelity clickable screens
- **Tags:** `[Process]`
- **Decision:** Output is **working high-fidelity screens** (mock-data driven, mocked telephony) as a baseline for front-end engineers — not a written spec and not production code.
- **Sign-off:** Soubhav.

### D-14 · CSxIQ built as a `/csxiq` route group with its own CSR sidebar
- **Tags:** `[Architecture]` `[UI]`
- **Decision:** CSxIQ lives in the existing Next.js app under `/csxiq` with its own CSR-facing sidebar (incl. presence dots) and a route-aware shell. Mock data in `lib/csxiq-data.ts`; telephony/LLM mocked.
- **Sign-off:** Damco-led.

### D-15 · Light "Quiet & precise" UI, Slate accent (color = status only)
- **Tags:** `[UI]`
- **Decision:** CSxIQ uses a **light** theme (Linear/Vercel "quiet & precise"): near-white canvas, hairline slate borders, minimal shadows, tight type. **Slate/ink is the only UI color; green/amber/red are reserved strictly for status.** CSxAI stays dark; the dark→light shift on the cross-link is intentional.
- **Rationale:** Restraint + hierarchy is the antidote to "AI-generated" UI; provides a credible baseline.
- **Sign-off:** Soubhav.

### D-16 · History screen — tagged trail + WebRTC callback from the record
- **Tags:** `[History]` `[Callbacks]`
- **Decision:** A **History** screen lists every interaction tagged by **status** (resolved/unresolved/unreachable/follow-up/escalated) and **sentiment**. Any **callable** status (unresolved/unreachable/follow-up) exposes a WebRTC **Call back** journey in the detail drawer; resolving flips the tag and writes back (D-08).
- **Rationale:** Supports the "I know a call was unresolved — what was its context, let me call them" lookup, distinct from the proactive Callbacks worklist.
- **Sign-off:** Soubhav.

### D-17 · Per-CSR credentials + role-scoped sessions (required)
- **Tags:** `[Auth]` `[Architecture]`
- **Decision:** Every CSR authenticates as themselves with role-scoped permissions (CSR / Senior CSR / Team Lead / Admin). Shared logins are not permitted.
- **Rationale:** Regulated member-PII access must be attributable (NCUA/GLBA); and presence, claim-lock, "handled by," and personal stats all depend on distinct identities.
- **Sign-off:** Soubhav (recommended, pending build).

### D-18 · Tenancy: single-tenant-per-CU now, tenant-aware schema
- **Tags:** `[Tenancy]` `[Architecture]`
- **Decision:** Deploy **single-tenant per credit union** for now (strong isolation, simplest compliance, matches the config-driven model). Build the data model **tenant-aware (`org_id` scoping)** so a pooled multi-tenant model is possible later without a rewrite.
- **Rationale:** Isolation is a sales asset and low-N ops overhead is trivial; revisit pooled multi-tenancy at ~15–20 tenants / weekly onboarding.
- **Sign-off:** Soubhav (recommended). Refines the 2026-04-16 multi-tenancy decision above.

### D-19 · AI Assist Copilot grounded in a Knowledge Base
- **Tags:** `[Knowledge]` `[Home]`
- **Decision:** Add a **Knowledge Base** screen (`/csxiq/knowledge`) where admins upload SOPs / policies / FAQs. When a member query arrives in chat, the **Copilot** retrieves from those docs and shows a suggestion (with its source) beside the chat that the CSR can one-click **Insert into reply** — review before sending.
- **Rationale:** Turns tribal SOP knowledge into instant, cited assistance; the central value of "AI Assist."
- **Sign-off:** Soubhav.

### D-20 · Separate Admin portal for RBAC, onboarding & ops metrics
- **Tags:** `[Auth]` `[Admin]` `[Architecture]`
- **Decision:** A **separate Admin portal** (`/admin`, its own sidebar) handles role-based access: **onboard CSRs** (name, email, role, bio), view each CSR's **bio + today's activity + role-based permissions**, and see **ops metrics** — CSRs onboarded, active now, calls taken today, queries resolved today, avg CSAT, and a 7-day history glimpse.
- **Rationale:** Admin/ops management is a distinct surface from frontline CSR work and shouldn't clutter the CSR portal.
- **Sign-off:** Soubhav.

### D-21 · Admin/ops metrics live in CSxIQ's Admin portal (refines D-10)
- **Tags:** `[Analytics]` `[Admin]`
- **Decision:** **Operational CSR-management metrics** (reps onboarded, calls/queries today, CSAT, team activity) live in the **CSxIQ Admin portal**. The **member-facing resolution analytics** (AI → final resolution funnel) still live in **CSxAI** (D-10 unchanged for that).
- **Rationale:** Team-ops numbers belong where you manage the team; the sellable resolution story stays in the admin/AI platform.
- **Sign-off:** Soubhav. **Refines D-10.**

### D-22 · Presence: three states only — Active / Busy / AFK
- **Tags:** `[UI]`
- **Decision:** Presence is exactly three states across the whole portal: **green = Active, red = Busy, yellow = AFK** (away from keyboard). The previous "presenting" (red-with-hyphen) state is removed.
- **Sign-off:** Soubhav.

### D-23 · Notion-like visual language
- **Tags:** `[UI]`
- **Decision:** Shift CSxIQ + Admin to a **Notion-inspired** look: warm off-white surfaces (`#F7F6F5` / white), warm near-black ink text (`#37352F`), hairline warm borders, airy spacing, large page titles with an icon, hover-gray rows, and subtle shadows. Replaces the earlier cool "slate" palette while keeping status-only color and the warm ink as the primary action color.
- **Rationale:** The slate look read as dull; Notion's warmth + density + hierarchy reads as a polished, intentional product.
- **Sign-off:** Soubhav.
