# CSxAI — Phase 1 Feature Overview

**Platform:** CSxAI (Customer Service x AI)
**Target Market:** US Credit Unions
**Phase 1 Status:** Complete (Frontend + Mock Data)
**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts

---

## Why We're Building This

Credit unions handle thousands of member calls daily — transaction questions, loan inquiries, card issues, balance checks. Most of these are repetitive and predictable, yet they still require human agents, leading to long wait times, inconsistent quality, and high operational costs.

CSxAI gives credit unions an AI voice agent platform that handles common call scenarios autonomously, escalates intelligently when needed, and gives operations teams full visibility into what's happening — in real time and historically.

Phase 1 delivers the **complete management interface** — everything an ops team needs to configure, monitor, test, and improve their AI agents. The backend/telephony integration comes in Phase 2.

---

## Platform Architecture

### Navigation Structure

| Group | Pages | Rationale |
|-------|-------|-----------|
| **Analytics** | Dashboard, Insights, Call Logs | Ops teams need performance visibility at three levels: high-level KPIs (Dashboard), improvement opportunities (Insights), and individual call detail (Call Logs) |
| **Agents** | Agent Canvas, Sandbox, Knowledge, Tools | Everything needed to configure what agents do, test them, feed them information, and define post-call actions |
| **Monitor** | Live Monitor | Real-time visibility into active calls — critical for launch confidence and supervisor oversight |
| **Review** | Evaluations | Systematic quality tracking — test suites catch regressions before they reach members |

**Why this grouping?** It mirrors the workflow of an operations team: monitor performance → identify issues → configure agents → test changes → deploy. Each section maps to a distinct job-to-be-done.

---

## Feature Breakdown

### 1. Dashboard

**What it does:** Central command center showing all key performance metrics at a glance.

**Features built:**
- Time-based greeting with org name ("Good afternoon, Lakeside CU")
- Filter pills: Voice / Date range / Scenario
- 6 KPI cards: AI Calls Handled, Resolution Rate, Escalation Rate, Hours Saved, NPS Score, First Call Resolution
- Weekly call volume bar chart (AI vs Human)
- Sentiment gauge (SVG semicircle visualization)
- 5 secondary metrics: Escalation Quality, Avg Handle Time, Customer Effort Score, Abandonment Rate, Repeat Call Rate
- Quick Insights grid (6 actionable cards)
- Call volume heatmap (day × hour)

**Rationale:**
- **NPS + FCR as primary KPIs**: Credit unions are member-relationship businesses. Resolution rate alone doesn't tell you if members are happy. NPS captures sentiment, FCR captures efficiency — together they tell the full story.
- **AI vs Human comparison**: The entire value proposition is "AI handles more, humans handle less." Showing this side-by-side makes the ROI immediately visible.
- **Heatmap**: Helps staffing decisions — when are AI agents handling the most volume? When should human backup be scheduled?
- **Sentiment gauge**: An at-a-glance emotional health check. If sentiment drops, something is wrong even if resolution rates look fine.

---

### 2. Agent Canvas (Configuration Hub)

**What it does:** The core configuration interface for AI agents. Inspired by Giga.ml's policy tree layout — a left sidebar tree with sections that open different content panels.

**Features built:**

**Agent List View:**
- Table showing all agents with type badges (Voice / Chat / Multi-modal)
- Status indicators (Active / Testing / Inactive)
- Resolution rate + FCR per agent
- "New Agent" creation modal with type selector

**Agent Detail View — Policy Tree:**

| Section | Content | Rationale |
|---------|---------|-----------|
| **Overview** | Resolution %, FCR %, scenario count, linked docs | Quick health check without clicking into specifics |
| **System Prompt** | Full prompt editor with version tracking | The system prompt is the agent's "brain" — needs to be editable and versioned |
| **Rules** | Cross-agent operating guidelines | Universal rules (like "always verify identity") should live separately from per-scenario prompts |
| **Guardrails** | Safety rules aggregated from all scenarios | Guardrails prevent harm — showing them in one place makes audit easy |
| **Escalation Flow** | Trigger table, agent brief template, queue overflow, after-hours rules | This is the #1 concern for credit unions: "what happens when AI can't handle it?" Dedicated section builds confidence |
| **Per-Scenario** | Prompt, guardrails, tools, metrics per scenario | Each scenario is essentially a mini-agent — needs its own config space |
| **Knowledge** | Linked documents with types and excerpts | Agents need context — this shows what information each agent has access to |
| **Test Cases** | Input → Expected → Actual → Pass/Fail | Quality assurance built into the agent config, not a separate afterthought |
| **Test Suite Runs** | Historical run results with pass rate trend | Track quality over time — are we getting better or worse? |
| **Version History** | All prompt versions with resolution rates | Rollback capability + correlation between prompt changes and performance |

