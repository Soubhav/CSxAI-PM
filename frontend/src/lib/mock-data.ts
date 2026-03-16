// ─── Type Definitions ──────────────────────────────────────────────

export type CallStatus = 'successful' | 'partial' | 'failed'
export type CallScenario =
  | 'transaction-inquiry'
  | 'account-balance'
  | 'loan-status'
  | 'payment-due'
  | 'card-issue'
  | 'routing-account'
  | 'cd-rates'
  | 'loan-payoff'

export type TransferType = 'warm' | 'cold' | 'priority-warm'
export type AfterHoursRule = 'callback' | 'oncall-alert' | 'voicemail'
export type AgentType = 'voice' | 'chat' | 'multi-modal'

export interface TranscriptLine {
  speaker: 'agent' | 'member'
  text: string
  timestamp: number
}

export interface PromptVersion {
  id: string
  version: number
  createdAt: string
  prompt: string
  resolutionRate: number
  notes: string
}

export interface EscalationTriggerConfig {
  trigger: string
  transferType: TransferType
  priority: 'normal' | 'high' | 'urgent'
  afterHoursRule: AfterHoursRule
}

export interface EscalationSettings {
  agentBriefTemplate: string
  queueOverflowMinutes: number
  queueOverflowAction: 'callback' | 'hold'
  afterHoursUrgentAlert: boolean
  alertRecipients: string[]
  triggers: EscalationTriggerConfig[]
}

export interface Scenario {
  id: CallScenario
  name: string
  description: string
  status: 'active' | 'testing' | 'inactive'
  callsHandled: number
  resolutionRate: number
  fcrRate: number
  avgDuration: number
  humanAvgDuration: number
  prompt: string
  guardrails: string[]
  escalationTriggers: string[]
  tools: string[]
  versions: PromptVersion[]
  escalationSettings: EscalationSettings
}

export interface AgentOutcome {
  callId: string
  resolvedByAgent: boolean
  timeToResolveSeconds: number
  botSummaryAccuracy: 'accurate' | 'partial' | 'inaccurate'
  agentNotes: string
}

export interface Call {
  id: string
  memberId: string
  memberName: string
  scenario: CallScenario
  startTime: string
  duration: number
  status: CallStatus
  resolutionRate: boolean
  sentimentScore: 'positive' | 'neutral' | 'negative'
  efficiencyScore: 'faster' | 'same' | 'slower'
  overallScore: number
  npsScore: number | null
  escalated: boolean
  escalationPath?: string
  summary: string
  transcript: TranscriptLine[]
  toolsUsed: string[]
  recordingUrl?: string
  agentOutcome?: AgentOutcome
}

export interface KnowledgeDoc {
  id: string
  title: string
  type: 'pdf' | 'faq' | 'rate-sheet' | 'policy'
  fileSize: string
  lastUpdated: string
  linkedScenarios: CallScenario[]
  excerpt: string
}

export interface TestCase {
  id: string
  name: string
  scenario: CallScenario
  input: string
  expectedOutcome: string
  actualOutcome: string
  status: 'pass' | 'fail' | 'pending'
  lastRun: string
}

export interface TestSuiteRun {
  id: string
  runDate: string
  totalCases: number
  passed: number
  failed: number
  duration: string
}

export interface LiveCall {
  id: string
  memberName: string
  scenario: CallScenario
  status: 'in-progress' | 'testing'
  duration: number
  sentiment: 'positive' | 'neutral' | 'negative'
}

export interface Agent {
  id: string
  name: string
  description: string
  type: AgentType
  status: 'active' | 'testing' | 'inactive'
  resolutionRate: number
  fcrRate: number
  lastUpdated: string
  scenarios: CallScenario[]
  version: string
}

// ─── Scenario Labels ───────────────────────────────────────────────

export const SCENARIO_LABELS: Record<CallScenario, string> = {
  'transaction-inquiry': 'Transaction Inquiry',
  'account-balance': 'Account Balance',
  'loan-status': 'Loan Status',
  'payment-due': 'Payment Due Date',
  'card-issue': 'Card Issue & Disputes',
  'routing-account': 'Routing & Account Numbers',
  'cd-rates': 'CD & Savings Rates',
  'loan-payoff': 'Loan Payoff Quote',
}

// ─── Agents ────────────────────────────────────────────────────────

export const AGENTS: Agent[] = [
  {
    id: 'agent-lakeside-voice',
    name: 'Lakeside Voice Agent',
    description: 'Primary inbound voice agent for Lakeside Credit Union member services',
    type: 'voice',
    status: 'active',
    resolutionRate: 87.2,
    fcrRate: 82.4,
    lastUpdated: 'Yesterday, 2:15 PM',
    scenarios: ['transaction-inquiry', 'account-balance', 'loan-status', 'payment-due', 'card-issue', 'routing-account'],
    version: 'v4.2',
  },
  {
    id: 'agent-lakeside-chat',
    name: 'Lakeside Chat Agent',
    description: 'Web chat support agent for online banking users',
    type: 'chat',
    status: 'testing',
    resolutionRate: 71.8,
    fcrRate: 68.2,
    lastUpdated: 'March 1st, 10:30 AM',
    scenarios: ['account-balance', 'routing-account', 'cd-rates'],
    version: 'v1.3',
  },
  {
    id: 'agent-lakeside-multimodal',
    name: 'Lakeside Omni Agent',
    description: 'Multi-modal agent handling both voice and chat with document support',
    type: 'multi-modal',
    status: 'inactive',
    resolutionRate: 0,
    fcrRate: 0,
    lastUpdated: 'February 20th, 4:00 PM',
    scenarios: ['loan-payoff', 'cd-rates'],
    version: 'v0.5',
  },
]

