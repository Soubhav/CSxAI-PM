# CSxAI — 25-Day Project Timeline & Roadmap

**Platform:** CSxAI (Customer Service x AI)
**Client:** US Credit Unions
**Team:** Small AI Engineering Team (2-3 engineers)
**Start Date:** TBD
**Duration:** 25 working days (5 weeks)

---

## Executive Summary

This roadmap delivers two parallel tracks over 25 days:

| Track | What It Delivers |
|-------|-----------------|
| **Track A — Core Platform** | Full AI voice agent management system (dashboard, agent config, scenarios, testing, monitoring, quality) |
| **Track B — Agent Assist Interface** | Real-time in-call intelligence panel for human reps (transcription, AI rebuttals, CRM panel, product recommendations, post-call automation) |

Both tracks converge in Week 5 for integration, polish, and client demo.

---

## Visual Roadmap

```
WEEK 1          WEEK 2          WEEK 3          WEEK 4          WEEK 5
Days 1-5        Days 6-10       Days 11-15      Days 16-20      Days 21-25
─────────────── ─────────────── ─────────────── ─────────────── ───────────────

TRACK A — CORE PLATFORM
┌───────────────┐┌───────────────┐┌───────────────┐┌───────────────┐┌───────────────┐
│ Dashboard     ││ Agent Canvas  ││ Call Logs     ││ Sandbox       ││ Integration   │
│ Insights      ││ 8 Scenarios   ││ Live Monitor  ││ Evaluations   ││ Polish        │
│ KPI Engine    ││ Escalation    ││ Knowledge Base││ Tools (Post)  ││ Demo Prep     │
└───────────────┘└───────────────┘└───────────────┘└───────────────┘└───────────────┘
      ▲                ▲                ▲                ▲                ▲
   DEMO 1           DEMO 2           DEMO 3           DEMO 4         FINAL DEMO
   Dashboard        Agent Config     Monitoring       Full Platform   Client Review
   + Insights       + Scenarios      + Call History   + Testing       + Both Tracks

TRACK B — AGENT ASSIST INTERFACE
┌───────────────┐┌───────────────┐┌───────────────┐┌───────────────┐┌───────────────┐
│ UI Shell      ││ Live Call     ││ CRM Intel     ││ Product Recs  ││ Integration   │
│ Layout Design ││ Transcription ││ Panel         ││ Engine        ││ Polish        │
│ Component Lib ││ Objection     ││ Customer      ││ Post-Call     ││ Demo Prep     │
│               ││ Detection     ││ History       ││ Intelligence  ││               │
└───────────────┘└───────────────┘└───────────────┘└───────────────┘└───────────────┘
```

---

## Week-by-Week Breakdown

---

### WEEK 1 — Foundation & Analytics (Days 1-5)

**Theme:** Build the command center and establish the design system

#### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **1** | Project scaffold + Design system | Next.js 16 setup, Tailwind v4 dark theme, shadcn/ui config, sidebar navigation (7 sections), Giga.ml color palette, component patterns |
| **2** | Dashboard — KPI layer | 6 KPI cards (AI Calls Handled, Resolution Rate, Escalation Rate, Hours Saved, NPS, FCR), time-based greeting ("Good afternoon, Lakeside CU"), filter pills (Voice / Date / Scenario) |
| **3** | Dashboard — Visualization layer | Weekly call volume bar chart (AI vs Human — Recharts), sentiment gauge (SVG semicircle), 5 secondary metrics (Escalation Quality, Avg Handle Time, CES, Abandonment, Repeat Rate) |
| **4** | Dashboard — Intelligence layer | Quick Insights grid (6 actionable cards), call volume heatmap (day x hour grid), responsive layout polish |
| **5** | Insights page | Waterfall chart (73.2% → 86.6%), 4 summary cards, 6 ranked improvement opportunities with impact %, effort badges (Low/Med/High), clickable bars → detail modal with recommendations |

#### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **1-2** | UI architecture + Design | Agent Assist panel layout (split-screen: call view + intelligence panels), component library, real-time state management architecture, WebSocket structure |
| **3-4** | Panel shell + Mock data layer | Tabbed intelligence panels (Live Call / CRM / Products / Post-Call), mock CRM data structure, mock product catalog, responsive panel resizing |
| **5** | Live transcription UI | Real-time transcript display (chat-bubble style with timestamps), speaker identification (Rep vs Member), auto-scroll with manual override |

#### Week 1 Milestone

> **DEMO 1 (End of Day 5):** Dashboard with full KPIs + Insights waterfall + Agent Assist panel shell with live transcript UI

**Checkpoint:** Client reviews dashboard analytics and Agent Assist layout direction

