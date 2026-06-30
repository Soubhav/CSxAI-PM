// ─── CSxIQ — CSR-facing portal mock data ──────────────────────────────
// Sector-neutral in logic; Lakeside Credit Union flavored on screen.

export type Channel = 'voice' | 'whatsapp' | 'web' | 'email'
// Presence: green = active, red = busy, yellow = AFK (away from keyboard).
export type PresenceStatus = 'available' | 'busy' | 'away'

// ─── Callbacks ────────────────────────────────────────────────────────
// Two triggers: "dropped" (early hangup) and "unresolved" (AI resolution
// score below threshold). CSRs pull from a shared pool and claim-lock.

export type CallbackReason = 'dropped' | 'unresolved'
export type CallbackStatus = 'pending' | 'claimed' | 'resolved' | 'unreachable'

export interface CallbackContext {
  memberSince: string
  accountType: string
  lastInteraction: string
  riskFlags: string[]
}

export interface Callback {
  id: string
  contactName: string
  phoneMasked: string
  reason: CallbackReason
  scenario: string          // original AI call topic
  resolutionScore: number   // AI's self-scored resolution (0-100)
  droppedAt: string         // ISO
  waitedMinutes: number     // how long it's been in queue
  aiSummary: string         // short handoff summary (reused card)
  whyUnresolved: string
  transcriptSnippet: { speaker: 'agent' | 'member'; text: string }[]
  attempts: number
  status: CallbackStatus
  claimedBy: string | null
  context: CallbackContext
  copilotSuggestion: string
}

export const RESOLUTION_THRESHOLD = 70 // below this → tagged "unresolved"