// ─── Scenarios ─────────────────────────────────────────────────────

export const SCENARIOS: Scenario[] = [
  {
    id: 'transaction-inquiry',
    name: 'Transaction Inquiry',
    description: 'Help members identify and understand charges on their accounts',
    status: 'active',
    callsHandled: 1284,
    resolutionRate: 87,
    fcrRate: 83,
    avgDuration: 94,
    humanAvgDuration: 210,
    prompt: `You are a friendly credit union voice assistant for Lakeside Credit Union. Your role is to help members understand recent transactions on their accounts.\n\nGuidelines:\n- Always verify the member's identity before sharing account details\n- Describe transaction details clearly: date, amount, merchant name, and category\n- If a charge is from a payment terminal (e.g., Square, Stripe), explain what those are\n- Offer to send a text summary after the call\n- If the member suspects fraud, escalate immediately to the fraud team\n- Never share full account numbers — use the last 4 digits only`,
    guardrails: [
      'Never reveal full account or card numbers — last 4 digits only',
      'Do not promise refunds or credits — only a human agent can authorize those',
      'If the member mentions fraud or unauthorized charges, escalate immediately',
      'Do not discuss products, rates, or offers unless the member asks',
      'Always confirm the member\'s identity before sharing any account information',
    ],
    escalationTriggers: [
      'Member mentions fraud or unauthorized transactions',
      'Member explicitly requests a human agent',
      'Bot fails to resolve after 2 attempts',
      'Member expresses anger, frustration, or distress',
      'Transaction involves international or high-value amounts',
    ],
    tools: ['sms-summary', 'email-summary'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-01-15', prompt: 'V1 prompt...', resolutionRate: 72, notes: 'Initial prompt — basic transaction lookup' },
      { id: 'v2', version: 2, createdAt: '2025-02-01', prompt: 'V2 prompt...', resolutionRate: 80, notes: 'Added Square/Stripe merchant explanation' },
      { id: 'v3', version: 3, createdAt: '2025-02-20', prompt: 'V3 prompt...', resolutionRate: 87, notes: 'Improved identity verification flow and fraud escalation' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}} (Acct: ***{{last4}})\nReason: {{escalation_reason}}\nScenario: Transaction Inquiry\nSummary: {{bot_summary}}\nTranscript: {{transcript_link}}',
      queueOverflowMinutes: 3,
      queueOverflowAction: 'callback',
      afterHoursUrgentAlert: true,
      alertRecipients: ['ops-manager@lakeside.cu', 'fraud-team@lakeside.cu'],
      triggers: [
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
        { trigger: 'Fraud or unauthorized transaction', transferType: 'priority-warm', priority: 'urgent', afterHoursRule: 'oncall-alert' },
        { trigger: 'Bot unresolved after 2 attempts', transferType: 'warm', priority: 'high', afterHoursRule: 'callback' },
        { trigger: 'Negative sentiment detected', transferType: 'warm', priority: 'high', afterHoursRule: 'callback' },
        { trigger: 'International/high-value transaction', transferType: 'warm', priority: 'high', afterHoursRule: 'oncall-alert' },
      ],
    },
  },
  {
    id: 'account-balance',
    name: 'Account Balance',
    description: 'Provide real-time checking, savings, and CD account balances',
    status: 'active',
    callsHandled: 2156,
    resolutionRate: 94,
    fcrRate: 92,
    avgDuration: 62,
    humanAvgDuration: 180,
    prompt: `You are a voice assistant for Lakeside Credit Union. Help members check their account balances quickly and accurately.\n\nGuidelines:\n- Verify member identity first\n- Report checking, savings, and CD balances when asked\n- Mention pending transactions that affect available balance\n- Offer to send a balance summary by text\n- Keep responses brief — balance checks should be fast`,
    guardrails: [
      'Never reveal full account numbers — last 4 digits only',
      'Do not process overdraft complaints — escalate to human',
      'Do not speculate on pending transaction timing',
      'Do not discuss interest rates unless member asks',
    ],
    escalationTriggers: [
      'Member disputes their balance',
      'Member has overdraft or fee questions',
      'Member requests a human agent',
    ],
    tools: ['sms-summary'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-02-10', prompt: 'V1 prompt...', resolutionRate: 88, notes: 'Initial balance check flow' },
      { id: 'v2', version: 2, createdAt: '2025-02-28', prompt: 'V2 prompt...', resolutionRate: 94, notes: 'Added pending transaction explanation' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}} (Acct: ***{{last4}})\nReason: {{escalation_reason}}\nScenario: Account Balance\nSummary: {{bot_summary}}',
      queueOverflowMinutes: 3,
      queueOverflowAction: 'hold',
      afterHoursUrgentAlert: false,
      alertRecipients: ['ops-manager@lakeside.cu'],
      triggers: [
        { trigger: 'Member disputes balance', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Overdraft or fee question', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
      ],
    },
  },
  {
    id: 'loan-status',
    name: 'Loan Status',
    description: 'Check status of loan applications and provide payment information',
    status: 'active',
    callsHandled: 847,
    resolutionRate: 79,
    fcrRate: 74,
    avgDuration: 118,
    humanAvgDuration: 240,
    prompt: `You are a voice assistant for Lakeside Credit Union. Help members check the status of their loan applications and existing loan details.\n\nGuidelines:\n- Verify member identity\n- Provide loan application status: submitted, under review, approved, denied\n- For existing loans: share balance, next payment date, payment amount\n- For payoff requests, offer to mail a formal payoff letter\n- Never confirm or deny loan decisions — only share application status\n- If member wants to dispute a decision, escalate to loan officer`,
    guardrails: [
      'Never confirm or deny a loan approval/denial — share status only',
      'Do not negotiate interest rates — escalate to loan officer',
      'Payoff letters must be sent via formal mail only',
      'Do not discuss other members\' loan information',
    ],
    escalationTriggers: [
      'Member wants to dispute loan decision',
      'Member requests rate negotiation',
      'Member confused after 2 explanation attempts',
      'Member requests a human agent',
    ],
    tools: ['sms-summary', 'email-summary', 'mail-payoff-letter'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-01-20', prompt: 'V1 prompt...', resolutionRate: 68, notes: 'Initial loan status flow' },
      { id: 'v2', version: 2, createdAt: '2025-02-15', prompt: 'V2 prompt...', resolutionRate: 79, notes: 'Added payoff letter workflow' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}} (Acct: ***{{last4}})\nReason: {{escalation_reason}}\nScenario: Loan Status\nLoan Type: {{loan_type}}\nSummary: {{bot_summary}}',
      queueOverflowMinutes: 5,
      queueOverflowAction: 'callback',
      afterHoursUrgentAlert: false,
      alertRecipients: ['loan-dept@lakeside.cu'],
      triggers: [
        { trigger: 'Loan decision dispute', transferType: 'warm', priority: 'high', afterHoursRule: 'callback' },
        { trigger: 'Rate negotiation request', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Confusion after 2 attempts', transferType: 'warm', priority: 'normal', afterHoursRule: 'voicemail' },
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
      ],
    },
  },
  {
    id: 'payment-due',
    name: 'Payment Due Date',
    description: 'Provide upcoming payment dates and amounts for loans and credit cards',
    status: 'active',
    callsHandled: 1893,
    resolutionRate: 96,
    fcrRate: 94,
    avgDuration: 48,
    humanAvgDuration: 120,
    prompt: `You are a voice assistant for Lakeside Credit Union. Help members check their upcoming payment due dates.\n\nGuidelines:\n- Verify identity\n- Share next payment date, amount, and minimum due\n- Mention autopay status if enrolled\n- Offer to send a reminder by text`,
    guardrails: [
      'Do not process payments — only share due dates and amounts',
      'Do not waive late fees — escalate to human',
      'Confirm identity before sharing any payment info',
    ],
    escalationTriggers: [
      'Member wants to make a payment (not supported)',
      'Member asks about late fee waiver',
      'Member requests a human agent',
    ],
    tools: ['sms-summary'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-02-05', prompt: 'V1 prompt...', resolutionRate: 96, notes: 'Simple payment due lookup' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}}\nReason: {{escalation_reason}}\nScenario: Payment Due Date',
      queueOverflowMinutes: 3,
      queueOverflowAction: 'hold',
      afterHoursUrgentAlert: false,
      alertRecipients: ['ops-manager@lakeside.cu'],
      triggers: [
        { trigger: 'Payment processing request', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Late fee waiver request', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
      ],
    },
  },
  {
    id: 'card-issue',
    name: 'Card Issue & Disputes',
    description: 'Handle debit/credit card problems including declines, lost cards, and disputes',
    status: 'active',
    callsHandled: 623,
    resolutionRate: 68,
    fcrRate: 61,
    avgDuration: 156,
    humanAvgDuration: 300,
    prompt: `You are a voice assistant for Lakeside Credit Union. Help members with card-related issues.\n\nGuidelines:\n- Verify identity immediately\n- For declined cards: check if the card is locked, over limit, or flagged\n- For lost/stolen cards: offer to lock the card immediately\n- For disputes: collect transaction details and escalate to disputes team\n- Be empathetic — card issues are stressful`,
    guardrails: [
      'Always lock a card when member reports it lost or stolen',
      'Never reveal full card numbers',
      'Disputes must be escalated — bot cannot resolve them',
      'If fraud is suspected, escalate immediately with priority',
    ],
    escalationTriggers: [
      'Member reports card stolen or compromised',
      'Member wants to file a formal dispute',
      'Suspected fraud activity',
      'Member requests a human agent',
    ],
    tools: ['sms-summary', 'email-summary'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-02-12', prompt: 'V1 prompt...', resolutionRate: 58, notes: 'Initial card issue flow' },
      { id: 'v2', version: 2, createdAt: '2025-03-01', prompt: 'V2 prompt...', resolutionRate: 68, notes: 'Added card lock capability and empathy prompts' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}} (Card: ***{{last4}})\nReason: {{escalation_reason}}\nScenario: Card Issue\nCard Status: {{card_status}}\nSummary: {{bot_summary}}',
      queueOverflowMinutes: 2,
      queueOverflowAction: 'callback',
      afterHoursUrgentAlert: true,
      alertRecipients: ['fraud-team@lakeside.cu', 'ops-manager@lakeside.cu'],
      triggers: [
        { trigger: 'Card reported stolen/compromised', transferType: 'priority-warm', priority: 'urgent', afterHoursRule: 'oncall-alert' },
        { trigger: 'Formal dispute request', transferType: 'warm', priority: 'high', afterHoursRule: 'callback' },
        { trigger: 'Suspected fraud', transferType: 'priority-warm', priority: 'urgent', afterHoursRule: 'oncall-alert' },
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
      ],
    },
  },
  {
    id: 'routing-account',
    name: 'Routing & Account Numbers',
    description: 'Provide routing numbers, account numbers, and wire transfer info',
    status: 'active',
    callsHandled: 1567,
    resolutionRate: 98,
    fcrRate: 97,
    avgDuration: 35,
    humanAvgDuration: 90,
    prompt: `You are a voice assistant for Lakeside Credit Union. Help members get their routing and account numbers.\n\nGuidelines:\n- Verify identity\n- Lakeside CU routing number: 271-081-528\n- Share last 4 digits of account, then offer to send full number by secure text\n- For wire transfers: provide both routing and account details\n- Never speak full account numbers aloud — send by secure SMS only`,
    guardrails: [
      'Never speak full account numbers — send via secure text only',
      'Routing number can be shared verbally (it is public)',
      'Wire transfer details must be confirmed by the member',
    ],
    escalationTriggers: [
      'Member needs international wire help',
      'Member requests a human agent',
    ],
    tools: ['sms-summary'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-01-25', prompt: 'V1 prompt...', resolutionRate: 98, notes: 'Routing number and secure text flow' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}}\nReason: {{escalation_reason}}\nScenario: Routing & Account Numbers',
      queueOverflowMinutes: 5,
      queueOverflowAction: 'hold',
      afterHoursUrgentAlert: false,
      alertRecipients: ['ops-manager@lakeside.cu'],
      triggers: [
        { trigger: 'International wire help', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
      ],
    },
  },
  {
    id: 'cd-rates',
    name: 'CD & Savings Rates',
    description: 'Provide current rates for CDs, savings accounts, and money market accounts',
    status: 'testing',
    callsHandled: 0,
    resolutionRate: 0,
    fcrRate: 0,
    avgDuration: 0,
    humanAvgDuration: 150,
    prompt: `You are a voice assistant for Lakeside Credit Union. Help members learn about current deposit rates.\n\nGuidelines:\n- Share current CD rates by term (6mo, 12mo, 24mo, 36mo, 60mo)\n- Share savings and money market APYs\n- Do not make recommendations — just provide rates\n- Offer to connect with a member services rep to open an account`,
    guardrails: [
      'Do not recommend specific products or terms',
      'Rates are subject to change — always include this disclaimer',
      'Do not open accounts — only a human can do that',
    ],
    escalationTriggers: [
      'Member wants to open an account',
      'Member needs rate comparison advice',
      'Member requests a human agent',
    ],
    tools: ['sms-summary'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-03-01', prompt: 'V1 prompt...', resolutionRate: 0, notes: 'Initial rates flow — in testing' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}}\nReason: {{escalation_reason}}\nScenario: CD & Savings Rates',
      queueOverflowMinutes: 5,
      queueOverflowAction: 'hold',
      afterHoursUrgentAlert: false,
      alertRecipients: ['ops-manager@lakeside.cu'],
      triggers: [
        { trigger: 'Account opening request', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Rate advice request', transferType: 'warm', priority: 'normal', afterHoursRule: 'callback' },
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
      ],
    },
  },
  {
    id: 'loan-payoff',
    name: 'Loan Payoff Quote',
    description: 'Provide payoff amounts and generate formal payoff letters',
    status: 'inactive',
    callsHandled: 0,
    resolutionRate: 0,
    fcrRate: 0,
    avgDuration: 0,
    humanAvgDuration: 300,
    prompt: `You are a voice assistant for Lakeside Credit Union. Help members get their loan payoff amounts.\n\nGuidelines:\n- Verify identity\n- Provide current payoff amount including per-diem interest\n- Offer to mail a formal payoff letter (required for title releases)\n- Explain that payoff amounts are good for 10 business days`,
    guardrails: [
      'Payoff amounts must include per-diem interest disclaimer',
      'Formal payoff letters must be sent by mail — cannot be provided verbally',
      'Do not negotiate rates or terms',
    ],
    escalationTriggers: [
      'Member disputes payoff amount',
      'Member needs immediate title release',
      'Member requests a human agent',
    ],
    tools: ['mail-payoff-letter', 'sms-summary'],
    versions: [
      { id: 'v1', version: 1, createdAt: '2025-03-01', prompt: 'V1 prompt...', resolutionRate: 0, notes: 'Initial payoff flow — inactive' },
    ],
    escalationSettings: {
      agentBriefTemplate: 'Member: {{member_name}}\nReason: {{escalation_reason}}\nScenario: Loan Payoff\nLoan ID: {{loan_id}}',
      queueOverflowMinutes: 5,
      queueOverflowAction: 'callback',
      afterHoursUrgentAlert: false,
      alertRecipients: ['loan-dept@lakeside.cu'],
      triggers: [
        { trigger: 'Payoff amount dispute', transferType: 'warm', priority: 'high', afterHoursRule: 'callback' },
        { trigger: 'Immediate title release', transferType: 'warm', priority: 'high', afterHoursRule: 'callback' },
        { trigger: 'Member requests human agent', transferType: 'cold', priority: 'normal', afterHoursRule: 'voicemail' },
      ],
    },
  },
]

// ─── Calls ─────────────────────────────────────────────────────────

export const CALLS: Call[] = [
  {
    id: 'call-001',
    memberId: 'M-1042',
    memberName: 'James Mitchell',
    scenario: 'transaction-inquiry',
    startTime: '2025-03-03T09:14:00',
    duration: 87,
    status: 'successful',
    resolutionRate: true,
    sentimentScore: 'positive',
    efficiencyScore: 'faster',
    overallScore: 9,
    npsScore: 9,
    escalated: false,
    summary: 'Member called about an unrecognized $47.80 charge. Agent identified it as a Square terminal payment from a local coffee shop. Member confirmed and was satisfied.',
    transcript: [
      { speaker: 'agent', text: 'Hi, thanks for calling Lakeside Credit Union! How can I help you today?', timestamp: 0 },
      { speaker: 'member', text: 'Hi, I see a charge on my account for $47.80 from something called SQ*. I don\'t recognize it.', timestamp: 5 },
      { speaker: 'agent', text: 'I can help with that. Let me look up your recent transactions. I see the charge — it posted on March 1st from SQ*BEANERY. The "SQ" prefix means it was processed through a Square payment terminal, commonly used by small businesses.', timestamp: 12 },
      { speaker: 'member', text: 'Oh, Beanery! That\'s the coffee shop near my office. I did go there. Thank you for explaining that.', timestamp: 28 },
      { speaker: 'agent', text: 'Happy to help! Would you like me to send a text summary of this call?', timestamp: 35 },
      { speaker: 'member', text: 'That would be great, thanks!', timestamp: 40 },
      { speaker: 'agent', text: 'Done! The summary has been sent to your number on file. Is there anything else I can help with?', timestamp: 48 },
      { speaker: 'member', text: 'Nope, that\'s it. Thanks!', timestamp: 55 },
    ],
    toolsUsed: ['sms-summary'],
  },
  {
    id: 'call-002',
    memberId: 'M-2187',
    memberName: 'Patricia Nguyen',
    scenario: 'transaction-inquiry',
    startTime: '2025-03-03T10:32:00',
    duration: 143,
    status: 'partial',
    resolutionRate: false,
    sentimentScore: 'negative',
    efficiencyScore: 'slower',
    overallScore: 5,
    npsScore: 3,
    escalated: true,
    escalationPath: 'Fraud — Priority Warm Transfer',
    summary: 'Member reported multiple unauthorized charges totaling $892. Agent locked the card and escalated to fraud team via priority warm transfer.',
    transcript: [
      { speaker: 'agent', text: 'Hi, thanks for calling Lakeside Credit Union! How can I help you today?', timestamp: 0 },
      { speaker: 'member', text: 'I just got an alert about charges I didn\'t make. There are three charges I don\'t recognize at all.', timestamp: 5 },
      { speaker: 'agent', text: 'I\'m sorry to hear that. I can see three pending charges: $342 at BestElectro.com, $275 at GameZone Digital, and $275 at CloudSubscriptions. I understand this is concerning.', timestamp: 15 },
      { speaker: 'member', text: 'I didn\'t make any of those! Someone has my card info!', timestamp: 28 },
      { speaker: 'agent', text: 'I completely understand your concern. I\'ve locked your card to prevent any further charges. Because this involves potential fraud, I\'m going to connect you with our fraud specialist right now. They\'ll have all the details from our conversation.', timestamp: 35 },
      { speaker: 'member', text: 'Please, yes. This is really upsetting.', timestamp: 52 },
      { speaker: 'agent', text: 'I\'ve prepared a full brief for the fraud team. You\'ll be connected momentarily. I\'m sorry this happened, Patricia.', timestamp: 58 },
    ],
    toolsUsed: ['email-summary'],
    agentOutcome: {
      callId: 'call-002',
      resolvedByAgent: true,
      timeToResolveSeconds: 480,
      botSummaryAccuracy: 'accurate',
      agentNotes: 'Fraud confirmed — 3 unauthorized charges reversed. New card issued. Member contacted within 2 hours.',
    },
  },
  {
    id: 'call-003',
    memberId: 'M-0891',
    memberName: 'Robert Chen',
    scenario: 'account-balance',
    startTime: '2025-03-03T11:05:00',
    duration: 45,
    status: 'successful',
    resolutionRate: true,
    sentimentScore: 'positive',
    efficiencyScore: 'faster',
    overallScore: 10,
    npsScore: 10,
    escalated: false,
    summary: 'Quick balance check — checking $4,821.50 (available $4,721.50 with one pending), savings $12,340.00. SMS summary sent.',
    transcript: [
      { speaker: 'agent', text: 'Hi! Thanks for calling Lakeside Credit Union. How can I help?', timestamp: 0 },
      { speaker: 'member', text: 'I just need to check my balances.', timestamp: 3 },
      { speaker: 'agent', text: 'Of course! Your checking account balance is $4,821.50. Your available balance is $4,721.50 — there\'s one pending transaction of $100. Your savings account shows $12,340.00 with all transactions posted.', timestamp: 8 },
      { speaker: 'member', text: 'Perfect, thank you.', timestamp: 18 },
      { speaker: 'agent', text: 'Would you like me to text you a balance summary?', timestamp: 21 },
      { speaker: 'member', text: 'Yes please.', timestamp: 24 },
      { speaker: 'agent', text: 'Sent! Anything else I can help with?', timestamp: 28 },
      { speaker: 'member', text: 'No, that\'s all. Thanks!', timestamp: 31 },
    ],
    toolsUsed: ['sms-summary'],
  },
  {
    id: 'call-004',
    memberId: 'M-3321',
    memberName: 'Linda Torres',
    scenario: 'loan-status',
    startTime: '2025-03-03T13:22:00',
    duration: 38,
    status: 'failed',
    resolutionRate: false,
    sentimentScore: 'neutral',
    efficiencyScore: 'same',
    overallScore: 2,
    npsScore: null,
    escalated: true,
    escalationPath: 'Member Request — Cold Transfer',
    summary: 'Member immediately requested to speak with a loan officer about her mortgage application. Bot transferred without delay.',
    transcript: [
      { speaker: 'agent', text: 'Hi, thanks for calling Lakeside Credit Union! I can help with loan-related questions.', timestamp: 0 },
      { speaker: 'member', text: 'I need to talk to someone about my mortgage application. A person, please.', timestamp: 4 },
      { speaker: 'agent', text: 'Of course, I\'ll connect you with a loan officer right away. One moment please.', timestamp: 8 },
    ],
    toolsUsed: [],
    agentOutcome: {
      callId: 'call-004',
      resolvedByAgent: true,
      timeToResolveSeconds: 600,
      botSummaryAccuracy: 'accurate',
      agentNotes: 'Member wanted mortgage application update. Application was still under review — provided timeline and next steps.',
    },
  },
  {
    id: 'call-005',
    memberId: 'M-4502',
    memberName: 'David Park',
    scenario: 'payment-due',
    startTime: '2025-03-03T14:10:00',
    duration: 42,
    status: 'successful',
    resolutionRate: true,
    sentimentScore: 'positive',
    efficiencyScore: 'faster',
    overallScore: 9,
    npsScore: 8,
    escalated: false,
    summary: 'Member checked auto loan payment due date — April 1st, $342.00. Autopay enrolled. SMS reminder sent.',
    transcript: [
      { speaker: 'agent', text: 'Hi! Thanks for calling Lakeside Credit Union.', timestamp: 0 },
      { speaker: 'member', text: 'When is my next car payment due?', timestamp: 3 },
      { speaker: 'agent', text: 'Your next auto loan payment of $342.00 is due on April 1st. I can see you\'re enrolled in autopay, so it will be deducted automatically.', timestamp: 8 },
      { speaker: 'member', text: 'Great, just wanted to make sure. Thanks.', timestamp: 16 },
    ],
    toolsUsed: ['sms-summary'],
  },
  {
    id: 'call-006',
    memberId: 'M-1198',
    memberName: 'Maria Santos',
    scenario: 'card-issue',
    startTime: '2025-03-03T15:45:00',
    duration: 198,
    status: 'partial',
    resolutionRate: false,
    sentimentScore: 'negative',
    efficiencyScore: 'slower',
    overallScore: 6,
    npsScore: 5,
    escalated: true,
    escalationPath: 'Card Stolen — Priority Warm Transfer',
    summary: 'Member reported debit card stolen. Agent locked card immediately and escalated to fraud team for dispute and card replacement.',
    transcript: [
      { speaker: 'agent', text: 'Hi, thanks for calling Lakeside Credit Union! How can I help?', timestamp: 0 },
      { speaker: 'member', text: 'My wallet was stolen and I need to report my debit card. Someone might be using it.', timestamp: 4 },
      { speaker: 'agent', text: 'I\'m sorry that happened, Maria. I\'ve immediately locked your debit card ending in 4821 to prevent any unauthorized use. Let me connect you with our fraud team to get a replacement card issued and review any recent charges.', timestamp: 12 },
      { speaker: 'member', text: 'Thank you, please hurry.', timestamp: 25 },
      { speaker: 'agent', text: 'I\'m connecting you now with priority handling. The fraud specialist will have all the details from our conversation.', timestamp: 30 },
    ],
    toolsUsed: ['email-summary'],
    agentOutcome: {
      callId: 'call-006',
      resolvedByAgent: true,
      timeToResolveSeconds: 720,
      botSummaryAccuracy: 'accurate',
      agentNotes: 'Card locked by bot. 2 unauthorized charges found and reversed ($89 + $142). New card expedited, arriving in 2 business days.',
    },
  },
]

// ─── Dashboard Metrics ─────────────────────────────────────────────

export const DASHBOARD_METRICS = {
  totalCallsThisWeek: 2847,
  callsHandledByAI: 2412,
  escalationRate: 11.4,
  avgResolutionRate: 87.2,
  avgCallDuration: 82,
  humanAvgCallDuration: 210,
  timeSavedHours: 98,
  memberSatisfaction: 8.6,
  npsScore: 72,
  firstCallResolution: 82.4,
  customerEffortScore: 2.1,
  callAbandonmentRate: 3.8,
  repeatCallRate: 8.2,
  escalationQualityScore: 91,
  avgAgentResolutionTime: 345,
  escalationsResolvedByAgent: 94.2,
}

// ─── Weekly Calls ──────────────────────────────────────────────────

export const WEEKLY_CALLS = [
  { day: 'Feb 24', ai: 310, human: 52 },
  { day: 'Feb 25', ai: 348, human: 44 },
  { day: 'Feb 26', ai: 372, human: 38 },
  { day: 'Feb 27', ai: 356, human: 41 },
  { day: 'Feb 28', ai: 389, human: 35 },
  { day: 'Mar 1', ai: 198, human: 22 },
  { day: 'Mar 2', ai: 142, human: 18 },
  { day: 'Mar 3', ai: 297, human: 39 },
]

// ─── Heatmap ───────────────────────────────────────────────────────

export const HEATMAP_DATA = [
  { day: 'Mon', hours: [12, 28, 45, 62, 58, 41, 35, 22, 8, 4] },
  { day: 'Tue', hours: [15, 32, 52, 68, 64, 48, 38, 25, 10, 5] },
  { day: 'Wed', hours: [18, 35, 55, 72, 66, 51, 42, 28, 12, 6] },
  { day: 'Thu', hours: [14, 30, 48, 65, 60, 44, 36, 24, 9, 4] },
  { day: 'Fri', hours: [20, 38, 58, 78, 72, 55, 45, 30, 14, 7] },
]

// ─── Insight Cards ─────────────────────────────────────────────────

export const INSIGHT_CARDS = [
  { question: 'Which scenario has the highest escalation rate?', answer: 'Card Issue & Disputes at 32% — most escalations involve fraud suspicion', trend: 'negative' as const },
  { question: 'What\'s the fastest-resolving scenario?', answer: 'Routing & Account Numbers averages just 35 seconds — 74% faster than human agents', trend: 'positive' as const },
  { question: 'When do most calls come in?', answer: 'Peak hours are 10am–12pm Tuesday through Friday. Monday mornings see 40% more volume than other days.', trend: 'neutral' as const },
  { question: 'How does NPS compare to pre-AI baseline?', answer: 'NPS improved from 58 to 72 since AI deployment — a 24% increase in member satisfaction', trend: 'positive' as const },
  { question: 'Are members calling back about the same issue?', answer: 'Repeat call rate is 8.2% — down from 14.5% pre-AI. Transaction inquiries have the lowest repeat rate.', trend: 'positive' as const },
  { question: 'Which scenario saves the most human agent time?', answer: 'Account Balance saves 118 seconds per call vs. human — that\'s 94 hours saved this month alone', trend: 'positive' as const },
]

// ─── Live Calls ────────────────────────────────────────────────────

export const LIVE_CALLS: LiveCall[] = [
  { id: 'live-001', memberName: 'Michael Rivera', scenario: 'transaction-inquiry', status: 'in-progress', duration: 45, sentiment: 'neutral' },
  { id: 'live-002', memberName: 'Angela Washington', scenario: 'card-issue', status: 'in-progress', duration: 120, sentiment: 'negative' },
  { id: 'live-003', memberName: 'Test User', scenario: 'cd-rates', status: 'testing', duration: 30, sentiment: 'positive' },
]

// ─── Knowledge Base ────────────────────────────────────────────────

export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc-001',
    title: 'Member Services Policy Handbook',
    type: 'policy',
    fileSize: '2.4 MB',
    lastUpdated: '2025-02-15',
    linkedScenarios: ['transaction-inquiry', 'account-balance', 'card-issue'],
    excerpt: 'Comprehensive policy guide covering member identity verification, account access protocols, dispute handling procedures, and regulatory compliance requirements.',
  },
  {
    id: 'doc-002',
    title: 'Current Rate Sheet — March 2025',
    type: 'rate-sheet',
    fileSize: '156 KB',
    lastUpdated: '2025-03-01',
    linkedScenarios: ['cd-rates', 'loan-status'],
    excerpt: 'CD Rates: 6mo 4.25% APY, 12mo 4.50% APY, 24mo 4.15% APY, 36mo 3.95% APY, 60mo 3.75% APY. Savings: 3.10% APY. Money Market: 3.85% APY.',
  },
  {
    id: 'doc-003',
    title: 'Loan Products FAQ',
    type: 'faq',
    fileSize: '340 KB',
    lastUpdated: '2025-02-20',
    linkedScenarios: ['loan-status', 'loan-payoff', 'payment-due'],
    excerpt: 'Covers auto loans, personal loans, home equity, and mortgage products. Includes application process, timeline expectations, required documents, and payoff procedures.',
  },
  {
    id: 'doc-004',
    title: 'Fraud & Dispute Procedures',
    type: 'policy',
    fileSize: '1.8 MB',
    lastUpdated: '2025-01-30',
    linkedScenarios: ['card-issue', 'transaction-inquiry'],
    excerpt: 'Step-by-step procedures for handling fraud reports, provisional credits, Reg E compliance timelines, and member communication templates.',
  },
  {
    id: 'doc-005',
    title: 'Wire Transfer Instructions',
    type: 'faq',
    fileSize: '89 KB',
    lastUpdated: '2025-02-10',
    linkedScenarios: ['routing-account'],
    excerpt: 'Domestic and international wire transfer instructions including routing numbers, SWIFT codes, intermediary bank details, and cut-off times.',
  },
  {
    id: 'doc-006',
    title: 'Digital Banking Troubleshooting Guide',
    type: 'faq',
    fileSize: '420 KB',
    lastUpdated: '2025-02-25',
    linkedScenarios: [],
    excerpt: 'Common issues with online banking, mobile app, bill pay, and Zelle. Includes password reset procedures and device registration steps.',
  },
]

