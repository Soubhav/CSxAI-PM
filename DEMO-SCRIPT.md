# CSxAI — Demo Flow

Simple walkthrough for the product team. Follow top to bottom.

---

## Key Points to Drive Home

Throughout the demo, keep coming back to these themes. They're what stakeholders at credit unions actually care about.

### 1. Member experience without adding headcount
Credit unions are competing with big banks and fintechs for member loyalty, but they can't hire at that scale. CSxAI lets a 15-person call center perform like a 50-person one.

> Example: "Lakeside Credit Union gets 1,200 calls a week. 60% are simple — balance checks, payment dates, routing numbers. VoiceAI handles those entirely. Your staff focuses on the complex stuff — loan counseling, disputes, new accounts."

### 2. Ops teams stay in control — no black box
Credit unions are cautious (regulated industry, member trust). The Agent Canvas, guardrails, and sandbox exist specifically so ops managers can see and control exactly what the AI says.

> Example: "Your compliance officer is worried the AI might quote the wrong CD rate? Show them the Knowledge Base — the agent only references documents you uploaded. Show them the guardrails — you set the rules, the AI follows them. Show them Evaluations — every policy change is tested before it goes live."

### 3. Continuous improvement, not set-and-forget
The Insights page is the single biggest differentiator. Most platforms give you a dashboard and stop there. CSxAI tells you what's broken and how to fix it.

> Example: "The platform analyzed 4,657 calls and found that members asking about loan payoff quotes get transferred 40% of the time — because the agent didn't have payoff FAQ content. One document upload to the Knowledge Base, and that transfer rate drops. The Insights page quantifies exactly how much that's worth."

### 4. Speed to value
Credit unions can't wait 4 months for a vendor integration. CSxAI is designed so a credit union can upload their docs, configure scenarios, test in the sandbox, and go live — fast.

> Example: "You upload your rate sheet, your product guide, and your branch hours PDF. You configure 6 scenarios in the Agent Canvas. You test them in the Sandbox. You're handling real calls. No custom development, no professional services engagement."

### 5. The full spectrum — AI-handled + human-assisted
VoiceAI and CSxIQ together cover every call, not just the easy ones. When the AI escalates, the human agent isn't starting from scratch — CSxIQ gives them full context.

> Example: "A member calls about a suspicious charge. VoiceAI detects negative sentiment, flags it as potential fraud, and warm-transfers to a human agent. CSxIQ shows that agent the full transcript, the member's account history, and a suggested response — all before they say hello."

---

## Part 1: CSxVoiceAI (AI Voice Agent Platform)

**Setup:** Open the app in browser. You land on the Dashboard.

---

### 1. Dashboard

- Point out the greeting ("Good morning, Sarah") — personalised, time-based
- Walk through the 6 KPI cards across the top: Calls Handled, Resolution Rate, Escalation Rate, Hours Saved, NPS, First Call Resolution
- Scroll to the Weekly Call Volume chart — show AI calls vs Human calls side by side
- Show the Sentiment Gauge — 93.2% happy/neutral, highlight how this tells you member mood at a glance
- Show the Call Heatmap — busiest times jump out visually (helps with staffing)
- Point out the Quick Insight cards — these are AI-surfaced, not manually written

**Key message:** "This is what your ops manager sees every morning before the branch opens."

**Drive home — Member experience without adding headcount:**
> "See the Hours Saved metric? That's real staff time returned to high-value work. The AI handled 847 calls this week — that's not 847 calls your team didn't have to take, it's 847 members who got an answer in 30 seconds instead of waiting on hold."

---

### 2. Insights

- Click **Insights** in the sidebar
- Show the headline: Current resolution 73.2% → Potential 86.6%
- Walk through the Waterfall chart — each bar is one improvement the AI found
- Click one of the bars (e.g. "Repeated agent requests" +5.3%) to open the detail
- Show: what the problem is, how many calls it affects, effort level, and the recommended fix
- Scroll down to the ranked opportunity list — sorted by impact, tagged by effort