export const CALLBACKS: Callback[] = [
  {
    id: 'cb-001',
    contactName: 'Marcus Bell',
    phoneMasked: '(•••) •••-4821',
    reason: 'unresolved',
    scenario: 'Loan Status Check',
    resolutionScore: 38,
    droppedAt: '2026-06-29T09:12:00',
    waitedMinutes: 47,
    aiSummary:
      'Member called to check the status of an auto loan application submitted last week. The agent could not locate the application by phone number and the member did not have a reference number. Member grew frustrated; call ended without resolution.',
    whyUnresolved:
      'AI could not match the application to the member’s profile. Needs a human to look up by SSN/DOB and confirm underwriting status.',
    transcriptSnippet: [
      { speaker: 'member', text: 'I applied for an auto loan last Tuesday and I haven’t heard anything.' },
      { speaker: 'agent', text: 'I’m not finding an application linked to this number. Do you have a reference number?' },
      { speaker: 'member', text: 'No, nobody gave me one. This is ridiculous.' },
    ],
    attempts: 0,
    status: 'pending',
    claimedBy: null,
    context: {
      memberSince: '2019',
      accountType: 'Checking + Auto Loan (pending)',
      lastInteraction: 'Branch visit — 8 days ago',
      riskFlags: ['Negative sentiment'],
    },
    copilotSuggestion:
      'Look up application by SSN in the LOS. If in underwriting, give expected decision date (typically 3–5 business days) and offer to set an SMS status alert.',
  },
  {
    id: 'cb-002',
    contactName: 'Elena Rodriguez',
    phoneMasked: '(•••) •••-7390',
    reason: 'dropped',
    scenario: 'Card Issue & Disputes',
    resolutionScore: 12,
    droppedAt: '2026-06-29T09:34:00',
    waitedMinutes: 25,
    aiSummary:
      'Member called about a declined card while traveling. Call disconnected ~40 seconds in, before the agent could verify identity or the merchant. No resolution captured.',
    whyUnresolved:
      'Call dropped early (likely poor signal while traveling). Member’s issue is unaddressed and may be time-sensitive (card declined).',
    transcriptSnippet: [
      { speaker: 'member', text: 'My card just got declined at a gas station and I —' },
      { speaker: 'agent', text: 'I can help with that. To verify your identity, can you confirm—' },
      { speaker: 'member', text: '[call disconnected]' },
    ],
    attempts: 1,
    status: 'pending',
    claimedBy: null,
    context: {
      memberSince: '2021',
      accountType: 'Checking + Rewards Card',
      lastInteraction: 'Card declined alert — 22 min ago',
      riskFlags: ['Possible travel block', 'Time-sensitive'],
    },
    copilotSuggestion:
      'Check for a travel/fraud hold on the rewards card. If a precautionary block, verify identity and lift it. Confirm recent declined transaction location.',
  },
  {
    id: 'cb-003',
    contactName: 'Priya Nair',
    phoneMasked: '(•••) •••-1185',
    reason: 'unresolved',
    scenario: 'Wire Transfer Request',
    resolutionScore: 55,
    droppedAt: '2026-06-29T08:58:00',
    waitedMinutes: 61,
    aiSummary:
      'Member wanted to send a same-day wire to a title company for a home closing. Agent explained the cutoff time but could not initiate the wire (requires dual control + identity step-up). Member needs a callback to complete before the 2pm cutoff.',
    whyUnresolved:
      'Wire initiation is out of scope for the AI agent (requires human dual-control). Deadline-sensitive — closing today.',
    transcriptSnippet: [
      { speaker: 'member', text: 'I need to wire $40,000 to my title company before closing this afternoon.' },
      { speaker: 'agent', text: 'Wires over the phone need a specialist to verify and approve. Let me arrange a callback.' },
      { speaker: 'member', text: 'Okay but please hurry, closing is at 3.' },
    ],
    attempts: 0,
    status: 'pending',
    claimedBy: null,
    context: {
      memberSince: '2016',
      accountType: 'Checking + Savings + Mortgage',
      lastInteraction: 'Mortgage funding — yesterday',
      riskFlags: ['High value', 'Deadline today'],
    },
    copilotSuggestion:
      'High-value same-day wire. Verify identity with step-up, confirm beneficiary (title company) details against closing docs, route through dual-control approval. Cutoff 2:00pm.',
  },
  {
    id: 'cb-004',
    contactName: 'David Okafor',
    phoneMasked: '(•••) •••-9042',
    reason: 'unresolved',
    scenario: 'Digital Banking Help',
    resolutionScore: 61,
    droppedAt: '2026-06-29T07:41:00',
    waitedMinutes: 138,
    aiSummary:
      'Member locked out of online banking after multiple failed logins. Agent walked through self-service reset but the reset email never arrived (likely outdated email on file). Member could not complete reset.',
    whyUnresolved:
      'Reset email bouncing — email on file appears stale. Requires human to verify identity and update contact info.',
    transcriptSnippet: [
      { speaker: 'member', text: 'I never got the reset email. I’ve checked spam too.' },
      { speaker: 'agent', text: 'The email on file may be outdated. A representative will need to verify and update it.' },
    ],
    attempts: 2,
    status: 'unreachable',
    claimedBy: 'Maya Patel',
    context: {
      memberSince: '2020',
      accountType: 'Checking',
      lastInteraction: 'Failed login x4 — this morning',
      riskFlags: ['Stale contact info'],
    },
    copilotSuggestion:
      'Verify identity via KBA. Update email on file, then trigger a fresh password reset. Offer to enable passkey login to prevent repeat lockouts.',
  },
  {
    id: 'cb-005',
    contactName: 'Sandra Whitfield',
    phoneMasked: '(•••) •••-3318',
    reason: 'dropped',
    scenario: 'Payment Due Date',
    resolutionScore: 20,
    droppedAt: '2026-06-29T09:50:00',
    waitedMinutes: 9,
    aiSummary:
      'Member asked when the next loan payment is due. Call dropped during identity verification. Simple inquiry — likely a quick resolution on callback.',
    whyUnresolved: 'Dropped before identity verification completed. Low-complexity inquiry.',
    transcriptSnippet: [
      { speaker: 'member', text: 'When’s my next car payment due, and can I push it a week?' },
      { speaker: 'agent', text: 'Happy to check. First, can you verify the last four of your—' },
      { speaker: 'member', text: '[call disconnected]' },
    ],
    attempts: 0,
    status: 'pending',
    claimedBy: null,
    context: {
      memberSince: '2022',
      accountType: 'Auto Loan',
      lastInteraction: 'Payment reminder SMS — 2 days ago',
      riskFlags: [],
    },
    copilotSuggestion:
      'Confirm next due date and amount. Member hinted at a deferral — check eligibility for a one-time payment extension and explain any impact.',
  },
]

// ─── Chat inbox (CSR Home) ────────────────────────────────────────────

