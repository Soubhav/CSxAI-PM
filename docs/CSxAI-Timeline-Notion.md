# CSxAI — 25-Day Project Timeline & Roadmap

## Platform Overview

| Field | Detail |
|-------|--------|
| **Platform** | CSxAI (Customer Service x AI) |
| **Client** | US Credit Unions |
| **Duration** | 25 Working Days (5 Weeks) |
| **Team** | Small AI Engineering Team (2-3 Engineers) |
| **Start Date** | TBD |

---

## Executive Summary

This roadmap delivers **two parallel tracks** over 25 days that converge in Week 5 for integration, polish, and client demo.

| Track | What It Delivers |
|-------|-----------------|
| **Track A — Core Platform** | Full AI voice agent management system — dashboard, agent config, 8 credit union scenarios, escalation workflows, testing sandbox, monitoring, evaluations, and post-call tools |
| **Track B — Agent Assist Interface** | Real-time in-call intelligence panel for human reps — live transcription, AI objection detection, rebuttal suggestions, CRM intelligence, product recommendations, and post-call automation |

---

## Visual Roadmap

| Week | Days | Track A — Core Platform | Track B — Agent Assist | Demo |
|------|------|------------------------|----------------------|------|
| **Week 1** | 1-5 | Dashboard, Insights, KPI Engine | UI Shell, Layout Design, Live Transcription | Demo 1 |
| **Week 2** | 6-10 | Agent Canvas, 8 Scenarios, Escalation | Objection Detection, AI Rebuttals, Live Call Intel | Demo 2 |
| **Week 3** | 11-15 | Call Logs, Live Monitor, Knowledge Base | CRM Panel, Customer History, Upsell/Cross-sell | Demo 3 |
| **Week 4** | 16-20 | Sandbox, Evaluations, Tools | Product Recs, Rec Engine UI, Post-Call Intel | Demo 4 |
| **Week 5** | 21-25 | Integration, Polish, Demo Prep | Integration, Polish, Demo Prep | Final Demo |

---

# Week-by-Week Breakdown

---

## Week 1 — Foundation & Analytics (Days 1-5)

> Build the command center and establish the design system

### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Day 1** | Project scaffold + Design system | Next.js 16 setup, Tailwind v4 dark theme, shadcn/ui config, sidebar navigation (7 sections), Giga.ml color palette, component patterns |
| **Day 2** | Dashboard — KPI layer | 6 KPI cards (AI Calls Handled, Resolution Rate, Escalation Rate, Hours Saved, NPS, FCR), time-based greeting ("Good afternoon, Lakeside CU"), filter pills (Voice / Date / Scenario) |
| **Day 3** | Dashboard — Visualization layer | Weekly call volume bar chart (AI vs Human — Recharts), sentiment gauge (SVG semicircle), 5 secondary metrics (Escalation Quality, Avg Handle Time, CES, Abandonment, Repeat Rate) |
| **Day 4** | Dashboard — Intelligence layer | Quick Insights grid (6 actionable cards), call volume heatmap (day x hour grid), responsive layout polish |
| **Day 5** | Insights page | Waterfall chart (73.2% → 86.6%), 4 summary cards, 6 ranked improvement opportunities with impact %, effort badges (Low/Med/High), clickable bars → detail modal with recommendations |

### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Days 1-2** | UI architecture + Design | Agent Assist panel layout (split-screen: call view + intelligence panels), component library, real-time state management architecture, WebSocket structure |
| **Days 3-4** | Panel shell + Mock data layer | Tabbed intelligence panels (Live Call / CRM / Products / Post-Call), mock CRM data structure, mock product catalog, responsive panel resizing |
| **Day 5** | Live transcription UI | Real-time transcript display (chat-bubble style with timestamps), speaker identification (Rep vs Member), auto-scroll with manual override |

### Demo 1 — End of Day 5

> **What's shown:** Dashboard with full KPIs + Insights waterfall + Agent Assist panel shell with live transcript UI
>
> **Client value:** "Here's your command center and where your reps will work"
>
> **Checkpoint:** Client reviews dashboard analytics and Agent Assist layout direction

---

## Week 2 — Agent Configuration & Live Intelligence (Days 6-10)

> Build the agent brain and real-time call intelligence

### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Day 6** | Agent Canvas — List view | Agent table (Voice/Chat/Multi-modal badges), status indicators (Active/Testing/Inactive), resolution rate + FCR per agent, "New Agent" creation modal with type selector |
| **Day 7** | Agent Canvas — Policy tree (Part 1) | Two-panel layout (left tree + right content), Overview section, System Prompt editor with version tracking, Rules section (cross-agent guidelines), Guardrails aggregated view |
| **Day 8** | Agent Canvas — Policy tree (Part 2) | Escalation Flow config (4 trigger types, 3 transfer types, 3 priority levels), per-scenario section (prompt, guardrails, tools, metrics), Knowledge linking, agent metadata bar |
| **Day 9** | 8 Credit Union Scenarios | Configure all 8 scenarios with individual prompts, guardrails, escalation rules, and tools |
| **Day 10** | Escalation Workflow | 4 escalation triggers per scenario, warm/cold/priority transfer config, after-hours rules (callback, alert on-call, voicemail), agent brief template, queue overflow config, urgent alert toggle |

