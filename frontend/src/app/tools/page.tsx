'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolConfig {
  id: string
  name: string
  description: string
  lastTriggered: string
  enabledForScenarios: string[]
  configSection: React.ReactNode
}

const SCENARIO_LABELS: Record<string, string> = {
  'transaction-inquiry': 'Transaction Inquiry',
  'account-balance': 'Account Balance',
  'loan-status': 'Loan Status',
  'payment-due': 'Payment Due Date',
  'card-issue': 'Card Issue & Disputes',
  'routing-account': 'Routing & Account Numbers',
  'cd-rates': 'CD & Savings Rates',
  'loan-payoff': 'Loan Payoff Quote',
}

function SMSConfig() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">From Number</label>
        <input type="text" defaultValue="+1 800 555 0100" className="h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Message Template</label>
        <textarea className="w-full rounded-lg border border-border bg-secondary p-3 text-sm text-foreground resize-y min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50"
          defaultValue="Hi {{member_name}}, here's a summary of your call with Lakeside Credit Union today: {{summary}}. Questions? Call us at 1-800-LAKESIDE." />
        <p className="text-xs text-muted-foreground mt-1">Variables: {'{{member_name}}'}, {'{{summary}}'}, {'{{scenario}}'}</p>
      </div>
    </div>
  )
}

function EmailConfig() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">From Address</label>
        <input type="email" defaultValue="noreply@lakeside.cu" className="h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Subject Line</label>
        <input type="text" defaultValue="Your call summary from Lakeside Credit Union" className="h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Template</label>
        <textarea className="w-full rounded-lg border border-border bg-secondary p-3 text-sm text-foreground resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
          defaultValue={`Hi {{member_name}},\n\nThank you for calling Lakeside Credit Union. Here's a summary:\n\n{{summary}}\n\nLakeside Credit Union Member Services`} />
      </div>
    </div>
  )
}

function PayoffConfig() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Fulfillment Partner</label>
        <select className="h-9 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option>Print &amp; Mail Co.</option>
          <option>DocuSend</option>
        </select>
      </div>
      <div className="p-3.5 bg-amber-500/8 border border-amber-500/20 rounded-xl">
        <p className="text-xs text-amber-400/80">
          Payoff letters are sent by first-class mail within 1-2 business days. Confirm fulfillment partner SLA before enabling in production.
        </p>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0',
        checked ? 'bg-primary' : 'bg-secondary border border-border')}>
      <span className={cn('inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform duration-200',
        checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  )
}

function ToolCard({ tool }: { tool: ToolConfig }) {
  const [enabled, setEnabled] = useState(tool.enabledForScenarios.length > 0)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1.5">
              <h2 className="text-base font-bold text-foreground">{tool.name}</h2>
              <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
                enabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-secondary text-muted-foreground border-border')}>
                {enabled && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{tool.description}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Last triggered: <span className="text-muted-foreground font-medium">{tool.lastTriggered}</span></p>
          </div>
          <ToggleSwitch checked={enabled} onChange={setEnabled} />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          <span className="text-xs text-muted-foreground font-medium">Used in:</span>
          {tool.enabledForScenarios.length > 0 ? (
            tool.enabledForScenarios.map((s) => (
              <span key={s} className="text-xs bg-primary/10 text-primary border border-primary/25 px-2.5 py-0.5 rounded-full">{SCENARIO_LABELS[s] ?? s}</span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground/50 italic">No scenarios</span>
          )}
        </div>
      </div>
      <div className="px-6 pb-5 border-t border-border pt-4">
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors select-none">
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', expanded ? 'rotate-180' : 'rotate-0')} />
          {expanded ? 'Hide Configuration' : 'Show Configuration'}
        </button>
        <div className={cn('overflow-hidden transition-all duration-300', expanded ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0')}>
          <div className="border-t border-border pt-4">{tool.configSection}</div>
        </div>
      </div>
    </div>
  )
}

const TOOLS: ToolConfig[] = [
  { id: 'sms-summary', name: 'SMS Summary', description: 'Send member a text summary after the call', lastTriggered: '2 hours ago', enabledForScenarios: ['transaction-inquiry', 'account-balance', 'payment-due', 'routing-account'], configSection: <SMSConfig /> },
  { id: 'email-summary', name: 'Email Summary', description: 'Send member a call summary via email', lastTriggered: '5 hours ago', enabledForScenarios: ['transaction-inquiry', 'card-issue'], configSection: <EmailConfig /> },
  { id: 'mail-payoff-letter', name: 'Payoff Letter (Mail)', description: 'Trigger a formal payoff letter by mail', lastTriggered: 'Yesterday at 3:14 PM', enabledForScenarios: ['loan-status', 'loan-payoff'], configSection: <PayoffConfig /> },
]

export default function ToolsPage() {
  return (
    <div className="p-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-foreground">Tool Configuration</h1>
        <p className="text-muted-foreground mt-1 text-sm">Define what actions agents can take after a call</p>
      </div>
      <div className="flex flex-col gap-4">
        {TOOLS.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>
      <div className="mt-6 p-5 bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Phase 2 tools coming:</span>{' '}
          CRM sync, webhook, voice callback, and Zelle dispute automation. These will be configurable per scenario once telephony integration is complete.
        </p>
      </div>
    </div>
  )
}
