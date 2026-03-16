# CSxAI — Project Instructions & Vision

## What We're Building

**CSxAI (Customer Service x AI)** is a full-featured AI voice agent management platform
built specifically for **US Credit Unions**. The platform is modelled directly on
**Giga.ml** — a production-grade AI support platform used by companies like DoorDash —
adapted for the credit union member services context.

The goal: give credit union operations teams a single dashboard to build, configure,
test, deploy, and monitor AI voice agents that handle inbound member calls.

---

## Why Giga.ml? What We Studied

After analysing 10 screenshots of the live Giga.ml platform, here is what each screen
does and why it matters for CSxAI:

---

### Screen 1 — Dashboard ("Good morning, Patrick")
**What it does:**
- Greets the logged-in user by name with a time-based greeting
- Shows a workspace selector (e.g. "Operations") and filter pills (Chat | Last 1 week | Agent)
- Displays 4 real-time metric cards:
  - Live tickets / calls in progress
  - Resolution rate (with week-over-week delta)
  - Abandoned rate
  - Transferred (escalation) rate
- Bar chart showing total vs. resolved call volume over time
- SVG sentiment gauge — split into Happy/neutral % and Unhappy %

**What CSxAI takes from this:**
The dashboard is the command centre. Credit union managers open this every morning to
see if AI performance is healthy before the branch opens. We keep the greeting, the
filter pills, and the sentiment gauge — but swap "tickets" for "calls" and tune the
KPIs to credit union benchmarks (resolution, escalation, hours saved).

---

### Screen 2 — Agent Canvas (Policy Detail View)
**What it does:**
- Two-panel layout: left policy tree + right content area
- Left panel shows a nested tree of the agent's structure:
  - Policies → Scenarios (individual topic flows) → Supporting docs
  - Rules, Data sources, Knowledge base, APIs
  - Personalization (Identities, Phone, Conversation)
  - Session analysis config, Evaluation, Experiments, Test cases
- Right content area shows the active policy's text — editable, versioned
- Shows agent metadata: agent name, status (Live), traffic %, voice type, version number
- "Remaining memory" indicator (how much policy space is left)
- "Last locked by" — shows who last edited (team collaboration)
- Dev Mode toggle
- Test panel on the right ("Test your agent" with initialization values)

**What CSxAI takes from this:**
This is the core of the platform. Each credit union AI agent has scenarios (e.g.
"Transaction Inquiry", "Loan Status") and each scenario has its own policy text,
guardrails, and rules. The left tree gives a clear mental model. CSxAI mirrors this
exactly with a left policy tree sidebar and click-based content switching.

---

### Screen 3 — Agent Canvas (Rules / Multi-Scenario Agent)
**What it does:**
- Shows an agent with many named scenarios in the left tree:
  Beach clubs, Bell desk, Billing, Casino, Check-in, Dining, Gaming, Room requests, etc.
- Main content shows "RULES: Operating Guidelines" — a structured text block with:
  - General Communication Standards
  - Response Guidelines
  - Information Collection Protocol
- "Remaining memory: Full" — agent is at capacity for this model context
- Same locked-by / version metadata

**What CSxAI takes from this:**
Credit unions will have their own scenario list (see below). Each scenario is a named
node in the tree. The Rules section sets cross-scenario agent behaviour — tone, data
collection standards, prohibited actions. CSxAI implements this as a top-level "Rules"
node above all scenario nodes.

---

### Screen 4 — Giga.ml Company Slide (Context)
**What it tells us:**
- Founded by Stanford PhD (Gen AI) + IIT grads with HFT background
- First team to fine-tune Llama 2 with 32k token context
- Live at DoorDash — built for support scale and volume
- Funded: Y Combinator, Garry Tan, Pioneer, Nexus → $61M Series A
- Platform milestones: launched voice support, Agent Canvas, LLMs trained for CS

**Why this matters for CSxAI:**
Giga.ml is a proven, venture-backed production platform. We're not guessing at the UX —
we're learning from a platform that handles real enterprise call volume. CSxAI should
feel equally serious and production-ready, not like a demo.

---

