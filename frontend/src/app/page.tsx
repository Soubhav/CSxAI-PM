'use client'

import { useState } from 'react'
import { DASHBOARD_METRICS, WEEKLY_CALLS, HEATMAP_DATA, INSIGHT_CARDS } from '@/lib/mock-data'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Phone, CheckCircle, ArrowUpRight, Clock, TrendingUp, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const filters = ['Voice', 'Last 1 week', 'All scenarios']

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState(0)
  const m = DASHBOARD_METRICS

  const kpiCards = [
    { label: 'AI Calls Handled', value: m.callsHandledByAI.toLocaleString(), delta: '↑ 12%', icon: Phone, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400' },
    { label: 'Resolution Rate', value: `${m.avgResolutionRate}%`, delta: '↑ 2.1%', icon: CheckCircle, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
    { label: 'Escalation Rate', value: `${m.escalationRate}%`, delta: '↓ 1.8%', icon: ArrowUpRight, iconBg: 'bg-red-500/15', iconColor: 'text-red-400' },
    { label: 'Hours Saved', value: `${m.timeSavedHours}h`, delta: '↑ 14 hrs', icon: Clock, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'NPS Score', value: m.npsScore.toString(), delta: '↑ 14 pts', icon: ThumbsUp, iconBg: 'bg-blue-500/15', iconColor: 'text-blue-400' },
    { label: 'First Call Resolution', value: `${m.firstCallResolution}%`, delta: '↑ 3.2%', icon: TrendingUp, iconBg: 'bg-teal-500/15', iconColor: 'text-teal-400' },
  ]

  const secondaryMetrics = [
    { label: 'Escalation Quality', value: `${m.escalationQualityScore}%`, sub: '94.2% resolved by agent' },
    { label: 'Avg Handle Time', value: `${Math.floor(m.avgCallDuration / 60)}m ${m.avgCallDuration % 60}s`, sub: `vs ${Math.floor(m.humanAvgCallDuration / 60)}m human` },
    { label: 'Effort Score', value: m.customerEffortScore.toFixed(1), sub: 'Scale 1-7 (lower = better)' },
    { label: 'Abandonment', value: `${m.callAbandonmentRate}%`, sub: 'Down from 6.2%' },
    { label: 'Repeat Calls', value: `${m.repeatCallRate}%`, sub: 'Down from 14.5%' },
  ]

  const maxHeat = Math.max(...HEATMAP_DATA.flatMap((d) => d.hours))
  const heatHours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm']

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{getGreeting()}, Sarah</h1>
        <p className="text-muted-foreground text-sm mt-1">Lakeside Credit Union · Week of Mar 3, 2025</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {filters.map((f, i) => (
          <button
            key={f}
            onClick={() => setActiveFilter(i)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border',
              activeFilter === i
                ? 'bg-primary/15 text-primary border-primary/25'
                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</span>
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg)}>
                <card.icon className={cn('w-4 h-4', card.iconColor)} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <p className="text-xs text-emerald-400 mt-1 font-medium">{card.delta} vs last week</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-card border border-border rounded-xl p-5">
          <p className="text-sm font-semibold text-foreground mb-4">Weekly AI vs Human Calls</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={WEEKLY_CALLS} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="ai" fill="#7c3aed" radius={[4, 4, 0, 0]} name="AI Calls" />
              <Bar dataKey="human" fill="rgba(255,255,255,0.08)" radius={[4, 4, 0, 0]} name="Human Calls" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-foreground mb-4">Member Sentiment</p>
          <svg viewBox="0 0 200 120" className="w-44">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 172 65" fill="none" stroke="#34d399" strokeWidth="14" strokeLinecap="round" />
            <path d="M 172 65 A 80 80 0 0 1 180 100" fill="none" stroke="#f87171" strokeWidth="14" strokeLinecap="round" />
            <text x="100" y="82" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">93.2%</text>
            <text x="100" y="98" textAnchor="middle" fill="#888" fontSize="10">Happy / Neutral</text>
          </svg>
          <div className="flex items-center gap-6 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-muted-foreground">93.2% Happy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs text-muted-foreground">6.8% Unhappy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {secondaryMetrics.map((sm) => (
          <div key={sm.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground font-medium mb-2">{sm.label}</p>
            <p className="text-xl font-bold text-foreground">{sm.value}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">{sm.sub}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-foreground mb-3">Quick Insights</p>
        <div className="grid grid-cols-3 gap-4">
          {INSIGHT_CARDS.map((card, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-foreground mb-2">{card.question}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.answer}</p>
              <div className="mt-2">
                <span className={cn(
                  'inline-block w-1.5 h-1.5 rounded-full',
                  card.trend === 'positive' ? 'bg-emerald-400' : card.trend === 'negative' ? 'bg-red-400' : 'bg-amber-400'
                )} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Calls by Day & Hour</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 ml-10">
            {heatHours.map((h) => (
              <span key={h} className="flex-1 text-center text-[10px] text-muted-foreground/50">{h}</span>
            ))}
          </div>
          {HEATMAP_DATA.map((row) => (
            <div key={row.day} className="flex items-center gap-1">
              <span className="w-10 text-xs text-muted-foreground text-right pr-2">{row.day}</span>
              {row.hours.map((val, i) => {
                const intensity = val / maxHeat
                return (
                  <div
                    key={i}
                    className="flex-1 h-7 rounded"
                    style={{ background: `rgba(124, 58, 237, ${0.1 + intensity * 0.7})` }}
                    title={`${row.day} ${heatHours[i]}: ${val} calls`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
