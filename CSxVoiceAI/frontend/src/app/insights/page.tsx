'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Opportunity {
  label: string
  impact: number
  base: number
  category: string
  effort: 'Low' | 'Medium' | 'High'
  description: string
}

const opportunities: Opportunity[] = [
  { label: 'Repeated agent requests', impact: 5.3, base: 73.2, category: 'Conversation Flow', effort: 'Medium', description: 'Members are being asked to repeat information already provided. Improve context retention in multi-turn conversations to reduce friction.' },
  { label: 'Add reimbursement support', impact: 3.4, base: 78.5, category: 'Missing Capability', effort: 'High', description: 'Members calling about reimbursements are always escalated. Adding a reimbursement FAQ and basic status lookup could resolve 60% of these calls.' },
  { label: 'Handle batched orders', impact: 2.2, base: 81.9, category: 'Edge Case', effort: 'Medium', description: 'When members ask about multiple transactions at once, the bot handles only the first. Support multi-transaction queries.' },
  { label: 'Provide cancellation FAQs', impact: 0.9, base: 84.1, category: 'Knowledge Gap', effort: 'Low', description: 'Common questions about cancelling services (autopay, alerts) are not in the knowledge base. Add FAQ entries.' },
  { label: 'AI handles specialist requests', impact: 0.8, base: 85.0, category: 'Routing', effort: 'High', description: 'Some specialist requests (CD early withdrawal, wire timing) could be answered with rate sheet data instead of escalating.' },
  { label: 'Deactivation workflow', impact: 0.8, base: 85.8, category: 'Missing Capability', effort: 'Low', description: 'Members requesting card deactivation can be handled by bot with identity verification instead of escalating.' },
]

const chartData = [
  { label: 'Current', value: 73.2, base: 0, improvement: 73.2, type: 'start' },
  ...opportunities.map((o) => ({ label: o.label, value: o.impact, base: o.base, improvement: o.impact, type: 'improvement' })),
  { label: 'Potential', value: 86.6, base: 0, improvement: 86.6, type: 'end' },
]

export default function InsightsPage() {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Insights</h1>
        <p className="text-muted-foreground mt-1 text-sm">Resolution Rate Improvement — Voice Agents</p>
      </div>

      <div className="bg-primary/10 border border-primary/25 rounded-xl p-4 mb-6">
        <p className="text-sm text-foreground">
          <span className="font-semibold">AI-powered analysis</span> has identified <span className="text-primary font-semibold">6 opportunities</span> to improve resolution rate from <span className="font-semibold">73.2%</span> to <span className="text-primary font-semibold">86.6%</span> across 4,657 conversations analyzed.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Current Resolution Rate', value: '73.2%', color: 'text-foreground' },
          { label: 'Potential Resolution Rate', value: '86.6%', color: 'text-emerald-400' },
          { label: 'Conversations Analyzed', value: '4,657', color: 'text-foreground' },
          { label: 'Actionable Insights', value: '6', color: 'text-primary' },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium mb-2">{card.label}</p>
            <p className={cn('text-2xl font-bold', card.color)}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <p className="text-sm font-semibold text-foreground mb-4">Improvement Waterfall</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} barCategoryGap="15%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fill: '#888', fontSize: 9 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={80} />
            <YAxis domain={[60, 90]} tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${Number(v).toFixed(1)}%`, '']} />
            <Bar dataKey="base" stackId="a" fill="transparent" />
            <Bar
              dataKey="improvement"
              stackId="a"
              radius={[4, 4, 0, 0]}
              cursor="pointer"
              onClick={(_: unknown, index: number) => {
                if (index > 0 && index <= opportunities.length) setSelectedOpp(opportunities[index - 1])
              }}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.type === 'start' ? '#7c3aed' : entry.type === 'end' ? '#34d399' : '#34d399'} fillOpacity={entry.type === 'improvement' ? 0.8 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground mb-3">Opportunities Ranked by Impact</p>
        {opportunities.map((opp, i) => {
          const cumulative = (73.2 + opportunities.slice(0, i + 1).reduce((s, o) => s + o.impact, 0)).toFixed(1)
          return (
            <button
              key={i}
              onClick={() => setSelectedOpp(opp)}
              className="w-full text-left bg-card border border-border rounded-xl p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{opp.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{opp.category}</span>
                      <span className={cn(
                        'text-xs px-1.5 py-0.5 rounded-full border font-medium',
                        opp.effort === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                        opp.effort === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                        'bg-red-500/10 text-red-400 border-red-500/25'
                      )}>
                        {opp.effort} effort
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">+{opp.impact}%</p>
                  <p className="text-xs text-muted-foreground">→ {cumulative}%</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Detail Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOpp(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">{selectedOpp.label}</h2>
              <button onClick={() => setSelectedOpp(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold text-emerald-400">+{selectedOpp.impact}% impact</span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full border font-medium',
                selectedOpp.effort === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' :
                selectedOpp.effort === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' :
                'bg-red-500/10 text-red-400 border-red-500/25'
              )}>
                {selectedOpp.effort} effort
              </span>
              <span className="text-xs text-muted-foreground">{selectedOpp.category}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{selectedOpp.description}</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setSelectedOpp(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Dismiss</button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Create task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