### Screen 5 — Insights (Waterfall Chart)
**What it does:**
- Header: "Resolution Rate Improvement (Voice)"
- 4 summary metric cards:
  - Current Resolution Rate: 73.2%
  - Potential Resolution Rate: 86.6%
  - Conversations Analyzed: 4,657
  - Actionable Insights: 6
- Waterfall bar chart: starts at current rate, each bar shows how much a specific
  improvement opportunity adds, ends at potential rate
- Each bar is clickable — opens a detail panel showing:
  - What the issue is (e.g. "Repeated agent requests" — member has to repeat themselves)
  - Ticket count affected
  - Impact on resolution rate (+5.3%)
  - Recommended policy change
- Opportunity list below the chart: ranked by impact, with effort level badges

**What CSxAI takes from this:**
This is the most powerful screen. It closes the loop — not just "here's your data" but
"here's what to fix and how much it's worth". CSxAI replicates this for credit union
voice calls. Each insight ties to a credit union scenario (e.g. "Loan Status calls
end without resolution because bot can't answer payoff questions — fix: add payoff
FAQ to Knowledge base").

---

### Screen 6 — Agents List
**What it does:**
- Table view of all configured agents
- Columns: Name | Agent type | Last updated | Actions
- Agent types shown: Voice, Chat, Multi-modal
- Action on hover: "Go to sandbox ↗" link — takes you directly to test that agent
- "+ New agent" button top-right
- Pagination at bottom

**What CSxAI takes from this:**
Simple, scannable list. Credit union admins need to see all their configured voice
agents at a glance and jump into any one to edit or test. CSxAI adds a Status column
(Live / Testing / Inactive) and a Resolution Rate column so performance is visible
without drilling in.

---

### Screen 7 — Comparison Slide (Giga vs. Competitors)
**What it tells us about the product:**
Giga.ml's key technical differentiators:
- **Speculative RAG**: <100ms latency, 99% accuracy across 100k documents
- **Hallucination rate**: <0.05%
- **Agent Canvas**: Lets non-engineers edit agent policy in plain text
- **Insights**: Automatically suggests policy changes to improve KPIs
- **Live in <2 weeks**: vs. 16 weeks for Google CCAI
- **Updates in <2 min**: vs. weeks-to-months for competitors

**What CSxAI takes from this:**
The Agent Canvas (policy-tree editor) and Insights (auto-suggestions) are the two
features that make Giga special. Everything else is table stakes. CSxAI prioritises
these two surfaces above all others.

---

### Screens 8 & 9 — Create New Agent Modal
**What it does:**
- Triggered by "+ New agent" button
- Fields:
  - Name (text input)
  - Description (textarea — "Describe what your agent does")
  - Agent type selector — 3 cards: Chat | Voice | Multi-modal
  - Relevant documents — drag-and-drop file upload zone
- Buttons: Cancel | Create agent

**What CSxAI takes from this:**
New agent creation is a focused, minimal modal — not a multi-step wizard. The document
upload is key: credit unions have existing PDFs (product guides, rate sheets, policies)
that the agent should reference. CSxAI replicates this exactly.

---

### Screen 10 — Giga.ml Sidebar Navigation
**Full sidebar structure observed:**

```
ANALYTICS
  Dashboard
  Tickets
  Insights
  Billing

AGENTS
  Agent Canvas
  Shared policies
  Knowledge
  APIs
  Mobile numbers
  Intents
  Custom fields
  Code Blocks

REVIEW
  Automated QA
  Manual QA

RESOURCES
  Documentation
```

**What CSxAI takes from this:**
CSxAI adapts this sidebar for the credit union context:

```
ANALYTICS
  Dashboard
  Insights
  Call Logs

AGENTS
  Agent Canvas        ← scenarios / policy tree
  Sandbox             ← test conversations
  Knowledge           ← uploaded docs & FAQs
  Tools               ← post-call actions (SMS, email, payoff letter)

MONITOR
  Live Monitor        ← real-time active calls

REVIEW
  Call Reviews        ← QA on completed calls (Phase 2)
```

---

## Credit Union Scenarios (CSxAI Use Cases)

These are the named scenarios that will exist inside the Agent Canvas for a typical
US credit union deployment. Each scenario is a node in the policy tree.

### Core Scenarios (Phase 1 — MVP)

| Scenario ID | Scenario Name | Member Need |
|---|---|---|
| `transaction-inquiry` | Transaction Inquiry | "What's this charge on my account?" |
| `account-balance` | Account Balance | "What's my checking/savings balance?" |
| `loan-status` | Loan Status Check | "Where is my auto loan application?" |
| `payment-due` | Payment Due Date | "When is my next loan payment due?" |
| `card-issue` | Card Issue & Disputes | "My card was declined / I see a fraud charge" |
| `routing-account` | Routing & Account Numbers | "What's the routing number for a wire transfer?" |

### Extended Scenarios (Phase 2)

| Scenario ID | Scenario Name | Member Need |
|---|---|---|
| `cd-rates` | CD & Savings Rates | "What's your current CD rate for 12 months?" |
| `loan-payoff` | Loan Payoff Quote | "How much do I owe to pay off my car loan?" |
| `branch-hours` | Branch & ATM Hours | "Is the downtown branch open on Saturday?" |
| `password-reset` | Digital Banking Help | "I'm locked out of online banking" |
| `new-account` | New Account Opening | "I want to open a savings account" |
| `wire-transfer` | Wire Transfer Request | "I need to send money by wire" |
| `mortgage-inquiry` | Mortgage Inquiry | "Can I get a home equity loan?" |
| `dispute-resolution` | Dispute Resolution | "I want to dispute a charge from last month" |

### Escalation Scenarios (Always configured)

| Scenario | Transfer Type | Priority |
|---|---|---|
| Member requests human | Warm transfer | Normal |
| Fraud / suspicious activity | Priority warm | Urgent |
| Bot unresolved after 2 attempts | Warm transfer | High |
| Negative sentiment detected | Proactive warm | High |
| After-hours urgent | SMS alert to on-call | Urgent |

---

## Platform Feature Breakdown

### Feature 1: Dashboard
- Time-based greeting by user name
- Filter pills: Voice | Date range | All scenarios
- KPI cards: Calls Handled, Resolution Rate, Escalation Rate, Hours Saved
- Weekly call volume chart (Recharts bar chart)
- Sentiment gauge (SVG semicircle)
- Quick insight cards
- Call heatmap (day × hour grid)

### Feature 2: Agent Canvas
- Left policy tree sidebar:
  - CONFIGURATION: Rules, then each Scenario as a node
  - KNOWLEDGE: Uploaded documents
  - AUDIT: Version history
- Main content switches on click — no full page reload
- Each scenario node shows: System Prompt textarea, Guardrails list, Escalation config
- Top bar: agent name + version + status + "Test Agent" + "Deploy Changes" buttons
- Agent metadata: Last locked by, Remaining memory, Dev Mode toggle

### Feature 3: Insights
- AI-identified improvement opportunities per scenario
- Waterfall chart (Recharts): current → incremental gains → potential
- Clickable bars → detail modal with: impact %, effort, description, recommended fix
- Ranked opportunity list with effort badges (Low / Medium / High)

### Feature 4: Call Logs
- Full filterable table of completed calls
- Columns: Member, Scenario, Time, Duration, Status, Score, Escalated
- "View" opens side drawer:
  - Signal scores (Resolution / Sentiment / Efficiency)
  - AI call summary
  - Agent outcome (for escalated calls)
  - Full transcript (chat-bubble style)
  - Audio recording player

### Feature 5: Sandbox
- Left panel: scenario selector + prompt/guardrails config tabs
- Right panel: live text chat simulation
- Cycling mock responses per scenario
- Typing indicator, reset conversation, mic button (visual)

### Feature 6: Live Monitor
- Real-time grid of active calls (in-progress vs. testing)
- Green glow on active calls, amber on testing
- Elapsed time badge, "Listen In" button (Phase 2)
- Session summary stats at bottom

### Feature 7: Tools
- Post-call action tools: SMS Summary, Email Summary, Payoff Letter (Mail)
- Toggle enable/disable per tool
- "Used in" scenario pills
- Expandable configuration section per tool

### Feature 8: Knowledge Base (Phase 2 — from Giga sidebar)
- Upload credit union documents (PDFs, rate sheets, product guides)
- Documents are searchable and referenced by agents during calls
- Version tracking per document

---

## Design System

**Inspired by:** Giga.ml — dark, professional, production-grade
**Theme:** Full dark mode via `className="dark"` on `<html>`

**Color palette (CSS custom properties — oklch):**
```css
--background:       oklch(0.08 0.018 265)  /* near-black */
--card:             oklch(0.12 0.022 265)  /* dark card surface */
--secondary:        oklch(0.17 0.025 265)  /* elevated surface */
--primary:          oklch(0.58 0.22 285)   /* violet accent */
--border:           oklch(1 0 0 / 8%)      /* very subtle */
--muted-foreground: oklch(0.58 0.03 258)   /* muted gray text */
```

**Status colors:**
- Active / success: `text-emerald-400`, `bg-emerald-500/10`
- Testing / warning: `text-amber-400`, `bg-amber-500/10`
- Escalation / danger: `text-red-400`, `bg-red-500/10`
- Primary / active: `text-primary`, `bg-primary/15`

**Component patterns:**
- Cards: `bg-card border border-border rounded-xl`
- Badges: `bg-[color]/10 text-[color]-400 border-[color]/25 rounded-full px-2.5 py-0.5 text-xs font-medium`
- Tables: header `bg-secondary/40`, rows `hover:bg-accent/30`
- Inputs: `bg-secondary border border-border focus:ring-2 focus:ring-primary/50`
- Agent type badge colors:
  - Voice: teal (`bg-teal-500/15 text-teal-400 border-teal-500/25`)
  - Chat: blue (`bg-blue-500/15 text-blue-400 border-blue-500/25`)
  - Multi-modal: violet (`bg-violet-500/15 text-violet-400 border-violet-500/25`)

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, TypeScript) | Same as VoiceIQ — proven setup |
| Styling | Tailwind CSS v4 + shadcn/ui | Dark theme + ready-made components |
| Charts | Recharts | Bar charts, sentiment gauge, waterfall |
| Icons | lucide-react | Consistent icon set |
| Data | Mock data (lib/mock-data.ts) | Structured for easy API replacement |
| State | React useState / Context | No over-engineering |

