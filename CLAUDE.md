# CSxAI — Control Room

## Engagement

- **Project:** CSxAI — AI voice agent management platform for US credit unions. Co-build with clients Vince & Tim, who will own and sell the product to their credit union network.
- **Model:** Product co-build (Damco builds, client brings domain + distribution)
- **Phase:** Phase 1 MVP complete. Final Demo upcoming (Day 25).

## Team

| Role | Person |
|---|---|
| Product & Delivery (me) | Soubhav |
| Tech Lead | Abhyam Gupta |
| Engineers | Ayush Tripathi, Madhav Sharma, Ankit Goel |
| Business Analyst | Harsh Shah |
| Clients / Co-founders | Vince & Tim |

## Decision Authority

- **Tech & UX:** Damco's call — make and log decisions
- **Product direction:** Consult Vince & Tim before committing
- **Client updates:** After each demo milestone

## Project Status

- **Done:** Dashboard, Insights, Agent Canvas, Scenarios, Escalation, Call Logs, Knowledge Base, Sandbox, Tools — all 9 features with mock data
- **In progress:** Demo polish, realistic Lakeside Credit Union data
- **Next:** Final Demo (Day 25) — full platform walkthrough

## Demo Milestones

| Demo | Day | Scope | Status |
|---|---|---|---|
| Demo 1 | 5 | Dashboard + Insights | Done |
| Demo 2 | 10 | Agent Canvas + Scenarios + Escalation | Done |
| Demo 3 | 15 | Call Logs + Knowledge Base | Done |
| Demo 4 | 20 | Sandbox + Tools + Polish | Done |
| Final Demo | 25 | Complete platform | Upcoming |

## Control Room Commands

- `"Catch me up"` — reviews meeting notes, decisions, risks
- `"Log a decision: [x]"` → writes to `decisions/decisions-log.md`
- `"Log a risk: [x]"` → adds to open risks
- `"Draft a client update — [summary]"` → writes to `client-updates/`
- `"Weekly review"` → summarises decisions, gaps, comms

## Open Risks

| Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|

---

# Technical Reference

## What We're Building

**CSxAI** — One dashboard to build, configure, test, deploy, and monitor AI voice agents handling inbound credit union member calls. Modelled on Giga.ml (used by DoorDash), adapted for credit unions.

## Design Principles

- Agent Canvas + Insights are the two priority surfaces
- Dashboard is the daily command centre for CU managers
- New agent creation = minimal modal, not a wizard
- Production-grade feel throughout — not a demo

## Credit Union Scenarios

### Phase 1 — Core

| ID | Name | Member Need |
|---|---|---|
| `transaction-inquiry` | Transaction Inquiry | "What's this charge on my account?" |
| `account-balance` | Account Balance | "What's my checking/savings balance?" |
| `loan-status` | Loan Status Check | "Where is my auto loan application?" |
| `payment-due` | Payment Due Date | "When is my next loan payment due?" |
| `card-issue` | Card Issue & Disputes | "My card was declined / I see a fraud charge" |
| `routing-account` | Routing & Account Numbers | "What's the routing number for a wire transfer?" |

### Phase 2 — Extended

| ID | Name | Member Need |
|---|---|---|
| `cd-rates` | CD & Savings Rates | "What's your current CD rate for 12 months?" |
| `loan-payoff` | Loan Payoff Quote | "How much to pay off my car loan?" |
| `branch-hours` | Branch & ATM Hours | "Is downtown branch open Saturday?" |
| `password-reset` | Digital Banking Help | "I'm locked out of online banking" |
| `new-account` | New Account Opening | "I want to open a savings account" |
| `wire-transfer` | Wire Transfer Request | "I need to send money by wire" |
| `mortgage-inquiry` | Mortgage Inquiry | "Can I get a home equity loan?" |
| `dispute-resolution` | Dispute Resolution | "I want to dispute a charge" |

### Escalation (always configured)