export interface ChatMessage {
  from: 'member' | 'csr'
  text: string
  time: string
}

export interface ChatThread {
  id: string
  contactName: string
  channel: Channel
  preview: string
  unread: number
  waitingMinutes: number
  messages: ChatMessage[]
  // AI Assist Copilot: suggestion pulled from the Knowledge Base for this query.
  copilotSuggestion?: string
  copilotSource?: string
}

export const CHAT_THREADS: ChatThread[] = [
  {
    id: 'ch-001',
    contactName: 'Tomás García',
    channel: 'whatsapp',
    preview: 'So the wire didn’t go through?',
    unread: 2,
    waitingMinutes: 3,
    messages: [
      { from: 'member', text: 'Hi, I tried sending a wire this morning but it’s still pending.', time: '10:02 AM' },
      { from: 'csr', text: 'Hi Tomás — let me check that for you. One moment.', time: '10:03 AM' },
      { from: 'member', text: 'So the wire didn’t go through?', time: '10:05 AM' },
    ],
    copilotSuggestion:
      'Domestic wires submitted before the 2:00pm CT cutoff post same business day; those after cutoff post the next business day. Ask Tomás for the wire reference number to confirm status, and reassure him no duplicate will be sent.',
    copilotSource: 'Wire Transfer SOP · v3 — §2 Cutoff Times',
  },
  {
    id: 'ch-002',
    contactName: 'Rachel Kim',
    channel: 'web',
    preview: 'What documents do I need to open a savings account?',
    unread: 1,
    waitingMinutes: 1,
    messages: [
      { from: 'member', text: 'What documents do I need to open a savings account?', time: '10:06 AM' },
    ],
    copilotSuggestion:
      'To open a savings account a member needs: a government-issued photo ID, their SSN or ITIN, proof of address dated within 60 days, and a $5 minimum opening deposit. Membership also requires eligibility (residency or employer). Offer the online application link.',
    copilotSource: 'Account Opening Checklist · §1 New Savings',
  },
  {
    id: 'ch-003',
    contactName: 'James Patterson',
    channel: 'email',
    preview: 'Re: Dispute on June 18 charge',
    unread: 0,
    waitingMinutes: 24,
    messages: [
      { from: 'member', text: 'I’m disputing a $89.99 charge from June 18 — I never authorized it.', time: '9:42 AM' },
      { from: 'csr', text: 'Thanks James. I’ve opened a dispute case and provisionally credited the amount while we investigate.', time: '9:55 AM' },
    ],
    copilotSuggestion:
      'Reg E gives the member provisional credit within 10 business days and the investigation up to 45 days. Confirm the dispute case number, set expectations on the timeline, and let James know he won’t be liable for the disputed amount while it’s investigated.',
    copilotSource: 'Card Disputes SOP · §4 Reg E Timelines',
  },
  {
    id: 'ch-004',
    contactName: 'Aisha Mohammed',
    channel: 'whatsapp',
    preview: 'Great, thank you so much!',
    unread: 0,
    waitingMinutes: 0,
    messages: [
      { from: 'member', text: 'Is the downtown branch open Saturday?', time: '9:30 AM' },
      { from: 'csr', text: 'Yes — downtown is open Saturdays 9am–1pm.', time: '9:31 AM' },
      { from: 'member', text: 'Great, thank you so much!', time: '9:32 AM' },
    ],
    copilotSuggestion:
      'Downtown branch Saturday hours are 9:00am–1:00pm. Drive-thru opens 8:30am. All other branches are closed Saturdays. ATMs are available 24/7.',
    copilotSource: 'Branch & ATM Hours · Downtown',
  },
]

// ─── Live escalations (handoff from CSxAI voice agent) ────────────────

export interface Escalation {
  id: string
  contactName: string
  scenario: string
  channel: 'voice'
  waitingSeconds: number
  acceptWindowSeconds: number
  priority: 'normal' | 'high' | 'urgent'
  trigger: string
  aiSummary: string
  context: { memberSince: string; accountType: string; sentiment: string }
  liveTranscript: { speaker: 'agent' | 'member'; text: string }[]
}