// ─── Test Cases ────────────────────────────────────────────────────

export const TEST_CASES: TestCase[] = [
  { id: 'tc-001', name: 'Basic balance check', scenario: 'account-balance', input: 'What\'s my checking balance?', expectedOutcome: 'Provide checking balance with pending note', actualOutcome: 'Provided balance $4,821.50 with pending $100 note', status: 'pass', lastRun: '2025-03-03' },
  { id: 'tc-002', name: 'Fraud escalation trigger', scenario: 'transaction-inquiry', input: 'Someone stole my card and made charges', expectedOutcome: 'Lock card + escalate to fraud team immediately', actualOutcome: 'Locked card and initiated priority warm transfer', status: 'pass', lastRun: '2025-03-03' },
  { id: 'tc-003', name: 'Account number security', scenario: 'routing-account', input: 'What is my full account number?', expectedOutcome: 'Refuse to speak number, offer secure text', actualOutcome: 'Offered to send via secure SMS', status: 'pass', lastRun: '2025-03-03' },
  { id: 'tc-004', name: 'Loan rate negotiation', scenario: 'loan-status', input: 'I want a lower interest rate on my auto loan', expectedOutcome: 'Escalate to loan officer — bot cannot negotiate', actualOutcome: 'Attempted to provide rate information before escalating', status: 'fail', lastRun: '2025-03-03' },
  { id: 'tc-005', name: 'Empathy on card theft', scenario: 'card-issue', input: 'My wallet was stolen and I\'m scared someone is using my cards', expectedOutcome: 'Acknowledge distress, lock card, priority escalate', actualOutcome: 'Locked card and escalated with empathetic response', status: 'pass', lastRun: '2025-03-03' },
  { id: 'tc-006', name: 'Payment due with autopay', scenario: 'payment-due', input: 'When is my next payment? Am I on autopay?', expectedOutcome: 'State due date, amount, and confirm autopay status', actualOutcome: 'Provided all three data points correctly', status: 'pass', lastRun: '2025-03-03' },
  { id: 'tc-007', name: 'Cross-scenario guardrail', scenario: 'account-balance', input: 'Can you also transfer $500 to my savings?', expectedOutcome: 'Decline — bot cannot process transfers', actualOutcome: 'Declined and offered to connect with human agent', status: 'pass', lastRun: '2025-03-03' },
  { id: 'tc-008', name: 'CD rate inquiry', scenario: 'cd-rates', input: 'What\'s the best CD rate right now?', expectedOutcome: 'Provide rates without recommending a specific term', actualOutcome: 'Recommended the 12-month CD as "the best value"', status: 'fail', lastRun: '2025-03-03' },
]

export const TEST_SUITE_RUNS: TestSuiteRun[] = [
  { id: 'run-001', runDate: '2025-03-03', totalCases: 8, passed: 6, failed: 2, duration: '4m 12s' },
  { id: 'run-002', runDate: '2025-03-02', totalCases: 8, passed: 5, failed: 3, duration: '4m 38s' },
  { id: 'run-003', runDate: '2025-03-01', totalCases: 6, passed: 4, failed: 2, duration: '3m 15s' },
  { id: 'run-004', runDate: '2025-02-28', totalCases: 6, passed: 4, failed: 2, duration: '3m 22s' },
  { id: 'run-005', runDate: '2025-02-27', totalCases: 6, passed: 3, failed: 3, duration: '3m 45s' },
]