**Rationale:**
- **Policy tree layout**: Borrowed from Giga.ml because it solves a real problem — agent configuration has many dimensions (prompts, rules, guardrails, escalation, knowledge, testing). A flat page would be overwhelming. The tree makes it navigable.
- **Versioning built in**: Credit unions are regulated. They need to know what changed, when, and what the impact was. Version history with resolution rate tracking provides this.
- **Evaluation inside Agent Canvas**: Quality shouldn't be a separate workflow. When you change a prompt, you should immediately be able to run tests and see if you broke something.

---

### 3. 8 Credit Union Scenarios

| Scenario | Use Case | Status | Why Included |
|----------|----------|--------|--------------|
| **Transaction Inquiry** | "What's this $47.50 charge?" | Active | #1 call driver at most credit unions |
| **Account Balance** | "What's my checking balance?" | Active | High volume, high automation potential (94% resolution) |
| **Loan Status** | "Where's my loan application?" | Active | Common anxiety-driven call — members want reassurance |
| **Payment Due Date** | "When's my car payment due?" | Active | Simple lookup, perfect for AI (96% resolution) |
| **Card Issue & Disputes** | "My card was stolen" | Active | High-emotion scenario — tests AI empathy + escalation |
| **Routing & Account Numbers** | "What's the routing number?" | Active | Near-100% automatable (98% resolution) |
| **CD & Savings Rates** | "What CD rates do you offer?" | Testing | Rate inquiries are common but need guardrails (no recommendations) |
| **Loan Payoff Quote** | "How much to pay off my loan?" | Inactive | Requires fulfillment integration (mail payoff letter) |

**Rationale:**
- **8 scenarios, not 3**: A real credit union deployment needs breadth. Three scenarios would feel like a demo. Eight covers the majority of call volume.
- **Mix of statuses**: Showing Active / Testing / Inactive demonstrates the deployment lifecycle — not everything goes live at once.
- **Each scenario has its own prompt, guardrails, escalation rules, and tools**: Because a fraud call and a balance check require fundamentally different AI behavior. One-size-fits-all doesn't work.

---

### 4. Escalation Workflow

**What it does:** Defines exactly what happens when AI can't handle a call — the most critical system for credit union trust.

**Features built:**
- 4 escalation trigger types per scenario: Member Request, Fraud Detection, Unresolved After Retries, Negative Sentiment
- 3 transfer types: Cold (no context), Warm (with AI summary), Priority-Warm (urgent + on-call)
- 3 priority levels: Normal, High, Urgent
- 3 after-hours rules: Schedule Callback, Alert On-Call, Voicemail
- Agent brief template (what the human agent sees on screen-pop)
- Queue overflow configuration (callback vs hold, with minute threshold)
- After-hours urgent alert toggle with email recipients

**Rationale:**
- **This is THE feature that sells or kills the platform.** Credit unions won't adopt AI if they can't guarantee members reach a human when needed. The escalation system needs to be configurable, transparent, and robust.
- **Warm transfer with AI summary**: When a call escalates, the human agent gets context — member name, account details, what the AI already tried. This eliminates "please repeat your issue" frustration.
- **After-hours rules**: Credit unions can't staff 24/7. The AI handles calls, but urgent issues (fraud, stolen cards) need to alert someone. This is a regulatory and member-safety requirement.
- **Agent brief template**: Reduces resolution time for escalated calls by 30-40% in industry benchmarks. The human agent isn't starting from zero.

---

### 5. Call Logs

**What it does:** Searchable, filterable history of every call with deep-dive capability.

