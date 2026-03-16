'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AGENTS, SCENARIOS, SCENARIO_LABELS, KNOWLEDGE_DOCS, TEST_CASES, TEST_SUITE_RUNS } from '@/lib/mock-data'
import type { CallScenario } from '@/lib/mock-data'
import { ArrowLeft, ShieldX, Play, RotateCcw, CheckCircle, XCircle, FileText, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

type TreeSection = 'overview' | 'prompt' | 'rules' | 'guardrails' | 'escalation' | 'knowledge' | 'test-cases' | 'test-runs' | 'versions' | `scenario-${string}`

const transferBadge = (type: string) => {
  switch (type) {
    case 'priority-warm': return 'bg-red-500/10 text-red-400 border-red-500/25'
    case 'warm': return 'bg-blue-500/10 text-blue-400 border-blue-500/25'
    default: return 'bg-secondary text-muted-foreground border-border'
  }
}
const priorityBadge = (p: string) => {
  switch (p) {
    case 'urgent': return 'bg-red-500/10 text-red-400 border-red-500/25'
    case 'high': return 'bg-amber-500/10 text-amber-400 border-amber-500/25'
    default: return 'bg-secondary text-muted-foreground border-border'
  }
}
const afterHoursBadge = (r: string) => {
  switch (r) {
    case 'oncall-alert': return 'bg-red-500/10 text-red-400 border-red-500/25'
    case 'callback': return 'bg-blue-500/10 text-blue-400 border-blue-500/25'
    default: return 'bg-secondary text-muted-foreground border-border'
  }
}

export default function AgentCanvasPage() {
  const { id } = useParams<{ id: string }>()
  const agent = AGENTS.find((a) => a.id === id)
  const [activeSection, setActiveSection] = useState<TreeSection>('overview')
  const [selectedScenario, setSelectedScenario] = useState<CallScenario | null>(null)

  if (!agent) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Agent not found.</p>
        <Link href="/scenarios" className="text-primary text-sm hover:underline mt-2 inline-block">← Back to Agents</Link>
      </div>
    )
  }

  const agentScenarios = SCENARIOS.filter((s) => agent.scenarios.includes(s.id))
  const currentScenario = selectedScenario ? SCENARIOS.find((s) => s.id === selectedScenario) : null
  const linkedDocs = KNOWLEDGE_DOCS.filter((d) => agent.scenarios.some((s) => d.linkedScenarios.includes(s)))
  const agentTestCases = TEST_CASES.filter((tc) => agent.scenarios.includes(tc.scenario))

  const treeItems: { id: TreeSection; label: string; group: string }[] = [
    { id: 'overview', label: 'Overview', group: 'CONFIGURATION' },
    { id: 'prompt', label: 'System Prompt', group: 'CONFIGURATION' },
    { id: 'rules', label: 'Rules', group: 'CONFIGURATION' },
    { id: 'guardrails', label: 'Guardrails', group: 'CONFIGURATION' },
    { id: 'escalation', label: 'Escalation Flow', group: 'CONFIGURATION' },
    ...agentScenarios.map((s) => ({ id: `scenario-${s.id}` as TreeSection, label: s.name, group: 'SCENARIOS' })),
    { id: 'knowledge', label: 'Knowledge Base', group: 'KNOWLEDGE' },
    { id: 'test-cases', label: 'Test Cases', group: 'EVALUATION' },
    { id: 'test-runs', label: 'Test Suite Runs', group: 'EVALUATION' },
    { id: 'versions', label: 'Version History', group: 'AUDIT' },
  ]

  const groups = [...new Set(treeItems.map((t) => t.group))]

  function handleTreeClick(section: TreeSection) {
    setActiveSection(section)
    if (section.startsWith('scenario-')) {
      setSelectedScenario(section.replace('scenario-', '') as CallScenario)
    } else {
      setSelectedScenario(null)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Policy Tree */}
      <div className="w-56 flex-shrink-0 border-r border-border flex flex-col overflow-y-auto" style={{ background: 'oklch(0.10 0.02 265)' }}>
        <div className="px-4 py-4 border-b border-border">
          <Link href="/scenarios" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3">
            <ArrowLeft className="w-3 h-3" /> Back to Agents
          </Link>
          <p className="text-sm font-bold text-foreground">{agent.name}</p>
          <span className="text-xs text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full mt-1 inline-block">{agent.version}</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-4">
          {groups.map((group) => (
            <div key={group}>
              <p className="px-2 mb-1 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">{group}</p>
              <div className="space-y-0.5">
                {treeItems.filter((t) => t.group === group).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTreeClick(item.id)}
                    className={cn(
                      'w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors truncate',
                      activeSection === item.id
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            {agent.status === 'active' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">Live</span>
              </>
            ) : agent.status === 'testing' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs text-amber-400 font-medium">Testing</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                <span className="text-xs text-muted-foreground font-medium">Inactive</span>
              </>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{agent.version}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">{agent.name}</h1>
            <p className="text-sm text-muted-foreground">{agent.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/sandbox?agent=${agent.id}`} className="px-4 py-2 border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              Test Agent
            </Link>
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
              Deploy Changes
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview */}
          {activeSection === 'overview' && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">Overview</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Resolution Rate', value: `${agent.resolutionRate}%`, color: 'text-emerald-400' },
                  { label: 'First Call Resolution', value: `${agent.fcrRate}%`, color: 'text-blue-400' },
                  { label: 'Scenarios', value: agent.scenarios.length.toString(), color: 'text-violet-400' },
                  { label: 'Knowledge Docs', value: linkedDocs.length.toString(), color: 'text-amber-400' },
                ].map((card) => (
                  <div key={card.label} className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground font-medium mb-2">{card.label}</p>
                    <p className={cn('text-2xl font-bold', card.color)}>{card.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm font-semibold text-foreground mb-3">Active Scenarios</p>
                <div className="space-y-2">
                  {agentScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleTreeClick(`scenario-${s.id}` as TreeSection)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="text-sm font-bold text-foreground">{s.resolutionRate}%</p>
                          <p className="text-xs text-muted-foreground">Resolution</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{s.callsHandled.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Calls</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* System Prompt */}
          {activeSection === 'prompt' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">System Prompt</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-primary bg-primary/10 border border-primary/25 px-2 py-0.5 rounded-full">{agent.version}</span>
                  <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors">Save Version</button>
                </div>
              </div>
              <textarea
                className="w-full min-h-[320px] rounded-xl border border-border bg-secondary p-4 text-xs text-foreground font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                defaultValue={agentScenarios[0]?.prompt || 'No prompt configured.'}
              />
            </div>
          )}

          {/* Rules */}
          {activeSection === 'rules' && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">Agent Rules</h2>
              <div className="bg-card border border-border rounded-xl p-5">
                <textarea
                  className="w-full min-h-[300px] rounded-xl border border-border bg-secondary p-4 text-xs text-foreground font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                  defaultValue={`RULES: ${agent.name} Operating Guidelines\n\nGeneral Communication Standards:\n- Always greet the member warmly and identify yourself as CSxAI assistant\n- Use the member's name when available\n- Keep responses concise and natural — avoid robotic language\n- Confirm understanding by paraphrasing the member's request\n\nResponse Guidelines:\n- Answer within the scope of your configured scenarios only\n- If unsure, say so honestly rather than guessing\n- Always verify member identity before sharing account information\n- Use last 4 digits of account/card numbers — never full numbers\n\nInformation Collection Protocol:\n- Collect member name and last 4 of account for verification\n- Ask one question at a time — don't overwhelm\n- Summarize collected info back to the member before acting\n\nProhibited Actions:\n- Never process financial transactions (transfers, payments)\n- Never share other members' information\n- Never make promises about loan approvals or rate changes\n- Never provide legal or tax advice`}
                />
              </div>
            </div>
          )}

          {/* Guardrails */}
          {activeSection === 'guardrails' && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">Guardrails</h2>
              <p className="text-sm text-muted-foreground mb-4">Safety rules enforced across all scenarios for this agent</p>
              <div className="space-y-3">
                {agentScenarios.flatMap((s) => s.guardrails).filter((v, i, a) => a.indexOf(v) === i).map((rule, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <ShieldX className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground/80 leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Escalation Flow */}
          {activeSection === 'escalation' && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">Escalation Flow</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Trigger</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Transfer</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Priority</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">After Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentScenarios.flatMap((s) => s.escalationSettings.triggers).filter((t, i, a) => a.findIndex((x) => x.trigger === t.trigger) === i).map((t, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-4 py-3 text-sm text-foreground">{t.trigger}</td>
                        <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', transferBadge(t.transferType))}>{t.transferType === 'priority-warm' ? 'Priority Warm' : t.transferType === 'warm' ? 'Warm Transfer' : 'Cold Transfer'}</span></td>
                        <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', priorityBadge(t.priority))}>{t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</span></td>
                        <td className="px-4 py-3"><span className={cn('px-2 py-0.5 rounded-full text-xs font-medium border', afterHoursBadge(t.afterHoursRule))}>{t.afterHoursRule === 'oncall-alert' ? 'Alert On-Call' : t.afterHoursRule === 'callback' ? 'Schedule Callback' : 'Voicemail'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-2">Agent Brief Template</p>
                <textarea
                  className="w-full min-h-[120px] rounded-xl border border-border bg-secondary p-3 text-xs text-foreground font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                  defaultValue={agentScenarios[0]?.escalationSettings.agentBriefTemplate || ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-sm font-semibold text-foreground mb-3">Queue Overflow</p>
                  <p className="text-xs text-muted-foreground mb-3">When wait time exceeds {agentScenarios[0]?.escalationSettings.queueOverflowMinutes || 3} minutes:</p>
                  <div className="space-y-2">
                    {['callback', 'hold'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="overflow" defaultChecked={opt === (agentScenarios[0]?.escalationSettings.queueOverflowAction || 'callback')} className="accent-violet-500" />
                        <span className="text-sm text-foreground">{opt === 'callback' ? 'Offer callback' : 'Continue holding'}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <p className="text-sm font-semibold text-foreground mb-3">After-Hours Urgent Alerts</p>
                  <div className="flex items-center gap-3 mb-3">
                    <button className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors', agentScenarios[0]?.escalationSettings.afterHoursUrgentAlert ? 'bg-primary' : 'bg-secondary border border-border')}>
                      <span className={cn('inline-block h-4 w-4 rounded-full bg-white shadow-md transition-transform', agentScenarios[0]?.escalationSettings.afterHoursUrgentAlert ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                    <span className="text-sm text-foreground">{agentScenarios[0]?.escalationSettings.afterHoursUrgentAlert ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(agentScenarios[0]?.escalationSettings.alertRecipients || []).map((r) => (
                      <span key={r} className="text-xs bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-full">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scenario Detail */}
          {activeSection.startsWith('scenario-') && currentScenario && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-1">{currentScenario.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{currentScenario.description}</p>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Resolution</p>
                  <p className="text-xl font-bold text-emerald-400">{currentScenario.resolutionRate}%</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">FCR</p>
                  <p className="text-xl font-bold text-blue-400">{currentScenario.fcrRate}%</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Calls</p>
                  <p className="text-xl font-bold text-foreground">{currentScenario.callsHandled.toLocaleString()}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Avg Duration</p>
                  <p className="text-xl font-bold text-foreground">{Math.floor(currentScenario.avgDuration / 60)}m {currentScenario.avgDuration % 60}s</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-2">Scenario Prompt</p>
                <textarea
                  className="w-full min-h-[200px] rounded-xl border border-border bg-secondary p-3 text-xs text-foreground font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 leading-relaxed"
                  defaultValue={currentScenario.prompt}
                />
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-2">Guardrails</p>
                <div className="space-y-2">
                  {currentScenario.guardrails.map((g, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card">
                      <ShieldX className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground/80">{g}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Tools Used</p>
                <div className="flex flex-wrap gap-2">
                  {currentScenario.tools.map((t) => (
                    <span key={t} className="text-xs bg-primary/10 text-primary border border-primary/25 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Knowledge */}
          {activeSection === 'knowledge' && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground mb-4">Documents linked to this agent for RAG retrieval</p>
              <div className="space-y-3">
                {linkedDocs.map((doc) => (
                  <div key={doc.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{doc.excerpt}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-muted-foreground/60">{doc.type.toUpperCase()} · {doc.fileSize}</span>
                            <span className="text-xs text-muted-foreground/60">Updated {doc.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3 ml-8">
                      {doc.linkedScenarios.map((s) => (
                        <span key={s} className="text-xs bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-full">{SCENARIO_LABELS[s]}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test Cases */}
          {activeSection === 'test-cases' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">Test Cases</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
                  <Play className="w-3.5 h-3.5" /> Run All Tests
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Cases</p>
                  <p className="text-xl font-bold text-foreground">{agentTestCases.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Passing</p>
                  <p className="text-xl font-bold text-emerald-400">{agentTestCases.filter((t) => t.status === 'pass').length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Failing</p>
                  <p className="text-xl font-bold text-red-400">{agentTestCases.filter((t) => t.status === 'fail').length}</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Test</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Scenario</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Expected</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actual</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentTestCases.map((tc) => (
                      <tr key={tc.id} className="border-b border-border/50">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-foreground">{tc.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 italic">&ldquo;{tc.input}&rdquo;</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{SCENARIO_LABELS[tc.scenario]}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px]">{tc.expectedOutcome}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px]">{tc.actualOutcome}</td>
                        <td className="px-4 py-3">
                          {tc.status === 'pass' ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium"><CheckCircle className="w-3.5 h-3.5" /> Pass</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-red-400 font-medium"><XCircle className="w-3.5 h-3.5" /> Fail</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Test Suite Runs */}
          {activeSection === 'test-runs' && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">Test Suite Runs</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Cases</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Passed</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Failed</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Pass Rate</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TEST_SUITE_RUNS.map((run) => (
                      <tr key={run.id} className="border-b border-border/50">
                        <td className="px-4 py-3 text-sm text-foreground">{run.runDate}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{run.totalCases}</td>
                        <td className="px-4 py-3 text-sm text-emerald-400 font-medium">{run.passed}</td>
                        <td className="px-4 py-3 text-sm text-red-400 font-medium">{run.failed}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(run.passed / run.totalCases) * 100}%` }} />
                            </div>
                            <span className="text-xs text-foreground font-medium">{Math.round((run.passed / run.totalCases) * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{run.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Version History */}
          {activeSection === 'versions' && (
            <div>
              <h2 className="text-base font-bold text-foreground mb-4">Version History</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/40 border-b border-border/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Version</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Resolution Rate</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Notes</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentScenarios.flatMap((s) => s.versions).sort((a, b) => b.version - a.version).map((v) => (
                      <tr key={v.id} className="border-b border-border/50">
                        <td className="px-4 py-3">
                          <span className="text-xs bg-primary/10 text-primary border border-primary/25 px-2 py-0.5 rounded-full">v{v.version}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{v.createdAt}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{v.resolutionRate}%</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{v.notes}</td>
                        <td className="px-4 py-3">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <RotateCcw className="w-3 h-3" /> Restore
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
