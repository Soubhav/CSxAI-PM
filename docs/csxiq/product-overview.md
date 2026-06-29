# CSxIQ — Product Overview

**Status:** Planning + high-fidelity screens shipped (mock data). Baseline for front-end engineering.
**Last updated:** 2026-06-29

---

## What CSxIQ is

CSxIQ is the **human layer** of the CSxAI member-service stack. CSxAI runs the AI voice agents (configure, deploy, monitor); CSxIQ is where a customer support representative (CSR) picks up the moments that need a human.

> **In one line:** CSxAI handles the volume. CSxIQ handles the moments that need a person.

| Platform | Who uses it | Purpose |
|---|---|---|
| **CSxAI** | CU admins, ops managers | Configure, deploy, monitor AI voice agents — and view **all analytics** |
| **CSxIQ** | Customer support reps | Handle escalations, work callbacks, manage omnichannel chat |

They are linked but distinct: a link at the bottom of the CSxAI sidebar opens CSxIQ (D-11). Analytics stay in CSxAI (D-10); CSxIQ is a focused work tool.

---

## How they connect

```
Member contact
     │
     ▼
CSxAI Voice Agent ── Resolved ──▶ call ends, post-call tools fire
     │
     ├── Live escalation (member on the line) ─▶ CSxIQ › Live Escalations
     │
     └── Unresolved / dropped (call ended) ────▶ CSxIQ › Callbacks  (outbound WebRTC)
                                                          │
                                             Resolved ────┘──▶ write-back to CSxAI
                                                                 (final resolution rate)
```

- **Live escalation** = synchronous; member waiting; CSR joins the room. (Already built; CSxIQ adds an AI handoff-summary card.)
- **Callback** = asynchronous, outbound; call already ended and was tagged unresolved/dropped; CSR calls back via WebRTC. (See [journeys.md](journeys.md).)

---

## Channels

Voice (escalations + outbound callbacks), WhatsApp, Web chat, Email — all converge into one interaction model with a shared lifecycle and the same tooling.

---

## Shipped screens

| Screen | Route | What it does |
|---|---|---|
| **Home** | `/csxiq` | Personal stat strip (my open chats / closed today / inquiries / avg handle) + omnichannel inbox + inline chat window + team presence (D-09) |
| **Callbacks** | `/csxiq/callbacks` | Shared callback queue (Dropped / Unresolved tags, claim-lock) + workspace: dial → outcomes/retry → SMS/Email fallback → disposition → write-back (D-02…D-08) |
| **Live Escalations** | `/csxiq/escalations` | AI handoff-summary card, accept-window countdown, join-call (D-05) |
| **History** | `/csxiq/history` | Tagged trail of every interaction (status + sentiment); WebRTC callback from any unresolved record (D-16) |

Plus: CSR-facing sidebar with a **presence switcher** (green = available, red = busy, red-with-hyphen = presenting).

---

## Roles

CSR · Senior CSR · Team Lead · Admin — role-scoped sessions, each rep authenticated as themselves (D-17). The CSR-facing interface is intentionally minimal — scoped to frontline work.

---

## Design system

Light **"Quiet & precise"** theme (Linear/Vercel feel): near-white canvas, white panels, 1px hairline slate borders, minimal shadows, tight type hierarchy. **Slate/ink is the only UI color; green/amber/red are reserved strictly for status** (D-15). CSxAI stays dark — the dark→light shift on the cross-link is intentional.

---

## Deployment & tenancy posture

- **Single-tenant per credit union** for now; data model built **tenant-aware** (`org_id`) to enable pooled multi-tenancy later (D-18).
- **Sector-neutral in logic**, credit-union-first, demoed on Lakeside CU (D-12).
- This build is mock-data driven with mocked telephony/LLM — a baseline, not a design system. Real polish (token scale, component library, motion, empty/error/loading states, a11y) is the FE engineering step.
