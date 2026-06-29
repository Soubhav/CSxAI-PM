# AI Assist (CSxIQ) — Platform Overview

**Date:** 2026-05-18
**Author:** Soubhav
**Status:** Phase 1 MVP complete — active development

---

## What AI Assist Is

AI Assist (also called **CSxIQ**) is the **human-in-the-loop CSR portal** that pairs with CSxAI. It is the platform customer support representatives (CSRs) log into to handle escalations from the AI voice agent, as well as inbound chat-based queries from omnichannel sources.

When the AI voice agent on CSxAI cannot resolve a member's query, it escalates the call into AI Assist as a live ticket. An available CSR picks it up and finishes the conversation — with full context already loaded. AI Assist is also accessible directly from within the CSxAI portal via a navigation link.

**In one line:** CSxAI handles the volume. AI Assist handles the moments that need a human.

---

## How CSxAI and AI Assist Work Together

```
Member Call
     │
     ▼
CSxAI Voice Agent
     │
     ├── Resolved → Call ends, post-call tools fire (SMS/email)
     │
     └── Escalation triggered →
              │
              ▼
         AI Assist
         Live call ticket created
         Available CSR claims it
         CSR joins the live session room
         Conversation concluded by human
```

**Escalation triggers (from CSxAI):**
- Member explicitly requests a human
- Fraud or suspicious activity detected
- AI unresolved after 2 attempts
- Negative sentiment detected
- After-hours urgent call

**What the CSR inherits on escalation:**
- Live conversation room (bridged via LiveKit) — audio ready for voice, thread for chat
- Member context already loaded — no need for the member to repeat themselves
- Conversation history up to the point of handoff

---

## Channels AI Assist Handles

| Channel | What CSR Sees |
|---|---|
| **Voice escalation (from CSxAI)** | Call ticket with live voice room, mute/speak controls, and handoff context |
| **Chat / messaging** | Thread-style ticket from WhatsApp, LINE, embedded web bots, or proprietary channels |

All channels converge into the same ticket model — same lifecycle, same reporting, same tooling.

---

## Ticket Lifecycle

**Three states:** Waiting → Active → Closed

- **Waiting** — ticket is in queue, needs to be claimed
- **Active** — CSR has accepted and is live with the customer
- **Closed** — conversation ended; transcript and AI Copilot snapshots retained for audit and coaching

### Acceptance Window
When a ticket is offered to a CSR, a visible countdown timer starts (~25–30 seconds, configurable). If the CSR accepts within the window, the ticket binds to them. If the window expires, the ticket re-routes to the next available CSR — customers are never left waiting indefinitely.

### Real-time Queue
The ticket board updates live via WebSockets (polling fallback for resilience). Optional audible cues for new arrivals.

---

## The Live CSR Workspace

### Voice Sessions
- Large live audio visualization
- Mute/speak controls
- Clear "voice call active" indicator
- Browser audio unlock prompts
- Designed for focus — minimal chrome, attention on the conversation

### Chat Sessions
- Full conversation canvas with scrolling transcript
- Participant presence indicators
- Composer for responses
- Floating recovery surface if CSR navigates away mid-session

### Close-out
Ending a session persists the full transcript, AI Copilot snapshots, and relevant metadata for compliance and coaching review.

---

## Knowledge Base

Authorized users (CSR and above) can upload, catalog, preview, and retire content that grounds agent responses.

**Two document families:**
1. **Company knowledge** — policies, procedures, FAQs, troubleshooting guides
2. **Product catalog** — what the org sells, product attributes, bundles, tiers, upsell/cross-sell context

**Supported formats:** PDF, DOCX

**Pipeline:** Upload → text extraction → chunking → embedding → vector storage (Qdrant). CSR-facing status shows ingestion progress and chunk counts so teams know when new content is live.

Deletion removes the file from GCS storage and the vector index simultaneously.

---

## AI Copilot

The Copilot assists the CSR — it never speaks directly to the customer. It retrieves from the org's own KB and product catalog, so suggestions reflect approved content, not generic AI output.

**What CSR receives:**
- **Operational suggestion** — policy-aligned guidance for resolving the current issue
- **Product cards** — contextually relevant offers or upgrades based on the conversation
- **Traceability cues** — pointers back to the source KB snippet for trust and QA

**Two modes:**
- **Manual** — CSR triggers "Get AI Suggestion" on demand
- **Live** — Copilot listens to the thread and refreshes suggestions as the conversation evolves (debounced to prevent thrashing)

**Scope today:** Copilot is optimized for chat sessions. Voice takeover workflows keep the UI streamlined — CSR attention stays on audio, not AI panels. Multimodal voice guidance is a future roadmap item.

**Isolation:** Suggestions are org-scoped — one company's KB never bleeds into another's retrieval.

---

## Session Logs & Observability

Historical session views support audit, training, and dispute review.

**CSR-facing filters:** All / Chat / Call
**Surfaced per session:** Lifecycle status, durations, AI summaries, stitched transcripts, Copilot snapshots

**Analytics APIs (built by Madhav — CSX-208):**
- `/summary` — KPIs: queue wait time, handle time, abandonment rate, accept/expiry rates
- `/trends` — Time-series: volume, wait time, handle time (hourly/daily/weekly)
- `/agents` — CSR performance leaderboard
- `/funnel` — Session lifecycle funnel (created → dispatched → accepted → closed)

---

## Workforce Presence

CSRs set availability status: **available, busy, DnD**, meeting modes, vacation, holiday. Optional custom note with auto-clear timer.

Smart ticket routing uses live presence state — escalations are only routed to CSRs who are actually available. Presence is tracked in Redis (runtime) with durable custom status in MongoDB.

**Heartbeat model:** Near-real-time visibility reconciled with scheduled states.

---

## Roles

- **CSR** — frontline agent, claims and handles tickets, uses Copilot
- **Admin/Manager** — manages knowledge base, views observability dashboards, configures settings (org setup dependent)

The CSR-facing interface is intentionally uncomplicated — scoped to what frontline agents need.

---

## Platform Value Summary

| Problem | AI Assist Response |
|---|---|
| Voice escalations lose context on handoff | CSR inherits live room + full member context from CSxAI |
| Chat channels are fragmented | Single ticket model across WhatsApp, LINE, web bots, and voice |
| New CSRs ramp slowly | Copilot + curated KB surface approved answers in real time |
| Inconsistent policy or product cites | Dual retrieval: policy truth + merchandise fit as surfaced cards |
| No visibility into CSR operations | Observability APIs: funnel, trends, leaderboard, KPIs |
| Routing fairness and SLA compliance | Visible accept windows + presence-based smart routing |

---

## Relationship to CSxAI — Summary

| Platform | Who uses it | Primary purpose |
|---|---|---|
| **CSxAI** | CU admins, ops managers | Configure, deploy, and monitor AI voice agents |
| **AI Assist (CSxIQ)** | Customer support reps | Handle escalations and inbound chat in one workspace |

They are separate platforms but deeply linked: CSxAI is the AI layer, AI Assist is the human layer. Together they form a complete member service stack — AI handles volume, humans handle judgment calls.

Navigation link from CSxAI portal → AI Assist (entitlement-dependent).