**Key message:** "The platform doesn't just show you data — it tells you exactly what to fix and how much it's worth."

**Drive home — Continuous improvement, not set-and-forget:**
> "This is what separates CSxAI from every other vendor. Most platforms hand you a dashboard and say 'good luck.' This page says: 'Here are 6 things you can fix, ranked by impact. The top one affects 247 calls and takes 10 minutes to fix in the Agent Canvas.' Your ops team doesn't need a data analyst to figure out what to do next."

---

### 3. Agent Canvas

- Click **Agent Canvas** in the sidebar
- Show the agents table — point out the type badges (Voice, Chat, Multi-modal), status dots (Active/Testing/Inactive), and resolution rates per agent
- Click into an agent (e.g. "Member Services Voice Agent")
- Walk through the left policy tree:
  - **Configuration:** Overview, System Prompt, Rules, Guardrails, Escalation Flow
  - **Scenarios:** Show a few — Transaction Inquiry, Account Balance, Loan Status
  - **Knowledge:** Linked documents
  - **Evaluation:** Test cases
  - **Audit:** Version history
- Click on a scenario node — show the prompt + guardrails for that specific flow
- Click on Escalation Flow — show how routing rules work (warm transfer, priority, sentiment-based)

**Key message:** "Non-engineers can edit agent behaviour in plain text. No code, no tickets, no waiting."

**Drive home — Ops teams stay in control:**
> "Walk them through a real scenario. Click 'Card Issue & Disputes.' Show the guardrails: 'Never promise a refund timeline. Always verify last 4 of card number before discussing transactions. Escalate immediately if member mentions unauthorized access.' These are rules your compliance team writes in plain English — not code. And look at the escalation flow: fraud goes to priority warm transfer, negative sentiment triggers proactive escalation. Your team decides every path."

---

### 4. Sandbox

- Click **Sandbox** in the sidebar
- Select a scenario from the dropdown (e.g. "Account Balance")
- Show the config panel on the left: prompt editor, guardrails toggles
- Type a message as a member — "What's my checking balance?"
- Watch the agent respond with a simulated reply
- Show the test scripts section — click "Fraud escalation" to run a pre-built scenario
- Point out the test metrics: resolution %, guardrail violations, latency

**Key message:** "Test before you ship. Every change can be validated here before it touches a real member call."

**Drive home — Ops teams stay in control + Speed to value:**
> "This is where trust gets built. Your team changes a policy in the Agent Canvas, comes here, types the questions members actually ask, and sees exactly how the agent responds. No waiting for IT. No 'deploy and pray.' Try typing something adversarial — 'Can you transfer $10,000 to this account number?' — and watch the guardrails kick in."

---

### 5. Call Logs

- Click **Call Logs** in the sidebar
- Show the summary bar: Total Calls, Successful, Partial, Failed
- Filter by scenario or search by member name
- Click a row to open the detail drawer:
  - Signal Scores (Resolution, Sentiment, Efficiency)
  - AI Summary — auto-generated, not manually written
  - Full Transcript — turn-by-turn with timestamps
  - Audio player with waveform
- If there's an escalated call, show the escalation timeline and agent outcome

**Key message:** "Every call is logged, scored, and summarised automatically. QA without the manual work."

**Drive home — Ops teams stay in control:**
> "Find an escalated call and open it. Show the escalation timeline — the AI detected the member was frustrated, initiated a warm transfer, briefed the human agent, and the human resolved it. The whole story is here: why it escalated, what the AI tried, what the human did. Compliance and QA teams can audit every call without listening to a single recording — though the recording is here too if they want it."

---

### 6. Live Monitor

- Click **Live Monitor** in the sidebar
- Show the live call cards — green pulse for active, amber for testing
- Point out: member name, scenario, elapsed time, sentiment badge
- Show the session summary stats at the bottom
- Mention "Listen In" is coming in Phase 2