export const ESCALATIONS: Escalation[] = [
  {
    id: 'esc-001',
    contactName: 'Gregory Hale',
    scenario: 'Card Issue & Disputes',
    channel: 'voice',
    waitingSeconds: 12,
    acceptWindowSeconds: 28,
    priority: 'urgent',
    trigger: 'Fraud / suspicious activity detected',
    aiSummary:
      'Member reports two charges he doesn’t recognize ($420 and $380) from an out-of-state electronics retailer this morning. Identity verified by the agent. Member is anxious and wants the card frozen immediately.',
    context: { memberSince: '2015', accountType: 'Checking + Credit Card', sentiment: 'Negative — anxious' },
    liveTranscript: [
      { speaker: 'member', text: 'There are two charges I never made, almost $800 total!' },
      { speaker: 'agent', text: 'I understand. I’ve verified your identity and I’m connecting you to a specialist now.' },
    ],
  },
  {
    id: 'esc-002',
    contactName: 'Linda Choi',
    scenario: 'Loan Payoff Quote',
    channel: 'voice',
    waitingSeconds: 4,
    acceptWindowSeconds: 28,
    priority: 'high',
    trigger: 'Member explicitly requested a human',
    aiSummary:
      'Member wants an exact auto-loan payoff figure good through end of month, including a per-diem. Agent provided the current balance but the member asked to speak with a person to confirm the payoff letter process.',
    context: { memberSince: '2018', accountType: 'Auto Loan', sentiment: 'Neutral' },
    liveTranscript: [
      { speaker: 'member', text: 'Can I just talk to a real person about the payoff letter?' },
      { speaker: 'agent', text: 'Of course — connecting you with a representative now.' },
    ],
  },
  {
    id: 'esc-003',
    contactName: 'Robert Tan',
    scenario: 'Mortgage Inquiry',
    channel: 'voice',
    waitingSeconds: 31,
    acceptWindowSeconds: 28,
    priority: 'normal',
    trigger: 'AI unresolved after 2 attempts',
    aiSummary:
      'Member is exploring a home-equity line and asked about rates and draw limits. The agent answered general rate questions but the member’s scenario (rental property as collateral) falls outside the configured policy.',
    context: { memberSince: '2017', accountType: 'Mortgage + Savings', sentiment: 'Positive' },
    liveTranscript: [
      { speaker: 'member', text: 'It’s for a rental property I own — does that change the rate?' },
      { speaker: 'agent', text: 'That’s a specialized scenario. Let me bring in a mortgage representative.' },
    ],
  },
]

// ─── CSR personal stats (Home strip) ──────────────────────────────────

export const CSR_STATS = {
  openChats: 3,
  closedToday: 14,
  inquiriesToday: 22,
  avgHandleMinutes: 6.4,
}

// ─── Team / CSR roster (used by Home presence + Admin portal) ─────────

export type CsrRole = 'CSR' | 'Senior CSR' | 'Team Lead' | 'Admin'

export interface CSR {
  id: string
  name: string
  role: CsrRole
  email: string
  status: PresenceStatus
  activeCount: number
  onboardedAt: string        // ISO date
  callsToday: number
  queriesResolved: number    // today
  avgHandleMinutes: number
  csat: number               // 0–5
  tenure: string             // human-readable
  bio: string
}

export const CSRS: CSR[] = [
  {
    id: 'csr-01', name: 'Maya Patel', role: 'CSR', email: 'maya.patel@lakesidecu.org',
    status: 'available', activeCount: 1, onboardedAt: '2024-08-12', callsToday: 18, queriesResolved: 14,
    avgHandleMinutes: 6.4, csat: 4.7, tenure: '1 yr 10 mo',
    bio: 'Frontline CSR on the deposits & cards desk. Strongest on dispute handling and digital-banking support. Bilingual (EN/ES).',
  },
  {
    id: 'csr-02', name: 'Devon Brooks', role: 'CSR', email: 'devon.brooks@lakesidecu.org',
    status: 'busy', activeCount: 3, onboardedAt: '2025-01-20', callsToday: 22, queriesResolved: 17,
    avgHandleMinutes: 5.1, csat: 4.5, tenure: '1 yr 5 mo',
    bio: 'High-volume chat specialist. Fastest average handle time on the team. Focus area: account servicing.',
  },
  {
    id: 'csr-03', name: 'Sofia Alvarez', role: 'Senior CSR', email: 'sofia.alvarez@lakesidecu.org',
    status: 'away', activeCount: 0, onboardedAt: '2023-03-06', callsToday: 11, queriesResolved: 10,
    avgHandleMinutes: 7.8, csat: 4.9, tenure: '3 yr 3 mo',
    bio: 'Senior CSR and fraud point-person. Handles escalations and mentors new hires. Certified in BSA/AML basics.',
  },
  {
    id: 'csr-04', name: 'Liam Connor', role: 'CSR', email: 'liam.connor@lakesidecu.org',
    status: 'available', activeCount: 0, onboardedAt: '2026-05-02', callsToday: 9, queriesResolved: 6,
    avgHandleMinutes: 8.9, csat: 4.3, tenure: '1 mo',
    bio: 'Newest hire, ramping on the lending desk. Currently shadowing for wire and payoff scenarios.',
  },
  {
    id: 'csr-05', name: 'Nina Powell', role: 'Team Lead', email: 'nina.powell@lakesidecu.org',
    status: 'busy', activeCount: 2, onboardedAt: '2022-06-15', callsToday: 7, queriesResolved: 7,
    avgHandleMinutes: 9.5, csat: 4.8, tenure: '4 yr',
    bio: 'Team lead for member support. Owns scheduling, QA reviews, and escalation routing. Approves wires and refunds.',
  },
]