**The 8 Credit Union Scenarios:**

| # | Scenario | Member Need | Status |
|---|----------|-------------|--------|
| 1 | Transaction Inquiry | "What's this $47.50 charge?" | Active |
| 2 | Account Balance | "What's my checking balance?" | Active |
| 3 | Loan Status | "Where's my loan application?" | Active |
| 4 | Payment Due Date | "When's my car payment due?" | Active |
| 5 | Card Issue & Disputes | "My card was stolen" | Active |
| 6 | Routing & Account Numbers | "What's the routing number?" | Active |
| 7 | CD & Savings Rates | "What CD rates do you offer?" | Testing |
| 8 | Loan Payoff Quote | "How much to pay off my loan?" | Inactive |

### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Days 6-7** | AI Objection Detection | Real-time keyword/intent analysis engine, objection classification (price, timing, competitor, trust, feature), visual objection alert in transcript (highlighted + categorized) |
| **Days 8-9** | AI Rebuttal Suggestions | Context-aware rebuttal generation engine, rebuttal card UI (confidence score + suggested response), one-click copy-to-clipboard, rebuttal history per call, 3-5 pre-built rebuttal templates per objection type |
| **Day 10** | Live Call Intelligence — Integration | Connect transcription + objection detection + rebuttals into unified real-time flow, typing/speaking indicators, latency optimization, call timer + status bar |

### Demo 2 — End of Day 10

> **What's shown:** Full Agent Canvas with 8 scenarios + escalation config + Live Call Intelligence panel (transcription, objection detection, AI rebuttals)
>
> **Client value:** "Here's how you configure AI agents and how reps get real-time help"
>
> **Checkpoint:** Client reviews agent configuration workflow and live call intelligence accuracy

---

## Week 3 — Monitoring, CRM & Call History (Days 11-15)

> Visibility into operations and customer intelligence

### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Day 11** | Call Logs — Table + Filters | Summary cards (Total/Successful/Partial/Failed), filterable table (member search, scenario filter, escalation filter), pagination, sort by date/duration/score |
| **Day 12** | Call Logs — Detail Drawer | Slide-out panel with signal scores (Resolution/Sentiment/Efficiency), overall score (0-10), AI-generated summary, full transcript (chat-bubble + timestamps), recording player (waveform), tools used, NPS score |
| **Day 13** | Call Logs — Escalation Timeline | Escalation detail view: when triggered, which path taken, wait time, human agent outcome, full call journey visualization |
| **Day 14** | Live Monitor | 3-column card grid for active calls, green glow (in-progress) vs amber (testing), per-call info (member, scenario, elapsed time, sentiment), session summary stats, "Listen In" button (Phase 2 placeholder) |
| **Day 15** | Knowledge Base | Drag-and-drop upload zone, 6 demo documents (Member Services Policy, Rate Sheet, Loan FAQ, Fraud Procedures, Wire Instructions, Digital Banking Troubleshooting), search + filter, scenario linking, stats (Total/Linked/Unlinked) |

### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Days 11-12** | CRM Intelligence Panel — Data layer | CRM data pull architecture (mock backend), customer profile card (name, account type, tenure, lifetime value), account summary (products held, balances, recent activity) |
| **Day 13** | CRM Intelligence Panel — History view | Customer interaction history (last 10 calls/visits), previous issues + resolutions, satisfaction trend, communication preferences, notes from previous reps |
| **Day 14** | Upsell / Cross-sell Engine | Product recommendation logic based on customer profile, recommended products with reasoning, propensity score per product (0-100%), visual propensity bar + confidence indicator |
| **Day 15** | CRM Panel — Integration | Unified CRM panel (profile + history + upsell in tabbed view), real-time data refresh, panel state persistence across call, loading states + error handling |

### Demo 3 — End of Day 15

> **What's shown:** Call Logs with full detail + Live Monitor + Knowledge Base + CRM Intelligence Panel with customer history and upsell scores
>
> **Client value:** "Here's full operational visibility and customer intelligence"
>
> **Checkpoint:** Client reviews monitoring capabilities and CRM intelligence accuracy

---

## Week 4 — Testing, Tools & Product Intelligence (Days 16-20)

> Quality assurance, post-call automation, and AI-powered product recommendations