| Scenario | Transfer Type | Priority |
|---|---|---|
| Member requests human | Warm transfer | Normal |
| Fraud / suspicious activity | Priority warm | Urgent |
| Bot unresolved after 2 attempts | Warm transfer | High |
| Negative sentiment detected | Proactive warm | High |
| After-hours urgent | SMS alert to on-call | Urgent |

## Platform Features

1. **Dashboard** — KPI cards (Calls Handled, Resolution Rate, Escalation Rate, Hours Saved), call volume chart, sentiment gauge, heatmap
2. **Agent Canvas** — Policy tree (Rules → Scenarios → Knowledge → Audit), content editor, test panel, deploy button
3. **Insights** — Waterfall chart (current → potential resolution rate), ranked opportunity list with impact/effort/fix
4. **Call Logs** — Filterable table, side drawer with signal scores, AI summary, transcript, audio player
5. **Sandbox** — Scenario selector + config (left), live chat simulation (right)
6. **Live Monitor** — Real-time active call grid, status glow, elapsed time, session stats
7. **Tools** — Post-call actions (SMS, Email, Payoff Letter), toggle per scenario
8. **Knowledge Base** *(Phase 2)* — Document upload, search, version tracking

**Sidebar:**
```
ANALYTICS: Dashboard, Insights, Call Logs
AGENTS:    Agent Canvas, Sandbox, Knowledge, Tools
MONITOR:   Live Monitor
REVIEW:    Call Reviews (Phase 2)
```

## Design System

**Theme:** Full dark mode (`className="dark"`)

**Colors (oklch):**
- Background `oklch(0.08 0.018 265)` · Card `oklch(0.12 0.022 265)` · Secondary `oklch(0.17 0.025 265)`
- Primary `oklch(0.58 0.22 285)` (violet) · Border `oklch(1 0 0 / 8%)` · Muted `oklch(0.58 0.03 258)`

**Status:** Emerald=active, Amber=testing, Red=escalation, Violet=primary

**Patterns:**
- Cards: `bg-card border border-border rounded-xl`
- Badges: `bg-[color]/10 text-[color]-400 border-[color]/25 rounded-full px-2.5 py-0.5 text-xs font-medium`
- Tables: header `bg-secondary/40`, rows `hover:bg-accent/30`
- Agent types: Voice=teal, Chat=blue, Multi-modal=violet

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts |
| Icons | lucide-react |
| Data | Mock data (`lib/mock-data.ts`) |
| State | React useState / Context |

## Folder Structure

```
CSxAI/
├── CLAUDE.md
├── meeting-notes/      ← call transcripts / bullet notes
├── decisions/          ← decisions-log.md (Claude maintains)
├── client-updates/     ← drafts + sent updates
├── internal-notes/     ← learnings, escalations (never client-facing)
├── docs/               ← product spec, timeline
├── research/           ← Giga.ml, Symitar, etc.
└── frontend/           ← Next.js app
```

```
frontend/src/
├── app/
│   ├── page.tsx              (Dashboard)
│   ├── insights/page.tsx
│   ├── call-logs/page.tsx
│   ├── scenarios/page.tsx    (Agents list)
│   ├── sandbox/page.tsx
│   ├── live-monitor/page.tsx
│   └── tools/page.tsx
├── components/Sidebar.tsx
└── lib/mock-data.ts
```

## Branding

- **Name:** CSxAI — *AI-Powered Member Services for Credit Unions*
- **Logo:** Headphones icon
- **Demo tenant:** Lakeside Credit Union · User: Sarah Chen (Admin)

## Build Phases

- **Phase 1 (MVP):** 7 sidebar sections, 6 core scenarios, dark design system, mock data
- **Phase 2:** Knowledge Base, Automated QA, telephony (Twilio/Vapi), live listening
- **Phase 3:** Real LLM backend (Claude Haiku/Sonnet), RAG pipeline, RBAC, vertical expansion (real estate, insurance, etc.)
