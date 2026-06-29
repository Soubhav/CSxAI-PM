// ─── CSxIQ (AI Assist) — CSR-facing portal mock data ──────────────────
// Sector-neutral in logic; Lakeside Credit Union flavored on screen.

export type Channel = 'voice' | 'whatsapp' | 'web' | 'email'
export type PresenceStatus = 'available' | 'busy' | 'presenting'

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

// ─── Team presence ────────────────────────────────────────────────────

export interface TeamMember {
  name: string
  role: string
  status: PresenceStatus
  activeCount: number
}

export const TEAM: TeamMember[] = [
  { name: 'Maya Patel', role: 'CSR', status: 'available', activeCount: 1 },
  { name: 'Devon Brooks', role: 'CSR', status: 'busy', activeCount: 3 },
  { name: 'Sofia Alvarez', role: 'Senior CSR', status: 'presenting', activeCount: 0 },
  { name: 'Liam Connor', role: 'CSR', status: 'available', activeCount: 0 },
  { name: 'Nina Powell', role: 'Team Lead', status: 'busy', activeCount: 2 },
]

export const CHANNEL_LABEL: Record<Channel, string> = {
  voice: 'Voice',
  whatsapp: 'WhatsApp',
  web: 'Web Chat',
  email: 'Email',
}
