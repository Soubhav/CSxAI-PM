# CSxIQ — Planning & Decisions Repository

**CSxIQ** is the CSR-facing portal of the **CSxAI** platform — the human layer where customer support representatives handle escalations from the AI voice agent, work unresolved-call callbacks, and manage omnichannel chat.

> **Naming policy:** The product is **CSxIQ**. "AI Assist" (descriptor) and "CSIQ" (typo) are **deprecated** — do not use them in new docs, UI, or code. See decision **D-01**.

This folder is the single home for all CSxIQ planning. Decisions live in the platform-wide ledger.

## Contents

| File | What it covers |
|---|---|
| [product-overview.md](product-overview.md) | What CSxIQ is, how it relates to CSxAI, channels, roles, the shipped screens |
| [journeys.md](journeys.md) | Step-by-step CSR journeys: Callbacks, History callback, Escalation handoff, Home/inbox |
| [open-questions.md](open-questions.md) | Auth & tenancy posture, deferred items, phase mapping |
| [features-agent-assist.md](features-agent-assist.md) | The Agent-Assist feature vision (live transcription, objection detection, recommendations) — folded from the former standalone `CSxIQ/` folder |
| [legacy-ai-assist-overview.md](legacy-ai-assist-overview.md) | Earlier "AI Assist — Platform Overview" (2026-05-18), preserved for reference; superseded by `product-overview.md` |

## Decisions

All CSxIQ decisions are tagged in the platform decisions ledger:
**[`../../decisions/decisions-log.md`](../../decisions/decisions-log.md)** → section *"CSxIQ — Session Decisions"* (D-01 … D-18).

## Where the code lives

- App routes: `CSxVoiceAI/frontend/src/app/csxiq/` (`/csxiq`, `/csxiq/callbacks`, `/csxiq/escalations`, `/csxiq/history`)
- Sidebar / shell / presence: `CSxVoiceAI/frontend/src/components/` (`CsxiqSidebar.tsx`, `AppShell.tsx`, `PresenceDot.tsx`)
- Mock data: `CSxVoiceAI/frontend/src/lib/csxiq-data.ts`
- Live demo: https://soubhav.github.io/CSxAI-PM/csxiq

_Last updated: 2026-06-29._