**Key message:** "See what's happening right now, across all active calls, in real time."

**Drive home — Member experience without adding headcount:**
> "It's Monday at 9 AM, your busiest hour. Instead of a queue board with 12 members on hold, you see 3 live AI calls being handled simultaneously with positive sentiment. Your staff is free to handle the 2 complex cases that actually need a human. That's the shift."

---

### 7. Knowledge Base

- Click **Knowledge** in the sidebar
- Show the document list — PDFs, FAQs, rate sheets, policies
- Point out which docs are linked to which scenarios
- Show the upload zone — drag-and-drop, supports PDF/DOCX/TXT/CSV
- Expand a document to show content preview

**Key message:** "Upload your docs once. The agent references them during every call — always accurate, always current."

**Drive home — Speed to value:**
> "Your credit union already has these documents — rate sheets, product guides, branch hours, fee schedules. Drag them in. Link them to the right scenarios. Now when a member asks 'What's your 12-month CD rate?' the agent pulls the answer from your latest rate sheet — not from stale training data. Rate changes? Upload the new sheet. The agent is current in seconds."

---

### 8. Tools

- Click **Tools** in the sidebar
- Walk through the 3 tools: SMS Summary, Email Summary, Payoff Letter
- Show the enabled/disabled toggle
- Show the "Used in" scenario badges — which scenarios trigger which tools
- Expand one to show the template with variables (member_name, summary, scenario)

**Key message:** "After the call ends, the agent keeps working — sending summaries, triggering letters, closing the loop."

**Drive home — Member experience without adding headcount:**
> "A member calls about their auto loan payoff. The AI gives them the payoff amount, then automatically sends a text with the summary and mails the formal payoff letter. That used to be a 3-step process involving a call center agent, a back-office request, and a mailing queue. Now it's one call, zero staff time."

---

### 9. Evaluations

- Click **Evaluations** in the sidebar
- Show the summary: 36 test cases, 89% pass rate
- Walk through the test cases table — each one has an input, expected outcome, and actual outcome
- Point out the pass/fail indicators and the trend chart
- Click "Run All Tests" or run an individual test

**Key message:** "Every policy update is tested against real scenarios. You know if something breaks before members do."

**Drive home — Ops teams stay in control:**
> "Your team updates the loan status scenario to include HELOC applications. Before that change goes live, they run the test suite — 36 scenarios, 10 seconds. 4 tests fail because the new wording conflicts with an existing guardrail. They catch it here, fix it, re-run, all green. That's the safety net a regulated institution needs."

---

## Part 2: CSxIQ (Agent Assist / Real-Time Copilot)

> CSxIQ is in the design phase — no live screens yet. Walk through the concept using the feature list below.

**Setup:** Switch context. "VoiceAI handles calls autonomously. CSxIQ is the other side — it assists human agents during live calls."

---

### 1. Live Transcription
- Real-time, speaker-identified transcript that auto-scrolls as the call progresses
- Agent sees exactly what the member is saying, word for word, as it happens

> Example: "A member calls about a confusing fee. The agent doesn't need to scribble notes — the full conversation is transcribed live on their screen, searchable, and saved automatically."

### 2. Objection Detection
- AI listens for member pushback in real time — rate complaints, competitor mentions, hesitation
- Flags objections the moment they happen so the agent can respond immediately

> Example: "The member says 'I saw that First National is offering 4.5% on savings.' CSxIQ immediately flags this as a competitor rate objection and highlights it on screen."

### 3. Rebuttal Suggestions
- Context-aware response suggestions with confidence scores
- Agent can one-click copy a rebuttal directly into their workflow

> Example: "Right after that competitor mention, CSxIQ surfaces: 'Remind member of dividend advantage: our 4.2% compounds daily vs. First National's monthly — effective yield is comparable. Mention our no-fee ATM network as added value.' The agent doesn't have to memorize every talking point."