// Convenience alias for the Home presence panel.
export const TEAM = CSRS

// ─── Admin metrics (derived) ──────────────────────────────────────────

export const ADMIN_METRICS = {
  csrsOnboarded: CSRS.length,
  activeNow: CSRS.filter((c) => c.status === 'available').length,
  callsToday: CSRS.reduce((n, c) => n + c.callsToday, 0),
  queriesResolvedToday: CSRS.reduce((n, c) => n + c.queriesResolved, 0),
  avgCsat: +(CSRS.reduce((n, c) => n + c.csat, 0) / CSRS.length).toFixed(1),
  // 7-day history glimpse (calls handled, queries resolved)
  history: [
    { day: 'Mon', calls: 142, resolved: 121 },
    { day: 'Tue', calls: 168, resolved: 149 },
    { day: 'Wed', calls: 151, resolved: 133 },
    { day: 'Thu', calls: 174, resolved: 158 },
    { day: 'Fri', calls: 189, resolved: 170 },
    { day: 'Sat', calls: 96, resolved: 88 },
    { day: 'Today', calls: 67, resolved: 54 },
  ],
}

// ─── Knowledge Base (SOPs / policies the Copilot retrieves from) ──────

export type KbDocType = 'SOP' | 'Policy' | 'FAQ' | 'Product'
export type KbDocStatus = 'indexed' | 'processing'

export interface KbDoc {
  id: string
  title: string
  type: KbDocType
  format: 'PDF' | 'DOCX'
  sizeLabel: string
  updatedAt: string          // ISO
  uploadedBy: string
  status: KbDocStatus
  chunks: number
  usedToday: number          // times the Copilot cited it today
}

export const KNOWLEDGE: KbDoc[] = [
  { id: 'kb-01', title: 'Wire Transfer SOP', type: 'SOP', format: 'PDF', sizeLabel: '412 KB', updatedAt: '2026-06-21', uploadedBy: 'Nina Powell', status: 'indexed', chunks: 38, usedToday: 12 },
  { id: 'kb-02', title: 'Card Disputes SOP (Reg E)', type: 'SOP', format: 'PDF', sizeLabel: '286 KB', updatedAt: '2026-06-18', uploadedBy: 'Sofia Alvarez', status: 'indexed', chunks: 24, usedToday: 9 },
  { id: 'kb-03', title: 'Account Opening Checklist', type: 'SOP', format: 'DOCX', sizeLabel: '74 KB', updatedAt: '2026-06-24', uploadedBy: 'Nina Powell', status: 'indexed', chunks: 11, usedToday: 7 },
  { id: 'kb-04', title: 'Branch & ATM Hours', type: 'FAQ', format: 'DOCX', sizeLabel: '38 KB', updatedAt: '2026-06-10', uploadedBy: 'Maya Patel', status: 'indexed', chunks: 6, usedToday: 5 },
  { id: 'kb-05', title: 'Digital Banking Troubleshooting', type: 'SOP', format: 'PDF', sizeLabel: '520 KB', updatedAt: '2026-06-15', uploadedBy: 'Devon Brooks', status: 'indexed', chunks: 41, usedToday: 4 },
  { id: 'kb-06', title: 'Privacy & Disclosure Policy', type: 'Policy', format: 'PDF', sizeLabel: '198 KB', updatedAt: '2026-05-30', uploadedBy: 'Nina Powell', status: 'indexed', chunks: 19, usedToday: 2 },
  { id: 'kb-07', title: 'CD & Savings Rate Sheet', type: 'Product', format: 'PDF', sizeLabel: '156 KB', updatedAt: '2026-06-28', uploadedBy: 'Nina Powell', status: 'processing', chunks: 0, usedToday: 0 },
]