### Track A — Core Platform

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Day 16** | Sandbox — Layout + Config | Left panel (scenario selector, prompt editor tab, guardrails toggle tab), right panel (chat simulation), reset conversation, mic button placeholder |
| **Day 17** | Sandbox — Test Scripts + Metrics | 5 pre-built test scripts (happy path, fraud escalation, angry member, edge case, guardrail test), per-response metrics (Resolution %, Guardrail Violations, Latency ms), mock AI response cycling |
| **Day 18** | Evaluations | 8 test cases across scenarios, pass/fail per test (expected vs actual), pass rate trend chart (color-coded thresholds), 5 historical test suite runs, "Run All Tests" + individual run buttons, summary cards |
| **Day 19** | Tools (Post-Call Actions) | 3 tools (SMS Summary, Email Summary, Payoff Letter), per-tool enable/disable + scenario assignment, template editor with variables ({{member_name}}, {{summary}}, {{scenario}}), fulfillment partner selection |
| **Day 20** | Version History + Agent Metadata | All prompt versions with resolution rate correlation, rollback capability, "Last locked by" indicator, remaining memory gauge, dev mode toggle, test cases inside Agent Canvas |

### Track B — Agent Assist Interface

| Day | Deliverable | Engineering Tasks |
|-----|-------------|-------------------|
| **Days 16-17** | Real-Time Product Recommendations | Conversation analysis engine (mock NLP), product catalog integration (credit union products: checking, savings, CDs, loans, credit cards), real-time suggestion cards that update as conversation progresses, relevance scoring per product |
| **Day 18** | Product Recommendation UI | Product cards with: name, match reason, propensity score, key selling points, suggested talking points for the rep, visual priority ranking (top 3 highlighted), dismiss/pin actions |
| **Days 19-20** | Post-Call Intelligence | Auto-generated call summary (key topics, decisions, outcomes), action items extraction (with assignee + due date), follow-up tasks (auto-created), CRM notes (structured format for auto-entry), sales insights (products discussed, member interest signals, next-best-action) |

### Demo 4 — End of Day 20

> **What's shown:** Complete Core Platform (all 11 features) + Real-Time Product Recommendations + Post-Call Intelligence auto-generation
>
> **Client value:** "Here's quality assurance, post-call automation, and AI selling"
>
> **Checkpoint:** Client reviews full platform functionality and Agent Assist intelligence quality

---

## Week 5 — Integration, Polish & Client Demo (Days 21-25)

> Connect both tracks, polish the experience, and prepare for client presentation

| Day | Track A — Core Platform | Track B — Agent Assist | Joint |
|-----|------------------------|----------------------|-------|
| **Day 21** | Cross-page navigation polish, loading states, empty states, error boundaries | Agent Assist ↔ Core Platform data bridge (shared call context, CRM data flows into Call Logs) | Integration testing — both tracks sharing data correctly |
| **Day 22** | Dashboard real-time updates from Agent Assist data, Call Logs enriched with Agent Assist insights (rebuttals used, products recommended) | Post-call data → auto-populates CRM notes, summary, follow-ups in Core Platform tools | End-to-end call flow: incoming call → Agent Assist live panel → call ends → post-call auto-generation → Call Logs entry |
| **Day 23** | Performance optimization (lazy loading, code splitting), responsive design audit, accessibility pass | Agent Assist panel responsive behavior (collapsible panels, mobile-friendly), keyboard shortcuts for reps | Full regression testing across all 11 core features + 4 Agent Assist modules |
| **Day 24** | Demo data seeding (realistic Lakeside CU data across all screens), demo script walkthrough, edge case fixes | Demo scenarios: live call simulation with objection detection, CRM lookup, product recs, post-call generation | Dry run of full client demo (both tracks) |
| **Day 25** | Final bug fixes, documentation | Final bug fixes, documentation | **CLIENT DEMO — Full platform walkthrough** |

### Final Demo — Day 25

> **What's shown:** Complete CSxAI platform — Core Management System + Agent Assist Interface — fully integrated, polished, and ready for client review
>
> **Client value:** "Here's your complete AI-powered member services platform"

---

# Complete Feature Matrix

## Track A — Core Platform (11 Features)