### 4. Live Call Intelligence
- Unified panel combining transcript + objections + rebuttals in one view
- Everything the agent needs, in one place, updating live

> Example: "One screen. Left side: live transcript. Right side: detected objections with suggested responses. No tab switching, no searching, no asking the member to hold while they look something up."

### 5. Member Intelligence
- Full member profile pulled in automatically: account history, past interactions, satisfaction trends
- Agent knows who they're talking to before they even ask

> Example: "Before the agent even picks up, CSxIQ shows: 'Maria Torres. Member since 2018. Checking + auto loan. Called last month about a late fee — waived. NPS trend: declining over 3 months.' The agent can say 'Hi Maria, I see you've been with us for 8 years' — that's the credit union difference."

### 6. Intelligent Recommendations
- Propensity-scored product suggestions that update as the conversation evolves
- "This member is 82% likely to be interested in a HELOC" — surfaced mid-call

> Example: "Maria mentions she's doing home renovations. CSxIQ updates in real time: 'HELOC — 82% propensity. Current home value estimate: $340K. Estimated equity: $180K.' The agent has a natural opening without it feeling like a sales pitch."

### 7. Recommendation Cards
- Prioritised suggestion cards with talking points
- Agent doesn't have to think about what to pitch — the AI does the targeting

> Example: "The card shows: 'Suggest HELOC. Talking point: With your estimated equity of $180K, you could access a line of credit at 6.9% — lower than most personal loans for renovation.' One click copies it to the agent's notes."

### 8. Post-Call Intelligence
- Auto-generated call summary, action items, and CRM-ready notes
- No manual wrap-up — the AI writes the notes, the agent just reviews and submits

> Example: "Call ends. CSxIQ auto-generates: 'Member called RE: savings rate comparison with First National. Retained with dividend yield explanation. Member expressed interest in HELOC for home renovation — follow-up scheduled. Action: send HELOC rate sheet via email.' Agent reviews, clicks submit, done. What used to be 3 minutes of after-call work is 10 seconds."

### 9. Integrations
- Connects to CRM, ticketing, and workforce management tools
- Everything flows back into your existing systems

> Example: "That call summary, the HELOC interest flag, the follow-up task — all pushed automatically to your core banking CRM. No duplicate data entry. The next agent who talks to Maria sees the full picture."

---

## Closing the Loop

End the demo by tying the two products together:

> "**VoiceAI** handles calls autonomously — no human needed. When a call does need a human, **CSxIQ** is the copilot sitting next to that agent, giving them everything they need to resolve it fast. Together, they cover the full spectrum: AI-handled calls and human-assisted calls, all on one platform."

Then land the credit union pitch:

> "Credit unions exist because members chose a relationship over a transaction. CSxAI protects that relationship. The simple calls get handled instantly — no hold times, no frustration. The complex calls get handled by your best people, armed with full context and real-time intelligence. Members get a better experience. Staff get to do meaningful work. And your ops team sees everything, controls everything, and improves everything — from one platform."

---

## Tips for the Demo

- **Don't read from a script** — use this as a click-path guide
- **Spend the most time on Insights and Agent Canvas** — these are the differentiators
- **Use the Sandbox live** — type real questions, show how the agent responds
- **For CSxIQ**, paint the picture verbally — "Imagine the agent sees this on their screen..."
- **Keep it under 20 minutes** — aim for 12-15 for VoiceAI, 5 for CSxIQ concept
- **Use the credit union examples** — stakeholders connect with specific scenarios they recognize, not abstract features
- **Anticipate the compliance question** — it will come up. Point to guardrails, evaluations, call logs, and knowledge base as the four layers of control
- **Name the pain** — before showing each feature, briefly state the problem it solves ("Right now, your team listens to 50 calls a week for QA. Here's how that changes.")