---

## Folder Structure (Target)

```
CSxAI/
└── frontend/
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── page.tsx                    # Dashboard
        │   ├── insights/page.tsx           # Insights + waterfall
        │   ├── call-logs/page.tsx          # Call log table + drawer
        │   ├── scenarios/
        │   │   ├── page.tsx                # Agents list
        │   │   └── [id]/page.tsx           # Agent Canvas
        │   ├── sandbox/page.tsx
        │   ├── live-monitor/page.tsx
        │   └── tools/page.tsx
        ├── components/
        │   └── Sidebar.tsx
        └── lib/
            └── mock-data.ts
```

---

## Branding

- **Platform name:** CSxAI
- **Tagline:** AI-Powered Member Services for Credit Unions
- **Logo icon:** Headphones (representing voice + service)
- **Organisation shown:** Lakeside Credit Union (demo tenant)
- **User shown:** Sarah Chen, Admin

---

## Build Phases

### Phase 1 — MVP (Build now)
- All 7 sidebar sections (Dashboard, Insights, Call Logs, Agent Canvas, Sandbox, Live Monitor, Tools)
- 6 core credit union scenarios
- Full dark Giga.ml design system
- Mock data for all screens

### Phase 2 — Extended
- Knowledge Base (document upload + search)
- Automated QA (call scoring)
- Real telephony integration (Twilio / Vapi)
- Live agent screen-pop on escalation
- Live listening in monitor

### Phase 3 — Production
- Real LLM agent backend (Claude claude-haiku-4-5-20251001 for cost, claude-sonnet-4-6 for quality)
- RAG pipeline over credit union knowledge docs
- Multi-tenant support (multiple credit unions)
- Role-based access (Admin, Supervisor, Analyst)