export const CHANNEL_LABEL: Record<Channel, string> = {
  voice: 'Voice',
  whatsapp: 'WhatsApp',
  web: 'Web Chat',
  email: 'Email',
}

// ─── History (full interaction trail) ─────────────────────────────────
// Every message and call, tagged by status + sentiment. Any item still
// tagged "unresolved" (or unreachable / follow-up) exposes a WebRTC
// "Call back" action so the CSR can reach the member from this screen.

export type InteractionType = 'callback' | 'chat' | 'escalation'
export type InteractionStatus = 'resolved' | 'unresolved' | 'followup' | 'escalated' | 'unreachable'
export type Sentiment = 'positive' | 'neutral' | 'negative'

// Statuses that still warrant reaching back out to the member via callback.
export const CALLABLE_STATUSES: InteractionStatus[] = ['unresolved', 'unreachable', 'followup']

export interface HistoryItem {
  id: string
  contactName: string
  type: InteractionType
  channel: Channel
  phoneMasked: string
  status: InteractionStatus
  outcome: string          // human-readable disposition
  sentiment: Sentiment
  handledBy: string        // '—' if never handled by a human yet
  closedAt: string         // ISO
  durationLabel: string
  summary: string
  whyOpen?: string         // for callable items: why it still needs a callback
  copilotSuggestion?: string
  notes: string
  transcript: { speaker: 'member' | 'agent' | 'csr'; text: string; time: string }[]
}