**Features built:**
- Summary cards: Total Calls, Successful, Partial, Failed
- Filterable table: Member name search, scenario filter, escalation filter
- Detail drawer (slide-out panel) with:
  - Signal scores: Resolution / Sentiment / Efficiency (color-coded)
  - Overall score (0-10)
  - AI-generated call summary
  - Full transcript (chat-bubble style with timestamps)
  - Recording player (waveform visualization)
  - Tools used during/after call
  - Escalation timeline (for escalated calls): when, which path, human agent outcome
  - NPS score if collected

**Rationale:**
- **Three-tier scoring (Resolution + Sentiment + Efficiency)**: A call can be "resolved" but leave the member frustrated (bad sentiment) or take too long (bad efficiency). Three signals give the complete picture.
- **Transcript + recording**: Supervisors need to review calls for quality. Transcript makes it searchable; recording captures tone/emotion that text misses.
- **Escalation timeline**: When something goes wrong, you need the full story — not just "it escalated" but when, why, how long the member waited, and whether the human agent resolved it.
- **NPS per call**: Ties member satisfaction to specific interactions, not just aggregate scores. Helps identify which scenarios or agent behaviors drive satisfaction up or down.

---

### 6. Insights (AI-Powered Improvement)

**What it does:** Identifies specific opportunities to improve resolution rate, ranked by impact.

**Features built:**
- Waterfall chart: Current rate (73.2%) → 6 improvement opportunities → Potential rate (86.6%)
- 4 summary cards: Current Rate, Potential Rate, Conversations Analyzed, Actionable Insights
- 6 ranked opportunities with:
  - Impact percentage
  - Effort level (Low / Medium / High)
  - Category (Conversation Flow, Missing Capability, Edge Case, Knowledge Gap, Routing)
  - Detailed description with specific recommendation
- Clickable bars and cards → detail modal with "Create task" action

**Rationale:**
- **Waterfall chart**: Makes the ROI of each improvement visually obvious. Stakeholders can see "if we fix repeated agent requests, we gain 5.3% resolution rate."
- **Effort + Impact matrix**: Not all improvements are equal. A 5% gain that takes a week beats a 0.8% gain that takes a month. Effort badges help prioritize.
- **Actionable, not just analytical**: Each insight includes a specific recommendation ("Add reimbursement FAQ and basic status lookup could resolve 60% of these calls"). This bridges the gap between data and action.

---

### 7. Sandbox (Testing Environment)

**What it does:** Safe space to test agent behavior before deploying to production.

**Features built:**
- Left panel: Scenario selector, Prompt tab (editable), Guardrails tab (toggleable rules)
- Right panel: Chat simulation with mock AI responses
- 5 pre-built test scripts: Happy path, Fraud escalation, Angry member, Edge case multi-transaction, Guardrail test
- Per-response evaluation metrics: Resolution %, Guardrail Violations, Latency (ms)
- Typing indicator, reset conversation, mic button (Phase 2)

**Rationale:**
- **Pre-built test scripts**: Manual testing is inconsistent. Pre-built scripts ensure the same edge cases are tested every time — especially adversarial ones like "angry member" and "guardrail test."
- **Per-response metrics**: Don't wait until the end of a conversation to know something went wrong. Real-time scoring per response catches issues immediately.
- **Prompt editing in sandbox**: Test changes before deploying them. Edit the prompt, run a test script, see the impact — all without touching production.

---

### 8. Knowledge Base

**What it does:** Manages the documents and information that AI agents reference during calls.

**Features built:**
- Drag-and-drop file upload zone
- 6 documents: Member Services Policy, Rate Sheet, Loan FAQ, Fraud Procedures, Wire Instructions, Digital Banking Troubleshooting
- Document types: PDF, FAQ, Rate Sheet, Policy
- Search and filter across all documents
- Per-document: file size, last updated, linked scenarios, content preview
- Scenario linking (which scenarios can access which documents)
- Stats: Total docs, Linked, Unlinked, Type breakdown

**Rationale:**
- **Scenario-level linking**: Not every document should be available to every scenario. A fraud procedures document is relevant to Card Issues but not Balance Checks. Linking prevents AI hallucination from irrelevant context.
- **Unlinked document visibility**: Highlights documents that exist but aren't being used — potential knowledge gaps or cleanup opportunities.
- **Content preview**: Ops teams need to verify what the AI is reading without downloading and opening every file.