---

### WEEK 2 — Agent Configuration & Live Intelligence (Days 6-10)

**Theme:** Build the agent brain and real-time call intelligence

#### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **6** | Agent Canvas — List view | Agent table (Voice/Chat/Multi-modal badges), status indicators (Active/Testing/Inactive), resolution rate + FCR per agent, "New Agent" creation modal with type selector |
| **7** | Agent Canvas — Policy tree (Part 1) | Two-panel layout (left tree + right content), Overview section, System Prompt editor with version tracking, Rules section (cross-agent guidelines), Guardrails aggregated view |
| **8** | Agent Canvas — Policy tree (Part 2) | Escalation Flow config (4 trigger types, 3 transfer types, 3 priority levels), per-scenario section (prompt, guardrails, tools, metrics), Knowledge linking, agent metadata bar |
| **9** | 8 Credit Union Scenarios | Configure all 8 scenarios with individual prompts, guardrails, escalation rules, and tools: Transaction Inquiry, Account Balance, Loan Status, Payment Due Date, Card Issue & Disputes, Routing & Account Numbers, CD & Savings Rates, Loan Payoff Quote |
| **10** | Escalation Workflow | 4 escalation triggers per scenario, warm/cold/priority transfer config, after-hours rules (callback, alert on-call, voicemail), agent brief template, queue overflow config, urgent alert toggle |

#### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **6-7** | AI Objection Detection | Real-time keyword/intent analysis engine, objection classification (price, timing, competitor, trust, feature), visual objection alert in transcript (highlighted + categorized) |
| **8-9** | AI Rebuttal Suggestions | Context-aware rebuttal generation engine, rebuttal card UI (confidence score + suggested response), one-click copy-to-clipboard, rebuttal history per call, 3-5 pre-built rebuttal templates per objection type |
| **10** | Live Call Intelligence — Integration | Connect transcription + objection detection + rebuttals into unified real-time flow, typing/speaking indicators, latency optimization, call timer + status bar |

#### Week 2 Milestone

> **DEMO 2 (End of Day 10):** Full Agent Canvas with 8 scenarios + escalation config + Live Call Intelligence panel (transcription, objection detection, AI rebuttals)

**Checkpoint:** Client reviews agent configuration workflow and live call intelligence accuracy

---

### WEEK 3 — Monitoring, CRM & Call History (Days 11-15)

**Theme:** Visibility into operations and customer intelligence

#### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **11** | Call Logs — Table + Filters | Summary cards (Total/Successful/Partial/Failed), filterable table (member search, scenario filter, escalation filter), pagination, sort by date/duration/score |
| **12** | Call Logs — Detail Drawer | Slide-out panel with signal scores (Resolution/Sentiment/Efficiency), overall score (0-10), AI-generated summary, full transcript (chat-bubble + timestamps), recording player (waveform), tools used, NPS score |
| **13** | Call Logs — Escalation Timeline | Escalation detail view: when triggered, which path taken, wait time, human agent outcome, full call journey visualization |
| **14** | Live Monitor | 3-column card grid for active calls, green glow (in-progress) vs amber (testing), per-call info (member, scenario, elapsed time, sentiment), session summary stats, "Listen In" button (Phase 2 placeholder) |
| **15** | Knowledge Base | Drag-and-drop upload zone, 6 demo documents (Member Services Policy, Rate Sheet, Loan FAQ, Fraud Procedures, Wire Instructions, Digital Banking Troubleshooting), search + filter, scenario linking, stats (Total/Linked/Unlinked) |

#### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **11-12** | CRM Intelligence Panel — Data layer | CRM data pull architecture (mock backend), customer profile card (name, account type, tenure, lifetime value), account summary (products held, balances, recent activity) |
| **13** | CRM Intelligence Panel — History view | Customer interaction history (last 10 calls/visits), previous issues + resolutions, satisfaction trend, communication preferences, notes from previous reps |
| **14** | Upsell / Cross-sell Engine | Product recommendation logic based on customer profile, recommended products with reasoning, propensity score per product (0-100%), visual propensity bar + confidence indicator |
| **15** | CRM Panel — Integration | Unified CRM panel (profile + history + upsell in tabbed view), real-time data refresh, panel state persistence across call, loading states + error handling |

#### Week 3 Milestone

> **DEMO 3 (End of Day 15):** Call Logs with full detail + Live Monitor + Knowledge Base + CRM Intelligence Panel with customer history and upsell scores

**Checkpoint:** Client reviews monitoring capabilities and CRM intelligence accuracy

---

### WEEK 4 — Testing, Tools & Product Intelligence (Days 16-20)