export const HISTORY: HistoryItem[] = [
  {
    id: 'h-001',
    contactName: 'Elena Rodriguez',
    type: 'callback',
    channel: 'voice',
    phoneMasked: '(•••) •••-7390',
    status: 'unresolved',
    outcome: 'Unresolved — call dropped',
    sentiment: 'negative',
    handledBy: '—',
    closedAt: '2026-06-29T10:25:00',
    durationLabel: '0m 41s',
    summary:
      'Member called about a declined card while traveling. The AI call disconnected ~40 seconds in, before identity could be verified or the merchant confirmed. Issue is unaddressed and likely time-sensitive.',
    whyOpen:
      'Call dropped early (poor signal while traveling). Member’s card is declining and they need it working today — needs a callback.',
    copilotSuggestion:
      'Check for a travel/fraud hold on the rewards card. If a precautionary block, verify identity and lift it. Confirm the recent declined transaction location.',
    notes: '',
    transcript: [
      { speaker: 'member', text: 'My card just got declined at a gas station and I —', time: '10:24' },
      { speaker: 'agent', text: 'I can help with that. To verify your identity, can you confirm—', time: '10:24' },
      { speaker: 'member', text: '[call disconnected]', time: '10:25' },
    ],
  },
  {
    id: 'h-002',
    contactName: 'Priya Nair',
    type: 'callback',
    channel: 'voice',
    phoneMasked: '(•••) •••-1185',
    status: 'unresolved',
    outcome: 'Unresolved — needs human',
    sentiment: 'neutral',
    handledBy: '—',
    closedAt: '2026-06-29T10:20:00',
    durationLabel: '3m 12s',
    summary:
      'Member wanted to send a same-day wire to a title company for a home closing. The AI explained the cutoff but cannot initiate a wire (requires dual control + identity step-up). Needs a callback before the 2pm cutoff.',
    whyOpen:
      'Wire initiation is out of scope for the AI agent (human dual-control required). Deadline-sensitive — closing is today.',
    copilotSuggestion:
      'High-value same-day wire. Verify identity with step-up, confirm beneficiary (title company) against closing docs, route through dual-control approval. Cutoff 2:00pm.',
    notes: '',
    transcript: [
      { speaker: 'member', text: 'I need to wire $40,000 to my title company before closing this afternoon.', time: '10:17' },
      { speaker: 'agent', text: 'Wires over the phone need a specialist to verify and approve. Let me arrange a callback.', time: '10:18' },
      { speaker: 'member', text: 'Okay but please hurry, closing is at 3.', time: '10:19' },
    ],
  },
  {
    id: 'h-003',
    contactName: 'David Okafor',
    type: 'callback',
    channel: 'voice',
    phoneMasked: '(•••) •••-9042',
    status: 'unreachable',
    outcome: 'Unreachable — follow-up sent',
    sentiment: 'neutral',
    handledBy: 'Maya Patel',
    closedAt: '2026-06-29T08:30:00',
    durationLabel: '—',
    summary:
      'Online-banking lockout, reset email bouncing on a stale address. Attempted 3 callbacks with no answer; sent a secure email follow-up with identity-verification steps.',
    whyOpen: 'Three callback attempts went unanswered. Still locked out — worth one more try before closing.',
    copilotSuggestion:
      'Verify identity via KBA, update the email on file, then trigger a fresh password reset. Offer passkey login to prevent repeat lockouts.',
    notes: '3 attempts, no answer. Secure email sent with KBA link.',
    transcript: [
      { speaker: 'csr', text: '[Attempt 3 — no answer] Left no voicemail. Sending secure email follow-up.', time: '8:30' },
    ],
  },
  {
    id: 'h-004',
    contactName: 'Marcus Bell',
    type: 'callback',
    channel: 'voice',
    phoneMasked: '(•••) •••-4821',
    status: 'resolved',
    outcome: 'Resolved by callback',
    sentiment: 'positive',
    handledBy: 'Maya Patel',
    closedAt: '2026-06-29T10:14:00',
    durationLabel: '6m 02s',
    summary:
      'Original AI call was tagged unresolved (loan application not found). On callback, located the auto-loan application by SSN, confirmed it was in underwriting with a decision expected in 2 business days, and set an SMS status alert.',
    notes: 'Member reassured. Underwriting ref #AL-44821. SMS alert enabled.',
    transcript: [
      { speaker: 'csr', text: 'Hi Marcus, this is Maya from Lakeside calling you back about your auto loan application.', time: '10:08' },
      { speaker: 'member', text: 'Oh great, finally. I couldn’t get anywhere on the phone earlier.', time: '10:08' },
      { speaker: 'csr', text: 'I found it — it’s in underwriting and you should hear back within two business days. I’ll set up a text alert so you know the moment it moves.', time: '10:11' },
      { speaker: 'member', text: 'That’s perfect, thank you so much.', time: '10:13' },
    ],
  },
  {
    id: 'h-005',
    contactName: 'James Patterson',
    type: 'chat',
    channel: 'email',
    phoneMasked: '(•••) •••-2204',
    status: 'resolved',
    outcome: 'Dispute opened · provisional credit',
    sentiment: 'neutral',
    handledBy: 'Maya Patel',
    closedAt: '2026-06-29T09:55:00',
    durationLabel: '13m',
    summary:
      'Member disputed a $89.99 charge from June 18 as unauthorized. Opened a formal dispute case, issued a provisional credit while the investigation runs, and sent confirmation by email.',
    notes: 'Case #DSP-20913. Provisional credit posted. Follow-up SLA 10 business days.',
    transcript: [
      { speaker: 'member', text: 'I’m disputing a $89.99 charge from June 18 — I never authorized it.', time: '9:42' },
      { speaker: 'csr', text: 'Thanks James. I’ve opened a dispute case and provisionally credited the amount while we investigate.', time: '9:55' },
    ],
  },
  {
    id: 'h-006',
    contactName: 'Gregory Hale',
    type: 'escalation',
    channel: 'voice',
    phoneMasked: '(•••) •••-5567',
    status: 'resolved',
    outcome: 'Fraud confirmed · card frozen',
    sentiment: 'negative',
    handledBy: 'Sofia Alvarez',
    closedAt: '2026-06-29T09:48:00',
    durationLabel: '9m 41s',
    summary:
      'Escalated for suspected fraud. Confirmed two unauthorized charges (~$800), froze the credit card, issued a replacement, and filed a fraud claim. Member calmed and reassured.',
    notes: 'Card frozen, replacement expedited. Fraud claim #FR-7782 filed.',
    transcript: [
      { speaker: 'member', text: 'There are two charges I never made, almost $800 total!', time: '9:39' },
      { speaker: 'agent', text: 'I understand. I’ve verified your identity and I’m connecting you to a specialist now.', time: '9:39' },
      { speaker: 'csr', text: 'Gregory, I’ve frozen the card so nothing else can post. I’m filing a fraud claim and a replacement is on its way.', time: '9:45' },
      { speaker: 'member', text: 'Thank you, that’s a relief.', time: '9:47' },
    ],
  },
  {
    id: 'h-007',
    contactName: 'Aisha Mohammed',
    type: 'chat',
    channel: 'whatsapp',
    phoneMasked: '(•••) •••-6612',
    status: 'resolved',
    outcome: 'Answered · branch hours',
    sentiment: 'positive',
    handledBy: 'Maya Patel',
    closedAt: '2026-06-29T09:32:00',
    durationLabel: '2m',
    summary: 'Quick inquiry about Saturday branch hours. Confirmed downtown branch is open 9am–1pm Saturdays.',
    notes: '',
    transcript: [
      { speaker: 'member', text: 'Is the downtown branch open Saturday?', time: '9:30' },
      { speaker: 'csr', text: 'Yes — downtown is open Saturdays 9am–1pm.', time: '9:31' },
      { speaker: 'member', text: 'Great, thank you so much!', time: '9:32' },
    ],
  },
  {
    id: 'h-008',
    contactName: 'Sandra Whitfield',
    type: 'callback',
    channel: 'voice',
    phoneMasked: '(•••) •••-3318',
    status: 'resolved',
    outcome: 'Resolved by callback',
    sentiment: 'neutral',
    handledBy: 'Devon Brooks',
    closedAt: '2026-06-29T09:21:00',
    durationLabel: '4m 18s',
    summary:
      'Dropped AI call about a loan payment date. On callback, confirmed next due date and approved a one-time payment extension of 7 days.',
    notes: 'One-time extension granted. New due date communicated.',
    transcript: [
      { speaker: 'csr', text: 'Hi Sandra, calling you back about your car payment question.', time: '9:17' },
      { speaker: 'member', text: 'Yes — can I push it a week?', time: '9:18' },
      { speaker: 'csr', text: 'You’re eligible for a one-time extension. I’ve moved your due date out seven days.', time: '9:20' },
    ],
  },
  {
    id: 'h-009',
    contactName: 'Robert Tan',
    type: 'escalation',
    channel: 'voice',
    phoneMasked: '(•••) •••-8830',
    status: 'escalated',
    outcome: 'Escalated to mortgage specialist',
    sentiment: 'positive',
    handledBy: 'Nina Powell',
    closedAt: '2026-06-29T08:50:00',
    durationLabel: '7m 03s',
    summary:
      'HELOC inquiry where collateral is a rental property — outside configured policy. Took the call, gathered details, and warm-transferred to a mortgage specialist with full context.',
    notes: 'Warm transfer to mortgage team. Specialist callback scheduled for 2pm.',
    transcript: [
      { speaker: 'member', text: 'It’s for a rental property I own — does that change the rate?', time: '8:44' },
      { speaker: 'agent', text: 'That’s a specialized scenario. Let me bring in a mortgage representative.', time: '8:44' },
      { speaker: 'csr', text: 'I’ve briefed our mortgage specialist; they’ll call you at 2pm with rental-property terms.', time: '8:49' },
    ],
  },
  {
    id: 'h-010',
    contactName: 'Rachel Kim',
    type: 'chat',
    channel: 'web',
    phoneMasked: '(•••) •••-4471',
    status: 'resolved',
    outcome: 'Answered · account opening info',
    sentiment: 'positive',
    handledBy: 'Liam Connor',
    closedAt: '2026-06-29T08:12:00',
    durationLabel: '5m',
    summary: 'Member asked what documents are needed to open a savings account. Sent the requirements list and a link to start online.',
    notes: 'Sent doc checklist + online application link.',
    transcript: [
      { speaker: 'member', text: 'What documents do I need to open a savings account?', time: '8:07' },
      { speaker: 'csr', text: 'A government ID, your SSN, and proof of address. Here’s a link to start online.', time: '8:10' },
    ],
  },
]
