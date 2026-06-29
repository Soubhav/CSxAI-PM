# CSxIQ — CSR Journeys

Step-by-step flows for each shipped screen. These are the intended behaviors and states the front-end build targets. Telephony is mocked (a "Demo · simulate outcome" chooser stands in for real WebRTC/PSTN).

---

## 1. Callback journey (proactive worklist) — `/csxiq/callbacks`

The dedicated queue for freshly dropped/unresolved AI calls.

1. **Queue** — CSR sees a shared pool of callbacks, each tagged **Dropped** (early hangup) or **Unresolved** (AI resolution score below threshold), with wait time, score, and attempts. (D-03)
2. **Claim** — opening a pending callback **claim-locks** it to the CSR ("Claimed by you") so two reps can't dial the same member. (D-04)
3. **Context** — the workspace shows the reusable **AI summary card**, a "why it needs a callback" callout, risk flags, and the last exchange before drop-off. (D-05)
4. **Call back (WebRTC)** — "Call back" dials the masked number; outcome is one of **Connected / No answer / Voicemail / Busy**. (D-06)
   - Not connected → attempt counter increments; retry up to 3.
   - Max attempts → **Unreachable** → offer **SMS / Email** follow-up from the platform.
5. **Live** — on Connected: running call timer, **Copilot suggestion**, notes, mute, "End & wrap up."
6. **Disposition** — **Resolved / Follow-up needed / Escalate / Wrong number**. (D-07)
7. **Write-back** — Resolved flips the original AI call `Unresolved → Resolved by callback` and writes back to CSxAI's final resolution rate. (D-08)

---

## 2. History callback journey (lookup + recover) — `/csxiq/history`

For when a CSR *remembers* a call was unresolved and wants its context, then to call back.

1. **Find** — a filterable table of every interaction, tagged by **status** (Resolved / Unresolved / Unreachable / Follow-up / Escalated) and **sentiment** (Positive / Neutral / Negative). Filter by type (All / Chat / Callback / Escalation), toggle **"Needs callback,"** or search by member. (D-16)
2. **Open** — clicking a row opens a drawer with full context: tags, "why this still needs a callback," AI summary, full transcript, CSR notes.
3. **Call back** — for any **callable** status (unresolved / unreachable / follow-up), a **Call back** button launches the same WebRTC flow inside the drawer: dial → outcome → live (timer + Copilot + notes) → end.
4. **Disposition + write-back** — Resolved flips the tag in place (`Unresolved → Resolved`) and writes back to CSxAI. (D-08)

> Callbacks (worklist) and History (record) intentionally overlap — they share callable statuses and the same dial flow. In a real build, both read from one interactions table.

---

## 3. Escalation handoff journey — `/csxiq/escalations`

The live, synchronous handoff from the CSxAI voice agent (escalation backend already built; CSxIQ adds the summary card).

1. **Waiting list** — live voice escalations with priority (Urgent / High / Normal) and trigger (fraud, member-requested human, AI unresolved after 2 attempts, etc.).
2. **Read before you join** — the **AI handoff-summary card** gives the CSR what happened + member context so the member never repeats themselves. (D-05)
3. **Accept window** — a countdown shows time left before the ticket re-routes to the next available CSR.
4. **Join** — CSR joins the live room (timer, mute, end). Member context is already loaded.

---

## 4. Home / inbox journey — `/csxiq`

The CSR's daily landing screen.

1. **Personal stats** — a thin strip: my open chats, closed today, inquiries today, avg handle time (personal, not team — D-09).
2. **Inbox** — omnichannel threads (WhatsApp / Web / Email) with unread counts and wait times.
3. **Chat window** — open a thread and reply inline.
4. **Team presence** — see who's available / busy / presenting (green / red / red-with-hyphen dots); the CSR sets their own presence from the sidebar.