**Theme:** Quality assurance, post-call automation, and AI-powered product recommendations

#### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **16** | Sandbox — Layout + Config | Left panel (scenario selector, prompt editor tab, guardrails toggle tab), right panel (chat simulation), reset conversation, mic button placeholder |
| **17** | Sandbox — Test Scripts + Metrics | 5 pre-built test scripts (happy path, fraud escalation, angry member, edge case, guardrail test), per-response metrics (Resolution %, Guardrail Violations, Latency ms), mock AI response cycling |
| **18** | Evaluations | 8 test cases across scenarios, pass/fail per test (expected vs actual), pass rate trend chart (color-coded thresholds), 5 historical test suite runs, "Run All Tests" + individual run buttons, summary cards |
| **19** | Tools (Post-Call Actions) | 3 tools (SMS Summary, Email Summary, Payoff Letter), per-tool enable/disable + scenario assignment, template editor with variables ({{member_name}}, {{summary}}, {{scenario}}), fulfillment partner selection |
| **20** | Version History + Agent Metadata | All prompt versions with resolution rate correlation, rollback capability, "Last locked by" indicator, remaining memory gauge, dev mode toggle, test cases inside Agent Canvas |

#### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **16-17** | Real-Time Product Recommendations | Conversation analysis engine (mock NLP), product catalog integration (credit union products: checking, savings, CDs, loans, credit cards), real-time suggestion cards that update as conversation progresses, relevance scoring per product |
| **18** | Product Recommendation UI | Product cards with: name, match reason, propensity score, key selling points, suggested talking points for the rep, visual priority ranking (top 3 highlighted), dismiss/pin actions |
| **19-20** | Post-Call Intelligence | Auto-generated call summary (key topics, decisions, outcomes), action items extraction (with assignee + due date), follow-up tasks (auto-created), CRM notes (structured format for auto-entry), sales insights (products discussed, member interest signals, next-best-action) |

#### Week 4 Milestone

> **DEMO 4 (End of Day 20):** Complete Core Platform (all 11 features) + Real-Time Product Recommendations + Post-Call Intelligence auto-generation

**Checkpoint:** Client reviews full platform functionality and Agent Assist intelligence quality

---

### WEEK 5 — Integration, Polish & Client Demo (Days 21-25)

**Theme:** Connect both tracks, polish the experience, and prepare for client presentation

| Day | Track A — Core Platform | Track B — Agent Assist | Joint |
|-----|------------------------|----------------------|-------|
| **21** | Cross-page navigation polish, loading states, empty states, error boundaries | Agent Assist ↔ Core Platform data bridge (shared call context, CRM data flows into Call Logs) | Integration testing — both tracks sharing data correctly |
| **22** | Dashboard real-time updates from Agent Assist data, Call Logs enriched with Agent Assist insights (rebuttals used, products recommended) | Post-call data → auto-populates CRM notes, summary, follow-ups in Core Platform tools | End-to-end call flow: incoming call → Agent Assist live panel → call ends → post-call auto-generation → Call Logs entry |
| **23** | Performance optimization (lazy loading, code splitting), responsive design audit, accessibility pass | Agent Assist panel responsive behavior (collapsible panels, mobile-friendly), keyboard shortcuts for reps | Full regression testing across all 11 core features + 4 Agent Assist modules |
| **24** | Demo data seeding (realistic Lakeside CU data across all screens), demo script walkthrough, edge case fixes | Demo scenarios: live call simulation with objection detection, CRM lookup, product recs, post-call generation | Dry run of full client demo (both tracks) |
| **25** | Final bug fixes, documentation | Final bug fixes, documentation | **CLIENT DEMO** — Full platform walkthrough |

#### Week 5 Milestone

> **FINAL DEMO (Day 25):** Complete CSxAI platform — Core Management System + Agent Assist Interface — fully integrated, polished, and ready for client review

---

## Complete Feature Matrix

### Track A — Core Platform (Phase 1 Features)