| # | Feature | Description | Week | Days |
|---|---------|-------------|------|------|
| 1 | **Dashboard** | 6 KPIs, call volume chart, sentiment gauge, heatmap, quick insights | Week 1 | Days 2-4 |
| 2 | **Insights** | Waterfall chart, 6 improvement opportunities, effort/impact ranking | Week 1 | Day 5 |
| 3 | **Agent Canvas** | Policy tree, system prompt editor, rules, guardrails, version history | Week 2 | Days 6-8 |
| 4 | **8 Credit Union Scenarios** | Individual prompts, guardrails, escalation, tools per scenario | Week 2 | Day 9 |
| 5 | **Escalation Workflow** | 4 triggers, 3 transfer types, after-hours, agent briefs, queue overflow | Week 2 | Day 10 |
| 6 | **Call Logs** | Filterable table, detail drawer, signal scores, transcript, recording, escalation timeline | Week 3 | Days 11-13 |
| 7 | **Live Monitor** | Real-time call grid, status indicators, sentiment, session stats | Week 3 | Day 14 |
| 8 | **Knowledge Base** | Document upload, search, scenario linking, 6 demo docs | Week 3 | Day 15 |
| 9 | **Sandbox** | Scenario testing, prompt editing, 5 test scripts, per-response metrics | Week 4 | Days 16-17 |
| 10 | **Evaluations** | 8 test cases, pass/fail tracking, trend chart, historical runs | Week 4 | Day 18 |
| 11 | **Tools** | SMS/Email/Mail post-call actions, templates, scenario assignment | Week 4 | Day 19 |

## Track B — Agent Assist Interface (10 Features)

| # | Feature | Description | Week | Days |
|---|---------|-------------|------|------|
| 1 | **Live Transcription** | Real-time transcript, speaker ID, auto-scroll | Week 1 | Day 5 |
| 2 | **AI Objection Detection** | Real-time intent analysis, objection classification | Week 2 | Days 6-7 |
| 3 | **AI Rebuttal Suggestions** | Context-aware responses, confidence scores, one-click copy | Week 2 | Days 8-9 |
| 4 | **Live Call Intelligence** | Unified real-time flow: transcription + objections + rebuttals | Week 2 | Day 10 |
| 5 | **CRM Intelligence — Profile** | Customer profile, account summary, lifetime value | Week 3 | Days 11-12 |
| 6 | **CRM Intelligence — History** | Interaction history, previous issues, satisfaction trend | Week 3 | Day 13 |
| 7 | **Upsell / Cross-sell** | Propensity scores, product recommendations with reasoning | Week 3 | Day 14 |
| 8 | **Real-Time Product Recs** | Conversation-driven suggestions, live updates | Week 4 | Days 16-17 |
| 9 | **Product Rec UI** | Cards, talking points, priority ranking, dismiss/pin | Week 4 | Day 18 |
| 10 | **Post-Call Intelligence** | Auto summary, action items, follow-ups, CRM notes, sales insights | Week 4 | Days 19-20 |

---

# Demo Milestones

| Demo | Day | What's Shown | Client Value |
|------|-----|-------------|--------------|
| **Demo 1** | Day 5 | Dashboard + Insights + Agent Assist shell | "Here's your command center and where your reps will work" |
| **Demo 2** | Day 10 | Agent Canvas + 8 Scenarios + Live Call Intelligence | "Here's how you configure AI agents and how reps get real-time help" |
| **Demo 3** | Day 15 | Call Logs + Live Monitor + Knowledge Base + CRM Panel | "Here's full operational visibility and customer intelligence" |
| **Demo 4** | Day 20 | Sandbox + Evaluations + Tools + Product Recs + Post-Call | "Here's quality assurance, post-call automation, and AI selling" |
| **Final Demo** | Day 25 | Full integrated platform — both tracks | "Here's your complete AI-powered member services platform" |

---

# Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Week 2 scope is heavy (Agent Canvas + Live Intelligence) | Agent Canvas policy tree is the most complex component — if needed, version history moves to Week 4 |
| Real-time features depend on WebSocket architecture | Day 1-2 of Track B establishes the real-time architecture first, before building features on top |
| Integration week (5) could surface unexpected issues | Continuous integration touch-points at each weekly demo, not just Week 5 |
| Small team bandwidth | Track A and Track B can be split across engineers — they share design system but are otherwise independent until Week 5 |

---

# Tech Stack

| Layer | Choice |
|-------|--------|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4 + shadcn/ui (dark theme) |
| **Charts** | Recharts (bar, waterfall, trend, gauge) |
| **Real-time** | WebSocket architecture (mock in Phase 1) |
| **State** | React useState / Context + real-time state management |
| **Icons** | lucide-react |
| **Data** | Mock data structured for direct API replacement |

---

# What Comes After Day 25

## Phase 2 — Backend Integration (Weeks 6-10)

- Real telephony integration (Twilio / Vapi)
- Live CRM sync
- Real-time transcription API
- LLM-powered rebuttals

## Phase 3 — Production (Weeks 11-15)

- Claude Haiku / Sonnet backend
- RAG pipeline over credit union knowledge docs
- Multi-tenant support (multiple credit unions)
- Role-based access control (Admin, Supervisor, Analyst)
- Production deployment

---

*This timeline assumes a small AI engineering team (2-3 engineers) working full-time. Track A and Track B can be developed in parallel by splitting the team. All Phase 1 deliverables use mock data structured for seamless backend integration in Phase 2.*