---

### 9. Live Monitor

**What it does:** Real-time view of all active calls being handled by AI agents.

**Features built:**
- 3-column card grid for active calls
- Visual distinction: In-progress (green glow) vs Testing (amber)
- Per-call: Member name, scenario, elapsed time, sentiment indicator
- "Listen In" button (Phase 2 — telephony integration)
- Session summary: Total Active, In Progress, Testing counts

**Rationale:**
- **Real-time confidence**: During initial deployment, supervisors will want to watch AI handle calls live. This builds trust and catches issues early.
- **Green glow on active calls**: Instantly shows what's live vs what's a test. Visual hierarchy matters when you're monitoring multiple calls.
- **Sentiment indicator on live calls**: If a live call turns negative, a supervisor can intervene before it becomes a complaint.

---

### 10. Tools (Post-Call Actions)

**What it does:** Configures what happens after a call ends — automated follow-up actions.

**Features built:**
- 3 tools: SMS Summary, Email Summary, Payoff Letter (Mail)
- Per-tool: Enable/disable toggle, scenario assignment, template configuration
- Template variables: {{member_name}}, {{summary}}, {{scenario}}
- Fulfillment partner selection (for physical mail)

**Rationale:**
- **Post-call summary (SMS/Email)**: Members forget call details. An automated summary reinforces what was discussed, reduces callback rates, and creates a paper trail.
- **Per-scenario tool assignment**: A balance check doesn't need a mailed letter. A loan payoff does. Tools should be contextual.
- **Template configurability**: Every credit union has its own brand voice. Templates need to be editable, not hardcoded.

---

### 11. Evaluations (Quality Assurance)

**What it does:** Systematic testing of agent behavior with pass/fail tracking over time.

**Features built:**
- 8 test cases across scenarios (e.g., "Fraud escalation trigger", "Account number security", "Loan rate negotiation")
- Pass/Fail status per test with expected vs actual outcome
- Pass rate trend chart (color-coded: green ≥80%, amber ≥60%, red <60%)
- 5 historical test suite runs with duration tracking
- "Run All Tests" + individual "Run" buttons
- Summary cards: Total, Passing, Failing, Pass Rate

**Rationale:**
- **Regression testing**: Every prompt change risks breaking something. Automated test suites catch regressions before they reach members.
- **Trend tracking**: A single pass rate is a snapshot. The trend shows whether quality is improving or degrading over time.
- **Specific failure visibility**: Knowing "Loan rate negotiation" fails because the AI "attempted to provide rate info before escalating" tells you exactly what to fix. Vague metrics don't.

---

## Phase 1 Summary

| Metric | Value |
|--------|-------|
| Total pages built | 10 |
| Credit union scenarios | 8 |
| AI agents configured | 3 (Voice, Chat, Multi-modal) |
| Post-call tools | 3 |
| Knowledge documents | 6 |
| Test cases | 8 |
| KPI metrics tracked | 15+ |
| Escalation trigger rules | 25+ |

---

## What Phase 1 Does NOT Include (Phase 2)

| Feature | Why Deferred |
|---------|-------------|
| **Backend API** | Phase 1 validates the UX with mock data before investing in infrastructure |
| **Telephony integration (Twilio/Vonage)** | Requires carrier agreements and compliance review |
| **Live call listening** | Depends on telephony integration |
| **Real AI responses (LLM integration)** | Backend dependency — prompts and guardrails are configured, ready to connect |
| **CRM sync** | Integration work — Phase 1 proves the standalone value first |
| **Webhook & Zelle automation** | Requires partner API access |
| **Voice callback system** | Requires telephony + scheduling infrastructure |
| **User authentication & roles** | Phase 1 is single-user demo; multi-tenant auth comes with backend |
| **Mic input in Sandbox** | Requires speech-to-text integration |

**Phase 2 rationale:** Ship the interface first. Let the credit union ops team interact with the platform, configure their agents, and validate the workflow — before wiring up the expensive backend integrations. This de-risks the build and ensures we're building the right product.

---

*Built with Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui. All data is mock but structured for direct API replacement.*