| # | Feature | Week | Status |
|---|---------|------|--------|
| 1 | **Dashboard** — 6 KPIs, call volume chart, sentiment gauge, heatmap, quick insights | Week 1 | Days 2-4 |
| 2 | **Insights** — Waterfall chart, 6 improvement opportunities, effort/impact ranking | Week 1 | Day 5 |
| 3 | **Agent Canvas** — Policy tree, system prompt editor, rules, guardrails, version history | Week 2 | Days 6-8 |
| 4 | **8 Credit Union Scenarios** — Individual prompts, guardrails, escalation, tools per scenario | Week 2 | Day 9 |
| 5 | **Escalation Workflow** — 4 triggers, 3 transfer types, after-hours, agent briefs, queue overflow | Week 2 | Day 10 |
| 6 | **Call Logs** — Filterable table, detail drawer, signal scores, transcript, recording, escalation timeline | Week 3 | Days 11-13 |
| 7 | **Live Monitor** — Real-time call grid, status indicators, sentiment, session stats | Week 3 | Day 14 |
| 8 | **Knowledge Base** — Document upload, search, scenario linking, 6 demo docs | Week 3 | Day 15 |
| 9 | **Sandbox** — Scenario testing, prompt editing, 5 test scripts, per-response metrics | Week 4 | Days 16-17 |
| 10 | **Evaluations** — 8 test cases, pass/fail tracking, trend chart, historical runs | Week 4 | Day 18 |
| 11 | **Tools** — SMS/Email/Mail post-call actions, templates, scenario assignment | Week 4 | Day 19 |

### Track B — Agent Assist Interface

| # | Feature | Week | Status |
|---|---------|------|--------|
| 1 | **Live Transcription** — Real-time transcript, speaker ID, auto-scroll | Week 1 | Day 5 |
| 2 | **AI Objection Detection** — Real-time intent analysis, objection classification | Week 2 | Days 6-7 |
| 3 | **AI Rebuttal Suggestions** — Context-aware responses, confidence scores, one-click copy | Week 2 | Days 8-9 |
| 4 | **Live Call Intelligence (Unified)** — Transcription + objections + rebuttals in real-time | Week 2 | Day 10 |
| 5 | **CRM Intelligence — Profile & Data** — Customer profile, account summary, lifetime value | Week 3 | Days 11-12 |
| 6 | **CRM Intelligence — History** — Interaction history, previous issues, satisfaction trend | Week 3 | Day 13 |
| 7 | **CRM Intelligence — Upsell/Cross-sell** — Propensity scores, product recommendations | Week 3 | Day 14 |
| 8 | **Real-Time Product Recommendations** — Conversation-driven suggestions, live updates | Week 4 | Days 16-17 |
| 9 | **Product Recommendation UI** — Cards, talking points, priority ranking | Week 4 | Day 18 |
| 10 | **Post-Call Intelligence** — Auto summary, action items, follow-ups, CRM notes, sales insights | Week 4 | Days 19-20 |

---

## Demo Milestones

| Demo | Day | What's Shown | Client Value |
|------|-----|-------------|--------------|
| **Demo 1** | Day 5 | Dashboard + Insights + Agent Assist shell | "Here's your command center and where your reps will work" |
| **Demo 2** | Day 10 | Agent Canvas + 8 Scenarios + Live Call Intelligence | "Here's how you configure AI agents and how reps get real-time help" |
| **Demo 3** | Day 15 | Call Logs + Live Monitor + Knowledge Base + CRM Panel | "Here's full operational visibility and customer intelligence" |
| **Demo 4** | Day 20 | Sandbox + Evaluations + Tools + Product Recs + Post-Call | "Here's quality assurance, post-call automation, and AI selling" |
| **Final Demo** | Day 25 | Full integrated platform — both tracks | "Here's your complete AI-powered member services platform" |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Week 2 scope is heavy (Agent Canvas + Live Intelligence) | Agent Canvas policy tree is the most complex component — if needed, version history moves to Week 4 |
| Real-time features in Track B depend on WebSocket architecture | Day 1-2 of Track B establishes the real-time architecture first, before building features on top |
| Integration week (5) could surface unexpected issues | Continuous integration touch-points at each weekly demo, not just Week 5 |
| Small team bandwidth | Track A and Track B can be split across engineers — they share design system but are otherwise independent until Week 5 |

---

## Tech Stack (Both Tracks)

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + shadcn/ui (dark theme) |
| Charts | Recharts (bar, waterfall, trend, gauge) |
| Real-time | WebSocket architecture (mock in Phase 1) |
| State | React useState / Context + real-time state management |
| Icons | lucide-react |
| Data | Mock data structured for direct API replacement |

---

## What Comes After Day 25

| Phase | Timeline | Key Additions |
|-------|----------|--------------|
| **Phase 2 — Backend Integration** | Weeks 6-10 | Real telephony (Twilio/Vapi), live CRM sync, real-time transcription API, LLM-powered rebuttals |
| **Phase 3 — Production** | Weeks 11-15 | Claude Haiku/Sonnet backend, RAG pipeline, multi-tenant support, RBAC, production deployment |

---

*This timeline assumes a small AI engineering team (2-3 engineers) working full-time. Track A and Track B can be developed in parallel by splitting the team. All Phase 1 deliverables use mock data structured for seamless backend integration in Phase 2.*

*Built with Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui*
